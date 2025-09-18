# 🔧 Troubleshooting MercadoPago - Botón "Continuar" No Funciona

## Problema Reportado
El botón "Continuar" en MercadoPago no responde después de ingresar los datos de la tarjeta de prueba.

## Soluciones Implementadas

### 1. ✅ Redirección Directa
- **Problema:** El SDK de MercadoPago causaba conflictos con iframes
- **Solución:** Cambiado a redirección directa con `window.location.href`
- **Archivos modificados:** `SingleCard.tsx`, `MercadoPagoPayment.tsx`

### 2. ✅ Logging Mejorado
- **Problema:** Difícil diagnosticar problemas de configuración
- **Solución:** Agregado logging detallado en servidor y frontend
- **Verificación:** Revisar consola del navegador y terminal del servidor

### 3. ✅ Verificación de Sandbox
- **Problema:** Posible uso de URLs de producción
- **Solución:** Forzado uso de `sandbox_init_point`
- **Verificación:** URLs deben contener `sandbox.mercadopago.com.ar`

## Pasos para Probar

### 1. Verificar Servidor
```bash
# El servidor debe estar corriendo en puerto 4000
npm run dev
```

### 2. Verificar Consola del Navegador
Debes ver estos mensajes:
```
✅ Usando sandbox_init_point para modo de pruebas
🔗 Redirigiendo directamente a MercadoPago: https://sandbox.mercadopago.com.ar/...
```

### 3. Verificar Terminal del Servidor
Debes ver:
```
💳 Creando preferencia de MercadoPago en modo SANDBOX...
🧪 Modo Sandbox: true
🧪 sandbox_init_point: https://sandbox.mercadopago.com.ar/...
```

### 4. Datos de Tarjeta de Prueba
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/30
Nombre: APRO
```

## Posibles Causas del Botón No Funcional

### 1. 🔴 Problemas de JavaScript
- **Síntoma:** Botón no responde, errores en consola
- **Solución:** Limpiar caché del navegador, deshabilitar extensiones

### 2. 🔴 Problemas de CORS
- **Síntoma:** Errores 404, problemas de red
- **Solución:** Verificar que el servidor esté corriendo en puerto 4000

### 3. 🔴 Problemas de Credenciales
- **Síntoma:** No se crea la preferencia
- **Solución:** Verificar que las credenciales empiecen con "TEST-"

### 4. 🔴 Problemas de Navegador
- **Síntoma:** Iframe bloqueado, permisos denegados
- **Solución:** Usar navegador diferente, deshabilitar bloqueadores

## Comandos de Diagnóstico

### Verificar Servidor
```bash
# Verificar que el servidor esté corriendo
netstat -ano | findstr :4000

# Ver logs del servidor
npm run dev
```

### Verificar Frontend
```bash
# Verificar que React esté corriendo
netstat -ano | findstr :3000

# Limpiar caché
npm start
```

## URLs de Verificación

### Sandbox (Correcto)
```
https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=...
```

### Producción (Incorrecto para pruebas)
```
https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=...
```

## Próximos Pasos

1. **Reiniciar el servidor** con `npm run dev`
2. **Limpiar caché del navegador** (Ctrl+Shift+R)
3. **Probar en navegador incógnito**
4. **Verificar consola** para mensajes de error
5. **Usar datos de tarjeta exactos** (APRO como nombre)

## Contacto
Si el problema persiste, revisar:
- Logs del servidor en terminal
- Consola del navegador (F12)
- Red en DevTools para errores 404
