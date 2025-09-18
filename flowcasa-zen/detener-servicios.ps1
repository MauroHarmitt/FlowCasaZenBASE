# 🛑 SCRIPT PARA DETENER TODOS LOS SERVICIOS

Write-Host "🛑 Deteniendo servicios de FlowCasa Zen..." -ForegroundColor BrightRed
Write-Host ""

# Función para detener procesos en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($processes) {
            $processes | ForEach-Object {
                $processId = $_.OwningProcess
                if ($processId) {
                    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($process) {
                        Write-Host "   Deteniendo proceso $processId ($($process.ProcessName)) en puerto $Port" -ForegroundColor Yellow
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    }
                }
            }
        }
    } catch {
        # Ignorar errores
    }
}

# Detener servicios por puerto
$ports = @(
    @{Port=3000; Name="Frontend React"},
    @{Port=5000; Name="Backend API"},
    @{Port=5001; Name="Servidor MercadoPago"},
    @{Port=4040; Name="Ngrok"}
)

foreach ($service in $ports) {
    Write-Host "🛑 Deteniendo $($service.Name) (puerto $($service.Port))..." -ForegroundColor Cyan
    Stop-ProcessOnPort $service.Port
    Start-Sleep -Seconds 1
}

# Detener procesos de Node.js relacionados
Write-Host "🛑 Deteniendo procesos de Node.js..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   Deteniendo proceso Node.js $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "✅ Servicios detenidos" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Para verificar que todos los servicios estén detenidos:" -ForegroundColor Yellow
Write-Host "   node verificar-puertos.js" -ForegroundColor White
