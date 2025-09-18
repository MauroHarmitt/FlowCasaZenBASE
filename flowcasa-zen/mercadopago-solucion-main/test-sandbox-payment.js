/**
 * 🧪 PRUEBA DE PAGO EN MODO SANDBOX
 * 
 * Este script prueba el pago usando credenciales de sandbox
 * y tarjetas de prueba de MercadoPago
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

/**
 * 🧪 CREAR PAGO DE PRUEBA EN SANDBOX
 */
async function testSandboxPayment() {
    try {
        console.log('🧪 Probando pago en MODO SANDBOX...');
        console.log('='.repeat(60));
        console.log('📋 Información importante:');
        console.log('  🧪 Modo: SANDBOX (pruebas)');
        console.log('  💳 Usa tarjetas de prueba de MercadoPago');
        console.log('  🚫 NO uses tarjetas reales');
        console.log('='.repeat(60));
        console.log('');

        const paymentData = {
            items: [
                {
                    title: 'Clase de Yoga FlowCasaZen',
                    quantity: 1,
                    unit_price: 2500
                }
            ],
            payer: {
                email: 'test@example.com'
            }
        };

        console.log('🛒 Creando pago de prueba...');
        const response = await axios.post(`${BASE_URL}/api/create-preference`, paymentData);

        console.log('✅ ¡Pago creado exitosamente en SANDBOX!');
        console.log('='.repeat(60));
        console.log(`🆔 ID de preferencia: ${response.data.id}`);
        console.log(`🔗 URL de pago: ${response.data.url}`);
        console.log('');
        console.log('💳 TARJETAS DE PRUEBA PARA USAR:');
        console.log('');
        console.log('✅ TARJETA APROBADA:');
        console.log('   Número: 4509 9535 6623 3704');
        console.log('   Vencimiento: 11/25');
        console.log('   CVV: 123');
        console.log('   Titular: APRO');
        console.log('');
        console.log('❌ TARJETA RECHAZADA:');
        console.log('   Número: 4000 0000 0000 0002');
        console.log('   Vencimiento: 11/25');
        console.log('   CVV: 123');
        console.log('   Titular: OTHE');
        console.log('');
        console.log('⏳ TARJETA PENDIENTE:');
        console.log('   Número: 4000 0000 0000 0004');
        console.log('   Vencimiento: 11/25');
        console.log('   CVV: 123');
        console.log('   Titular: PEND');
        console.log('');
        console.log('🔗 URL DE PAGO:');
        console.log(response.data.url);
        console.log('='.repeat(60));

        return response.data;
    } catch (error) {
        console.error('💥 Error creando pago:', error.response?.data || error.message);
        console.log('');
        console.log('🔧 Soluciones:');
        console.log('  1. Asegúrate de que el servidor esté corriendo');
        console.log('  2. Verifica que esté en modo SANDBOX');
        console.log('  3. Revisa las credenciales');
    }
}

/**
 * 🏥 VERIFICAR ESTADO DEL SERVIDOR
 */
async function checkServer() {
    try {
        console.log('🏥 Verificando estado del servidor...');
        const response = await axios.get(`${BASE_URL}/health`);
        
        console.log('✅ ¡Servidor funcionando correctamente!');
        console.log(`📊 Estado: ${response.data.status}`);
        console.log(`🕐 Timestamp: ${response.data.timestamp}`);
        console.log(`🏷️ Servicio: ${response.data.service}`);
        console.log('');

        return true;
    } catch (error) {
        console.error('❌ Servidor no disponible:', error.message);
        console.log('🔧 Ejecuta: node server.js');
        return false;
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🧪 PRUEBA DE PAGO SANDBOX - FLOWCASZEN');
    console.log('='.repeat(50));
    console.log('📋 Configuración:');
    console.log('  🧪 Modo: SANDBOX (pruebas)');
    console.log('  💳 Método: Checkout Pro');
    console.log('  🚫 Solo tarjetas de prueba');
    console.log('='.repeat(50));
    console.log('');

    // Verificar servidor
    const serverOk = await checkServer();
    
    if (serverOk) {
        // Crear pago de prueba
        await testSandboxPayment();
    } else {
        console.log('❌ No se puede crear el pago sin el servidor');
    }
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testSandboxPayment,
    checkServer
};
