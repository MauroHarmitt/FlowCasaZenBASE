// Configuración de MercadoPago para FlowCasaZen
// Las credenciales se cargan desde variables de entorno

// config/mercadopago.js
require('dotenv').config();

module.exports = {
  mercadopago: {
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457',
    public_key: process.env.MERCADOPAGO_PUBLIC_KEY || 'TEST-679639fa-4d9d-484c-b251-daa49396562f',
    sandbox: process.env.MERCADOPAGO_SANDBOX === 'true' || true
  },

  server: {
    port: process.env.PORT || 5001,
    host: process.env.HOST || 'localhost'
  },

  urls: {
    success: process.env.SUCCESS_URL || 'https://e046a6e7531e.ngrok-free.app/payment/success',
    failure: process.env.FAILURE_URL || 'https://e046a6e7531e.ngrok-free.app/payment/failure',
    pending: process.env.PENDING_URL || 'https://e046a6e7531e.ngrok-free.app/payment/pending',
    webhook: process.env.WEBHOOK_URL || 'https://e046a6e7531e.ngrok-free.app/api/webhooks/mercadopago'
  }
};
