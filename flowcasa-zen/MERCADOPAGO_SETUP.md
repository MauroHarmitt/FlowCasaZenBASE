# 💳 Configuración de MercadoPago para FlowCasaZen

## 📋 Resumen de la Configuración

La integración de MercadoPago con CheckoutPro está configurada para funcionar en modo **SANDBOX** (pruebas) con las siguientes características:

### ✅ Estado Actual de la Configuración

1. **Frontend (React)**: ✅ Configurado
   - SDK de MercadoPago cargado dinámicamente
   - Componente `MercadoPagoPayment` implementado
   - Redirección a CheckoutPro configurada

2. **Backend (Node.js)**: ✅ Configurado
   - Endpoint para crear preferencias de pago
   - Webhook para notificaciones
   - Integración con SDK oficial de MercadoPago

3. **Variables de Entorno**: ⚠️ Necesita configuración
   - Archivo `.env.local` no existe
   - Credenciales hardcodeadas en algunos archivos

## 🔧 Configuración Requerida

### 1. Crear archivo `.env.local` en la raíz del proyecto

```bash
# 💳 MERCADOPAGO - CREDENCIALES DE PRUEBA (SANDBOX)
REACT_APP_MERCADOPAGO_PUBLIC_KEY=TEST-679639fa-4d9d-484c-b251-daa49396562f
REACT_APP_MERCADOPAGO_ACCESS_TOKEN=TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457

# 🔧 CONFIGURACIÓN DEL SERVIDOR
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:4000

# 🗄️ MONGODB CONFIGURATION
MONGODB_URI=mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22

# 🔐 JWT SECRET
JWT_SECRET=tu_jwt_secret_muy_seguro_para_flowcasa_zen_2024

# 🌍 ENVIRONMENT
NODE_ENV=development

# 💳 MERCADOPAGO - CONFIGURACIÓN ADICIONAL
MERCADOPAGO_SANDBOX=true
MERCADOPAGO_PUBLIC_KEY=TEST-679639fa-4d9d-484c-b251-daa49396562f
MERCADOPAGO_ACCESS_TOKEN=TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457

# 🔗 URLs DE REDIRECCIÓN PARA PAGOS
SUCCESS_URL=http://localhost:3000/payment/success
FAILURE_URL=http://localhost:3000/payment/failure
PENDING_URL=http://localhost:3000/payment/pending
WEBHOOK_URL=http://localhost:4000/api/payments/mercadopago/webhook

# 📡 CONFIGURACIÓN DEL SERVIDOR
PORT=4000
HOST=localhost
```

### 2. Obtener Credenciales Reales de MercadoPago

1. Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers/)
2. Crea una cuenta de desarrollador
3. Obtén tu **Public Key** y **Access Token** de prueba
4. Reemplaza las credenciales de ejemplo en el archivo `.env.local`

### 3. Configurar Webhook (Opcional para desarrollo local)

Para recibir notificaciones automáticas de pagos:

1. Usa ngrok para exponer tu servidor local:
   ```bash
   ngrok http 4000
   ```

2. Configura la URL del webhook en tu panel de MercadoPago:
   ```
   https://tu-ngrok-url.ngrok.io/api/payments/mercadopago/webhook
   ```

## 🧪 Datos de Prueba

### Tarjetas de Prueba para CheckoutPro

| Tipo | Número | CVV | Vencimiento | Resultado |
|------|--------|-----|-------------|-----------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobada |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobada |
| American Express | 3753 651535 56885 | 1234 | 11/25 | Aprobada |
| Visa | 4000 0000 0000 0002 | 123 | 11/25 | Rechazada |

### Otros Métodos de Pago

- **Transferencia bancaria**: Usa cualquier CBU
- **Efectivo**: Usa cualquier código de pago generado
- **Billetera digital**: Usa cualquier email

## 🚀 Cómo Probar la Integración

### 1. Iniciar el Servidor Backend

```bash
cd flowcasa-zen/server
npm install
npm start
```

### 2. Iniciar el Frontend

```bash
cd flowcasa-zen
npm install
npm start
```

### 3. Probar el Flujo de Pago

1. Navega a `http://localhost:3000`
2. Selecciona una clase
3. Haz clic en "Comprar"
4. Completa el formulario de pago
5. Serás redirigido a MercadoPago CheckoutPro
6. Usa los datos de prueba para completar el pago

### 4. Verificar en Logs

Revisa los logs del servidor backend para ver:
- Creación de preferencias
- Notificaciones de webhook
- Estados de pago

## 📁 Archivos de Configuración

### Frontend
- `src/config/mercadopago.ts` - Configuración del SDK
- `src/components/MercadoPagoPayment.tsx` - Componente de pago

### Backend
- `server/server.js` - Servidor principal con endpoints de pago
- `mercadopago-solucion-main/server.js` - Servidor de ejemplo independiente

### Configuración
- `src/config/env.example.ts` - Ejemplo de variables de entorno
- `mercadopago-solucion-main/config.js` - Configuración del servidor de ejemplo

## 🔍 Endpoints Disponibles

### Frontend (React)
- `http://localhost:3000` - Aplicación principal

### Backend (Node.js)
- `GET /health` - Health check
- `POST /api/payments/mercadopago/create-preference` - Crear preferencia de pago
- `POST /api/payments/mercadopago/webhook` - Webhook para notificaciones

### Servidor de Ejemplo
- `GET /health` - Health check del servidor de ejemplo
- `POST /api/create-preference` - Crear preferencia (servidor independiente)
- `POST /api/webhooks/mercadopago` - Webhook (servidor independiente)

## ⚠️ Problemas Conocidos y Soluciones

### 1. Error de CORS
**Problema**: Error de CORS al hacer requests desde el frontend
**Solución**: Verificar que el backend esté configurado para aceptar requests desde `http://localhost:3000`

### 2. SDK no se carga
**Problema**: Error "MercadoPago is not defined"
**Solución**: Verificar que el script del SDK se esté cargando correctamente

### 3. Preferencia no se crea
**Problema**: Error al crear preferencia de pago
**Solución**: Verificar credenciales y conexión a internet

### 4. Webhook no funciona
**Problema**: No se reciben notificaciones de pago
**Solución**: Para desarrollo local, usar ngrok o verificar configuración del webhook

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del servidor
2. Verifica las credenciales de MercadoPago
3. Asegúrate de que todos los servicios estén ejecutándose
4. Consulta la [documentación oficial de MercadoPago](https://www.mercadopago.com.ar/developers/es/docs)

## 🎯 Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Obtener credenciales reales de MercadoPago
3. ✅ Probar flujo completo de pago
4. ✅ Configurar webhook para producción
5. ✅ Implementar manejo de errores robusto
6. ✅ Agregar logging detallado
7. ✅ Configurar monitoreo de pagos
