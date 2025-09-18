# 🧪 Configuración de MercadoPago en Modo Sandbox

## Problema Identificado
Cuando rediriges a MercadoPago, solo aparecen tus tarjetas reales en lugar de las tarjetas de prueba. Esto indica que la integración está usando el entorno de producción en lugar del sandbox.

## Solución

### 1. Verificar Credenciales de Sandbox
Las credenciales de sandbox de MercadoPago deben empezar con `TEST-`:

**Access Token (Backend):**
```
TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457
```

**Public Key (Frontend):**
```
TEST-679639fa-4d9d-484c-b251-daa49396562f
```

### 2. Configuración del Servidor
El servidor ya está configurado para forzar modo sandbox:
```javascript
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-5510015184927084-091602-570e6ddfc67738f0639841b187342ce4-419183457',
  options: {
    sandbox: true // Forzar modo sandbox para pruebas
  }
});
```

### 3. Configuración del Frontend
El frontend ahora prioriza `sandbox_init_point` sobre `init_point`:
```javascript
// Forzar uso de sandbox_init_point para modo de pruebas
let paymentUrl = result.sandbox_init_point;

if (!paymentUrl) {
  console.warn('No se encontró sandbox_init_point, usando init_point como fallback');
  paymentUrl = result.init_point;
}
```

### 4. Tarjetas de Prueba de MercadoPago

#### Tarjetas de Crédito de Prueba:
- **Visa:** 4509 9535 6623 3704
- **Mastercard:** 5031 7557 3453 0604
- **American Express:** 3753 651535 56885

#### Datos de Prueba:
- **CVV:** 123
- **Fecha de vencimiento:** Cualquier fecha futura
- **Nombre del titular:** APRO
- **Email:** test@test.com

### 5. Verificación
Para verificar que está funcionando en modo sandbox:

1. **En la consola del navegador** deberías ver:
   ```
   ✅ Usando sandbox_init_point para modo de pruebas
   ```

2. **En la consola del servidor** deberías ver:
   ```
   💳 Creando preferencia de MercadoPago en modo SANDBOX...
   🧪 Modo Sandbox: true
   🧪 sandbox_init_point: https://sandbox.mercadopago.com/...
   ```

3. **En la URL de MercadoPago** debería aparecer:
   - `sandbox.mercadopago.com` en lugar de `mercadopago.com`

### 6. Si Aún No Funciona

Si después de estos cambios sigues viendo tus tarjetas reales:

1. **Verifica las credenciales** en tu cuenta de MercadoPago:
   - Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
   - Asegúrate de estar en la sección "Pruebas" (no "Producción")
   - Copia las credenciales que empiecen con `TEST-`

2. **Limpia la caché del navegador** y reinicia el servidor

3. **Verifica que no haya variables de entorno** sobrescribiendo la configuración

### 7. Comandos para Reiniciar
```bash
# Detener el servidor (Ctrl+C)
# Luego ejecutar:
npm run dev
# o
npm start
```

## Notas Importantes
- ✅ Las credenciales de sandbox son seguras para usar en desarrollo
- ✅ Las transacciones en sandbox no cobran dinero real
- ✅ Las tarjetas de prueba solo funcionan en entorno sandbox
- ❌ No uses credenciales de producción en desarrollo
- ❌ No uses tarjetas reales en modo sandbox
