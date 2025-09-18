# 🌐 GUÍA PARA COMPARTIR TU WEB CON NGROK

## 🚀 **INICIO RÁPIDO**

### **Opción 1: Script Automático (Recomendado)**
```bash
# Ejecutar el script completo
start-complete-system.bat
```

### **Opción 2: Script PowerShell**
```powershell
# Ejecutar con PowerShell
.\start-complete-system.ps1
```

### **Opción 3: Manual**
```bash
# 1. Iniciar servidor
node server.js

# 2. En otra terminal, iniciar ngrok
ngrok http 3001

# 3. Actualizar configuración
node update-ngrok-urls.js

# 4. Crear pago de prueba
node test-sandbox-payment.js
```

## 📋 **PASOS DETALLADOS**

### **1. Preparación**
- ✅ Node.js instalado
- ✅ ngrok instalado
- ✅ Credenciales de MercadoPago configuradas
- ✅ Modo sandbox activado

### **2. Iniciar el Sistema**
1. **Ejecuta el script**:
   ```bash
   start-complete-system.bat
   ```

2. **Espera a que se inicien**:
   - 🛒 Servidor de pagos (puerto 3001)
   - 🌐 ngrok (túnel público)
   - 🔄 Configuración actualizada

3. **Verifica en el navegador**:
   - http://127.0.0.1:4040 (Interfaz de ngrok)

### **3. Obtener URL Pública**
1. **Ve a** http://127.0.0.1:4040
2. **Copia la URL HTTPS** (ej: `https://abc123.ngrok-free.app`)
3. **Esta es tu URL pública** para compartir

### **4. Crear Pago de Prueba**
```bash
node test-sandbox-payment.js
```

### **5. Compartir con Clientes**
- 🔗 **URL de pago**: La que aparece en la consola
- 💳 **Tarjetas de prueba**: Para testing
- 📱 **Instrucciones**: Para completar el pago

## 💳 **TARJETAS DE PRUEBA**

### ✅ **Tarjeta Aprobada**
- **Número**: `4509 9535 6623 3704`
- **Vencimiento**: `11/25`
- **CVV**: `123`
- **Titular**: `APRO`

### ❌ **Tarjeta Rechazada**
- **Número**: `4000 0000 0000 0002`
- **Vencimiento**: `11/25`
- **CVV**: `123`
- **Titular**: `OTHE`

### ⏳ **Tarjeta Pendiente**
- **Número**: `4000 0000 0000 0004`
- **Vencimiento**: `11/25`
- **CVV**: `123`
- **Titular**: `PEND`

## 🔧 **CONFIGURACIÓN AUTOMÁTICA**

El script `update-ngrok-urls.js` actualiza automáticamente:

- ✅ **URLs de redirección** en MercadoPago
- ✅ **Webhook URL** para notificaciones
- ✅ **URLs de éxito/fallo/pendiente**
- ✅ **Configuración del servidor**

## 📱 **INFORMACIÓN PARA COMPARTIR**

### **Para tus Clientes:**
```
🛒 COMPRA EN FLOWCASZEN

🔗 Enlace de pago: [URL_DE_PAGO]

📋 Instrucciones:
1. Haz clic en el enlace
2. Completa los datos de la tarjeta
3. Confirma el pago
4. Recibirás confirmación por email

💳 Métodos de pago aceptados:
- Tarjetas de crédito/débito
- MercadoPago
- Transferencia bancaria

🆘 Soporte: [tu_email]
```

### **Para Testing:**
```
🧪 PRUEBA DE PAGO

🔗 Enlace: [URL_DE_PAGO]

💳 Tarjetas de prueba:
✅ Aprobada: 4509 9535 6623 3704
❌ Rechazada: 4000 0000 0000 0002
⏳ Pendiente: 4000 0000 0000 0004

📅 Vencimiento: 11/25
🔢 CVV: 123
```

## ⚠️ **CONSIDERACIONES IMPORTANTES**

### **URLs Temporales**
- 🔄 Las URLs de ngrok cambian al reiniciar
- 💰 Planes pagos mantienen URLs fijas
- 🔧 Actualiza la configuración si cambia

### **Seguridad**
- 🔒 Solo usa tarjetas de prueba en sandbox
- 🚫 No compartas credenciales reales
- ✅ HTTPS automático con ngrok

### **Rendimiento**
- 🌐 ngrok puede tener latencia
- 📊 Monitorea el uso de datos
- 🔄 Reinicia si hay problemas

## 🆘 **TROUBLESHOOTING**

### **Error: "ngrok not found"**
```bash
# Instalar ngrok
npm install -g ngrok
# O descargar desde https://ngrok.com/download
```

### **Error: "Server not responding"**
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:3001/health
```

### **Error: "Invalid webhook URL"**
```bash
# Actualizar configuración
node update-ngrok-urls.js
```

### **Error: "Payment failed"**
- ✅ Verificar modo sandbox
- ✅ Usar tarjetas de prueba
- ✅ Revisar logs del servidor

## 📊 **MONITOREO**

### **Verificar Estado**
```bash
# Health check
curl http://localhost:3001/health

# Ver túneles activos
curl http://127.0.0.1:4040/api/tunnels
```

### **Logs del Servidor**
- 📋 Consola del servidor de pagos
- 🔔 Webhooks recibidos
- 💳 Pagos procesados

### **Interfaz de ngrok**
- 🌐 http://127.0.0.1:4040
- 📊 Tráfico en tiempo real
- 🔍 Inspección de requests

## 🎯 **PRÓXIMOS PASOS**

### **Para Producción:**
1. 🔄 Cambiar a modo producción
2. 🌐 Configurar dominio propio
3. 🔒 Certificados SSL
4. 📊 Monitoreo avanzado

### **Para Desarrollo:**
1. 🧪 Mantener modo sandbox
2. 🔄 URLs temporales OK
3. 💳 Solo tarjetas de prueba
4. 📝 Logs detallados

## 📞 **SOPORTE**

Si necesitas ayuda:
- 📄 Revisa `SOLUCION_PAGO.md`
- 🧪 Usa `test-sandbox-payment.js`
- 🔄 Ejecuta `update-ngrok-urls.js`
- 📋 Verifica logs del servidor

---

## 🎉 **¡LISTO PARA COMPARTIR!**

Tu sistema está configurado y listo para:
- ✅ Recibir pagos reales
- ✅ Procesar transacciones
- ✅ Enviar notificaciones
- ✅ Manejar webhooks

**¡Comparte tu URL de pago y comienza a recibir pagos!**
