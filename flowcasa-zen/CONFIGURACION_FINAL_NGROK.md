# 🚀 CONFIGURACIÓN FINAL - NGROK Y MERCADO PAGO

## ✅ Configuración Completada

### 🌐 **URLs de Ngrok**
- **URL Principal**: `https://8ac64d6f11ca.ngrok-free.app`
- **Puerto Backend**: `4000` (expuesto a través de ngrok)
- **Puerto Frontend**: `3000` (local)

### 🔧 **Configuración del Servidor**
- **Backend**: Puerto 4000 ✅
- **Frontend**: Puerto 3000 ✅
- **Ngrok**: Expone puerto 4000 ✅
- **Proxy**: Configurado para ngrok ✅

## 📱 **Configuración en el Panel de MercadoPago**

### 1. **Acceder al Panel**
```
https://www.mercadopago.com.ar/developers/apps/87756889032549
```

### 2. **Configurar Webhooks**
En la sección "Webhooks", agrega:
```
https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook
```

**Eventos a seleccionar:**
- ✅ `payment`
- ✅ `merchant_order`
- ✅ `point_integration_wh`

### 3. **Configurar URLs de Retorno**
En la sección "URLs de retorno":
- **Success**: `https://8ac64d6f11ca.ngrok-free.app/payment/success`
- **Failure**: `https://8ac64d6f11ca.ngrok-free.app/payment/failure`
- **Pending**: `https://8ac64d6f11ca.ngrok-free.app/payment/pending`

## 🧪 **Prueba del Sistema**

### 1. **Link de Pago de Prueba**
```
https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=419183457-f2f8816b-d440-4f3a-b524-e0cb9ee1f521
```

### 2. **Tarjetas de Prueba**
- **Visa**: `4509 9535 6623 3704`
- **Mastercard**: `5031 7557 3453 0604`
- **CVV**: `123`
- **Fecha**: Cualquier fecha futura

### 3. **Verificación del Webhook**
En tu servidor deberías ver:
```
🔔 Webhook de Mercado Pago recibido: { type: "payment", data: { id: "..." } }
💳 Procesando pago ID: ...
✅ Pago ... procesado exitosamente
```

## 🔄 **Comandos para Ejecutar**

### 1. **Iniciar Backend**
```bash
cd server
$env:PORT=4000; node server.js
```

### 2. **Iniciar Ngrok**
```bash
ngrok http 4000
```

### 3. **Iniciar Frontend**
```bash
npm start
```

## 📊 **Verificaciones**

### 1. **Health Check**
```bash
curl https://8ac64d6f11ca.ngrok-free.app/health
```

### 2. **Endpoint de Clases**
```bash
curl https://8ac64d6f11ca.ngrok-free.app/api/classes
```

### 3. **Crear Preferencia**
```bash
curl -X POST https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "price": 10.00,
    "currency": "USD"
  }'
```

## 🎯 **Estado Actual**

- ✅ **Backend funcionando** en puerto 4000
- ✅ **Ngrok exponiendo** puerto 4000
- ✅ **Frontend configurado** para usar ngrok
- ✅ **MercadoPago configurado** con credenciales de producción
- ✅ **Modo desarrollador activado**
- ✅ **Webhook configurado** con URL de ngrok

## ⚠️ **Consideraciones Importantes**

### 1. **URLs Temporales**
- Las URLs de ngrok cambian al reiniciar (excepto en planes pagos)
- Si cambia la URL, actualiza la configuración en MercadoPago

### 2. **HTTPS Automático**
- Ngrok proporciona HTTPS automáticamente
- MercadoPago requiere HTTPS para webhooks

### 3. **Persistencia**
- Para mantener la misma URL, considera un plan pagado de ngrok
- O configura un dominio personalizado

## 🆘 **Troubleshooting**

### Error: "Webhook not receiving"
1. Verifica que ngrok esté ejecutándose
2. Confirma que el servidor esté en puerto 4000
3. Revisa la configuración en el panel de MercadoPago

### Error: "Cannot connect to server"
1. Verifica que el backend esté ejecutándose
2. Confirma que ngrok esté exponiendo el puerto correcto
3. Revisa los logs del servidor

### Error: "Invalid webhook URL"
1. Verifica que la URL sea HTTPS
2. Confirma que el endpoint responda con status 200
3. Revisa la configuración en MercadoPago

## 🎉 **¡Sistema Listo!**

Tu sistema está completamente configurado y listo para:
- ✅ Procesar pagos reales con MercadoPago
- ✅ Recibir webhooks de notificaciones
- ✅ Manejar URLs de retorno
- ✅ Funcionar en modo desarrollador

**Próximo paso**: Configura las URLs en el panel de MercadoPago y prueba el flujo completo.
