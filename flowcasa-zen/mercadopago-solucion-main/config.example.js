// Configuración de MercadoPago
// Copia este archivo como config.js y actualiza los valores

module.exports = {
    // Configuración de MercadoPago
    mercadopago: {
        access_token: 'TEST-12345678-1234-1234-1234-123456789012',
        sandbox: true
    },
    
    // Configuración del servidor
    server: {
        port: 3001,
        host: 'localhost'
    },
    
    // URLs de redirección (cambiar por tus URLs reales)
    urls: {
        success: 'https://4cd5df6b08cf.ngrok-free.app/dashboard/orders?payment=success',
        failure: 'https://4cd5df6b08cf.ngrok-free.app/shop',
        pending: 'https://4cd5df6b08cf.ngrok-free.app/dashboard/orders?payment=pending',
        webhook: 'https://b08c06e69a24.ngrok-free.app/api/webhooks/mercadopago'
    }
};

