# 🌐 SCRIPT COMPLETO: GODADDY → CLOUDFLARE → UBUNTU → FLOWCASZEN
# Automatiza todo el proceso de configuración

param(
    [string]$ServerIP = "",
    [string]$ServerUser = "ubuntu",
    [string]$MongoDBUri = "",
    [switch]$SkipServerSetup,
    [switch]$BuildOnly
)

Write-Host "🌐 FLOWCASA ZEN - CONFIGURACIÓN COMPLETA CON CLOUDFLARE" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Green
Write-Host ""

# Colores
$Green = "Green"
$Yellow = "Yellow" 
$Red = "Red"
$Blue = "Blue"
$Cyan = "Cyan"

function Write-Status($message) {
    Write-Host "✅ $message" -ForegroundColor $Green
}

function Write-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor $Yellow
}

function Write-Error($message) {
    Write-Host "❌ $message" -ForegroundColor $Red
}

function Write-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor $Blue
}

function Write-Step($message) {
    Write-Host "🔄 $message" -ForegroundColor $Cyan
}

# Verificar dependencias
Write-Step "Verificando dependencias..."

if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js no está instalado. Instala Node.js primero."
    exit 1
}

if (-not (Get-Command "ssh" -ErrorAction SilentlyContinue)) {
    Write-Error "SSH no está disponible. Instala OpenSSH o usa WSL."
    exit 1
}

Write-Status "Dependencias verificadas"

# PASO 1: Configurar aplicación local
Write-Host ""
Write-Host "📦 PASO 1: CONFIGURANDO APLICACIÓN LOCAL" -ForegroundColor $Cyan
Write-Host "========================================" -ForegroundColor $Cyan

Write-Step "Instalando dependencias..."
try {
    npm run install:all
    Write-Status "Dependencias instaladas"
} catch {
    Write-Error "Error instalando dependencias: $($_.Exception.Message)"
    exit 1
}

Write-Step "Configurando para producción..."
try {
    node setup-production.js
    Write-Status "Configuración de producción completada"
} catch {
    Write-Error "Error en configuración: $($_.Exception.Message)"
    exit 1
}

if ($MongoDBUri -ne "") {
    Write-Step "Actualizando MongoDB URI..."
    $envContent = Get-Content "env.production" -Raw
    $envContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=$MongoDBUri"
    Set-Content "env.production" $envContent
    Write-Status "MongoDB URI actualizado"
}

Write-Step "Creando build de producción..."
try {
    npm run build
    Write-Status "Build completado"
} catch {
    Write-Error "Error creando build: $($_.Exception.Message)"
    exit 1
}

if ($BuildOnly) {
    Write-Host ""
    Write-Status "Build completado. Archivos listos en carpeta 'build/'"
    Write-Info "Puedes subir manualmente a tu servidor o continuar con la configuración automática."
    exit 0
}

# PASO 2: Configurar servidor (si se proporcionó IP)
if ($ServerIP -ne "") {
    Write-Host ""
    Write-Host "🖥️  PASO 2: CONFIGURANDO SERVIDOR UBUNTU" -ForegroundColor $Cyan
    Write-Host "=========================================" -ForegroundColor $Cyan

    if (-not $SkipServerSetup) {
        Write-Step "Copiando script de configuración al servidor..."
        
        # Copiar script de configuración
        try {
            scp setup-ubuntu-server.sh ${ServerUser}@${ServerIP}:/home/${ServerUser}/
            Write-Status "Script copiado al servidor"
        } catch {
            Write-Error "Error copiando script: $($_.Exception.Message)"
            Write-Info "Asegúrate de que SSH esté configurado correctamente"
            exit 1
        }

        Write-Step "Ejecutando configuración del servidor..."
        Write-Warning "Esto puede tomar varios minutos..."
        
        try {
            ssh ${ServerUser}@${ServerIP} "chmod +x setup-ubuntu-server.sh && ./setup-ubuntu-server.sh"
            Write-Status "Configuración del servidor completada"
        } catch {
            Write-Error "Error configurando servidor: $($_.Exception.Message)"
            Write-Info "Puedes ejecutar manualmente: ssh ${ServerUser}@${ServerIP} './setup-ubuntu-server.sh'"
        }
    }

    Write-Step "Subiendo aplicación al servidor..."
    
    # Crear archivo temporal con comandos de despliegue
    $deployScript = @"
#!/bin/bash
set -e

echo "🚀 DESPLEGANDO FLOWCASA ZEN AL SERVIDOR..."

# Crear directorio si no existe
sudo mkdir -p /var/www/flowcasazen
sudo chown \$USER:\$USER /var/www/flowcasazen

# Limpiar directorio anterior
rm -rf /var/www/flowcasazen/*

# Crear estructura básica
mkdir -p /var/www/flowcasazen/server
mkdir -p /var/www/flowcasazen/build

echo "✅ Estructura de directorios creada"
"@

    $deployScript | Out-File -FilePath "deploy-temp.sh" -Encoding UTF8

    try {
        scp deploy-temp.sh ${ServerUser}@${ServerIP}:/home/${ServerUser}/
        ssh ${ServerUser}@${ServerIP} "chmod +x deploy-temp.sh && ./deploy-temp.sh"
        Write-Status "Estructura de directorios creada en el servidor"
    } catch {
        Write-Error "Error creando estructura en servidor: $($_.Exception.Message)"
    }

    # Subir archivos de la aplicación
    Write-Step "Subiendo archivos de la aplicación..."
    
    try {
        # Subir build
        scp -r build/* ${ServerUser}@${ServerIP}:/var/www/flowcasazen/build/
        
        # Subir servidor
        scp -r server/* ${ServerUser}@${ServerIP}:/var/www/flowcasazen/server/
        
        # Subir archivos de configuración
        scp package*.json ${ServerUser}@${ServerIP}:/var/www/flowcasazen/
        scp env.production ${ServerUser}@${ServerIP}:/var/www/flowcasazen/.env
        
        Write-Status "Archivos subidos al servidor"
    } catch {
        Write-Error "Error subiendo archivos: $($_.Exception.Message)"
        Write-Info "Puedes subir manualmente usando SCP o SFTP"
    }

    Write-Step "Instalando dependencias en el servidor..."
    
    $installScript = @"
#!/bin/bash
set -e

cd /var/www/flowcasazen

echo "📦 Instalando dependencias del servidor..."
cd server && npm install && cd ..

echo "🔧 Configurando permisos..."
sudo chown -R www-data:www-data /var/www/flowcasazen/build
sudo chmod -R 755 /var/www/flowcasazen

echo "🚀 Iniciando aplicación con PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Aplicación iniciada"
pm2 status
"@

    $installScript | Out-File -FilePath "install-temp.sh" -Encoding UTF8

    try {
        scp install-temp.sh ${ServerUser}@${ServerIP}:/home/${ServerUser}/
        ssh ${ServerUser}@${ServerIP} "chmod +x install-temp.sh && ./install-temp.sh"
        Write-Status "Aplicación instalada y ejecutándose en el servidor"
    } catch {
        Write-Error "Error instalando en servidor: $($_.Exception.Message)"
        Write-Info "Puedes ejecutar manualmente los comandos de instalación"
    }

    # Limpiar archivos temporales
    Remove-Item "deploy-temp.sh" -ErrorAction SilentlyContinue
    Remove-Item "install-temp.sh" -ErrorAction SilentlyContinue

    Write-Status "Servidor configurado y aplicación desplegada"
}

# PASO 3: Instrucciones para Cloudflare
Write-Host ""
Write-Host "🌐 PASO 3: CONFIGURACIÓN DE CLOUDFLARE" -ForegroundColor $Cyan
Write-Host "=====================================" -ForegroundColor $Cyan

Write-Info "INSTRUCCIONES PARA CLOUDFLARE:"
Write-Host ""
Write-Host "1. 🌐 CREAR CUENTA CLOUDFLARE:" -ForegroundColor $Yellow
Write-Host "   - Ve a: https://cloudflare.com"
Write-Host "   - Crea una cuenta gratuita"
Write-Host "   - Verifica tu email"
Write-Host ""

Write-Host "2. 🔗 AGREGAR DOMINIO:" -ForegroundColor $Yellow
Write-Host "   - Haz clic en 'Add a Site'"
Write-Host "   - Ingresa: flowcasazen.com"
Write-Host "   - Selecciona plan FREE"
Write-Host ""

Write-Host "3. 📋 CONFIGURAR DNS:" -ForegroundColor $Yellow
if ($ServerIP -ne "") {
    Write-Host "   - Agrega estos registros DNS:"
    Write-Host "     Type: A, Name: @, Content: $ServerIP, Proxy: ON"
    Write-Host "     Type: A, Name: www, Content: $ServerIP, Proxy: ON"
} else {
    Write-Host "   - Agrega registros DNS apuntando a la IP de tu servidor"
}
Write-Host ""

Write-Host "4. 🔄 CAMBIAR NAMESERVERS:" -ForegroundColor $Yellow
Write-Host "   - Cloudflare te dará 2 nameservers"
Write-Host "   - Ve a GoDaddy > DNS > Nameservers"
Write-Host "   - Cambia a los nameservers de Cloudflare"
Write-Host ""

Write-Host "5. 🔒 CONFIGURAR SSL:" -ForegroundColor $Yellow
Write-Host "   - En Cloudflare: SSL/TLS > Overview"
Write-Host "   - Selecciona 'Full (strict)' mode"
Write-Host "   - En tu servidor ejecuta:"
Write-Host "     sudo certbot --nginx -d flowcasazen.com -d www.flowcasazen.com"
Write-Host ""

# Mostrar información importante
Write-Host ""
Write-Host "📊 INFORMACIÓN IMPORTANTE" -ForegroundColor $Cyan
Write-Host "=========================" -ForegroundColor $Cyan

if ($ServerIP -ne "") {
    Write-Info "IP del servidor: $ServerIP"
    Write-Info "Usuario SSH: $ServerUser"
}
Write-Info "Aplicación desplegada en: /var/www/flowcasazen"
Write-Info "Configuración Nginx: /etc/nginx/sites-available/flowcasazen.com"
Write-Info "Logs: /var/log/nginx/ y pm2 logs"
Write-Host ""

Write-Host "🔧 COMANDOS ÚTILES PARA EL SERVIDOR:" -ForegroundColor $Yellow
Write-Host "pm2 status                    # Ver estado de la aplicación"
Write-Host "pm2 logs flowcasa-zen-api     # Ver logs de la aplicación"
Write-Host "sudo systemctl status nginx   # Ver estado de Nginx"
Write-Host "sudo nginx -t                 # Verificar configuración Nginx"
Write-Host "sudo systemctl reload nginx   # Recargar Nginx"
Write-Host ""

Write-Host "📖 DOCUMENTACIÓN:" -ForegroundColor $Yellow
Write-Host "- Guía completa: CLOUDFLARE_SETUP_GUIDE.md"
Write-Host "- Configuración servidor: setup-ubuntu-server.sh"
Write-Host ""

Write-Host "✅ CONFIGURACIÓN COMPLETADA" -ForegroundColor $Green
Write-Host "===========================" -ForegroundColor $Green
Write-Host ""
Write-Info "Próximos pasos:"
Write-Host "1. Configura Cloudflare siguiendo las instrucciones arriba"
Write-Host "2. Espera la propagación DNS (hasta 48 horas)"
Write-Host "3. Tu sitio estará disponible en: https://www.flowcasazen.com"
Write-Host ""
Write-Host "🎉 ¡FlowCasa Zen estará listo para producción!" -ForegroundColor $Green
