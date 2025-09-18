# 🎯 SCRIPT MAESTRO PARA GESTIONAR SERVICIOS DE FLOWCASA ZEN

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("iniciar", "detener", "verificar", "reiniciar", "estado")]
    [string]$Accion = "estado"
)

# 🎨 Colores para la consola
$Host.UI.RawUI.ForegroundColor = "White"

function Show-Header {
    Write-Host ""
    Write-Host "🎯 GESTOR DE SERVICIOS FLOWCASA ZEN" -ForegroundColor BrightCyan
    Write-Host "=================================" -ForegroundColor BrightCyan
    Write-Host ""
}

function Show-Menu {
    Write-Host "📋 OPCIONES DISPONIBLES:" -ForegroundColor Yellow
    Write-Host "   iniciar    - Iniciar todos los servicios" -ForegroundColor White
    Write-Host "   detener    - Detener todos los servicios" -ForegroundColor White
    Write-Host "   verificar  - Verificar estado de servicios" -ForegroundColor White
    Write-Host "   reiniciar  - Reiniciar todos los servicios" -ForegroundColor White
    Write-Host "   estado     - Mostrar estado actual (por defecto)" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 USO: .\gestionar-servicios.ps1 -Accion [opcion]" -ForegroundColor Cyan
    Write-Host ""
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

function Show-Status {
    Write-Host "📊 ESTADO ACTUAL DE SERVICIOS:" -ForegroundColor Cyan
    Write-Host ""
    
    $services = @(
        @{Name="Frontend React"; Port=3000; URL="http://localhost:3000"},
        @{Name="Backend API"; Port=5000; URL="http://localhost:5000"},
        @{Name="Servidor MercadoPago"; Port=5001; URL="http://localhost:5001"},
        @{Name="Ngrok Interface"; Port=4040; URL="http://localhost:4040"}
    )
    
    foreach ($service in $services) {
        $isRunning = Test-Port $service.Port
        $status = if ($isRunning) { "✅ FUNCIONANDO" } else { "❌ DETENIDO" }
        $color = if ($isRunning) { "Green" } else { "Red" }
        
        Write-Host "   $($service.Name) (Puerto $($service.Port)): $status" -ForegroundColor $color
        Write-Host "      URL: $($service.URL)" -ForegroundColor White
    }
    
    Write-Host ""
}

function Start-Services {
    Write-Host "🚀 INICIANDO SERVICIOS..." -ForegroundColor BrightGreen
    Write-Host ""
    
    # Detener servicios existentes primero
    Write-Host "🧹 Limpiando puertos..." -ForegroundColor Yellow
    .\detener-servicios.ps1
    Start-Sleep -Seconds 3
    
    # Iniciar servicios
    Write-Host "🔧 Iniciando servicios..." -ForegroundColor Cyan
    .\iniciar-servicios.ps1
    
    Write-Host ""
    Write-Host "⏳ Esperando que los servicios se estabilicen..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Verificar estado
    Write-Host ""
    Show-Status
    
    # Ejecutar verificación completa
    Write-Host "🔍 Ejecutando verificación completa..." -ForegroundColor Cyan
    node verificar-puertos.js
}

function Stop-Services {
    Write-Host "🛑 DETENIENDO SERVICIOS..." -ForegroundColor BrightRed
    Write-Host ""
    
    .\detener-servicios.ps1
    
    Write-Host ""
    Write-Host "⏳ Esperando que los servicios se detengan..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    Show-Status
}

function Restart-Services {
    Write-Host "🔄 REINICIANDO SERVICIOS..." -ForegroundColor BrightYellow
    Write-Host ""
    
    Stop-Services
    Start-Sleep -Seconds 2
    Start-Services
}

function Verify-Services {
    Write-Host "🔍 VERIFICANDO SERVICIOS..." -ForegroundColor BrightCyan
    Write-Host ""
    
    Show-Status
    node verificar-puertos.js
}

# 🎯 LÓGICA PRINCIPAL
Show-Header

switch ($Accion.ToLower()) {
    "iniciar" {
        Start-Services
    }
    "detener" {
        Stop-Services
    }
    "verificar" {
        Verify-Services
    }
    "reiniciar" {
        Restart-Services
    }
    "estado" {
        Show-Status
        Write-Host "💡 Para ver más opciones, ejecuta:" -ForegroundColor Yellow
        Write-Host "   .\gestionar-servicios.ps1 -Accion verificar" -ForegroundColor White
    }
    default {
        Show-Menu
        Show-Status
    }
}

Write-Host ""
Write-Host "🎯 Gestión de servicios completada" -ForegroundColor BrightGreen
