# 🎨 IMPLEMENTAR LOGO EN NAVBAR - INSTRUCCIONES ESPECÍFICAS

## ✅ PASO 1: COPIAR LA IMAGEN

**COPIA MANUALMENTE:**
- **DESDE:** `C:\Users\Mauro\Desktop\FlowCasaZen\brand_ultimo.png`
- **HACIA:** `C:\Users\Mauro\Desktop\FlowCasaZen\flowcasa-zen\public\brand_ultimo.png`

## ✅ PASO 2: ACTUALIZAR EL CÓDIGO

**EN EL ARCHIVO:** `src/components/Home.tsx`

**REEMPLAZAR LAS LÍNEAS 161-169:**

```tsx
{/* Logo and brand */}
<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
  <div className="flex shrink-0 items-center">
    <div className="flex items-center">
      {/* 🎨 LOGO DE LA MARCA */}
      <img 
        src="/brand_ultimo.png" 
        alt="FlowCasaZen" 
        className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 object-contain"
        onError={(e) => {
          // Fallback al texto si la imagen no se carga
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'block';
        }}
      />
      {/* Fallback al texto original */}
      <h1 className="text-2xl font-bold text-sage-800 hidden">FlowCasaZen</h1>
      <span className="ml-2 text-sm text-gray-500 hidden sm:block">Tu plataforma de yoga y fitness</span>
    </div>
  </div>
</div>
```

## 🎯 CÓDIGO COMPLETO PARA COPIAR Y PEGAR:

```tsx
            {/* Logo and brand */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <div className="flex items-center">
                  {/* 🎨 LOGO DE LA MARCA */}
                  <img 
                    src="/brand_ultimo.png" 
                    alt="FlowCasaZen" 
                    className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 object-contain"
                    onError={(e) => {
                      // Fallback al texto si la imagen no se carga
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback al texto original */}
                  <h1 className="text-2xl font-bold text-sage-800 hidden">FlowCasaZen</h1>
                  <span className="ml-2 text-sm text-gray-500 hidden sm:block">Tu plataforma de yoga y fitness</span>
                </div>
              </div>
            </div>
```

## 🔧 INSTRUCCIONES DETALLADAS:

### **1. Abrir el archivo:**
- Ve a `src/components/Home.tsx`
- Busca las líneas 161-169

### **2. Reemplazar el código:**
- Selecciona desde la línea 161 hasta la línea 169
- Borra el código seleccionado
- Pega el nuevo código de arriba

### **3. Guardar:**
- Guarda el archivo (Ctrl+S)

### **4. Verificar:**
- Recarga la página en el navegador
- La imagen debería aparecer en el navbar

## 🎨 CARACTERÍSTICAS DEL LOGO:

- **Tamaños Responsive:**
  - Mobile: 40px (h-10)
  - Small: 48px (h-12) 
  - Medium: 56px (h-14)
  - Large: 64px (h-16)

- **Propiedades:**
  - Mantiene proporción (object-contain)
  - Ancho automático (w-auto)
  - Fallback al texto si falla

## 🚨 SI NO FUNCIONA:

### **Verificar que la imagen esté en:**
```
C:\Users\Mauro\Desktop\FlowCasaZen\flowcasa-zen\public\brand_ultimo.png
```

### **Verificar en el navegador:**
1. F12 → Console → Buscar errores
2. F12 → Network → Recargar → Buscar brand_ultimo.png

### **Código alternativo más simple:**
```tsx
<img 
  src="/brand_ultimo.png" 
  alt="FlowCasaZen" 
  className="h-12 w-auto object-contain"
/>
```

## ✨ RESULTADO ESPERADO:

- ✅ Imagen del logo en el navbar
- ✅ Tamaño responsive
- ✅ Fallback al texto si falla
- ✅ Funcionalidad completa mantenida
