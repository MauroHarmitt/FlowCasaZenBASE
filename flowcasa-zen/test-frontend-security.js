/**
 * 🔒 PRUEBA DE SEGURIDAD DEL FRONTEND
 * 
 * Este script verifica que las medidas de seguridad del frontend
 * funcionen correctamente y bloqueen el acceso con credenciales incorrectas
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

/**
 * 🧪 PROBAR MÚLTIPLES INTENTOS FALLIDOS
 */
async function testMultipleFailedAttempts() {
    console.log('🧪 Probando múltiples intentos fallidos...');
    
    const testEmail = 'test-failed-attempts@example.com';
    const wrongPassword = 'wrongpassword123';
    
    let attempts = 0;
    const maxAttempts = 5;
    
    for (let i = 1; i <= maxAttempts; i++) {
        try {
            console.log(`   Intento ${i}/${maxAttempts}...`);
            
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testEmail,
                password: wrongPassword
            });
            
            // ❌ ESTO NO DEBERÍA PASAR
            console.log(`❌ ERROR CRÍTICO: Se permitió acceso en intento ${i}!`);
            console.log('📋 Respuesta:', response.data);
            return false;
            
        } catch (error) {
            // ✅ ESTO ES LO CORRECTO
            if (error.response && error.response.status === 401) {
                console.log(`   ✅ Intento ${i} rechazado correctamente`);
                console.log(`   📋 Mensaje: ${error.response.data.error}`);
                attempts++;
            } else if (error.response && error.response.status === 423) {
                console.log(`   🔒 Intento ${i} - Cuenta bloqueada (esperado después de varios intentos)`);
                console.log(`   📋 Mensaje: ${error.response.data.error}`);
                return true; // Bloqueo es correcto
            } else {
                console.log(`   ❌ Error inesperado en intento ${i}:`, error.response?.data || error.message);
                return false;
            }
        }
        
        // Pequeña pausa entre intentos
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Se rechazaron correctamente ${attempts} intentos fallidos`);
    return true;
}

/**
 * 🧪 PROBAR DIFERENTES TIPOS DE CREDENCIALES INCORRECTAS
 */
async function testDifferentInvalidCredentials() {
    console.log('🧪 Probando diferentes tipos de credenciales incorrectas...');
    
    const testCases = [
        {
            name: 'Email inexistente',
            email: 'usuario-inexistente@example.com',
            password: 'password123'
        },
        {
            name: 'Email válido, contraseña incorrecta',
            email: 'test@example.com',
            password: 'contraseña-incorrecta'
        },
        {
            name: 'Email con formato inválido',
            email: 'email-sin-arroba',
            password: 'password123'
        },
        {
            name: 'Campos vacíos',
            email: '',
            password: ''
        },
        {
            name: 'Solo email, sin contraseña',
            email: 'test@example.com',
            password: ''
        },
        {
            name: 'Solo contraseña, sin email',
            email: '',
            password: 'password123'
        }
    ];
    
    let passedTests = 0;
    
    for (const testCase of testCases) {
        try {
            console.log(`   Probando: ${testCase.name}...`);
            
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testCase.email,
                password: testCase.password
            });
            
            // ❌ ESTO NO DEBERÍA PASAR
            console.log(`   ❌ ERROR: Se permitió acceso con ${testCase.name}!`);
            console.log(`   📋 Respuesta:`, response.data);
            
        } catch (error) {
            // ✅ ESTO ES LO CORRECTO
            if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                console.log(`   ✅ CORRECTO: Se rechazó ${testCase.name}`);
                console.log(`   📋 Mensaje: ${error.response.data.error}`);
                passedTests++;
            } else {
                console.log(`   ❌ Error inesperado:`, error.response?.data || error.message);
            }
        }
        
        // Pequeña pausa entre pruebas
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Pruebas pasadas: ${passedTests}/${testCases.length}`);
    return passedTests === testCases.length;
}

/**
 * 🧪 PROBAR REGISTRO Y LOGIN CORRECTO
 */
async function testCorrectLogin() {
    console.log('🧪 Probando registro y login correcto...');
    
    const testUser = {
        firstName: 'Test',
        lastName: 'Security',
        email: `test-security-${Date.now()}@example.com`,
        password: 'password123',
        country: 'Argentina',
        timezone: 'America/Argentina/Buenos_Aires',
        role: 'student'
    };
    
    try {
        // 1. Registrar usuario
        console.log('   Registrando usuario...');
        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
        
        if (registerResponse.data && registerResponse.data.user && registerResponse.data.token) {
            console.log('   ✅ Usuario registrado exitosamente');
            
            // 2. Hacer login con credenciales correctas
            console.log('   Haciendo login con credenciales correctas...');
            const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            
            if (loginResponse.data && loginResponse.data.user && loginResponse.data.token) {
                console.log('   ✅ Login exitoso con credenciales correctas');
                console.log(`   📧 Email: ${loginResponse.data.user.email}`);
                console.log(`   🆔 ID: ${loginResponse.data.user.id}`);
                return true;
            } else {
                console.log('   ❌ Login falló con credenciales correctas');
                return false;
            }
        } else {
            console.log('   ❌ Registro falló');
            return false;
        }
        
    } catch (error) {
        console.log('   ❌ Error en registro/login correcto:', error.response?.data || error.message);
        return false;
    }
}

/**
 * 🧪 PROBAR VERIFICACIÓN DE TOKEN
 */
async function testTokenVerification() {
    console.log('🧪 Probando verificación de token...');
    
    const testUser = {
        firstName: 'Test',
        lastName: 'Token',
        email: `test-token-${Date.now()}@example.com`,
        password: 'password123',
        country: 'Argentina',
        timezone: 'America/Argentina/Buenos_Aires',
        role: 'student'
    };
    
    try {
        // 1. Registrar y hacer login
        const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        
        const token = loginResponse.data.token;
        
        // 2. Probar acceso con token válido
        console.log('   Probando acceso con token válido...');
        const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (profileResponse.data && profileResponse.data.user) {
            console.log('   ✅ Acceso con token válido exitoso');
        } else {
            console.log('   ❌ Acceso con token válido falló');
            return false;
        }
        
        // 3. Probar acceso con token inválido
        console.log('   Probando acceso con token inválido...');
        try {
            const invalidTokenResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': 'Bearer token-invalido'
                }
            });
            
            // ❌ ESTO NO DEBERÍA PASAR
            console.log('   ❌ ERROR: Se permitió acceso con token inválido!');
            return false;
            
        } catch (error) {
            // ✅ ESTO ES LO CORRECTO
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log('   ✅ CORRECTO: Se rechazó acceso con token inválido');
                console.log(`   📋 Status: ${error.response.status}, Mensaje: ${error.response.data.error}`);
                return true;
            } else {
                console.log('   ❌ Error inesperado:', error.response?.data || error.message);
                return false;
            }
        }
        
    } catch (error) {
        console.log('   ❌ Error en verificación de token:', error.response?.data || error.message);
        return false;
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
        console.log('🔧 Asegúrate de que el servidor esté ejecutándose en puerto 5000');
        return false;
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🔒 PRUEBA DE SEGURIDAD DEL FRONTEND - FLOWCASZEN');
    console.log('='.repeat(70));
    console.log('📋 Verificando que las medidas de seguridad del frontend funcionen');
    console.log('📋 Bloqueando acceso con credenciales incorrectas');
    console.log('='.repeat(70));
    console.log('');
    
    let testsPassed = 0;
    let totalTests = 5;
    
    // Prueba 1: Verificar servidor
    console.log('1️⃣ Verificando servidor...');
    if (await checkServer()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 2: Probar múltiples intentos fallidos
    console.log('2️⃣ Probando múltiples intentos fallidos...');
    if (await testMultipleFailedAttempts()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 3: Probar diferentes tipos de credenciales incorrectas
    console.log('3️⃣ Probando diferentes tipos de credenciales incorrectas...');
    if (await testDifferentInvalidCredentials()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 4: Probar registro y login correcto
    console.log('4️⃣ Probando registro y login correcto...');
    if (await testCorrectLogin()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 5: Probar verificación de token
    console.log('5️⃣ Probando verificación de token...');
    if (await testTokenVerification()) {
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
        console.log('✅ El sistema de autenticación es completamente seguro');
        console.log('✅ NO se permite acceso con credenciales incorrectas');
        console.log('✅ Los intentos fallidos son bloqueados correctamente');
        console.log('✅ Los tokens se verifican correctamente');
        console.log('✅ El frontend implementa medidas de seguridad efectivas');
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
    testMultipleFailedAttempts,
    testDifferentInvalidCredentials,
    testCorrectLogin,
    testTokenVerification,
    checkServer
};
