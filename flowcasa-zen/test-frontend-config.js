/**
 * 🔧 PRUEBA DE CONFIGURACIÓN DEL FRONTEND
 * 
 * Este script verifica la configuración del frontend
 */

console.log('🔧 VERIFICANDO CONFIGURACIÓN DEL FRONTEND');
console.log('='.repeat(50));

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL || 'No definida');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'No definida');
console.log('');

// Verificar configuración por defecto
const defaultApiUrl = 'http://localhost:5000';
console.log('📋 Configuración por defecto:');
console.log('  API_BASE_URL:', defaultApiUrl);
console.log('');

// Verificar si el puerto 5000 está disponible
const net = require('net');

function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });
        
        server.on('error', () => {
            resolve(false);
        });
    });
}

async function main() {
    console.log('🔍 Verificando disponibilidad de puertos...');
    
    const port5000 = await checkPort(5000);
    const port4000 = await checkPort(4000);
    
    console.log('  Puerto 5000:', port5000 ? '✅ Disponible' : '❌ Ocupado');
    console.log('  Puerto 4000:', port4000 ? '✅ Disponible' : '❌ Ocupado');
    console.log('');
    
    if (!port5000) {
        console.log('⚠️  El puerto 5000 está ocupado');
        console.log('🔧 Esto puede indicar que el servidor ya está corriendo');
    }
    
    if (!port4000) {
        console.log('⚠️  El puerto 4000 está ocupado');
        console.log('🔧 Esto puede indicar que hay otro servicio corriendo');
    }
    
    console.log('');
    console.log('📋 RECOMENDACIONES:');
    console.log('  1. Asegúrate de que el servidor esté corriendo en puerto 5000');
    console.log('  2. Verifica que no haya conflictos de puertos');
    console.log('  3. Revisa la configuración del frontend');
    console.log('  4. Considera usar variables de entorno para la configuración');
}

main().catch(console.error);
