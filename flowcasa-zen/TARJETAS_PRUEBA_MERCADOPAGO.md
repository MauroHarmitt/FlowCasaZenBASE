# 💳 TARJETAS DE PRUEBA PARA MERCADOPAGO SANDBOX

## 🚨 **PROBLEMA IDENTIFICADO**

El error "La operación no acepta este medio de pago" ocurre porque estás usando una tarjeta real en modo sandbox. MercadoPago sandbox solo acepta tarjetas de prueba específicas.

## ✅ **SOLUCIÓN: USAR TARJETAS DE PRUEBA**

### **Tarjetas de Prueba Válidas para MercadoPago Sandbox:**

#### **1. Visa (Aprobada)**
- **Número**: 4509 9535 6623 3704
- **Vencimiento**: 11/25
- **CVV**: 123
- **Nombre**: APRO
- **DNI**: 12345678

#### **2. Mastercard (Aprobada)**
- **Número**: 5031 7557 3453 0604
- **Vencimiento**: 11/25
- **CVV**: 123
- **Nombre**: APRO
- **DNI**: 12345678

#### **3. American Express (Aprobada)**
- **Número**: 3753 651535 56885
- **Vencimiento**: 11/25
- **CVV**: 1234
- **Nombre**: APRO
- **DNI**: 12345678

#### **4. Visa (Rechazada) - Para probar errores**
- **Número**: 4000 0000 0000 0002
- **Vencimiento**: 11/25
- **CVV**: 123
- **Nombre**: OTHE
- **DNI**: 12345678

#### **5. Mastercard (Rechazada) - Para probar errores**
- **Número**: 5031 7557 3453 0604
- **Vencimiento**: 11/25
- **CVV**: 123
- **Nombre**: OTHE
- **DNI**: 12345678

## 🔧 **INSTRUCCIONES DE USO**

### **Para Probar Pagos Exitosos:**
1. Usa cualquiera de las tarjetas **APRO** (aprobadas)
2. Cualquier nombre del titular
3. Cualquier DNI
4. El pago será aprobado automáticamente

### **Para Probar Pagos Rechazados:**
1. Usa las tarjetas **OTHE** (rechazadas)
2. El pago será rechazado para probar el manejo de errores

## ⚠️ **IMPORTANTE**

- **NO uses tarjetas reales** en modo sandbox
- **Solo usa las tarjetas de prueba** listadas arriba
- **El modo sandbox** es solo para desarrollo y pruebas
- **No se procesan pagos reales** en modo sandbox

## 🎯 **DATOS PARA TU PRUEBA**

Usa estos datos exactos:

```
Número de tarjeta: 4509 9535 6623 3704
Nombre del titular: APRO
Vencimiento: 11/25
Código de seguridad: 123
Documento del titular: 12345678
```

## 🔄 **CAMBIAR A MODO PRODUCCIÓN**

Para usar tarjetas reales, necesitas:
1. Cambiar `sandbox: false` en la configuración
2. Usar credenciales de producción
3. Configurar webhooks de producción
4. Obtener aprobación de MercadoPago

## 📋 **VERIFICACIÓN**

Después de usar las tarjetas de prueba:
- ✅ El pago debe ser aprobado
- ✅ Debes recibir confirmación
- ✅ El webhook debe funcionar
- ✅ La transacción debe aparecer en el dashboard de MercadoPago

---

**¡Usa las tarjetas de prueba y el pago funcionará correctamente!**

