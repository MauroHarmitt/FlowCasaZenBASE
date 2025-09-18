/**
 * 🔄 CAMBIAR MODO DE MERCADOPAGO
 * 
 * Este script te permite cambiar fácilmente entre modo SANDBOX y PRODUCCIÓN
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'config.js');

/**
 * 🔄 CAMBIAR A MODO SANDBOX
 */
function switchToSandbox() {
    try {
        console.log('🧪 Cambiando a MODO SANDBOX...');
        
        let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
        
        // Cambiar sandbox a true
        configContent = configContent.replace(
            /sandbox: process\.env\.MERCADOPAGO_SANDBOX === 'true' \|\| false/g,
            'sandbox: process.env.MERCADOPAGO_SANDBOX === \'true\' || true'
        );
        
        // Cambiar comentario
        configContent = configContent.replace(
            /\/\/ Modo producción por defecto/g,
            '// Modo sandbox por defecto para pruebas'
        );
        
        fs.writeFileSync(CONFIG_FILE, configContent);
        
        console.log('✅ ¡Cambiado a MODO SANDBOX exitosamente!');
        console.log('');
        console.log('📋 Características del modo SANDBOX:');
        console.log('  🧪 Solo tarjetas de prueba');
        console.log('  💰 No se procesan pagos reales');
        console.log('  🔒 Seguro para desarrollo');
        console.log('  🚫 No uses tarjetas reales');
        console.log('');
        console.log('💳 Tarjetas de prueba recomendadas:');
        console.log('  ✅ Aprobada: 4509 9535 6623 3704');
        console.log('  ❌ Rechazada: 4000 0000 0000 0002');
        console.log('  ⏳ Pendiente: 4000 0000 0000 0004');
        
    } catch (error) {
        console.error('💥 Error cambiando a sandbox:', error.message);
    }
}

/**
 * 🚀 CAMBIAR A MODO PRODUCCIÓN
 */
function switchToProduction() {
    try {
        console.log('🚀 Cambiando a MODO PRODUCCIÓN...');
        
        let configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
        
        // Cambiar sandbox a false
        configContent = configContent.replace(
            /sandbox: process\.env\.MERCADOPAGO_SANDBOX === 'true' \|\| true/g,
            'sandbox: process.env.MERCADOPAGO_SANDBOX === \'true\' || false'
        );
        
        // Cambiar comentario
        configContent = configContent.replace(
            /\/\/ Modo sandbox por defecto para pruebas/g,
            '// Modo producción por defecto'
        );
        
        fs.writeFileSync(CONFIG_FILE, configContent);
        
        console.log('✅ ¡Cambiado a MODO PRODUCCIÓN exitosamente!');
        console.log('');
        console.log('⚠️  ADVERTENCIA - MODO PRODUCCIÓN:');
        console.log('  💳 Se procesarán pagos REALES');
        console.log('  💰 Se cobrará dinero real');
        console.log('  🔒 Solo para uso en producción');
        console.log('  ✅ Usa tarjetas reales');
        console.log('');
        console.log('🔧 Asegúrate de tener:');
        console.log('  - Credenciales de producción');
        console.log('  - Webhook configurado');
        console.log('  - URLs de producción');
        
    } catch (error) {
        console.error('💥 Error cambiando a producción:', error.message);
    }
}

/**
 * 📊 MOSTRAR ESTADO ACTUAL
 */
function showCurrentMode() {
    try {
        const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
        
        if (configContent.includes('sandbox: process.env.MERCADOPAGO_SANDBOX === \'true\' || true')) {
            console.log('🧪 MODO ACTUAL: SANDBOX (pruebas)');
            console.log('  💳 Solo tarjetas de prueba');
            console.log('  🚫 No se procesan pagos reales');
        } else {
            console.log('🚀 MODO ACTUAL: PRODUCCIÓN');
            console.log('  💳 Pagos reales');
            console.log('  💰 Se cobra dinero real');
        }
        
    } catch (error) {
        console.error('💥 Error leyendo configuración:', error.message);
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    console.log('🔄 CAMBIADOR DE MODO MERCADOPAGO');
    console.log('='.repeat(40));
    console.log('');
    
    switch (command) {
        case 'sandbox':
            switchToSandbox();
            break;
        case 'production':
            switchToProduction();
            break;
        case 'status':
            showCurrentMode();
            break;
        default:
            console.log('📋 Uso:');
            console.log('  node switch-mode.js sandbox     - Cambiar a modo sandbox');
            console.log('  node switch-mode.js production  - Cambiar a modo producción');
            console.log('  node switch-mode.js status      - Ver modo actual');
            console.log('');
            showCurrentMode();
    }
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main();
}

module.exports = {
    switchToSandbox,
    switchToProduction,
    showCurrentMode
};
