/**
 * 🛒 GENERADOR DE PAGO PARA FLOWCASAZEN
 * 
 * 📝 Este script crea un pago usando la cuenta de vendedor de prueba
 * Vendedor: TESTUSER5054... (Argentina)
 * Comprador: TESTUSER5945... (Argentina)
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

/**
 * 🛒 CREAR PAGO PARA FLOWCASAZEN
 * 
 * 📝 Descripción:
 * Crea un pago de ejemplo para FlowCasaZen usando Checkout Pro
 * con la cuenta de vendedor de prueba
 */
async function createFlowCasaZenPayment() {
    try {
        console.log('🛒 Creando pago para FlowCasaZen...');
        console.log('🏪 Vendedor: TESTUSER5054... (Argentina)');
        console.log('👤 Comprador: TESTUSER5945... (Argentina)');
        console.log('');

        const paymentData = {
            items: [
                {
                    title: 'Clase de Yoga FlowCasaZen',     // 🧘‍♀️ Clase de yoga
                    quantity: 1,                            // 🔢 Cantidad
                    unit_price: 2500                        // 💰 Precio en ARS
                },
                {
                    title: 'Sesión de Meditación',          // 🧘‍♂️ Sesión de meditación
                    quantity: 1,                            // 🔢 Cantidad
                    unit_price: 1500                        // 💰 Precio en ARS
                }
            ],
            payer: {
                email: 'testuser5945@test.com',            // 📧 Email del comprador de prueba
                id: '2690307621'                           // 🆔 User ID del comprador
            }
        };

        console.log('📦 Items del pago:');
        paymentData.items.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title} - $${item.unit_price} ARS`);
        });
        
        const total = paymentData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        console.log(`💰 Total: $${total} ARS`);
        console.log('');

        console.log('🔧 Enviando solicitud al servidor...');
        const response = await axios.post(`${BASE_URL}/api/create-preference`, paymentData);

        console.log('🎉 ¡Pago creado exitosamente!');
        console.log('='.repeat(60));
        console.log(`🆔 ID de preferencia: ${response.data.id}`);
        console.log(`🔗 URL de pago: ${response.data.url}`);
        console.log('');
        console.log('📋 Detalles del pago:');
        console.log(`  🏪 Vendedor: TESTUSER5054... (ID: 2697937676)`);
        console.log(`  👤 Comprador: TESTUSER5945... (ID: 2690307621)`);
        console.log(`  📧 Email comprador: ${paymentData.payer.email}`);
        console.log(`  💰 Total: $${response.data.total} ARS`);
        console.log('');
        console.log('🎯 Para probar el pago:');
        console.log('  1. Copia la URL de pago');
        console.log('  2. Ábrela en tu navegador');
        console.log('  3. Usa los datos del comprador de prueba:');
        console.log('     - Usuario: TESTUSER5945...');
        console.log('     - Contraseña: XFppYkMfUy');
        console.log('  4. Completa el pago');
        console.log('');
        console.log('🔗 URL DE PAGO:');
        console.log(response.data.url);
        console.log('='.repeat(60));

        return response.data;
    } catch (error) {
        console.error('💥 Error creando pago:', error.response?.data || error.message);
        console.log('');
        console.log('🔧 Soluciones:');
        console.log('  - Verifica que el servidor esté corriendo (node server.js)');
        console.log('  - Revisa las credenciales en config.js');
        console.log('  - Asegúrate de tener conexión a internet');
        console.log('  - Verifica que el puerto 3001 esté disponible');
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
    console.log('🚀 GENERADOR DE PAGO FLOWCASAZEN');
    console.log('='.repeat(50));
    console.log('📋 Configuración:');
    console.log('  🏪 Vendedor: TESTUSER5054... (Argentina)');
    console.log('  👤 Comprador: TESTUSER5945... (Argentina)');
    console.log('  💳 Método: Checkout Pro');
    console.log('='.repeat(50));
    console.log('');

    // Verificar servidor
    const serverOk = await checkServer();
    
    if (serverOk) {
        // Crear pago
        await createFlowCasaZenPayment();
    } else {
        console.log('❌ No se puede crear el pago sin el servidor');
    }
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    createFlowCasaZenPayment,
    checkServer
};
