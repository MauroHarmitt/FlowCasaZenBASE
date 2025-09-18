/**
 * 🧪 PRUEBA CON SERVIDOR TEMPORAL
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function testTempPayment() {
    try {
        console.log('🧪 Probando pago con servidor temporal...');
        
        // Verificar servidor
        console.log('🏥 Verificando servidor temporal...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Servidor temporal funcionando');
        
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

        console.log('🛒 Creando pago...');
        const response = await axios.post(`${BASE_URL}/api/create-preference`, paymentData);

        console.log('✅ ¡Pago creado exitosamente!');
        console.log('='.repeat(60));
        console.log(`🆔 ID de preferencia: ${response.data.id}`);
        console.log(`🔗 URL de pago: ${response.data.url}`);
        console.log('');
        console.log('💳 TARJETAS DE PRUEBA:');
        console.log('  ✅ Aprobada: 4509 9535 6623 3704 (Vencimiento: 11/25, CVV: 123)');
        console.log('  ❌ Rechazada: 4000 0000 0000 0002 (Vencimiento: 11/25, CVV: 123)');
        console.log('  ⏳ Pendiente: 4000 0000 0000 0004 (Vencimiento: 11/25, CVV: 123)');
        console.log('');
        console.log('🔗 URL DE PAGO PARA COMPARTIR:');
        console.log(response.data.url);
        console.log('='.repeat(60));

        return response.data;
    } catch (error) {
        console.error('💥 Error:', error.response?.data || error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('🔧 Inicia el servidor temporal: node server-temp.js');
        }
        return null;
    }
}

// Ejecutar prueba
testTempPayment();
