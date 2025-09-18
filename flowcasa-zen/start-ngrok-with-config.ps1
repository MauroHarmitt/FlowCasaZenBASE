# 🚀 SCRIPT DE NGROK CON CONFIGURACIÓN AUTOMÁTICA
# Este script inicia ngrok y actualiza automáticamente la configuración del frontend y backend

param(
    [int]$Port = 3000,
    [string]$Region = "sa"
)

# 🎨 Colores para la consola
$Host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "🚀 Iniciando ngrok con configuración automática..." -ForegroundColor BrightCyan
Write-Host ""

# 🔍 Verificar si ngrok está instalado
try {
    $ngrokVersion = ngrok version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "ngrok no está instalado o no está en el PATH"
    }
    Write-Host "✅ ngrok encontrado: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: ngrok no está instalado" -ForegroundColor Red
    Write-Host "   Instala ngrok desde: https://ngrok.com/download" -ForegroundColor Yellow
    exit 1
}

# 🔍 Verificar si el puerto está en uso
try {
    $portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portInUse) {
        Write-Host "✅ Puerto $Port está en uso (aplicación corriendo)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Puerto $Port no está en uso. Asegúrate de que la aplicación esté corriendo" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo verificar el puerto $Port" -ForegroundColor Yellow
}

Write-Host ""

# 🚀 Iniciar ngrok en segundo plano
Write-Host "🚀 Iniciando ngrok en puerto $Port..." -ForegroundColor Cyan
$ngrokProcess = Start-Process -FilePath "ngrok" -ArgumentList "http", $Port, "--region", $Region -PassThru -WindowStyle Hidden

# ⏳ Esperar a que ngrok se inicie
Write-Host "⏳ Esperando a que ngrok se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 🔍 Verificar que ngrok esté corriendo
try {
    $ngrokStatus = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    if ($ngrokStatus.tunnels.Count -eq 0) {
        throw "No se encontraron túneles activos"
    }
    Write-Host "✅ ngrok iniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: ngrok no se inició correctamente" -ForegroundColor Red
    Write-Host "   Verifica que el puerto 4040 esté disponible" -ForegroundColor Yellow
    $ngrokProcess.Kill()
    exit 1
}

# 🔄 Actualizar configuración automáticamente
Write-Host ""
Write-Host "🔄 Actualizando configuración automáticamente..." -ForegroundColor Cyan

try {
    # Ejecutar el script de actualización
    node update-ngrok-config.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Configuración actualizada exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Hubo problemas actualizando la configuración" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Error ejecutando script de actualización: $_" -ForegroundColor Yellow
}

Write-Host ""

# 📋 Mostrar información del túnel
try {
    $tunnels = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
    $httpTunnel = $tunnels.tunnels | Where-Object { $_.config.addr -eq "http://localhost:$Port" -and $_.proto -eq "https" }
    
    if ($httpTunnel) {
        Write-Host "🎉 ¡ngrok configurado exitosamente!" -ForegroundColor BrightGreen
        Write-Host ""
        Write-Host "📋 Información del túnel:" -ForegroundColor Cyan
        Write-Host "   🌐 URL Pública: $($httpTunnel.public_url)" -ForegroundColor Green
        Write-Host "   🔧 URL Backend: $($httpTunnel.public_url -replace '3000', '5000')" -ForegroundColor Green
        Write-Host "   💳 Webhook URL: $($httpTunnel.public_url)/api/webhooks/mercadopago" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Interfaz web de ngrok: http://localhost:4040" -ForegroundColor Blue
        Write-Host ""
        Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
        Write-Host "   1. Reinicia el servidor backend para aplicar cambios de CORS" -ForegroundColor Yellow
        Write-Host "   2. La URL cambiará cada vez que reinicies ngrok" -ForegroundColor Yellow
        Write-Host "   3. Ejecuta este script cada vez que reinicies ngrok" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🛑 Para detener ngrok, presiona Ctrl+C" -ForegroundColor Red
    } else {
        Write-Host "⚠️  No se encontró túnel HTTP para el puerto $Port" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo obtener información del túnel: $_" -ForegroundColor Yellow
}

# 🔄 Función para actualizar configuración cuando se detecten cambios
function UpdateConfigOnChange {
    param([string]$previousUrl)
    
    try {
        $tunnels = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
        $httpTunnel = $tunnels.tunnels | Where-Object { $_.config.addr -eq "http://localhost:$Port" -and $_.proto -eq "https" }
        
        if ($httpTunnel -and $httpTunnel.public_url -ne $previousUrl) {
            Write-Host ""
            Write-Host "🔄 URL de ngrok cambió, actualizando configuración..." -ForegroundColor Cyan
            node update-ngrok-config.js
            return $httpTunnel.public_url
        }
    } catch {
        # Ignorar errores de monitoreo
    }
    
    return $previousUrl
}

# 🎯 Mantener el script corriendo y monitorear cambios
$currentUrl = ""
try {
    while ($true) {
        $currentUrl = UpdateConfigOnChange -previousUrl $currentUrl
        Start-Sleep -Seconds 10
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Deteniendo ngrok..." -ForegroundColor Red
    $ngrokProcess.Kill()
    Write-Host "✅ ngrok detenido" -ForegroundColor Green
}
