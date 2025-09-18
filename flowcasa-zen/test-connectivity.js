/**
 * 🔗 PRUEBA DE CONECTIVIDAD
 * 
 * Este script verifica la conectividad entre el frontend y el backend
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

/**
 * 🏥 VERIFICAR CONECTIVIDAD AL SERVIDOR
 */
async function testConnectivity() {
    console.log('🔗 Probando conectividad al servidor...');
    
    try {
        console.log(`📡 Intentando conectar a: ${BASE_URL}/health`);
        const response = await axios.get(`${BASE_URL}/health`);
        
        console.log('✅ ¡Conectividad exitosa!');
        console.log(`📊 Estado: ${response.data.status}`);
        console.log(`🕐 Timestamp: ${response.data.timestamp}`);
        console.log(`🌐 URL: ${BASE_URL}`);
        
        return true;
    } catch (error) {
        console.error('❌ Error de conectividad:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('🔧 El servidor no está corriendo o no está en el puerto 5000');
        } else if (error.code === 'ENOTFOUND') {
            console.log('🔧 No se puede resolver la dirección del servidor');
        } else {
            console.log('🔧 Error desconocido de conectividad');
        }
        
        return false;
    }
}

/**
 * 🧪 PROBAR LOGIN SIMPLE
 */
async function testSimpleLogin() {
    console.log('🧪 Probando login simple...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        
        console.log('❌ ERROR: Se permitió login con credenciales de prueba!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó login con credenciales de prueba');
            console.log('📋 Mensaje:', error.response.data.error);
            return true;
        } else {
            console.log('❌ Error inesperado:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🔗 PRUEBA DE CONECTIVIDAD - FLOWCASZEN');
    console.log('='.repeat(50));
    console.log('');
    
    // Prueba 1: Conectividad
    console.log('1️⃣ Verificando conectividad...');
    const connectivityOk = await testConnectivity();
    console.log('');
    
    if (!connectivityOk) {
        console.log('❌ No se puede conectar al servidor');
        console.log('🔧 Asegúrate de que el servidor esté corriendo en puerto 5000');
        return;
    }
    
    // Prueba 2: Login simple
    console.log('2️⃣ Probando login simple...');
    const loginOk = await testSimpleLogin();
    console.log('');
    
    // Resultados
    console.log('='.repeat(50));
    console.log('📊 RESULTADOS');
    console.log('='.repeat(50));
    
    if (connectivityOk && loginOk) {
        console.log('✅ ¡TODAS LAS PRUEBAS PASARON!');
        console.log('✅ El servidor está funcionando correctamente');
        console.log('✅ La conectividad es exitosa');
        console.log('✅ El sistema de autenticación responde correctamente');
    } else {
        console.log('❌ ALGUNAS PRUEBAS FALLARON');
        console.log('🔧 Revisa la configuración del servidor');
    }
    
    console.log('='.repeat(50));
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testConnectivity,
    testSimpleLogin
};
