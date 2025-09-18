// 🚀 SERVIDOR DE MERCADOPAGO SIMPLE
// Este servidor permite crear pagos de forma fácil y rápida
// Solo necesitas enviar items y email del pagador

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mercadopago = require('mercadopago');

// 📁 Cargar configuración desde config.js
const config = require('./config.js');

const app = express();
const PORT = config.server.port || 3001;

// 🔧 Configurar MercadoPago con tus credenciales
mercadopago.configure({
    sandbox: config.mercadopago.sandbox, // 🧪 true = pruebas, false = producción
    access_token: config.mercadopago.access_token // 🔑 Tu token de acceso
});

// 🛡️ Middleware de seguridad
app.use(helmet()); // Protege contra ataques comunes
app.use(cors()); // Permite requests desde otros dominios

// ⏱️ Rate limiting - Evita spam y ataques
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ⏰ Ventana de 15 minutos
    max: 100, // 📊 Máximo 100 requests por ventana
    message: '🚫 Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use(limiter);

// 📝 Middleware para parsear JSON del body
app.use(express.json());

// 📋 Logging de requests - Ve qué está pasando
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ==================== 💳 ENDPOINTS DE PAGO ====================

/**
 * 🛒 CREAR PREFERENCIA DE PAGO
 * 
 * 📍 Endpoint: POST /api/create-preference
 * 
 * 📦 Body requerido:
 * {
 *   "items": [
 *     {
 *       "title": "Nombre del producto",     // 📝 Título del item
 *       "quantity": 1,                     // 🔢 Cantidad
 *       "unit_price": 1500                 // 💰 Precio por unidad en ARS
 *     }
 *   ],
 *   "payer": {
 *     "email": "usuario@ejemplo.com"       // 📧 Email del comprador
 *   }
 * }
 * 
 * 📤 Respuesta:
 * {
 *   "id": "123456789",                     // 🆔 ID de la preferencia
 *   "url": "https://...",                  // 🔗 Link de pago
 *   "items": [...],                        // 📦 Items enviados
 *   "total": 1500                          // 💰 Total calculado
 * }
 */app.post('/api/create-preference', async (req, res) => {
    try {
        console.log('🛒 Nuevo pago solicitado...');
        const { items, payer } = req.body;

        // ✅ Validaciones básicas
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.log('❌ Error: No hay items válidos');
            return res.status(400).json({ 
                error: '❌ Items es requerido y debe ser un array no vacío' 
            });
        }

        if (!payer || !payer.email) {
            console.log('❌ Error: No hay email del pagador');
            return res.status(400).json({ 
                error: '❌ Email del pagador es requerido' 
            });
        }

        // Validar cada item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.title || !item.quantity || !item.unit_price) {
                return res.status(400).json({
                    error: `❌ Item en posición ${i} incompleto. Debe tener title, quantity y unit_price.`
                });
            }
        }

        // 🧮 Calcular total automáticamente
        const total = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unit_price)), 0);
        console.log(`💰 Total calculado: $${total} ARS`);

        // 🏗️ Crear preferencia para MercadoPago
        const preference = {
            items: items.map(item => ({
                title: item.title,
                quantity: item.quantity,
                currency_id: 'ARS',
                unit_price: parseFloat(item.unit_price)
            })),
            payer: {
                email: payer.email
            },
            back_urls: {
                success: config.urls.success,
                failure: config.urls.failure,
                pending: config.urls.pending
            },
            // 🔑 Referencia dinámica para cada usuario/pedido
            external_reference: `USER_${payer.id || 'anon'}_${Date.now()}`,
            notification_url: config.urls.webhook
        };

        console.log('🔧 Creando preferencia en MercadoPago...');
        console.log('📋 Datos:', JSON.stringify(preference, null, 2));

        const response = await mercadopago.preferences.create(preference);

        console.log('✅ Preferencia creada exitosamente!');
        console.log(`🆔 ID: ${response.body.id}`);
        console.log(`🔗 URL: ${response.body.init_point}`);

        res.json({
            id: response.body.id,
            url: response.body.init_point,
            items: items,
            total: total
        });

    } catch (error) {
        console.error('💥 Error creando preferencia:', error);
        // Si viene de Mercado Pago, mostrar detalles
        if (error.response) {
            console.error('💥 Detalles SDK:', error.response);
        }
        res.status(500).json({ 
            error: '💥 Error interno del servidor',
            details: error.message 
        });
    }
});



// ==================== 🔔 WEBHOOKS ====================

/**
 * 🔔 WEBHOOK DE MERCADOPAGO
 * 
 * 📍 Endpoint: POST /api/webhooks/mercadopago
 * 
 * 📝 Descripción:
 * MercadoPago envía notificaciones aquí cuando cambia el estado de un pago
 * Este endpoint se ejecuta automáticamente cuando:
 * - ✅ Un pago es aprobado
 * - ❌ Un pago es rechazado  
 * - ⏳ Un pago queda pendiente
 * 
 * 🔧 Configuración:
 * Debes configurar esta URL en tu cuenta de MercadoPago
 * para recibir notificaciones automáticas
 */
app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        console.log('🔔 Webhook MercadoPago recibido:', req.query);
        
        if (req.query.topic === 'merchant_order') {
            console.log('📦 Procesando orden de comerciante...');
            const merchantOrder = await mercadopago.merchant_orders.get(req.query.id);
            const externalReference = merchantOrder.body.external_reference;
            const payments = merchantOrder.body.payments;
            
            console.log(`🏷️ Referencia externa: ${externalReference}`);
            console.log(`💳 Pagos encontrados: ${payments.length}`);
            
            for (const payment of payments) {
                if (payment.status === 'approved' && payment.status_detail === 'accredited') {
                    console.log('🎉 ¡PAGO EXITOSO!');
                    console.log(`🆔 ID del pago: ${payment.id}`);
                    console.log(`🏷️ external_reference: ${externalReference}`);
                    console.log(`💰 Monto: $${payment.transaction_amount} ARS`);

                    

                    console.log('✅ El dinero ya está en tu cuenta!');
                } else if (payment.status === 'rejected') {
                    console.log('💔 PAGO RECHAZADO');
                    console.log(`🆔 ID del pago: ${payment.id}`);
                    console.log(`🏷️ Orden: ${externalReference}`);
                    console.log('❌ El pago no pudo ser procesado');
                } else {
                    console.log('⏳ PAGO PENDIENTE');
                    console.log(`📊 Estado: ${payment.status}`);
                    console.log(`🆔 ID del pago: ${payment.id}`);
                    console.log(`🏷️ Orden: ${externalReference}`);
                    console.log('🔄 Esperando confirmación...');
                }
            }
        }
        
        console.log('✅ Webhook procesado correctamente');
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('💥 Error en webhook MercadoPago:', error);
        res.status(500).json({ error: '💥 Error procesando webhook' });
    }
});


// ==================== 🛠️ ENDPOINTS DE UTILIDAD ====================

/**
 * 🏥 HEALTH CHECK
 * 
 * 📍 Endpoint: GET /health
 * 
 * 📝 Descripción:
 * Verifica que el servidor esté funcionando correctamente
 * Útil para monitoreo y debugging
 * 
 * 📤 Respuesta:
 * {
 *   "status": "OK",                    // ✅ Estado del servidor
 *   "timestamp": "2024-01-01T12:00:00Z", // 🕐 Momento de la consulta
 *   "service": "MercadoPago Payment Server" // 🏷️ Nombre del servicio
 * }
 */
app.get('/health', (req, res) => {
    console.log('🏥 Health check solicitado');
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'MercadoPago Payment Server'
    });
});

// ==================== 🚀 INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
    console.log('🎉 ¡Servidor de MercadoPago iniciado exitosamente!');
    console.log('='.repeat(50));
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔧 Modo: ${config.mercadopago.sandbox ? '🧪 SANDBOX (pruebas)' : '🚀 PRODUCCIÓN'}`);
    console.log('='.repeat(50));
    console.log('📋 Endpoints disponibles:');
    console.log('  🛒 POST /api/create-preference  - Crear pago');
    console.log('  🔔 POST /api/webhooks/mercadopago - Webhook');
    console.log('  🏥 GET /health                  - Health check');
    console.log('='.repeat(50));
    console.log('💡 Para probar el servidor, ejecuta: node test-examples.js');
    console.log('🎯 ¡Todo listo para recibir pagos!');
});

// 🛡️ Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('💥 Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Promesa rechazada no manejada:', reason);
});
