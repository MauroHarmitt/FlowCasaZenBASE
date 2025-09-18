# 🌐 CONFIGURACIÓN NGROK - FLOWCASZEN

## 📋 URLs de Ngrok Configuradas

### 🔗 URLs Actuales
- **Backend (API)**: `https://8ac64d6f11ca.ngrok-free.app`
- **Frontend**: `https://tu-frontend-ngrok-url.ngrok-free.app` (configurar cuando sea necesario)

## ⚙️ Configuración del Servidor

### 1. Variables de Entorno para Ngrok
```bash
# URLs DE NGROK
FRONTEND_URL=https://tu-frontend-ngrok-url.ngrok-free.app
BACKEND_URL=https://8ac64d6f11ca.ngrok-free.app

# MERCADO PAGO - PRODUCCIÓN
MERCADOPAGO_ACCESS_TOKEN=APP_USR-87756889032549-091521-a317709ed0afefe4482910d029ebcded-419183457
MERCADOPAGO_PUBLIC_KEY=APP_USR-f727d301-5562-4ef6-8866-96954070c812
MERCADOPAGO_SANDBOX=false

# OTROS
JWT_SECRET=tu_jwt_secret_muy_seguro_para_produccion
MONGODB_URI=mongodb+srv://admin-web:stuart@cluster0.podle1o.mongodb.net/maurito-22
PORT=4000
WEBHOOK_URL=https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook
```

## 🚀 Comandos para Iniciar

### 1. Iniciar Servidor
```bash
cd server
$env:PORT=4000; node server.js
```

### 2. Iniciar Ngrok
```bash
ngrok http 4000
```

### 3. Iniciar Frontend
```bash
cd ..
npm start
```

## 🔧 Configuración del Frontend

### 1. API Service (src/services/api.ts)
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://8ac64d6f11ca.ngrok-free.app';
```

### 2. Package.json
```json
{
  "proxy": "https://8ac64d6f11ca.ngrok-free.app"
}
```

## 🧪 Pruebas

### 1. Health Check
```bash
curl https://8ac64d6f11ca.ngrok-free.app/health
```

### 2. Test de MercadoPago
```bash
curl -X POST https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/create-preference \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product",
    "price": 10.00,
    "currency": "USD"
  }'
```

## 🔍 Verificación de Configuración

### 1. Servidor Funcionando
- ✅ Puerto 4000 disponible
- ✅ MongoDB conectado
- ✅ MercadoPago configurado

### 2. Ngrok Funcionando
- ✅ URL pública: `https://8ac64d6f11ca.ngrok-free.app`
- ✅ Web Interface: `http://127.0.0.1:4040`
- ✅ Región: South America (sa)

### 3. Frontend Configurado
- ✅ API_BASE_URL apunta a ngrok
- ✅ Proxy configurado
- ✅ CORS permitido

## ⚠️ Consideraciones Importantes

1. **URLs Temporales**: Las URLs de ngrok cambian cada vez que se reinicia (excepto en planes pagos)
2. **HTTPS**: Ngrok proporciona HTTPS automáticamente
3. **Webhooks**: MercadoPago puede enviar notificaciones a la URL de ngrok
4. **CORS**: El servidor debe permitir el dominio de ngrok

## 🔄 Actualizar URLs

Cuando la URL de ngrok cambie, actualizar:

1. **Frontend**:
   - `src/services/api.ts`
   - `package.json` (proxy)

2. **Servidor**:
   - Variables de entorno
   - Configuración de MercadoPago

3. **MercadoPago**:
   - Webhook URL en el panel de administración

## 📱 URLs de Pago

Con ngrok configurado, las URLs de pago de MercadoPago funcionarán correctamente:
- ✅ Success: `https://8ac64d6f11ca.ngrok-free.app/payment/success`
- ✅ Failure: `https://8ac64d6f11ca.ngrok-free.app/payment/failure`
- ✅ Pending: `https://8ac64d6f11ca.ngrok-free.app/payment/pending`
- ✅ Webhook: `https://8ac64d6f11ca.ngrok-free.app/api/payments/mercadopago/webhook`

## 🆘 Troubleshooting

### Error de Conexión
- Verificar que ngrok esté ejecutándose
- Confirmar que el servidor esté en puerto 4000
- Revisar logs de ngrok

### Error de CORS
- Verificar configuración CORS en el servidor
- Confirmar que el dominio de ngrok esté permitido

### Error de Webhook
- Verificar que la URL del webhook sea HTTPS
- Confirmar que el endpoint responda con status 200
