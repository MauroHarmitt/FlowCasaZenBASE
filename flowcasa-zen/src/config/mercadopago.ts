// 💳 CONFIGURACIÓN DE MERCADO PAGO
export const MERCADOPAGO_CONFIG = {
  // Credenciales públicas (seguras para el frontend) - MODO SANDBOX
  PUBLIC_KEY: process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY || 'TEST-679639fa-4d9d-484c-b251-daa49396562f',
  
  // URLs de la aplicación
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'https://9a3ed24db3bc.ngrok-free.app',
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'https://9a3ed24db3bc.ngrok-free.app',
  
  // Configuración del SDK
  SDK_URL: 'https://sdk.mercadopago.com/js/v2',
  
  // URLs de retorno
  SUCCESS_URL: '/payment/success',
  FAILURE_URL: '/payment/failure',
  PENDING_URL: '/payment/pending',
};

// 🎯 FUNCIÓN PARA CARGAR EL SDK DE MERCADO PAGO
export const loadMercadoPagoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar si ya está cargado
    if (window.MercadoPago) {
      resolve();
      return;
    }

    // Crear script tag
    const script = document.createElement('script');
    script.src = MERCADOPAGO_CONFIG.SDK_URL;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ SDK de Mercado Pago cargado exitosamente');
      resolve();
    };
    
    script.onerror = () => {
      console.error('❌ Error cargando SDK de Mercado Pago');
      reject(new Error('Error cargando SDK de Mercado Pago'));
    };
    
    document.head.appendChild(script);
  });
};

// 🎯 FUNCIÓN PARA INICIALIZAR MERCADO PAGO
export const initializeMercadoPago = () => {
  if (!window.MercadoPago) {
    throw new Error('SDK de Mercado Pago no está cargado');
  }
  
  if (!MERCADOPAGO_CONFIG.PUBLIC_KEY) {
    throw new Error('Clave pública de MercadoPago no configurada');
  }
  
  try {
    const mp = new window.MercadoPago(MERCADOPAGO_CONFIG.PUBLIC_KEY);
    console.log('✅ MercadoPago inicializado con clave:', MERCADOPAGO_CONFIG.PUBLIC_KEY.substring(0, 10) + '...');
    return mp;
  } catch (error) {
    console.error('❌ Error inicializando MercadoPago:', error);
    throw error;
  }
};

// 🎯 TIPOS PARA TYPESCRIPT
declare global {
  interface Window {
    MercadoPago: any;
  }
}