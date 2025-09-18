import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 💳 TIPOS DE MÉTODOS DE PAGO
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  available: boolean;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodSelect: (method: PaymentMethod) => void;
  total: number;
  currency: string;
  itemCount: number;
}

// 🎨 MÉTODOS DE PAGO DISPONIBLES
const paymentMethods: PaymentMethod[] = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Paga con tu cuenta de Mercado Pago',
    icon: '💳',
    color: 'from-blue-500 to-blue-600',
    available: true,
  },
  {
    id: 'lemon',
    name: 'Lemon',
    description: 'Paga con tu billetera digital Lemon',
    icon: '🍋',
    color: 'from-yellow-400 to-yellow-500',
    available: true,
  },
  {
    id: 'visa-mastercard',
    name: 'Visa / Mastercard',
    description: 'Paga con tu tarjeta de crédito o débito',
    icon: '💎',
    color: 'from-purple-500 to-purple-600',
    available: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga con tu cuenta de PayPal',
    icon: '🅿️',
    color: 'from-indigo-500 to-indigo-600',
    available: true,
  },
];

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentMethodSelect,
  total,
  currency,
  itemCount,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔙 MANEJAR BOTÓN ATRÁS DEL NAVEGADOR CUANDO EL MODAL ESTÁ ABIERTO
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    // Agregar una entrada al historial para poder detectar el botón atrás
    window.history.pushState({ page: 'payment-modal' }, '', window.location.href);
    
    // Escuchar el evento popstate (botón atrás del navegador)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleProceedToPayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    onPaymentMethodSelect(selectedMethod);
  };

  const handleClose = () => {
    setSelectedMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-zen-600 to-sage-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Selecciona tu método de pago</h2>
                    <p className="text-zen-100 mt-1">
                      {itemCount} {itemCount === 1 ? 'clase' : 'clases'} • Total: {currency} {total.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white hover:text-zen-200 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {paymentMethods.map((method, index) => (
                    <motion.button
                      key={method.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMethodSelect(method)}
                      disabled={!method.available}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod?.id === method.id
                          ? 'border-zen-500 bg-zen-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center text-white text-xl`}>
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedMethod?.id === method.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-6 h-6 bg-zen-500 rounded-full flex items-center justify-center"
                          >
                            <motion.svg 
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="w-4 h-4 text-white" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          </motion.div>
                        )}
                      </div>
                      {!method.available && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-xl flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">Próximamente</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Selected Method Details */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedMethod.color} flex items-center justify-center text-white text-lg`}>
                        {selectedMethod.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Método seleccionado: {selectedMethod.name}</h4>
                        <p className="text-sm text-gray-600">{selectedMethod.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">
                      Pago 100% seguro y encriptado
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Tus datos están protegidos con encriptación SSL de grado bancario.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between flex-shrink-0 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total a pagar:</span>
                  <span className="text-lg font-bold text-gray-900 ml-2">
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    ← Volver
                  </motion.button>
                  <motion.button
                    whileHover={selectedMethod && !isProcessing ? { 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    } : {}}
                    whileTap={selectedMethod && !isProcessing ? { scale: 0.98 } : {}}
                    onClick={handleProceedToPayment}
                    disabled={!selectedMethod || isProcessing}
                    className={`px-8 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      selectedMethod && !isProcessing
                        ? 'bg-zen-600 text-white hover:bg-zen-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      'Proceder al pago'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
