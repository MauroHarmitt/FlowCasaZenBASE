// 🔄 SCRIPT PARA ACTUALIZAR WEBHOOK DE MERCADO PAGO
// Actualiza la configuración del webhook con la nueva URL de ngrok

const { MercadoPagoConfig, Preference } = require('mercadopago');

// 🔑 Configuración de tu aplicación
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false // Producción
  }
});

const preference = new Preference(client);

// 🌐 URL de ngrok actual
const NGROK_URL = 'https://8ac64d6f11ca.ngrok-free.app';

async function updateMercadoPagoWebhook() {
  console.log('🔄 Actualizando configuración de webhook de MercadoPago...');
  console.log('='.repeat(60));
  
  try {
    // 📊 Información actual
    console.log('📋 CONFIGURACIÓN ACTUAL:');
    console.log(`🌐 URL de ngrok: ${NGROK_URL}`);
    console.log(`🔗 Webhook URL: ${NGROK_URL}/api/payments/mercadopago/webhook`);
    console.log(`✅ Success URL: ${NGROK_URL}/payment/success`);
    console.log(`❌ Failure URL: ${NGROK_URL}/payment/failure`);
    console.log(`⏳ Pending URL: ${NGROK_URL}/payment/pending`);
    console.log('='.repeat(60));
    
    // 🧪 Crear preferencia con nueva configuración
    console.log('🧪 Creando preferencia con nueva configuración...');
    
    const testPreference = {
      items: [
        {
          title: 'Test Webhook Update - FlowCasaZen',
          quantity: 1,
          unit_price: 1.00,
          currency_id: 'USD',
          description: 'Prueba de actualización de webhook'
        }
      ],
      back_urls: {
        success: `${NGROK_URL}/payment/success`,
        failure: `${NGROK_URL}/payment/failure`,
        pending: `${NGROK_URL}/payment/pending`
      },
      auto_return: 'approved',
      external_reference: `webhook-test-${Date.now()}`,
      notification_url: `${NGROK_URL}/api/payments/mercadopago/webhook`
    };

    const response = await preference.create({ body: testPreference });
    
    console.log('✅ ¡Preferencia creada exitosamente!');
    console.log('='.repeat(60));
    console.log('📊 RESULTADO:');
    console.log(`🆔 ID de preferencia: ${response.id}`);
    console.log(`🔗 URL de pago: ${response.init_point}`);
    console.log(`🔔 Webhook configurado: ${testPreference.notification_url}`);
    console.log('='.repeat(60));
    
    // 📱 Instrucciones para configurar en el panel
    console.log('📱 CONFIGURACIÓN EN EL PANEL DE MERCADO PAGO:');
    console.log('1. Ve a: https://www.mercadopago.com.ar/developers/apps/87756889032549');
    console.log('2. En la sección "Webhooks", agrega:');
    console.log(`   ${NGROK_URL}/api/payments/mercadopago/webhook`);
    console.log('3. Selecciona los eventos:');
    console.log('   - payment');
    console.log('   - merchant_order');
    console.log('4. En "URLs de retorno", configura:');
    console.log(`   - Success: ${NGROK_URL}/payment/success`);
    console.log(`   - Failure: ${NGROK_URL}/payment/failure`);
    console.log(`   - Pending: ${NGROK_URL}/payment/pending`);
    console.log('='.repeat(60));
    
    // 🧪 Prueba del webhook
    console.log('🧪 PARA PROBAR EL WEBHOOK:');
    console.log('1. Abre el link de pago en tu navegador');
    console.log('2. Usa una tarjeta de prueba:');
    console.log('   - Visa: 4509 9535 6623 3704');
    console.log('   - Mastercard: 5031 7557 3453 0604');
    console.log('   - CVV: 123');
    console.log('   - Fecha: Cualquier fecha futura');
    console.log('3. Completa el pago');
    console.log('4. Verifica en tu servidor que recibas el webhook');
    console.log('='.repeat(60));
    
    // 🔍 Verificación del servidor
    console.log('🔍 VERIFICACIÓN DEL SERVIDOR:');
    console.log('En tu servidor deberías ver:');
    console.log('🔔 Webhook de Mercado Pago recibido: { type: "payment", data: { id: "..." } }');
    console.log('💳 Procesando pago ID: ...');
    console.log('✅ Pago ... procesado exitosamente');
    console.log('='.repeat(60));
    
    return {
      success: true,
      preference_id: response.id,
      init_point: response.init_point,
      webhook_url: testPreference.notification_url,
      ngrok_url: NGROK_URL
    };
    
  } catch (error) {
    console.error('❌ Error actualizando webhook:', error);
    console.log('='.repeat(60));
    console.log('🔧 POSIBLES SOLUCIONES:');
    console.log('1. Verificar que ngrok esté ejecutándose');
    console.log('2. Confirmar que el servidor esté en puerto 4000');
    console.log('3. Verificar que las credenciales sean correctas');
    console.log('4. Revisar la conexión a internet');
    console.log('='.repeat(60));
    
    return {
      success: false,
      error: error.message
    };
  }
}

// 🚀 Ejecutar actualización
if (require.main === module) {
  updateMercadoPagoWebhook()
    .then(result => {
      if (result.success) {
        console.log('🎉 ¡Configuración actualizada exitosamente!');
        console.log(`🌐 URL de ngrok: ${result.ngrok_url}`);
        console.log(`🔔 Webhook URL: ${result.webhook_url}`);
        console.log('📱 Ahora configura estas URLs en el panel de MercadoPago');
        process.exit(0);
      } else {
        console.log('💥 Actualización falló');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { updateMercadoPagoWebhook };
