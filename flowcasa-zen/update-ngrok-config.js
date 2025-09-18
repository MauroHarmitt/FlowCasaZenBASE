#!/usr/bin/env node

/**
 * 🔄 SCRIPT DE ACTUALIZACIÓN AUTOMÁTICA DE NGROK
 * Actualiza automáticamente las URLs de ngrok en el frontend y backend
 * cada vez que se ejecuta un nuevo túnel de ngrok
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🎨 Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// 📁 Rutas de archivos
const paths = {
  frontendApi: path.join(__dirname, 'src', 'services', 'api.ts'),
  mercadopagoConfig: path.join(__dirname, 'mercadopago-solucion-main', 'config.js'),
  backendServer: path.join(__dirname, 'server', 'server.js'),
  envFile: path.join(__dirname, '.env'),
  envExample: path.join(__dirname, 'env.example')
};

/**
 * 🔍 Obtener la URL pública de ngrok
 */
async function getNgrokUrl() {
  try {
    log('🔍 Obteniendo URL de ngrok...', 'cyan');
    
    const response = await axios.get('http://localhost:4040/api/tunnels', {
      timeout: 5000,
      headers: {
        'User-Agent': 'ngrok-config-updater'
      }
    });
    const tunnels = response.data.tunnels;
    
    if (!tunnels || tunnels.length === 0) {
      throw new Error('No se encontraron túneles activos de ngrok');
    }
    
    // Buscar el túnel HTTP (puerto 3000)
    const httpTunnel = tunnels.find(tunnel => 
      tunnel.config.addr === 'http://localhost:3000' && 
      tunnel.proto === 'https'
    );
    
    if (!httpTunnel) {
      throw new Error('No se encontró túnel HTTP para el puerto 3000');
    }
    
    const publicUrl = httpTunnel.public_url;
    log(`✅ URL de ngrok encontrada: ${publicUrl}`, 'green');
    
    return publicUrl;
  } catch (error) {
    log(`❌ Error obteniendo URL de ngrok: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * 🔄 Actualizar archivo de configuración del frontend
 */
async function updateFrontendConfig(ngrokUrl) {
  try {
    log('🔄 Actualizando configuración del frontend...', 'cyan');
    
    const apiFilePath = paths.frontendApi;
    
    if (!fs.existsSync(apiFilePath)) {
      log(`⚠️  Archivo no encontrado: ${apiFilePath}`, 'yellow');
      return;
    }
    
    let content = fs.readFileSync(apiFilePath, 'utf8');
    
    // Actualizar la URL base de la API
    const backendUrl = ngrokUrl.replace('https://', 'https://').replace('3000', '5000');
    
    // Buscar y reemplazar la configuración de API_BASE_URL
    const apiUrlRegex = /const API_BASE_URL = process\.env\.REACT_APP_API_URL \|\| '[^']*';/;
    const newApiUrl = `const API_BASE_URL = process.env.REACT_APP_API_URL || '${backendUrl}';`;
    
    if (apiUrlRegex.test(content)) {
      content = content.replace(apiUrlRegex, newApiUrl);
      log(`✅ API_BASE_URL actualizada a: ${backendUrl}`, 'green');
    } else {
      log('⚠️  No se encontró API_BASE_URL para actualizar', 'yellow');
    }
    
    fs.writeFileSync(apiFilePath, content, 'utf8');
    log('✅ Configuración del frontend actualizada', 'green');
    
  } catch (error) {
    log(`❌ Error actualizando frontend: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * 🔄 Actualizar configuración de MercadoPago
 */
async function updateMercadoPagoConfig(ngrokUrl) {
  try {
    log('🔄 Actualizando configuración de MercadoPago...', 'cyan');
    
    const configFilePath = paths.mercadopagoConfig;
    
    if (!fs.existsSync(configFilePath)) {
      log(`⚠️  Archivo no encontrado: ${configFilePath}`, 'yellow');
      return;
    }
    
    let content = fs.readFileSync(configFilePath, 'utf8');
    
    // Actualizar URLs de webhook y callbacks
    const webhookUrl = `${ngrokUrl}/api/webhooks/mercadopago`;
    const successUrl = `${ngrokUrl}/payment/success`;
    const failureUrl = `${ngrokUrl}/payment/failure`;
    const pendingUrl = `${ngrokUrl}/payment/pending`;
    
    // Actualizar webhook URL
    const webhookRegex = /webhook: process\.env\.WEBHOOK_URL \|\| '[^']*'/;
    const newWebhook = `webhook: process.env.WEBHOOK_URL || '${webhookUrl}'`;
    
    if (webhookRegex.test(content)) {
      content = content.replace(webhookRegex, newWebhook);
      log(`✅ Webhook URL actualizada a: ${webhookUrl}`, 'green');
    }
    
    // Actualizar success URL
    const successRegex = /success: process\.env\.SUCCESS_URL \|\| '[^']*'/;
    const newSuccess = `success: process.env.SUCCESS_URL || '${successUrl}'`;
    
    if (successRegex.test(content)) {
      content = content.replace(successRegex, newSuccess);
      log(`✅ Success URL actualizada a: ${successUrl}`, 'green');
    }
    
    // Actualizar failure URL
    const failureRegex = /failure: process\.env\.FAILURE_URL \|\| '[^']*'/;
    const newFailure = `failure: process.env.FAILURE_URL || '${failureUrl}'`;
    
    if (failureRegex.test(content)) {
      content = content.replace(failureRegex, newFailure);
      log(`✅ Failure URL actualizada a: ${failureUrl}`, 'green');
    }
    
    // Actualizar pending URL
    const pendingRegex = /pending: process\.env\.PENDING_URL \|\| '[^']*'/;
    const newPending = `pending: process.env.PENDING_URL || '${pendingUrl}'`;
    
    if (pendingRegex.test(content)) {
      content = content.replace(pendingRegex, newPending);
      log(`✅ Pending URL actualizada a: ${pendingUrl}`, 'green');
    }
    
    fs.writeFileSync(configFilePath, content, 'utf8');
    log('✅ Configuración de MercadoPago actualizada', 'green');
    
  } catch (error) {
    log(`❌ Error actualizando MercadoPago: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * 🔄 Actualizar archivo .env
 */
async function updateEnvFile(ngrokUrl) {
  try {
    log('🔄 Actualizando archivo .env...', 'cyan');
    
    const envFilePath = paths.envFile;
    const envExamplePath = paths.envExample;
    
    // Crear .env si no existe
    if (!fs.existsSync(envFilePath)) {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envFilePath);
        log('✅ Archivo .env creado desde .env.example', 'green');
      } else {
        fs.writeFileSync(envFilePath, '', 'utf8');
        log('✅ Archivo .env creado', 'green');
      }
    }
    
    let content = fs.readFileSync(envFilePath, 'utf8');
    
    // Variables a actualizar
    const envVars = {
      'REACT_APP_API_URL': ngrokUrl.replace('3000', '5000'),
      'REACT_APP_FRONTEND_URL': ngrokUrl,
      'WEBHOOK_URL': `${ngrokUrl}/api/webhooks/mercadopago`,
      'SUCCESS_URL': `${ngrokUrl}/payment/success`,
      'FAILURE_URL': `${ngrokUrl}/payment/failure`,
      'PENDING_URL': `${ngrokUrl}/payment/pending`
    };
    
    // Actualizar o agregar variables
    for (const [key, value] of Object.entries(envVars)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (regex.test(content)) {
        content = content.replace(regex, newLine);
        log(`✅ ${key} actualizada a: ${value}`, 'green');
      } else {
        content += `\n${newLine}`;
        log(`✅ ${key} agregada: ${value}`, 'green');
      }
    }
    
    fs.writeFileSync(envFilePath, content, 'utf8');
    log('✅ Archivo .env actualizado', 'green');
    
  } catch (error) {
    log(`❌ Error actualizando .env: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * 🔄 Actualizar configuración del backend
 */
async function updateBackendConfig(ngrokUrl) {
  try {
    log('🔄 Actualizando configuración del backend...', 'cyan');
    
    const serverFilePath = paths.backendServer;
    
    if (!fs.existsSync(serverFilePath)) {
      log(`⚠️  Archivo no encontrado: ${serverFilePath}`, 'yellow');
      return;
    }
    
    let content = fs.readFileSync(serverFilePath, 'utf8');
    
    // Actualizar CORS para permitir la nueva URL de ngrok
    const corsRegex = /origin:\s*\[([^\]]*)\]/;
    const match = content.match(corsRegex);
    
    if (match) {
      const origins = match[1];
      if (!origins.includes(ngrokUrl)) {
        const newOrigins = origins + `, '${ngrokUrl}'`;
        content = content.replace(corsRegex, `origin: [${newOrigins}]`);
        log(`✅ CORS actualizado para incluir: ${ngrokUrl}`, 'green');
      }
    }
    
    fs.writeFileSync(serverFilePath, content, 'utf8');
    log('✅ Configuración del backend actualizada', 'green');
    
  } catch (error) {
    log(`❌ Error actualizando backend: ${error.message}`, 'red');
    throw error;
  }
}

/**
 * 🚀 Función principal
 */
async function main() {
  try {
    log('🚀 Iniciando actualización de configuración de ngrok...', 'bright');
    log('', 'reset');
    
    // Obtener URL de ngrok
    const ngrokUrl = await getNgrokUrl();
    log('', 'reset');
    
    // Actualizar configuraciones
    await updateFrontendConfig(ngrokUrl);
    log('', 'reset');
    
    await updateMercadoPagoConfig(ngrokUrl);
    log('', 'reset');
    
    await updateEnvFile(ngrokUrl);
    log('', 'reset');
    
    await updateBackendConfig(ngrokUrl);
    log('', 'reset');
    
    // Mostrar resumen
    log('🎉 ¡Configuración actualizada exitosamente!', 'bright');
    log('', 'reset');
    log('📋 Resumen de cambios:', 'cyan');
    log(`   🌐 Frontend URL: ${ngrokUrl}`, 'green');
    log(`   🔧 Backend URL: ${ngrokUrl.replace('3000', '5000')}`, 'green');
    log(`   💳 Webhook URL: ${ngrokUrl}/api/webhooks/mercadopago`, 'green');
    log('', 'reset');
    log('⚠️  Recuerda reiniciar el servidor backend para aplicar los cambios de CORS', 'yellow');
    log('', 'reset');
    
  } catch (error) {
    log(`❌ Error en la actualización: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  getNgrokUrl,
  updateFrontendConfig,
  updateMercadoPagoConfig,
  updateEnvFile,
  updateBackendConfig,
  main
};
