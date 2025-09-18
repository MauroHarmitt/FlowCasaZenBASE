# 🚀 SCRIPT DE DESPLIEGUE PARA PRODUCCIÓN
# Configura y despliega FlowCasa Zen para www.flowcasazen.com

param(
    [switch]$BuildOnly,
    [switch]$ConfigOnly,
    [string]$ServerIP = "",
    [string]$MongoDBUri = ""
)

Write-Host "🌐 FLOWCASA ZEN - DESPLIEGUE A PRODUCCIÓN" -ForegroundColor Cyan
Write-Host "Dominio: www.flowcasazen.com" -ForegroundColor Green
Write-Host ""

# Función para verificar si un comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Verificar dependencias
Write-Host "🔍 Verificando dependencias..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm no está instalado. Por favor instala npm primero." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js y npm están instalados" -ForegroundColor Green

# Verificar si existe el archivo de configuración
if (-not (Test-Path "env.production")) {
    Write-Host "❌ No se encontró el archivo env.production" -ForegroundColor Red
    Write-Host "💡 Ejecuta primero la configuración básica" -ForegroundColor Yellow
    exit 1
}

# Configurar variables de entorno si se proporcionaron
if ($MongoDBUri -ne "") {
    Write-Host "🔧 Actualizando MongoDB URI..." -ForegroundColor Yellow
    $envContent = Get-Content "env.production" -Raw
    $envContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=$MongoDBUri"
    Set-Content "env.production" $envContent
    Write-Host "✅ MongoDB URI actualizado" -ForegroundColor Green
}

if ($ConfigOnly) {
    Write-Host "⚙️ Solo configuración completada" -ForegroundColor Green
    exit 0
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
try {
    npm run install:all
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} catch {
    Write-Host "❌ Error instalando dependencias: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Configurar entorno de producción
Write-Host "🔧 Configurando entorno de producción..." -ForegroundColor Yellow
try {
    node setup-production.js
    Write-Host "✅ Entorno configurado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error configurando entorno: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if ($BuildOnly) {
    Write-Host "🏗️ Creando build de producción..." -ForegroundColor Yellow
    try {
        npm run build
        Write-Host "✅ Build completado en la carpeta 'build/'" -ForegroundColor Green
        Write-Host "📁 Puedes subir el contenido de 'build/' a tu hosting" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Error creando build: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    # Build completo
    Write-Host "🏗️ Creando build de producción..." -ForegroundColor Yellow
    try {
        npm run build
        Write-Host "✅ Build completado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error creando build: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Verificar que el build se creó correctamente
if (Test-Path "build/index.html") {
    Write-Host "✅ Archivos de build verificados" -ForegroundColor Green
} else {
    Write-Host "❌ No se encontró el archivo build/index.html" -ForegroundColor Red
    exit 1
}

# Mostrar resumen
Write-Host ""
Write-Host "🎉 DESPLIEGUE COMPLETADO" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📁 Archivos listos en: build/" -ForegroundColor White
Write-Host "🌐 Dominio configurado: www.flowcasazen.com" -ForegroundColor White
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. 🌐 Configura DNS en GoDaddy para apuntar a tu servidor" -ForegroundColor White
Write-Host "2. 📤 Sube los archivos de 'build/' a tu hosting web" -ForegroundColor White
Write-Host "3. 🖥️  Configura el servidor backend (puerto 5000)" -ForegroundColor White
Write-Host "4. 🔒 Instala certificado SSL/HTTPS" -ForegroundColor White
Write-Host "5. 🗄️  Configura tu base de datos de producción" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulta GUIDE_DEPLOYMENT_GODADDY.md para instrucciones detalladas" -ForegroundColor Cyan
Write-Host ""

# Mostrar información del servidor si se proporcionó
if ($ServerIP -ne "") {
    Write-Host "🖥️  INFORMACIÓN DEL SERVIDOR:" -ForegroundColor Yellow
    Write-Host "IP: $ServerIP" -ForegroundColor White
    Write-Host "Puerto Frontend: 80/443 (HTTP/HTTPS)" -ForegroundColor White
    Write-Host "Puerto Backend: 5000" -ForegroundColor White
    Write-Host ""
}

Write-Host "🚀 ¡Tu aplicación está lista para producción!" -ForegroundColor Green

