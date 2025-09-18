// 🚀 SERVIDOR TEMPORAL PARA PRUEBAS
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
const PORT = 3002; // Puerto diferente para evitar conflictos

// 🔧 Configurar MercadoPago
mercadopago.configure({
    sandbox: true, // Modo sandbox
    access_token: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457'
});

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 📋 Logging
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 🛒 CREAR PREFERENCIA DE PAGO
app.post('/api/create-preference', async (req, res) => {
    try {
        console.log('🛒 Nuevo pago solicitado...');
        const { items, payer } = req.body;

        // Validaciones básicas
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                error: '❌ Items es requerido y debe ser un array no vacío' 
            });
        }

        if (!payer || !payer.email) {
            return res.status(400).json({ 
                error: '❌ Email del pagador es requerido' 
            });
        }

        // Calcular total
        const total = items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unit_price)), 0);
        console.log(`💰 Total calculado: $${total} ARS`);

        // Crear preferencia SIN auto_return
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
                success: 'https://www.mercadopago.com.ar',
                failure: 'https://www.mercadopago.com.ar',
                pending: 'https://www.mercadopago.com.ar'
            },
            external_reference: `USER_${payer.id || 'anon'}_${Date.now()}`,
            notification_url: 'http://localhost:3002/api/webhooks/mercadopago'
        };

        console.log('🔧 Creando preferencia en MercadoPago...');
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
        res.status(500).json({ 
            error: '💥 Error interno del servidor',
            details: error.message 
        });
    }
});

// 🏥 HEALTH CHECK
app.get('/health', (req, res) => {
    console.log('🏥 Health check solicitado');
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'MercadoPago Payment Server (Temporal)'
    });
});

// 🔔 WEBHOOK
app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        console.log('🔔 Webhook MercadoPago recibido:', req.query);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('💥 Error en webhook:', error);
        res.status(500).json({ error: '💥 Error procesando webhook' });
    }
});

// 🚀 INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log('🎉 ¡Servidor temporal iniciado!');
    console.log('='.repeat(50));
    console.log(`📡 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔧 Modo: 🧪 SANDBOX (pruebas)`);
    console.log('='.repeat(50));
    console.log('💡 Para probar: node test-temp-payment.js');
});
