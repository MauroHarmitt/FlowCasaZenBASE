// 🧪 SCRIPT DE PRUEBA PARA VERIFICAR CONEXIÓN CON MONGODB
// Este script prueba la conexión y operaciones básicas con MongoDB

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

// 🔗 CONEXIÓN A MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22';

console.log('🔍 Probando conexión con MongoDB...');
console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ ¡Conexión exitosa con MongoDB!');
  
  // 📊 Obtener información de la base de datos
  const db = mongoose.connection.db;
  
  // 📋 Listar colecciones
  db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('❌ Error listando colecciones:', err);
    } else {
      console.log('📚 Colecciones disponibles:');
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }
    
    // 🧪 Probar operación de escritura
    const testCollection = db.collection('test_connection');
    testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Prueba de conexión exitosa'
    })
    .then(result => {
      console.log('✅ Prueba de escritura exitosa:', result.insertedId);
      
      // 🧹 Limpiar documento de prueba
      return testCollection.deleteOne({ _id: result.insertedId });
    })
    .then(() => {
      console.log('🧹 Documento de prueba eliminado');
      console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error en prueba de escritura:', err);
      process.exit(1);
    });
  });
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// ⏰ Timeout de seguridad
setTimeout(() => {
  console.log('⏰ Timeout alcanzado, cerrando conexión...');
  mongoose.connection.close();
  process.exit(1);
}, 10000);
