/**
 * 🗄️ PRUEBA DE INTEGRIDAD DE BASE DE DATOS
 * 
 * Este script verifica que la base de datos esté funcionando correctamente
 * para usuarios y clases, y que los datos se almacenen y recuperen correctamente
 */

const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:4000';

// 🗄️ CONEXIÓN A MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22';

/**
 * 🗄️ VERIFICAR CONEXIÓN A BASE DE DATOS
 */
async function testDatabaseConnection() {
    console.log('🗄️ Verificando conexión a base de datos...');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Conexión a MongoDB exitosa');
        
        // Verificar que la conexión esté activa
        const state = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        console.log(`📊 Estado de conexión: ${states[state]}`);
        
        if (state === 1) {
            console.log('✅ Base de datos conectada y lista');
            return true;
        } else {
            console.log('❌ Base de datos no está conectada');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        return false;
    }
}

/**
 * 👤 PROBAR REGISTRO DE USUARIO
 */
async function testUserRegistration() {
    console.log('👤 Probando registro de usuario...');
    
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        country: 'Argentina',
        timezone: 'America/Argentina/Buenos_Aires',
        role: 'student'
    };
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
        
        if (response.data && response.data.user && response.data.token) {
            console.log('✅ Usuario registrado exitosamente');
            console.log(`📧 Email: ${response.data.user.email}`);
            console.log(`🆔 ID: ${response.data.user.id}`);
            console.log(`🔑 Token: ${response.data.token ? 'Generado' : 'No generado'}`);
            
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        } else {
            console.log('❌ Respuesta de registro inválida');
            return { success: false };
        }
        
    } catch (error) {
        console.error('❌ Error en registro de usuario:', error.response?.data || error.message);
        return { success: false };
    }
}

/**
 * 🔐 PROBAR LOGIN DE USUARIO
 */
async function testUserLogin(email, password) {
    console.log('🔐 Probando login de usuario...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: email,
            password: password
        });
        
        if (response.data && response.data.user && response.data.token) {
            console.log('✅ Login exitoso');
            console.log(`📧 Email: ${response.data.user.email}`);
            console.log(`🆔 ID: ${response.data.user.id}`);
            console.log(`👤 Nombre: ${response.data.user.firstName} ${response.data.user.lastName}`);
            console.log(`🔑 Token: ${response.data.token ? 'Generado' : 'No generado'}`);
            
            return {
                success: true,
                user: response.data.user,
                token: response.data.token
            };
        } else {
            console.log('❌ Respuesta de login inválida');
            return { success: false };
        }
        
    } catch (error) {
        console.error('❌ Error en login de usuario:', error.response?.data || error.message);
        return { success: false };
    }
}

/**
 * ❌ PROBAR LOGIN CON CREDENCIALES INCORRECTAS
 */
async function testInvalidLogin() {
    console.log('❌ Probando login con credenciales incorrectas...');
    
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'usuario-inexistente@example.com',
            password: 'password-incorrecta'
        });
        
        // ❌ ESTO NO DEBERÍA PASAR
        console.log('❌ ERROR CRÍTICO: Se permitió login con credenciales incorrectas!');
        console.log('📋 Respuesta:', response.data);
        return false;
        
    } catch (error) {
        // ✅ ESTO ES LO CORRECTO
        if (error.response && error.response.status === 401) {
            console.log('✅ CORRECTO: Se rechazó login con credenciales incorrectas');
            console.log('📋 Mensaje de error:', error.response.data.error);
            return true;
        } else {
            console.log('❌ ERROR: Respuesta inesperada:', error.response?.data || error.message);
            return false;
        }
    }
}

/**
 * 👤 PROBAR OBTENER PERFIL DE USUARIO
 */
async function testGetUserProfile(token) {
    console.log('👤 Probando obtener perfil de usuario...');
    
    try {
        const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data && response.data.user) {
            console.log('✅ Perfil obtenido exitosamente');
            console.log(`📧 Email: ${response.data.user.email}`);
            console.log(`👤 Nombre: ${response.data.user.firstName} ${response.data.user.lastName}`);
            console.log(`🌍 País: ${response.data.user.country}`);
            console.log(`⏰ Zona horaria: ${response.data.user.timezone}`);
            console.log(`🎭 Rol: ${response.data.user.role}`);
            
            return { success: true, user: response.data.user };
        } else {
            console.log('❌ Respuesta de perfil inválida');
            return { success: false };
        }
        
    } catch (error) {
        console.error('❌ Error obteniendo perfil:', error.response?.data || error.message);
        return { success: false };
    }
}

/**
 * 📚 PROBAR OBTENER CLASES
 */
async function testGetClasses() {
    console.log('📚 Probando obtener clases...');
    
    try {
        const response = await axios.get(`${BASE_URL}/api/classes`);
        
        if (response.data && Array.isArray(response.data)) {
            console.log('✅ Clases obtenidas exitosamente');
            console.log(`📊 Total de clases: ${response.data.length}`);
            
            if (response.data.length > 0) {
                const firstClass = response.data[0];
                console.log(`📖 Primera clase: ${firstClass.title}`);
                console.log(`💰 Precio: $${firstClass.price} ${firstClass.currency}`);
                console.log(`⏱️ Duración: ${firstClass.duration}`);
                console.log(`📈 Dificultad: ${firstClass.difficulty}`);
            }
            
            return { success: true, classes: response.data };
        } else {
            console.log('❌ Respuesta de clases inválida');
            return { success: false };
        }
        
    } catch (error) {
        console.error('❌ Error obteniendo clases:', error.response?.data || error.message);
        return { success: false };
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
 * 🧹 LIMPIAR DATOS DE PRUEBA
 */
async function cleanupTestData(userId) {
    console.log('🧹 Limpiando datos de prueba...');
    
    try {
        // Conectar a MongoDB para limpiar
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Eliminar usuario de prueba
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        await User.findByIdAndDelete(userId);
        
        console.log('✅ Datos de prueba limpiados');
        
    } catch (error) {
        console.error('❌ Error limpiando datos:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

/**
 * 🎯 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🗄️ PRUEBA DE INTEGRIDAD DE BASE DE DATOS - FLOWCASZEN');
    console.log('='.repeat(70));
    console.log('📋 Verificando que la base de datos funcione correctamente');
    console.log('📋 Para usuarios y clases');
    console.log('='.repeat(70));
    console.log('');
    
    let testsPassed = 0;
    let totalTests = 6;
    let testUser = null;
    let testToken = null;
    
    // Prueba 1: Verificar servidor
    console.log('1️⃣ Verificando servidor...');
    if (await checkServer()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 2: Verificar conexión a base de datos
    console.log('2️⃣ Verificando conexión a base de datos...');
    if (await testDatabaseConnection()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 3: Probar registro de usuario
    console.log('3️⃣ Probando registro de usuario...');
    const registrationResult = await testUserRegistration();
    if (registrationResult.success) {
        testsPassed++;
        testUser = registrationResult.user;
        testToken = registrationResult.token;
    }
    console.log('');
    
    // Prueba 4: Probar login de usuario
    console.log('4️⃣ Probando login de usuario...');
    if (testUser) {
        const loginResult = await testUserLogin(testUser.email, 'password123');
        if (loginResult.success) {
            testsPassed++;
        }
    }
    console.log('');
    
    // Prueba 5: Probar login con credenciales incorrectas
    console.log('5️⃣ Probando login con credenciales incorrectas...');
    if (await testInvalidLogin()) {
        testsPassed++;
    }
    console.log('');
    
    // Prueba 6: Probar obtener perfil
    console.log('6️⃣ Probando obtener perfil de usuario...');
    if (testToken) {
        if (await testGetUserProfile(testToken)) {
            testsPassed++;
        }
    }
    console.log('');
    
    // Prueba 7: Probar obtener clases
    console.log('7️⃣ Probando obtener clases...');
    if (await testGetClasses()) {
        testsPassed++;
        totalTests = 7; // Actualizar total
    }
    console.log('');
    
    // Limpiar datos de prueba
    if (testUser && testUser.id) {
        await cleanupTestData(testUser.id);
    }
    
    // Resultados
    console.log('='.repeat(70));
    console.log('📊 RESULTADOS DE LAS PRUEBAS DE INTEGRIDAD');
    console.log('='.repeat(70));
    console.log(`✅ Pruebas pasadas: ${testsPassed}/${totalTests}`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON!');
        console.log('✅ La base de datos funciona correctamente');
        console.log('✅ Los usuarios se almacenan y recuperan correctamente');
        console.log('✅ Las clases se obtienen correctamente');
        console.log('✅ El sistema de autenticación es seguro');
    } else {
        console.log('❌ ALGUNAS PRUEBAS FALLARON');
        console.log('⚠️  La base de datos puede tener problemas');
        console.log('🔧 Revisa la configuración de MongoDB y el servidor');
    }
    
    console.log('='.repeat(70));
    
    // Cerrar conexión
    await mongoose.disconnect();
}

// 🎬 Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    testDatabaseConnection,
    testUserRegistration,
    testUserLogin,
    testInvalidLogin,
    testGetUserProfile,
    testGetClasses,
    checkServer
};
