import React from 'react';

const PaymentSuccess: React.FC = () => {
  // Obtener parámetros de la URL directamente sin usar React Router
  const urlParams = new URLSearchParams(window.location.search);
  const testMode = urlParams.get('test') === 'true';
  const preferenceId = urlParams.get('preference_id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Ya tienes acceso a la clase.
        </p>
        
        {testMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Modo de Prueba:</strong> Este es un pago simulado para desarrollo.
            </p>
            {preferenceId && (
              <p className="text-yellow-700 text-xs mt-2">
                ID de preferencia: {preferenceId}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-zen-600 text-white py-3 px-6 rounded-lg hover:bg-zen-700 transition-colors font-medium"
          >
            Volver al Inicio
          </button>
          
          <button
            onClick={() => window.location.href = '/student-dashboard'}
            className="w-full border border-zen-600 text-zen-600 py-3 px-6 rounded-lg hover:bg-zen-50 transition-colors font-medium"
          >
            Ir a mi Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
