# Servidor de Pagos MercadoPago

Este es un servidor independiente para procesar pagos con MercadoPago, extraído del sistema principal de CraftAR. Incluye toda la lógica necesaria para generar links de pago y manejar webhooks.

## 🚀 Características

- ✅ Generación de preferencias de pago para productos
- ✅ Generación de preferencias para carga de monedas/saldo
- ✅ Webhooks para procesar confirmaciones de pago
- ✅ Configuración simple y clara
- ✅ Logging detallado
- ✅ Middleware de seguridad (Helmet, CORS, Rate Limiting)
- ✅ Manejo de errores robusto

## 📋 Requisitos

- Node.js 14 o superior
- npm o yarn
- Cuenta de MercadoPago con acceso token

## ⚙️ Instalación

1. **Clonar/copiar la carpeta mercadopago**
2. **Instalar dependencias:**
   ```bash
   cd mercadopago
   npm install
   ```

3. **Configurar el servidor:**
   ```bash
   cp config.example.js config.js
   ```
   
4. **Editar `config.js` con tus datos:**
   ```javascript
   module.exports = {
       mercadopago: {
           access_token: 'TU_ACCESS_TOKEN_AQUI',
           sandbox: true // false para producción
       },
       server: {
           port: 3001,
           host: 'localhost'
       },
       urls: {
           success: 'https://tu-dominio.com/success',
           failure: 'https://tu-dominio.com/failure',
           pending: 'https://tu-dominio.com/pending',
           webhook: 'https://tu-dominio.com/api/webhooks/mercadopago'
       }
   };
   ```

5. **Iniciar el servidor:**
   ```bash
   npm start
   # o para desarrollo:
   npm run dev
   ```

## 🔗 Endpoints Disponibles

### Crear Preferencia de Pago (Productos)
```http
POST /api/create-preference
Content-Type: application/json

{
  "items": [
    {
      "id": "product_123",
      "title": "Diamante x64",
      "description": "64 diamantes para Minecraft",
      "quantity": 1,
      "unit_price": 1500
    }
  ],
  "payer": {
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez"
  },
  "external_reference": "orden_123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "preference_id": "123456789-abc-def",
  "payment_url": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789-abc-def",
  "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789-abc-def"
}
```

### Crear Preferencia para Carga de Monedas/Saldo
```http
POST /api/create-deposit-preference
Content-Type: application/json

{
  "amount": 1000,
  "payer": {
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez"
  },
  "type": "coins", // o "wallet"
  "external_reference": "deposit_user123_1640995200000"
}
```

### Webhooks

#### Webhook Principal (Productos)
```http
POST /api/webhooks/mercadopago
```

#### Webhook Carga de Monedas
```http
POST /api/webhooks/coins-deposit
```

#### Webhook Carga de Saldo
```http
POST /api/webhooks/wallet-deposit
```

### Endpoints de Utilidad

#### Obtener Información de Preferencia
```http
GET /api/preference/:id
```

#### Obtener Información de Pago
```http
GET /api/payment/:id
```

#### Health Check
```http
GET /health
```

## 🔧 Configuración de MercadoPago

### 1. Obtener Access Token

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Inicia sesión con tu cuenta
3. Ve a "Tus integraciones"
4. Crea una nueva aplicación o usa una existente
5. Copia el "Access Token"

### 2. Configurar Webhooks

1. En tu aplicación de MercadoPago, ve a "Webhooks"
2. Agrega la URL: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Selecciona los eventos: `merchant_order`

### 3. URLs de Redirección

Configura estas URLs en tu aplicación:
- **Success**: `https://tu-dominio.com/dashboard/orders?payment=success`
- **Failure**: `https://tu-dominio.com/shop`
- **Pending**: `https://tu-dominio.com/dashboard/orders?payment=pending`

## 🔄 Integración con tu Sistema

Para integrar este servidor con tu sistema principal:

### 1. Modificar Webhooks

En los archivos de webhook (líneas con `// TODO:`), agrega la lógica para:

```javascript
// Ejemplo de integración
if (payment.status === 'approved') {
    // 1. Buscar orden en tu BD
    const order = await Order.findById(externalReference);
    
    // 2. Marcar como pagada
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();
    
    // 3. Entregar productos
    await deliverItemsToPlayer(order.user, order);
    
    // 4. Notificar usuario
    io.to(`user_${order.userId}`).emit('order-updated', {
        orderId: order._id,
        status: 'paid'
    });
}
```

### 2. Conectar con tu Base de Datos

Agrega las dependencias necesarias:

```bash
npm install mongoose  # para MongoDB
# o
npm install mysql2    # para MySQL
```

### 3. Agregar Autenticación

Si necesitas autenticación, agrega middleware JWT:

```bash
npm install jsonwebtoken
```

## 📝 Logs

El servidor incluye logging detallado:
- ✅ Requests entrantes
- ✅ Creación de preferencias
- ✅ Webhooks recibidos
- ✅ Estados de pagos
- ❌ Errores y excepciones

## 🛡️ Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límite de 100 requests por 15 minutos
- **Validación**: Validación básica de datos de entrada

## 🧪 Testing

### Probar Creación de Preferencia

```bash
curl -X POST http://localhost:3001/api/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "id": "test_1",
      "title": "Producto de Prueba",
      "description": "Descripción de prueba",
      "quantity": 1,
      "unit_price": 100
    }],
    "payer": {
      "email": "test@ejemplo.com",
      "name": "Usuario Prueba"
    },
    "external_reference": "test_orden_123"
  }'
```

### Probar Health Check

```bash
curl http://localhost:3001/health
```

## 🚨 Troubleshooting

### Error: "Invalid access token"
- Verifica que el token en `config.js` sea correcto
- Asegúrate de usar el token de producción si `sandbox: false`

### Error: "Webhook not received"
- Verifica que la URL del webhook sea accesible públicamente
- Usa ngrok o similar para desarrollo local
- Revisa los logs del servidor

### Error: "Preference creation failed"
- Verifica que todos los campos requeridos estén presentes
- Revisa el formato de los datos (especialmente precios)
- Consulta los logs para más detalles

## 📞 Soporte

Para problemas específicos de MercadoPago, consulta:
- [Documentación oficial](https://www.mercadopago.com.ar/developers/es/docs)
- [Status de la API](https://status.mercadopago.com/)

## 📄 Licencia

MIT - Ver archivo LICENSE para más detalles.
# mercadopago-solucion
