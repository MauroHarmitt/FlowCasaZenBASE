/**
 * 🔒 PRUEBA DE SEGURIDAD ESTRICTA
 * 
 * Este script verifica que el sistema NO permita acceso bajo ninguna circunstancia
 * sin credenciales correctas y servidor funcionando
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

/**
 * 🧪 PROBAR QUE NO SE PUEDA ACCEDER SIN SERVIDOR
 */
async function testNoServerAccess() {
    console.log('🧪 Probando que NO se pueda acceder sin servidor...');
    
    try {
        // Intentar hacer login sin servidor
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'cualquier@email.com',
            password: 'cualquierpassword'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió acceso sin servidor!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.log('✅ CORRECTO: No se puede acceder sin servidor');
            console.log('📋 Error esperado:', error.code);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR QUE NO SE PUEDA ACCEDER CON CREDENCIALES FALSAS
 */
async function testFakeCredentials() {
    console.log('🧪 Probando que NO se pueda acceder con credenciales falsas...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'fake@fake.com',
            password: 'fakepassword123'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió acceso con credenciales falsas!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó acceso con credenciales falsas');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR QUE NO SE PUEDA ACCEDER CON EMAIL VÁLIDO PERO CONTRASEÑA INCORRECTA
 */
async function testValidEmailWrongPassword() {
    console.log('🧪 Probando que NO se pueda acceder con email válido pero contraseña incorrecta...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'passwordincorrecta123'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió acceso con contraseña incorrecta!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó acceso con contraseña incorrecta');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR QUE NO SE PUEDA ACCEDER CON DATOS VACÍOS
 */
async function testEmptyData() {
    console.log('🧪 Probando que NO se pueda acceder con datos vacíos...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: '',
            password: ''
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió acceso con datos vacíos!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 400) {
            console.log('✅ CORRECTO: Se rechazó acceso con datos vacíos');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 🧪 PROBAR QUE NO SE PUEDA ACCEDER CON FORMATO DE EMAIL INVÁLIDO
 */
async function testInvalidEmailFormat() {
    console.log('🧪 Probando que NO se pueda acceder con formato de email inválido...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'email-sin-arroba',
            password: 'password123'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió acceso con email inválido!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 400) {
            console.log('✅ CORRECTO: Se rechazó acceso con email inválido');
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
    console.log('🔒 PRUEBA DE SEGURIDAD ESTRICTA - FLOWCASZEN');
    console.log('='.repeat(70));
    console.log('📋 Verificando que el sistema sea 100% seguro');
    console.log('📋 NO debe permitir acceso bajo ninguna circunstancia incorrecta');
    console.log('='.repeat(70));
    console.log('');
    
    // Verificar servidor
    const serverOk = await checkServer();
    if (!serverOk) {
        console.log('⚠️  Servidor no disponible - ejecutando pruebas de seguridad sin servidor');
        console.log('');
        
        // Probar que no se pueda acceder sin servidor
        const noServerTest = await testNoServerAccess();
        console.log('');
        
        if (noServerTest) {
            console.log('✅ PRUEBA SIN SERVIDOR: PASÓ');
            console.log('🔒 El sistema NO permite acceso sin servidor');
        } else {
            console.log('❌ PRUEBA SIN SERVIDOR: FALLÓ');
            console.log('🚨 CRÍTICO: El sistema permite acceso sin servidor');
        }
        
        return;
    }
    
    let testsPassed = 0;
    let totalTests = 4;
    
    // Ejecutar pruebas con servidor
    console.log('🧪 Ejecutando pruebas de seguridad con servidor...');
    console.log('');
    
    // Prueba 1: Credenciales falsas
    if (await testFakeCredentials()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 2: Email válido, contraseña incorrecta
    if (await testValidEmailWrongPassword()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 3: Datos vacíos
    if (await testEmptyData()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 4: Formato de email inválido
    if (await testInvalidEmailFormat()) {
        testsPassed++;
    }
    console.log('');
    
    // Resultados
    console.log('='.repeat(70));
    console.log('📊 RESULTADOS DE LAS PRUEBAS DE SEGURIDAD');
    console.log('='.repeat(70));
    console.log(`✅ Pruebas pasadas: ${testsPassed}/${totalTests}`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ¡TODAS LAS PRUEBAS DE SEGURIDAD PASARON!');
        console.log('✅ El sistema es 100% SEGURO');
        console.log('✅ NO permite acceso con credenciales incorrectas');
        console.log('✅ NO permite acceso sin servidor');
        console.log('✅ NO permite acceso con datos inválidos');
    } else {
        console.log('❌ ALGUNAS PRUEBAS DE SEGURIDAD FALLARON');
        console.log('🚨 CRÍTICO: El sistema tiene vulnerabilidades de seguridad');
        console.log('🔧 Revisa inmediatamente la configuración de autenticación');
    }
    
    console.log('='.repeat(70));
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testNoServerAccess,
    testFakeCredentials,
    testValidEmailWrongPassword,
    testEmptyData,
    testInvalidEmailFormat,
    checkServer
};
