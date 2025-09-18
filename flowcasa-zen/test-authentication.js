/**
 * 🧪 PRUEBA DE AUTENTICACIÓN
 * 
 * Este script prueba que el sistema de autenticación funcione correctamente
 * y NO permita acceso con credenciales incorrectas
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

/**
 * 🧪 PROBAR LOGIN CON CREDENCIALES INCORRECTAS
 */
async function testInvalidCredentials() {
    console.log('🧪 Probando login con credenciales incorrectas...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'password123'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR - Si llega aquí, hay un problema
        console.log('❌ ERROR: Se permitió acceso con credenciales incorrectas!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO - Debe fallar con credenciales incorrectas
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó el acceso con credenciales incorrectas');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR LOGIN CON EMAIL INEXISTENTE
 */
async function testNonExistentEmail() {
    console.log('🧪 Probando login con email inexistente...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'noexiste@example.com',
            password: 'cualquierpassword'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR: Se permitió acceso con email inexistente!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó el acceso con email inexistente');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR LOGIN CON FORMATO DE EMAIL INVÁLIDO
 */
async function testInvalidEmailFormat() {
    console.log('🧪 Probando login con formato de email inválido...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'email-invalido',
            password: 'password123'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR: Se permitió acceso con email inválido!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 400) {
            console.log('✅ CORRECTO: Se rechazó el acceso con email inválido');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR LOGIN CON CAMPOS VACÍOS
 */
async function testEmptyFields() {
    console.log('🧪 Probando login con campos vacíos...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: '',
            password: ''
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR: Se permitió acceso con campos vacíos!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 400) {
            console.log('✅ CORRECTO: Se rechazó el acceso con campos vacíos');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
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
        console.log('');
        return true;
    } catch (error) {
        console.error('❌ Servidor no disponible:', error.message);
        console.log('🔧 Asegúrate de que el servidor esté ejecutándose en puerto 4000');
        return false;
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🧪 PRUEBA DE AUTENTICACIÓN - FLOWCASZEN');
    console.log('='.repeat(60));
    console.log('📋 Verificando que el sistema NO permita acceso con credenciales incorrectas');
    console.log('='.repeat(60));
    console.log('');
    
    // Verificar servidor
    const serverOk = await checkServer();
    if (!serverOk) {
        return;
    }
    
    let testsPassed = 0;
    let totalTests = 4;
    
    // Ejecutar pruebas
    console.log('🧪 Ejecutando pruebas de seguridad...');
    console.log('');
    
    // Prueba 1: Credenciales incorrectas
    if (await testInvalidCredentials()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 2: Email inexistente
    if (await testNonExistentEmail()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 3: Formato de email inválido
    if (await testInvalidEmailFormat()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 4: Campos vacíos
    if (await testEmptyFields()) {
        testsPassed++;
    }
    console.log('');
    
    // Resultados
    console.log('='.repeat(60));
    console.log('📊 RESULTADOS DE LAS PRUEBAS');
    console.log('='.repeat(60));
    console.log(`✅ Pruebas pasadas: ${testsPassed}/${totalTests}`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!');
        console.log('✅ El sistema de autenticación es SEGURO');
        console.log('✅ NO permite acceso con credenciales incorrectas');
    } else {
        console.log('❌ ALGUNAS PRUEBAS FALLARON');
        console.log('⚠️  El sistema puede tener problemas de seguridad');
        console.log('🔧 Revisa la configuración de autenticación');
    }
    
    console.log('='.repeat(60));
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testInvalidCredentials,
    testNonExistentEmail,
    testInvalidEmailFormat,
    testEmptyFields,
    checkServer
};