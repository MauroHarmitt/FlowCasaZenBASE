# 🚀 ACTIVACIÓN DEL MODO DESARROLLADOR - MERCADO PAGO

## 📋 Información de tu Aplicación

### 🔑 Credenciales Actuales
- **Public Key**: `APP_USR-f727d301-5562-4ef6-8866-96954070c812`
- **Access Token**: `APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457`
- **N° de aplicación**: `87756889032549`
- **User ID**: `419183457`

## 🛠️ Pasos para Activar el Modo Desarrollador

### 1. **Acceder al Panel de Desarrolladores**
1. Ve a: https://www.mercadopago.com.ar/developers
2. Inicia sesión con tu cuenta de MercadoPago
3. Busca tu aplicación: **N° 87756889032549**

### 2. **Activar Modo Desarrollador**
1. En el panel de tu aplicación, busca la sección **"Configuración"**
2. Busca la opción **"Modo de desarrollo"** o **"Developer Mode"**
3. Activa el modo desarrollador
4. Esto te permitirá:
   - Usar webhooks de desarrollo
   - Probar pagos reales con montos pequeños
   - Acceder a logs detallados
   - Usar herramientas de debugging

### 3. **Configurar Webhooks para Desarrollo**
1. En la sección **"Webhooks"** de tu aplicación
2. Agrega la URL de tu webhook de desarrollo:
   ```
   https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook
   ```
3. Selecciona los eventos que quieres recibir:
   - `payment`
   - `merchant_order`
   - `point_integration_wh`

### 4. **Configurar URLs de Retorno**
1. En la sección **"URLs de retorno"**
2. Configura:
   - **Success**: `https://8ac64d6f11ca.ngrok-free.app/payment/success`
   - **Failure**: `https://8ac64d6f11ca.ngrok-free.app/payment/failure`
   - **Pending**: `https://8ac64d6f11ca.ngrok-free.app/payment/pending`

## 🔧 Configuración en el Código

### 1. **Variables de Entorno**
```bash
# Modo desarrollo activado
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=false
MERCADOPAGO_DEVELOPER_MODE=true

# URLs de desarrollo
FRONTEND_URL=https://8ac64d6f11ca.ngrok-free.app
BACKEND_URL=https://8ac64d6f11ca.ngrok-free.app
WEBHOOK_URL=https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook
```

### 2. **Configuración del Servidor**
```javascript
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457',
  options: {
    sandbox: false, // Producción
    developerMode: true // Modo desarrollador activado
  }
});
```

## 🧪 Pruebas en Modo Desarrollador

### 1. **Crear Preferencia de Prueba**
```bash
curl -X POST https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Developer Mode",
    "price": 1.00,
    "currency": "USD"
  }'
```

### 2. **Verificar Webhook**
- Los webhooks se enviarán a tu URL de ngrok
- Podrás ver los logs en tiempo real
- Los pagos se procesarán pero no se cobrarán realmente

### 3. **Tarjetas de Prueba**
En modo desarrollador, puedes usar:
- **Visa**: 4509 9535 6623 3704
- **Mastercard**: 5031 7557 3453 0604
- **CVV**: 123
- **Fecha**: Cualquier fecha futura

## 📊 Monitoreo y Logs

### 1. **Panel de MercadoPago**
- Ve a: https://www.mercadopago.com.ar/developers/apps/87756889032549
- Revisa la sección **"Logs"** para ver todas las transacciones
- Monitorea los webhooks en **"Webhooks"**

### 2. **Logs del Servidor**
```bash
# En tu servidor, verás logs como:
🔔 Webhook de Mercado Pago recibido: { type: 'payment', data: { id: '123456789' } }
💳 Procesando pago ID: 123456789
✅ Pago 123456789 procesado exitosamente
```

## ⚠️ Consideraciones Importantes

### 1. **Límites del Modo Desarrollador**
- Montos máximos reducidos
- Algunas funcionalidades limitadas
- Webhooks solo para desarrollo

### 2. **Transición a Producción**
- Cuando estés listo, desactiva el modo desarrollador
- Actualiza las URLs a tu dominio real
- Configura webhooks de producción

### 3. **Seguridad**
- No compartas tus credenciales
- Usa HTTPS en producción
- Valida siempre los webhooks

## 🆘 Troubleshooting

### Error: "Application not in developer mode"
- Verifica que hayas activado el modo desarrollador en el panel
- Espera unos minutos para que se propague el cambio

### Error: "Webhook not receiving notifications"
- Verifica que la URL de ngrok esté activa
- Confirma que el endpoint responda con status 200
- Revisa los logs del panel de MercadoPago

### Error: "Invalid credentials"
- Verifica que las credenciales sean correctas
- Confirma que la aplicación esté activa
- Revisa que no haya espacios extra en las credenciales

## 📞 Soporte

Si tienes problemas:
1. Revisa la documentación: https://www.mercadopago.com.ar/developers
2. Contacta soporte: https://www.mercadopago.com.ar/developers/support
3. Revisa los logs en el panel de desarrolladores
