/**
 * 🔄 ACTUALIZADOR DE URLs DE NGROK
 * 
 * Este script actualiza automáticamente las URLs de ngrok en la configuración
 * cuando cambian las URLs públicas
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CONFIG_FILE = path.join(__dirname, 'config.js');

/**
 * 🌐 OBTENER URL DE NGROK DESDE LA API LOCAL
 */
async function getNgrokUrl() {
    try {
        console.log('🔍 Obteniendo URL de ngrok...');
        
        // Intentar obtener la URL desde la API local de ngrok
        const response = await axios.get('http://127.0.0.1:4040/api/tunnels');
        const tunnels = response.data.tunnels;
        
        if (tunnels && tunnels.length > 0) {
            // Buscar el túnel HTTPS
            const httpsTunnel = tunnels.find(tunnel => tunnel.proto === 'https');
            if (httpsTunnel) {
                console.log(`✅ URL de ngrok encontrada: ${httpsTunnel.public_url}`);
                return httpsTunnel.public_url;
            }
            
            // Si no hay HTTPS, usar HTTP
            const httpTunnel = tunnels.find(tunnel => tunnel.proto === 'http');
            if (httpTunnel) {
                console.log(`⚠️  Solo HTTP disponible: ${httpTunnel.public_url}`);
                return httpTunnel.public_url;
            }
        }
        
        throw new Error('No se encontraron túneles activos');
        
    } catch (error) {
        console.error('❌ Error obteniendo URL de ngrok:', error.message);
        console.log('🔧 Asegúrate de que ngrok esté ejecutándose en puerto 4040');
        return null;
    }
}

/**
 * 🔄 ACTUALIZAR CONFIGURACIÓN CON NUEVA URL
 */
function updateConfigWithNgrokUrl(ngrokUrl) {
    try {
        console.log('🔄 Actualizando configuración...');
        
        let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
        
        // Actualizar URLs de redirección
        configContent = configContent.replace(
            /success: process\.env\.SUCCESS_URL \|\| 'http:\/\/localhost:3000\/payment\/success'/g,
            `success: process.env.SUCCESS_URL || '${ngrokUrl}/payment/success'`
        );
        
        configContent = configContent.replace(
            /failure: process\.env\.FAILURE_URL \|\| 'http:\/\/localhost:3000\/payment\/failure'/g,
            `failure: process.env.FAILURE_URL || '${ngrokUrl}/payment/failure'`
        );
        
        configContent = configContent.replace(
            /pending: process\.env\.PENDING_URL \|\| 'http:\/\/localhost:3000\/payment\/pending'/g,
            `pending: process.env.PENDING_URL || '${ngrokUrl}/payment/pending'`
        );
        
        configContent = configContent.replace(
            /webhook: process\.env\.WEBHOOK_URL \|\| 'http:\/\/localhost:3001\/api\/webhooks\/mercadopago'/g,
            `webhook: process.env.WEBHOOK_URL || '${ngrokUrl}/api/webhooks/mercadopago'`
        );
        
        fs.writeFileSync(CONFIG_FILE, configContent);
        
        console.log('✅ ¡Configuración actualizada exitosamente!');
        console.log('');
        console.log('📋 URLs actualizadas:');
        console.log(`  ✅ Success: ${ngrokUrl}/payment/success`);
        console.log(`  ❌ Failure: ${ngrokUrl}/payment/failure`);
        console.log(`  ⏳ Pending: ${ngrokUrl}/payment/pending`);
        console.log(`  🔔 Webhook: ${ngrokUrl}/api/webhooks/mercadopago`);
        
        return true;
        
    } catch (error) {
        console.error('💥 Error actualizando configuración:', error.message);
        return false;
    }
}

/**
 * 🧪 CREAR PAGO DE PRUEBA CON NUEVA URL
 */
async function createTestPayment(ngrokUrl) {
    try {
        console.log('');
        console.log('🧪 Creando pago de prueba con nueva URL...');
        
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
        
        const response = await axios.post('http://localhost:3001/api/create-preference', paymentData);
        
        console.log('✅ ¡Pago de prueba creado!');
        console.log('');
        console.log('🔗 URL DE PAGO PARA COMPARTIR:');
        console.log(response.data.url);
        console.log('');
        console.log('💳 TARJETAS DE PRUEBA:');
        console.log('  ✅ Aprobada: 4509 9535 6623 3704 (Vencimiento: 11/25, CVV: 123)');
        console.log('  ❌ Rechazada: 4000 0000 0000 0002 (Vencimiento: 11/25, CVV: 123)');
        console.log('  ⏳ Pendiente: 4000 0000 0000 0004 (Vencimiento: 11/25, CVV: 123)');
        
        return response.data;
        
    } catch (error) {
        console.error('💥 Error creando pago de prueba:', error.response?.data || error.message);
        console.log('🔧 Asegúrate de que el servidor esté ejecutándose en puerto 3001');
        return null;
    }
}

/**
 * 📋 MOSTRAR INFORMACIÓN PARA COMPARTIR
 */
function showSharingInfo(ngrokUrl, paymentData) {
    console.log('');
    console.log('='.repeat(60));
    console.log('🌐 INFORMACIÓN PARA COMPARTIR');
    console.log('='.repeat(60));
    console.log('');
    console.log('🔗 URL PÚBLICA DE TU APLICACIÓN:');
    console.log(`   ${ngrokUrl}`);
    console.log('');
    console.log('🛒 URL DE PAGO ESPECÍFICA:');
    console.log(`   ${paymentData?.url || 'No disponible'}`);
    console.log('');
    console.log('📱 INSTRUCCIONES PARA TUS CLIENTES:');
    console.log('   1. Haz clic en el enlace de pago');
    console.log('   2. Completa los datos de la tarjeta');
    console.log('   3. Usa las tarjetas de prueba si es necesario');
    console.log('   4. Confirma el pago');
    console.log('');
    console.log('💳 TARJETAS DE PRUEBA (para testing):');
    console.log('   ✅ Aprobada: 4509 9535 6623 3704');
    console.log('   ❌ Rechazada: 4000 0000 0000 0002');
    console.log('   ⏳ Pendiente: 4000 0000 0000 0004');
    console.log('   📅 Vencimiento: 11/25');
    console.log('   🔢 CVV: 123');
    console.log('');
    console.log('⚠️  IMPORTANTE:');
    console.log('   - Las URLs de ngrok cambian al reiniciar');
    console.log('   - Solo usa tarjetas de prueba en modo sandbox');
    console.log('   - Para producción, cambia a modo producción');
    console.log('='.repeat(60));
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🔄 ACTUALIZADOR DE URLs DE NGROK');
    console.log('='.repeat(40));
    console.log('');
    
    // Obtener URL de ngrok
    const ngrokUrl = await getNgrokUrl();
    if (!ngrokUrl) {
        console.log('❌ No se pudo obtener la URL de ngrok');
        console.log('🔧 Asegúrate de que ngrok esté ejecutándose');
        return;
    }
    
    // Actualizar configuración
    const configUpdated = updateConfigWithNgrokUrl(ngrokUrl);
    if (!configUpdated) {
        console.log('❌ No se pudo actualizar la configuración');
        return;
    }
    
    // Crear pago de prueba
    const paymentData = await createTestPayment(ngrokUrl);
    
    // Mostrar información para compartir
    showSharingInfo(ngrokUrl, paymentData);
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    getNgrokUrl,
    updateConfigWithNgrokUrl,
    createTestPayment,
    showSharingInfo
};
