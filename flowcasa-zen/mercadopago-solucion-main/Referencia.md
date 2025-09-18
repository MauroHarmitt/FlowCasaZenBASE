# 🚀 Guía de Referencia: Integración MercadoPago

## 📋 Descripción General

Esta es una implementación completa y simple de MercadoPago que permite crear pagos de forma rápida y eficiente. El sistema está diseñado para ser fácil de integrar en cualquier proyecto.

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos
```
proyecto/
├── server.js          # Servidor principal con endpoints
├── config.js          # Configuración de credenciales
├── config.example.js  # Ejemplo de configuración
├── test-examples.js   # Ejemplos de uso
└── package.json       # Dependencias
```

### Dependencias Principales
```json
{
  "express": "^4.18.2",
  "mercadopago": "^1.5.14",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "axios": "^1.6.0"
}
```

## 🔧 Configuración Inicial

### 1. Configurar Credenciales (`config.js`)
```javascript
module.exports = {
    server: {
        port: 3001  // Puerto del servidor
    },
    mercadopago: {
        sandbox: false,  // false = PRODUCCIÓN, true = pruebas
        access_token: 'APP_USR-5510015184927084-091602-b6e26ad2b309d119592f4f47ca4bd121-419183457'  // Token de MercadoPago
    },
    urls: {
        success: 'https://d9760db60c05.ngrok-free.app/success',   // URL de éxito
        failure: 'https://d9760db60c05.ngrok-free.app/failure',    // URL de fallo
        pending: 'https://d9760db60c05.ngrok-free.app/pending',    // URL de pendiente
        webhook: 'https://d9760db60c05.ngrok-free.app/api/webhooks/mercadopago'  // Webhook
    }
};
```

### 2. Obtener Token de MercadoPago
1. Ve a: https://www.mercadopago.com.ar/developers/panel/credentials
2. Copia tu token de PRODUCCIÓN
3. Pégalo en `config.js`

## 🛒 Endpoints Disponibles

### POST `/api/create-preference`
Crea una preferencia de pago en MercadoPago.

**Body requerido:**
```json
{
  "items": [
    {
      "title": "Nombre del producto",
      "quantity": 1,
      "unit_price": 1500
    }
  ],
  "payer": {
    "email": "usuario@ejemplo.com"
  }
}
```

**Respuesta:**
```json
{
  "id": "123456789",
  "url": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...",
  "items": [...],
  "total": 1500
}
```

### POST `/api/webhooks/mercadopago`
Webhook para recibir notificaciones de MercadoPago sobre cambios de estado de pagos.

**Parámetros de query:**
- `topic`: Tipo de notificación (ej: "merchant_order")
- `id`: ID de la orden

### GET `/health`
Health check del servidor.

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00Z",
  "service": "MercadoPago Payment Server"
}
```

## 🔔 Sistema de Webhooks

### Configuración en MercadoPago
1. Ve a tu panel de desarrolladores de MercadoPago
2. Configura la URL del webhook: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Selecciona los eventos que quieres recibir

### Estados de Pago
- **approved**: Pago aprobado y acreditado
- **rejected**: Pago rechazado
- **pending**: Pago pendiente de confirmación

## 🧪 Ejemplos de Uso

### Crear un Pago Simple
```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3001/api/create-preference', {
    items: [
        {
            title: 'Diamante x64',
            quantity: 1,
            unit_price: 1500
        }
    ],
    payer: {
        email: 'usuario@ejemplo.com'
    }
});

console.log('URL de pago:', response.data.url);
```

### Verificar Estado del Servidor
```javascript
const health = await axios.get('http://localhost:3001/health');
console.log('Servidor:', health.data.status);
```

## 🛡️ Características de Seguridad

### Rate Limiting
- Máximo 100 requests por 15 minutos por IP
- Protección contra spam y ataques

### Middleware de Seguridad
- **Helmet**: Protección contra ataques comunes
- **CORS**: Control de acceso cross-origin
- **Validación**: Validación de datos de entrada

### Logging
- Logs detallados de todas las operaciones
- Tracking de pagos y webhooks
- Manejo de errores completo

## 🚀 Implementación en Nuevos Proyectos

### Paso 1: Instalar Dependencias
```bash
npm install express mercadopago cors helmet express-rate-limit axios
```

### Paso 2: Copiar Archivos Base
- Copia `server.js` y adapta los endpoints según tu proyecto
- Copia `config.js` y configura tus credenciales
- Adapta las URLs de retorno según tu dominio

### Paso 3: Configurar Variables de Entorno
```javascript
// En lugar de config.js, puedes usar variables de entorno:
const config = {
    mercadopago: {
        sandbox: process.env.MP_SANDBOX === 'true',
        access_token: process.env.MP_ACCESS_TOKEN
    },
    urls: {
        success: process.env.SUCCESS_URL,
        failure: process.env.FAILURE_URL,
        pending: process.env.PENDING_URL,
        webhook: process.env.WEBHOOK_URL
    }
};
```

### Paso 4: Integrar en tu Aplicación
```javascript
// Ejemplo de integración en Express
app.post('/crear-pago', async (req, res) => {
    try {
        const { items, email } = req.body;
        
        const response = await axios.post('http://tu-servidor-mp/api/create-preference', {
            items: items,
            payer: { email: email }
        });
        
        res.json({ url: response.data.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 📊 Monitoreo y Debugging

### Logs Importantes
- `🛒 Nuevo pago solicitado`: Inicio de creación de pago
- `✅ Preferencia creada exitosamente`: Pago creado correctamente
- `🔔 Webhook MercadoPago recibido`: Notificación recibida
- `🎉 ¡PAGO EXITOSO!`: Pago aprobado y acreditado

### Health Check
Usa el endpoint `/health` para verificar que el servidor esté funcionando correctamente.

## 🔧 Troubleshooting

### Errores Comunes

1. **Token inválido**
   - Verifica que el token sea de producción (no sandbox)
   - Confirma que el token esté activo en MercadoPago

2. **Webhook no funciona**
   - Verifica que la URL sea accesible públicamente
   - Confirma que el endpoint esté configurado en MercadoPago

3. **CORS errors**
   - Asegúrate de que el dominio esté permitido en CORS
   - Verifica que las URLs de retorno sean correctas

### Testing
```bash
# Ejecutar ejemplos de prueba
node test-examples.js

# Verificar servidor
curl http://localhost:3001/health
```

## 📝 Notas Importantes

- **Moneda**: El sistema está configurado para ARS (pesos argentinos)
- **Sandbox**: Usa `sandbox: true` para pruebas, `false` para producción
- **Webhooks**: Son esenciales para recibir confirmaciones de pago
- **URLs**: Deben ser HTTPS en producción
- **Rate Limiting**: Ajusta según las necesidades de tu proyecto

## 🎯 Casos de Uso Típicos

1. **E-commerce**: Pagos de productos/servicios
2. **Donaciones**: Pagos únicos o recurrentes
3. **Servicios**: Pagos por servicios digitales
4. **Subscripciones**: Pagos periódicos
5. **Marketplace**: Pagos entre usuarios

---

**💡 Tip**: Esta implementación está diseñada para ser simple pero robusta. Puedes extenderla agregando más validaciones, base de datos, autenticación, o cualquier funcionalidad específica de tu proyecto.
