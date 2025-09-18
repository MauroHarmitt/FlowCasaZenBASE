/**
 * 🌐 PRUEBA DE API DEL FRONTEND
 * 
 * Este script simula las llamadas que hace el frontend
 */

const axios = require('axios');

// Configuración que debería usar el frontend
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🏥 VERIFICAR HEALTH CHECK
 */
async function testHealthCheck() {
    console.log('🏥 Probando health check...');
    
    try {
        const response = await api.get('/health');
        console.log('✅ Health check exitoso');
        console.log(`📊 Estado: ${response.data.status}`);
        return true;
    } catch (error) {
        console.error('❌ Health check falló:', error.message);
        return false;
    }
}

/**
 * 🔐 PROBAR LOGIN
 */
async function testLogin() {
    console.log('🔐 Probando login...');
    
    try {
        const response = await api.post('/api/auth/login', {
            email: 'alumno@gmail.com',
            password: 'password123'
        });
        
        console.log('✅ Login exitoso');
        console.log(`📧 Email: ${response.data.user.email}`);
        console.log(`🆔 ID: ${response.data.user.id}`);
        console.log(`🔑 Token: ${response.data.token ? 'Generado' : 'No generado'}`);
        return true;
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Login falló');
            console.log(`📋 Status: ${error.response.status}`);
            console.log(`📋 Mensaje: ${error.response.data.error}`);
        } else {
            console.error('❌ Error de conexión:', error.message);
        }
        return false;
    }
}

/**
 * 🧪 PROBAR LOGIN CON CREDENCIALES INCORRECTAS
 */
async function testInvalidLogin() {
    console.log('🧪 Probando login con credenciales incorrectas...');
    
    try {
        const response = await api.post('/api/auth/login', {
            email: 'usuario-inexistente@example.com',
            password: 'password-incorrecta'
        });
        
        console.log('❌ ERROR: Se permitió login con credenciales incorrectas!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó login con credenciales incorrectas');
            console.log(`📋 Mensaje: ${error.response.data.error}`);
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
    console.log('🌐 PRUEBA DE API DEL FRONTEND - FLOWCASZEN');
    console.log('='.repeat(60));
    console.log(`📡 URL base: ${API_BASE_URL}`);
    console.log('');
    
    let testsPassed = 0;
    let totalTests = 3;
    
    // Prueba 1: Health check
    console.log('1️⃣ Verificando health check...');
    if (await testHealthCheck()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 2: Login con credenciales correctas
    console.log('2️⃣ Probando login con credenciales correctas...');
    if (await testLogin()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 3: Login con credenciales incorrectas
    console.log('3️⃣ Probando login con credenciales incorrectas...');
    if (await testInvalidLogin()) {
        testsPassed++;
    }
    console.log('');
    
    // Resultados
    console.log('='.repeat(60));
    console.log('📊 RESULTADOS');
    console.log('='.repeat(60));
    console.log(`✅ Pruebas pasadas: ${testsPassed}/${totalTests}`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!');
        console.log('✅ La API del frontend está funcionando correctamente');
        console.log('✅ El servidor responde correctamente');
        console.log('✅ El sistema de autenticación funciona');
    } else {
        console.log('❌ ALGUNAS PRUEBAS FALLARON');
        console.log('🔧 Revisa la configuración del servidor');
    }
    
    console.log('='.repeat(60));
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testHealthCheck,
    testLogin,
    testInvalidLogin
};
