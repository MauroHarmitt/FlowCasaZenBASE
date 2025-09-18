import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem } from '../contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  onProceedToCheckout 
}) => {
  const { state, removeFromCart, clearCart } = useCart();

  // 🔙 MANEJAR BOTÓN ATRÁS DEL NAVEGADOR CUANDO EL SIDEBAR ESTÁ ABIERTO
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = () => {
      onClose();
    };

    // Agregar una entrada al historial para poder detectar el botón atrás
    window.history.pushState({ page: 'cart-sidebar' }, '', window.location.href);
    
    // Escuchar el evento popstate (botón atrás del navegador)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
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
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-zen-600 to-sage-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Mi Carrito</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-white hover:text-zen-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-zen-100 mt-1">
                {state.itemCount} {state.itemCount === 1 ? 'clase' : 'clases'} en el carrito
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🛒</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-600">Agrega algunas clases para comenzar tu transformación</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item: CartItem, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex items-start space-x-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.category} • {item.difficulty}
                          </p>
                          <p className="text-sm font-bold text-zen-600 mt-2">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t bg-gray-50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-zen-600">
                    {formatPrice(state.total, state.items[0]?.currency || 'USD')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onProceedToCheckout}
                    className="w-full py-3 bg-gradient-to-r from-zen-600 to-sage-600 text-white rounded-xl font-semibold hover:from-zen-700 hover:to-sage-700 transition-all duration-200 shadow-lg"
                  >
                    Proceder al pago
                  </motion.button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
