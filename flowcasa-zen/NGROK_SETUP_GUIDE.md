# 🌐 Guía de Configuración de ngrok para FlowCasa Zen

## 📋 Resumen

Esta guía te ayudará a configurar ngrok para compartir tu aplicación web y hacer pruebas de MercadoPago con URLs públicas.

## 🚀 Configuración Rápida

### 1. Iniciar ngrok
```bash
ngrok http 3000
```

### 2. Actualizar configuración automáticamente
```powershell
.\ngrok-setup.ps1
```

## 📁 Archivos Creados

- `ngrok-setup.ps1` - Script principal para configurar ngrok
- `update-config-basic.ps1` - Script básico de actualización
- `get-ngrok-url.ps1` - Script para obtener URL de ngrok
- `.env` - Archivo de configuración generado automáticamente

## 🔧 URLs Configuradas

Cuando ejecutes el script, se configurarán automáticamente:

- **Frontend**: `https://tu-url-ngrok.ngrok-free.app`
- **Backend**: `https://tu-url-ngrok.ngrok-free.app` (puerto 5000)
- **Webhook MercadoPago**: `https://tu-url-ngrok.ngrok-free.app/api/webhooks/mercadopago`
- **Success URL**: `https://tu-url-ngrok.ngrok-free.app/payment/success`
- **Failure URL**: `https://tu-url-ngrok.ngrok-free.app/payment/failure`
- **Pending URL**: `https://tu-url-ngrok.ngrok-free.app/payment/pending`

## 📝 Archivos Actualizados Automáticamente

### 1. Frontend (`src/services/api.ts`)
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tu-url-ngrok.ngrok-free.app';
```

### 2. MercadoPago (`mercadopago-solucion-main/config.js`)
```javascript
urls: {
  success: process.env.SUCCESS_URL || 'https://tu-url-ngrok.ngrok-free.app/payment/success',
  failure: process.env.FAILURE_URL || 'https://tu-url-ngrok.ngrok-free.app/payment/failure',
  pending: process.env.PENDING_URL || 'https://tu-url-ngrok.ngrok-free.app/payment/pending',
  webhook: process.env.WEBHOOK_URL || 'https://tu-url-ngrok.ngrok-free.app/api/webhooks/mercadopago'
}
```

### 3. Variables de Entorno (`.env`)
```env
REACT_APP_API_URL=https://tu-url-ngrok.ngrok-free.app
REACT_APP_FRONTEND_URL=https://tu-url-ngrok.ngrok-free.app
WEBHOOK_URL=https://tu-url-ngrok.ngrok-free.app/api/webhooks/mercadopago
SUCCESS_URL=https://tu-url-ngrok.ngrok-free.app/payment/success
FAILURE_URL=https://tu-url-ngrok.ngrok-free.app/payment/failure
PENDING_URL=https://tu-url-ngrok.ngrok-free.app/payment/pending
```

## ⚠️ Pasos Importantes

### 1. Reiniciar el Servidor Backend
Después de ejecutar el script, **DEBES** reiniciar el servidor backend para que los cambios de CORS se apliquen:

```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
cd server
npm start
```

### 2. Verificar que Todo Funcione
- Abre la URL de ngrok en tu navegador
- Verifica que la aplicación cargue correctamente
- Prueba el login y registro
- Prueba la funcionalidad de MercadoPago

## 🔄 Flujo de Trabajo

### Cada vez que reinicies ngrok:

1. **Iniciar ngrok**:
   ```bash
   ngrok http 3000
   ```

2. **Ejecutar script de configuración**:
   ```powershell
   .\ngrok-setup.ps1
   ```

3. **Reiniciar servidor backend**:
   ```bash
   cd server
   npm start
   ```

## 🛠️ Solución de Problemas

### Error: "ngrok no está instalado"
```bash
# Descargar e instalar ngrok desde:
# https://ngrok.com/download
```

### Error: "Puerto 3000 no está en uso"
```bash
# Asegúrate de que la aplicación React esté corriendo:
npm start
```

### Error: "No se encontraron túneles activos"
```bash
# Verifica que ngrok esté corriendo:
# Abre http://localhost:4040 en tu navegador
```

### Error de CORS en el navegador
```bash
# Reinicia el servidor backend después de ejecutar el script
cd server
npm start
```

## 📱 Pruebas de MercadoPago

### URLs de Prueba
- **Webhook**: `https://tu-url-ngrok.ngrok-free.app/api/webhooks/mercadopago`
- **Success**: `https://tu-url-ngrok.ngrok-free.app/payment/success`
- **Failure**: `https://tu-url-ngrok.ngrok-free.app/payment/failure`

### Configuración en MercadoPago
1. Ve a tu panel de MercadoPago
2. Configura las URLs de webhook con la URL generada
3. Usa las tarjetas de prueba de MercadoPago

## 🎯 URLs Actuales

**Tu URL actual de ngrok es**: `https://e046a6e7531e.ngrok-free.app`

- **Frontend**: https://e046a6e7531e.ngrok-free.app
- **Backend**: https://e046a6e7531e.ngrok-free.app
- **Webhook**: https://e046a6e7531e.ngrok-free.app/api/webhooks/mercadopago

## 📞 Interfaz Web de ngrok

Puedes monitorear el tráfico y la configuración en:
**http://localhost:4040**

## ✅ Verificación Final

Para verificar que todo esté funcionando:

1. ✅ ngrok corriendo en puerto 3000
2. ✅ Script de configuración ejecutado
3. ✅ Servidor backend reiniciado
4. ✅ Aplicación accesible desde la URL de ngrok
5. ✅ MercadoPago configurado con las nuevas URLs

¡Tu aplicación está lista para compartir y hacer pruebas de MercadoPago! 🎉
