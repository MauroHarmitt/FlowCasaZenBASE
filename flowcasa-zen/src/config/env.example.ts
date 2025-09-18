// Archivo de ejemplo para variables de entorno
// Copia este archivo como .env.local y configura tus propias claves

export const ENV_EXAMPLE = {
  // MercadoPago Configuration
  // Obtén estas claves desde tu panel de MercadoPago
  REACT_APP_MERCADOPAGO_PUBLIC_KEY: 'TEST-12345678-1234-1234-1234-123456789012',
  REACT_APP_MERCADOPAGO_ACCESS_TOKEN: 'TEST-12345678901234567890123456789012-123456-12345678901234567890123456789012-123456789',
  
  // MongoDB Configuration (si decides usar MongoDB en el futuro)
  MONGODB_URI: 'mongodb://localhost:27017/flowcasa-zen',
  
  // JWT Secret (para autenticación)
  JWT_SECRET: 'tu_jwt_secret_muy_seguro_aqui',
  
  // Environment
  NODE_ENV: 'development'
};

// Instrucciones para configurar MercadoPago:
/*
1. Ve a https://www.mercadopago.com.ar/developers/
2. Crea una cuenta de desarrollador
3. Obtén tu Public Key y Access Token
4. Crea un archivo .env.local en la raíz del proyecto
5. Agrega las siguientes variables:

REACT_APP_MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui
REACT_APP_MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui

6. Reinicia el servidor de desarrollo
*/
