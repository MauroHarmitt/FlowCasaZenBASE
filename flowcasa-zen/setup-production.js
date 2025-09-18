#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE CONFIGURACIÓN PARA PRODUCCIÓN
 * Configura el entorno de producción para www.flowcasazen.com
 */

const fs = require('fs');
const path = require('path');

console.log('🌐 Configurando FlowCasa Zen para producción...\n');

// Verificar si existe el archivo env.production
const envProductionPath = path.join(__dirname, 'env.production');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envProductionPath)) {
    console.error('❌ Error: No se encontró el archivo env.production');
    console.log('💡 Asegúrate de que existe el archivo env.production en la raíz del proyecto');
    process.exit(1);
}

// Copiar env.production a .env
try {
    const envProductionContent = fs.readFileSync(envProductionPath, 'utf8');
    fs.writeFileSync(envPath, envProductionContent);
    console.log('✅ Archivo .env configurado para producción');
} catch (error) {
    console.error('❌ Error al copiar la configuración:', error.message);
    process.exit(1);
}

// Crear archivo .env para el servidor
const serverEnvPath = path.join(__dirname, 'server', '.env');
try {
    const serverEnvContent = `# Configuración del servidor para producción
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
FRONTEND_URL=https://www.flowcasazen.com
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/flowcasa-zen?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_muy_seguro_para_produccion_aqui_cambiar_por_uno_real
JWT_EXPIRES_IN=7d
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=false
WEBHOOK_URL=https://www.flowcasazen.com:5000/api/webhooks/mercadopago
SUCCESS_URL=https://www.flowcasazen.com/payment/success
FAILURE_URL=https://www.flowcasazen.com/payment/failure
PENDING_URL=https://www.flowcasazen.com/payment/pending
`;
    
    fs.writeFileSync(serverEnvPath, serverEnvContent);
    console.log('✅ Archivo .env del servidor configurado');
} catch (error) {
    console.error('❌ Error al configurar el servidor:', error.message);
}

console.log('\n🎉 Configuración completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. 🔧 Actualiza las variables de entorno en env.production:');
console.log('   - MONGODB_URI: Configura tu base de datos de producción');
console.log('   - JWT_SECRET: Cambia por un secreto real y seguro');
console.log('   - MERCADOPAGO_*: Verifica las credenciales de producción');
console.log('   - EMAIL_*: Configura si vas a usar notificaciones por email');
console.log('\n2. 🏗️  Ejecuta el build de producción:');
console.log('   npm run build');
console.log('\n3. 🚀 Sube los archivos a tu hosting');
console.log('\n4. 🌐 Configura tu dominio en GoDaddy para apuntar a tu servidor');
console.log('\n5. 🔒 Asegúrate de tener SSL/HTTPS configurado');

