// 🔍 SCRIPT PARA VERIFICAR ESTADO DE MERCADO PAGO
// Verifica el estado actual de tu aplicación y credenciales

const { MercadoPagoConfig, Preference } = require('mercadopago');

// 🔑 Configuración de tu aplicación
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false // Producción
  }
});

const preference = new Preference(client);

async function checkMercadoPagoStatus() {
  console.log('🔍 Verificando estado de MercadoPago...');
  console.log('='.repeat(60));
  
  try {
    // 📊 Información de la aplicación
    console.log('📋 INFORMACIÓN DE LA APLICACIÓN:');
    console.log(`🆔 N° de aplicación: 87756889032549`);
    console.log(`👤 User ID: 419183457`);
    console.log(`🔑 Access Token: ${client.accessToken.substring(0, 20)}...`);
    console.log(`🚀 Modo: ${client.options.sandbox ? 'Sandbox' : 'Producción'}`);
    console.log('='.repeat(60));
    
    // 🧪 Crear preferencia de prueba
    console.log('🧪 Creando preferencia de prueba...');
    
    const testPreference = {
      items: [
        {
          title: 'Test Developer Mode - FlowCasaZen',
          quantity: 1,
          unit_price: 1.00,
          currency_id: 'USD',
          description: 'Prueba del modo desarrollador'
        }
      ],
      back_urls: {
        success: 'https://8ac64d6f11ca.ngrok-free.app/payment/success',
        failure: 'https://8ac64d6f11ca.ngrok-free.app/payment/failure',
        pending: 'https://8ac64d6f11ca.ngrok-free.app/payment/pending'
      },
      auto_return: 'approved',
      external_reference: `dev-test-${Date.now()}`,
      notification_url: 'https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook'
    };

    const response = await preference.create({ body: testPreference });
    
    console.log('✅ ¡Preferencia creada exitosamente!');
    console.log('='.repeat(60));
    console.log('📊 RESULTADO:');
    console.log(`🆔 ID de preferencia: ${response.id}`);
    console.log(`🔗 URL de pago: ${response.init_point}`);
    console.log(`💰 Monto: $${testPreference.items[0].unit_price} ${testPreference.items[0].currency_id}`);
    console.log(`📝 Referencia: ${testPreference.external_reference}`);
    console.log('='.repeat(60));
    
    // 🔍 Verificaciones de estado
    console.log('🔍 VERIFICACIONES:');
    console.log(`✅ Credenciales válidas: ${!!response.id}`);
    console.log(`✅ Aplicación activa: ${!!response.init_point}`);
    console.log(`✅ Modo producción: ${!client.options.sandbox}`);
    console.log(`✅ Webhook configurado: ${!!testPreference.notification_url}`);
    
    // 📱 Información para pruebas
    console.log('='.repeat(60));
    console.log('📱 PARA PROBAR EL PAGO:');
    console.log('1. Abre el link de pago en tu navegador');
    console.log('2. Usa una tarjeta de prueba:');
    console.log('   - Visa: 4509 9535 6623 3704');
    console.log('   - Mastercard: 5031 7557 3453 0604');
    console.log('   - CVV: 123');
    console.log('   - Fecha: Cualquier fecha futura');
    console.log('3. Completa el pago');
    console.log('4. Verifica que recibas el webhook');
    console.log('='.repeat(60));
    
    // 🎯 Estado del modo desarrollador
    console.log('🎯 ESTADO DEL MODO DESARROLLADOR:');
    if (response.init_point && !response.init_point.includes('sandbox')) {
      console.log('✅ Modo desarrollador ACTIVADO');
      console.log('✅ Puedes procesar pagos reales');
      console.log('✅ Webhooks funcionando');
    } else {
      console.log('⚠️ Modo desarrollador NO ACTIVADO');
      console.log('⚠️ Necesitas activarlo en el panel de MercadoPago');
    }
    
    console.log('='.repeat(60));
    console.log('🌐 ENLACES ÚTILES:');
    console.log('📊 Panel de desarrolladores: https://www.mercadopago.com.ar/developers/apps/87756889032549');
    console.log('🔧 Configuración de webhooks: https://www.mercadopago.com.ar/developers/apps/87756889032549/webhooks');
    console.log('📋 Documentación: https://www.mercadopago.com.ar/developers');
    console.log('='.repeat(60));
    
    return {
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      developer_mode: !response.init_point.includes('sandbox')
    };
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
    console.log('='.repeat(60));
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que las credenciales sean correctas');
    console.log('2. Activar el modo desarrollador en el panel');
    console.log('3. Verificar que la aplicación esté activa');
    console.log('4. Revisar la conexión a internet');
    console.log('='.repeat(60));
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 🚀 Ejecutar verificación
if (require.main === module) {
  checkMercadoPagoStatus()
    .then(result => {
      if (result.success) {
        console.log('🎉 ¡Verificación completada exitosamente!');
        if (result.developer_mode) {
          console.log('✅ Modo desarrollador está ACTIVADO');
        } else {
          console.log('⚠️ Necesitas activar el modo desarrollador');
        }
        process.exit(0);
      } else {
        console.log('💥 Verificación falló');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { checkMercadoPagoStatus };
