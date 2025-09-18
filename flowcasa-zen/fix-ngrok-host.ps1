# Script para solucionar el error "Invalid Host header" con ngrok

Write-Host "Solucionando error 'Invalid Host header' para ngrok..." -ForegroundColor Cyan

# Crear archivo .env.local
$envLocalContent = @"
# Configuracion para desarrollo con ngrok
DANGEROUSLY_DISABLE_HOST_CHECK=true
GENERATE_SOURCEMAP=false
"@

Set-Content ".env.local" $envLocalContent -NoNewline
Write-Host "Archivo .env.local creado" -ForegroundColor Green

# Verificar si existe webpack.config.js y crear uno si no existe
if (-not (Test-Path "webpack.config.js")) {
    Write-Host "Creando webpack.config.js para deshabilitar host check..." -ForegroundColor Yellow
    
    $webpackConfig = @"
const path = require('path');

module.exports = {
  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 3000,
    disableHostCheck: true,
  },
};
"@
    
    Set-Content "webpack.config.js" $webpackConfig -NoNewline
    Write-Host "webpack.config.js creado" -ForegroundColor Green
}

# Actualizar package.json para incluir la configuracion
Write-Host "Actualizando package.json..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

# Agregar configuracion de devServer si no existe
if (-not $packageJson.devServer) {
    $packageJson | Add-Member -MemberType NoteProperty -Name "devServer" -Value @{
        allowedHosts = "all"
        host = "0.0.0.0"
        port = 3000
        disableHostCheck = $true
    }
}

# Convertir de vuelta a JSON y guardar
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -NoNewline
Write-Host "package.json actualizado" -ForegroundColor Green

Write-Host ""
Write-Host "Solucion aplicada!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "1. Deten el servidor React (Ctrl+C)" -ForegroundColor Yellow
Write-Host "2. Reinicia el servidor React:" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor White
Write-Host "3. Luego prueba el link de ngrok nuevamente" -ForegroundColor Yellow
Write-Host ""
Write-Host "El error 'Invalid Host header' deberia estar solucionado" -ForegroundColor Green
