# 🚀 CONFIGURACIÓN DE MERCADO PAGO PARA PRODUCCIÓN

## 📋 Credenciales de Producción Configuradas

### 🔑 Credenciales MercadoPago
- **Public Key**: `APP_USR-f727d301-5562-4ef6-8866-96954070c812`
- **Access Token**: `APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457`
- **N° de aplicación**: `87756889032549`
- **User ID**: `419183457`

### 🔗 Link de Pago Generado
```html
<script src="https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js" 
data-preference-id="419183457-193fc73d-0f3f-4d85-ab4b-2c97822675c9" data-source="button">
</script>
```

### 🌐 Link para Compartir
```
https://mpago.la/1c66PJx
```

## ⚙️ Configuración del Servidor

### 1. Variables de Entorno (.env)
```bash
# MERCADO PAGO - PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=false

# URLs DE PRODUCCIÓN
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://tu-api-dominio.com

# OTROS
JWT_SECRET=tu_jwt_secret_muy_seguro_para_produccion
MONGODB_URI=mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22
PORT=4000
```

### 2. Configuración del Cliente MercadoPago
```javascript
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false // Modo producción
  }
});
```

## 🔄 Flujo de Pago Checkout Pro

### 1. Crear Preferencia
```javascript
const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 1,
        unit_price: 2000
      }
    ],
    back_urls: {
      success: 'https://tu-dominio.com/payment/success',
      failure: 'https://tu-dominio.com/payment/failure',
      pending: 'https://tu-dominio.com/payment/pending'
    },
    auto_return: 'approved',
    external_reference: `flowcasa-zen-${Date.now()}`,
    notification_url: 'https://tu-api-dominio.com/api/payments/mercadopago/webhook'
  }
})
.then(console.log)
.catch(console.log);
```

### 2. Parámetros del Webhook
- **payment_id**: ID del pago de MercadoPago
- **status**: Estado del pago (approved, pending, rejected)
- **external_reference**: Referencia externa del sistema
- **merchant_order_id**: ID de la orden de MercadoPago

## 🧪 Instalación de Dependencias

```bash
npm install mercadopago
```

## 🔧 Endpoints Configurados

### Crear Preferencia de Pago
```
POST /api/payments/mercadopago/create-preference
```

**Body:**
```json
{
  "title": "Clase de Yoga",
  "price": 25.99,
  "currency": "USD",
  "description": "Clase de yoga para principiantes",
  "quantity": 1
}
```

### Webhook de Notificaciones
```
POST /api/payments/mercadopago/webhook
```

## 🚀 Pasos para Despliegue

1. **Configurar Variables de Entorno**
   - Crear archivo `.env` con las credenciales de producción
   - Configurar URLs de producción

2. **Instalar Dependencias**
   ```bash
   npm install
   ```

3. **Iniciar Servidor**
   ```bash
   npm start
   ```

4. **Verificar Configuración**
   - Hacer GET a `/health` para verificar estado
   - Probar endpoint de creación de preferencias

## 🔍 Verificación de Configuración

### Health Check
```bash
curl https://tu-api-dominio.com/health
```

### Test de Preferencia
```bash
curl -X POST https://tu-api-dominio.com/api/payments/mercadopago/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "price": 10.00,
    "currency": "USD"
  }'
```

## ⚠️ Consideraciones Importantes

1. **Seguridad**: Nunca exponer las credenciales en el frontend
2. **Webhooks**: Configurar URLs HTTPS para webhooks
3. **Logs**: Monitorear logs de pagos y errores
4. **Backup**: Mantener backup de la base de datos
5. **SSL**: Usar certificados SSL válidos en producción

## 🆘 Troubleshooting

### Error de Credenciales
- Verificar que el Access Token sea de producción
- Confirmar que `sandbox: false`

### Error de Webhook
- Verificar que la URL sea HTTPS
- Confirmar que el endpoint responda con status 200

### Error de CORS
- Configurar dominios permitidos en el servidor
- Verificar headers de CORS

## 📞 Soporte

Para problemas con MercadoPago:
- Documentación: https://www.mercadopago.com.ar/developers
- Soporte: https://www.mercadopago.com.ar/developers/support
