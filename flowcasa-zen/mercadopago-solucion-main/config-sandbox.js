// 💳 CONFIGURACIÓN DE MERCADOPAGO - MODO SANDBOX
// Para pruebas y desarrollo

module.exports = {
  mercadopago: {
    // 🔑 Credenciales de SANDBOX (pruebas)
    access_token: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
    public_key: 'APP_USR-f727d301-5562-4ef6-8866-96954070c812',
    
    // 🧪 Modo SANDBOX activado
    sandbox: true
  },

  server: {
    port: 3001,
    host: 'localhost'
  },

  urls: {
    success: 'http://localhost:3000/payment/success',
    failure: 'http://localhost:3000/payment/failure',
    pending: 'http://localhost:3000/payment/pending',
    webhook: 'http://localhost:3001/api/webhooks/mercadopago'
  }
};
