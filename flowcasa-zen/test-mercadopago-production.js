// 🧪 SCRIPT DE PRUEBA PARA MERCADO PAGO EN PRODUCCIÓN
// Este script verifica que la configuración de MercadoPago funcione correctamente

const { MercadoPagoConfig, Preference } = require('mercadopago');

// 🔑 Configuración de producción
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false // Modo producción
  }
});

const preference = new Preference(client);

async function testMercadoPagoProduction() {
  console.log('🚀 Iniciando prueba de MercadoPago en PRODUCCIÓN...');
  console.log('='.repeat(60));
  
  try {
    // 📋 Datos de prueba
    const testPreference = {
      items: [
        {
          title: 'Clase de Yoga - Test Producción',
          quantity: 1,
          unit_price: 25.99,
          currency_id: 'USD',
          description: 'Prueba de pago en producción'
        }
      ],
      back_urls: {
        success: 'https://tu-dominio.com/payment/success',
        failure: 'https://tu-dominio.com/payment/failure',
        pending: 'https://tu-dominio.com/payment/pending'
      },
      auto_return: 'approved',
      external_reference: `test-production-${Date.now()}`,
      notification_url: 'https://tu-api-dominio.com/api/payments/mercadopago/webhook'
    };

    console.log('💳 Creando preferencia de prueba...');
    console.log('🔑 Access Token:', client.accessToken.substring(0, 20) + '...');
    console.log('🚀 Modo Producción:', !client.options.sandbox);
    
    // 🎯 Crear preferencia
    const response = await preference.create({ body: testPreference });
    
    console.log('✅ ¡Preferencia creada exitosamente!');
    console.log('='.repeat(60));
    console.log('📊 INFORMACIÓN DE LA PREFERENCIA:');
    console.log(`🆔 ID: ${response.id}`);
    console.log(`🔗 init_point: ${response.init_point}`);
    console.log(`🧪 sandbox_init_point: ${response.sandbox_init_point || 'N/A'}`);
    console.log(`💰 Total: $${testPreference.items[0].unit_price} ${testPreference.items[0].currency_id}`);
    console.log(`📝 Referencia: ${testPreference.external_reference}`);
    console.log('='.repeat(60));
    
    // 🔍 Verificaciones
    console.log('🔍 VERIFICACIONES:');
    console.log(`✅ Preferencia creada: ${!!response.id}`);
    console.log(`✅ URL de pago disponible: ${!!response.init_point}`);
    console.log(`✅ Modo producción activo: ${!client.options.sandbox}`);
    console.log(`✅ Access Token válido: ${client.accessToken.startsWith('APP_USR-')}`);
    
    if (response.init_point) {
      console.log('='.repeat(60));
      console.log('🌐 ENLACES DE PAGO:');
      console.log(`🔗 Link de pago: ${response.init_point}`);
      console.log('='.repeat(60));
      console.log('📱 Para probar el pago:');
      console.log('1. Abre el link de pago en tu navegador');
      console.log('2. Completa el proceso de pago');
      console.log('3. Verifica que recibas la notificación en el webhook');
      console.log('='.repeat(60));
    }
    
    return {
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      test_data: testPreference
    };
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.log('='.repeat(60));
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que las credenciales sean correctas');
    console.log('2. Confirmar que el Access Token sea de producción');
    console.log('3. Verificar conexión a internet');
    console.log('4. Revisar que la aplicación esté activa en MercadoPago');
    console.log('='.repeat(60));
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 🚀 Ejecutar prueba
if (require.main === module) {
  testMercadoPagoProduction()
    .then(result => {
      if (result.success) {
        console.log('🎉 ¡Prueba completada exitosamente!');
        process.exit(0);
      } else {
        console.log('💥 Prueba falló');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { testMercadoPagoProduction };
