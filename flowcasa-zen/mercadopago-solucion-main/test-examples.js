/**
 * 🧪 EJEMPLOS DE USO DEL SERVIDOR DE MERCADOPAGO
 * 
 * 📝 Este archivo contiene ejemplos prácticos de cómo usar el servidor
 * para crear pagos de forma simple y rápida
 * 
 * 🚀 Para ejecutar: node test-examples.js
 * 
 * 📋 Requisitos:
 * - El servidor debe estar corriendo (node server.js)
 * - Configurar config.js con tus credenciales de MercadoPago
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

/**
 * 🛒 CREAR UN PAGO SIMPLE
 * 
 * 📝 Descripción:
 * Esta función demuestra cómo crear un pago con múltiples items
 * 
 * 📦 Items incluidos:
 * - 💎 Diamante x64 por $1500 ARS
 * - 💚 Esmeralda x32 x2 por $800 ARS cada una
 * 
 * 💰 Total esperado: $3100 ARS
 */
async function createPayment() {
    try {
        console.log('🛒 Creando pago de ejemplo...');
        console.log('📦 Items:');
        console.log('  💎 Diamante x64 - $1500 ARS');
        console.log('  💚 Esmeralda x32 x2 - $800 ARS c/u');
        console.log('💰 Total esperado: $3100 ARS');
        console.log('');

        const response = await axios.post(`${BASE_URL}/api/create-preference`, {
            items: [
                {
                    title: 'Diamante x64',        // 💎 Nombre del producto
                    quantity: 1,                   // 🔢 Cantidad
                    unit_price: 1500               // 💰 Precio por unidad
                },
                {
                    title: 'Esmeralda x32',        // 💚 Nombre del producto
                    quantity: 2,                   // 🔢 Cantidad
                    unit_price: 800                 // 💰 Precio por unidad
                }
            ],
            payer: {
                email: 'usuario@ejemplo.com'       // 📧 Email del comprador
            }
        });

        console.log('🎉 ¡Pago creado exitosamente!');
        console.log('='.repeat(40));
        console.log(`🆔 ID de preferencia: ${response.data.id}`);
        console.log(`🔗 URL de pago: ${response.data.url}`);
        console.log('📦 Items procesados:');
        response.data.items.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title} x${item.quantity} - $${item.unit_price} ARS`);
        });
        console.log(`💰 Total calculado: $${response.data.total} ARS`);
        console.log('='.repeat(40));
        console.log('💡 Copia la URL y ábrela en tu navegador para probar el pago');

        return response.data;
    } catch (error) {
        console.error('💥 Error creando pago:', error.response?.data || error.message);
        console.log('🔧 Verifica que:');
        console.log('  - El servidor esté corriendo (node server.js)');
        console.log('  - Las credenciales en config.js sean correctas');
        console.log('  - Tengas conexión a internet');
    }
}

/**
 * 🏥 HEALTH CHECK
 * 
 * 📝 Descripción:
 * Verifica que el servidor esté funcionando correctamente
 * antes de intentar crear pagos
 */
async function healthCheck() {
    try {
        console.log('🏥 Verificando estado del servidor...');
        const response = await axios.get(`${BASE_URL}/health`);
        
        console.log('✅ ¡Servidor funcionando perfectamente!');
        console.log(`📊 Estado: ${response.data.status}`);
        console.log(`🕐 Timestamp: ${response.data.timestamp}`);
        console.log(`🏷️ Servicio: ${response.data.service}`);

        return response.data;
    } catch (error) {
        console.error('❌ Servidor no disponible:', error.message);
        console.log('🔧 Soluciones:');
        console.log('  - Ejecuta: node server.js');
        console.log('  - Verifica que el puerto 3001 esté libre');
        console.log('  - Revisa la configuración en config.js');
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 * 
 * 📝 Descripción:
 * Ejecuta todos los ejemplos en orden para demostrar
 * el funcionamiento completo del servidor
 */
async function runExample() {
    console.log('🚀 Iniciando ejemplos de MercadoPago...');
    console.log('='.repeat(50));
    console.log('📋 Este ejemplo demostrará:');
    console.log('  1. 🏥 Verificar que el servidor funcione');
    console.log('  2. 🛒 Crear un pago con múltiples items');
    console.log('='.repeat(50));
    console.log('');

    // 1. Health check
    console.log('1️⃣ HEALTH CHECK');
    console.log('-'.repeat(20));
    const healthResult = await healthCheck();
    console.log('');

    // Solo continuar si el servidor está funcionando
    if (healthResult && healthResult.status === 'OK') {
        // 2. Crear pago
        console.log('2️⃣ CREAR PAGO');
        console.log('-'.repeat(20));
        await createPayment();
        console.log('');

        console.log('🎉 ¡Ejemplo completado exitosamente!');
        console.log('='.repeat(50));
        console.log('💡 Próximos pasos:');
        console.log('  - Abre la URL de pago en tu navegador');
        console.log('  - Completa el pago con datos de prueba');
        console.log('  - Revisa los logs del servidor para ver el webhook');
        console.log('  - ¡Tu integración está lista!');
    } else {
        console.log('❌ No se pudo completar el ejemplo');
        console.log('🔧 Soluciona los problemas del servidor primero');
    }
}

// 🎬 Ejecutar si se llama directamente desde terminal
if (require.main === module) {
    runExample().catch(console.error);
}

// 📦 Exportar funciones para uso en otros archivos
module.exports = {
    createPayment,
    healthCheck
};
