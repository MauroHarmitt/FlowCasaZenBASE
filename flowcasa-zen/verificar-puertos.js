#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VERIFICACIÓN DE SERVICIOS Y PUERTOS
 * Verifica que todos los servicios estén corriendo correctamente
 */

const http = require('http');
const https = require('https');
const net = require('net');

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

// 📋 Configuración de servicios
const services = [
  {
    name: 'Frontend React',
    port: 3000,
    path: '/',
    expectedStatus: 200,
    description: 'Aplicación React principal'
  },
  {
    name: 'Backend API',
    port: 5000,
    path: '/health',
    expectedStatus: 200,
    description: 'API del servidor backend'
  },
  {
    name: 'Servidor MercadoPago',
    port: 5001,
    path: '/',
    expectedStatus: 200,
    description: 'Servidor independiente de MercadoPago'
  },
  {
    name: 'Ngrok Web Interface',
    port: 4040,
    path: '/api/tunnels',
    expectedStatus: 200,
    description: 'Interfaz web de ngrok'
  }
];

/**
 * 🔍 Verificar si un puerto está abierto
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(2000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, 'localhost');
  });
}

/**
 * 🌐 Hacer solicitud HTTP a un servicio
 */
function makeHttpRequest(host, port, path) {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data.substring(0, 100) // Primeros 100 caracteres
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

/**
 * 🔍 Verificar un servicio completo
 */
async function checkService(service) {
  log(`\n🔍 Verificando ${service.name}...`, 'cyan');
  
  // Verificar puerto
  const portOpen = await checkPort(service.port);
  
  if (!portOpen) {
    log(`❌ Puerto ${service.port} cerrado`, 'red');
    return {
      name: service.name,
      port: service.port,
      portStatus: 'CERRADO',
      httpStatus: 'N/A',
      success: false,
      error: 'Puerto no disponible'
    };
  }
  
  log(`✅ Puerto ${service.port} abierto`, 'green');
  
  // Verificar respuesta HTTP
  const httpResponse = await makeHttpRequest('localhost', service.port, service.path);
  
  if (httpResponse.success) {
    log(`✅ HTTP ${httpResponse.status} - Servicio respondiendo`, 'green');
  } else {
    log(`❌ HTTP ${httpResponse.status} - ${httpResponse.error || 'Error en respuesta'}`, 'red');
  }
  
  return {
    name: service.name,
    port: service.port,
    portStatus: 'ABIERTO',
    httpStatus: httpResponse.status,
    success: httpResponse.success,
    error: httpResponse.error || null,
    description: service.description
  };
}

/**
 * 📊 Mostrar reporte final
 */
function showReport(results) {
  log('\n' + '='.repeat(80), 'bright');
  log('📊 REPORTE DE VERIFICACIÓN DE SERVICIOS', 'bright');
  log('='.repeat(80), 'bright');
  
  let allServicesOk = true;
  
  results.forEach((result) => {
    const statusIcon = result.success ? '✅' : '❌';
    const statusColor = result.success ? 'green' : 'red';
    
    log(`\n${statusIcon} ${result.name}`, statusColor);
    log(`   Puerto: ${result.port}`, 'white');
    log(`   Estado del puerto: ${result.portStatus}`, result.portStatus === 'ABIERTO' ? 'green' : 'red');
    log(`   Respuesta HTTP: ${result.httpStatus}`, result.success ? 'green' : 'red');
    log(`   Descripción: ${result.description}`, 'white');
    
    if (result.error) {
      log(`   Error: ${result.error}`, 'red');
    }
    
    if (!result.success) {
      allServicesOk = false;
    }
  });
  
  log('\n' + '='.repeat(80), 'bright');
  
  if (allServicesOk) {
    log('🎉 ¡TODOS LOS SERVICIOS ESTÁN FUNCIONANDO CORRECTAMENTE!', 'bright');
    log('✅ Tu aplicación está lista para usar con ngrok', 'green');
  } else {
    log('⚠️  ALGUNOS SERVICIOS NO ESTÁN FUNCIONANDO', 'yellow');
    log('🔧 Revisa los errores anteriores y reinicia los servicios necesarios', 'yellow');
  }
  
  log('='.repeat(80), 'bright');
}

/**
 * 🚀 Función principal
 */
async function main() {
  log('🚀 Iniciando verificación de servicios...', 'bright');
  log('⏳ Esto puede tomar unos segundos...', 'yellow');
  
  const results = [];
  
  for (const service of services) {
    const result = await checkService(service);
    results.push(result);
  }
  
  showReport(results);
  
  // Mostrar URLs útiles
  log('\n🌐 URLs ÚTILES:', 'cyan');
  log('   Frontend React: http://localhost:3000', 'white');
  log('   Backend API: http://localhost:5000', 'white');
  log('   MercadoPago: http://localhost:5001', 'white');
  log('   Ngrok Interface: http://localhost:4040', 'white');
  
  // Mostrar comandos útiles
  log('\n🔧 COMANDOS ÚTILES:', 'cyan');
  log('   Iniciar Frontend: npm start', 'white');
  log('   Iniciar Backend: cd server && npm start', 'white');
  log('   Iniciar MercadoPago: cd mercadopago-solucion-main && npm start', 'white');
  log('   Iniciar ngrok: ngrok http 3000', 'white');
  log('   Iniciar todo: npm run dev', 'white');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch((error) => {
    log(`❌ Error en la verificación: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  checkService,
  checkPort,
  makeHttpRequest,
  showReport,
  main
};
