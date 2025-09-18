import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCart, CartItem } from '../contexts/CartContext';
import PaymentModal, { PaymentMethod } from './PaymentModal';
import { ClassData, getCurrentUser } from '../services/api';
import { loadMercadoPagoSDK, initializeMercadoPago, MERCADOPAGO_CONFIG } from '../config/mercadopago';

// 🎯 INTERFAZ PARA EL PACK DE CLASE
export interface ClassPack {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  difficulty: string;
  duration: string | number;
  instructor?: string;
  image?: string;
  videoUrl?: string;
  benefits: string[];
  requirements: string[];
  exercises: string[];
  rating?: number;
  studentsCount?: number;
  language?: string;
  level?: string;
  teacher?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    students: number;
    country: string;
  };
  thumbnail?: string;
  reelUrl?: string;
  isPopular?: boolean;
  discount?: number;
}

interface SingleCardProps {
  pack: ClassData;
  userEmail?: string;
  onGoBack: () => void;
  onPurchase?: (packId: string) => void;
  onRegister: () => void;
}

const SingleCard: React.FC<SingleCardProps> = ({
  pack,
  userEmail,
  onGoBack,
  onPurchase,
  onRegister,
}) => {
  const { addToCart, state } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // 🔙 MANEJAR BOTÓN ATRÁS DEL NAVEGADOR
  useEffect(() => {
    const handlePopState = () => {
      onGoBack();
    };

    // Agregar una entrada al historial para poder detectar el botón atrás
    window.history.pushState({ page: 'single-card' }, '', window.location.href);
    
    // Escuchar el evento popstate (botón atrás del navegador)
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onGoBack]);

  // 💳 CARGAR SDK DE MERCADO PAGO
  useEffect(() => {
    const loadSDK = async () => {
      try {
        await loadMercadoPagoSDK();
        console.log('✅ SDK de Mercado Pago cargado');
      } catch (error) {
        console.error('❌ Error cargando SDK de Mercado Pago:', error);
      }
    };

    loadSDK();
  }, []);

  // 🛒 CONVERTIR PACK A CART ITEM
  const convertToCartItem = (pack: ClassData): CartItem => ({
    id: pack._id || pack.title,
    title: pack.title,
    description: pack.description,
    price: pack.price,
    currency: pack.currency,
    category: pack.category,
    difficulty: pack.difficulty,
    duration: typeof pack.duration === 'string' ? parseInt(pack.duration) : pack.duration,
    instructor: pack.teacher?.name || 'Instructor',
    image: pack.thumbnail,
    videoUrl: pack.reelUrl,
    benefits: pack.benefits,
    requirements: pack.requirements,
    exercises: pack.exercises,
  });

  // 🛒 AGREGAR AL CARRITO Y REDIRIGIR A MERCADOPAGO
  const handleAddToCart = async () => {
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // Usuario no autenticado - redirigir directamente al registro
      onRegister();
      return;
    }
    
    // Usuario autenticado - proceder con la compra
    setIsAddingToCart(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const cartItem = convertToCartItem(pack);
    addToCart(cartItem);
    
    setIsAddingToCart(false);
    
    // 💳 REDIRIGIR A MERCADOPAGO
    const mercadoPagoUrl = 'https://mpago.la/1c66PJx';
    window.open(mercadoPagoUrl, '_blank');
  };

  // 💳 MANEJAR SELECCIÓN DE MÉTODO DE PAGO
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    console.log('Método de pago seleccionado:', method);
    console.log('Pack a comprar:', pack);
    
    // Verificar si el usuario está autenticado
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      // Usuario no autenticado - mostrar mensaje y cerrar modal
      setShowPaymentModal(false);
      
      const shouldLogin = window.confirm(
        'Para realizar una compra, necesitas estar registrado e iniciar sesión.\n\n¿Te gustaría ir a la página de registro/login?'
      );
      
      if (shouldLogin) {
        // Redirigir al home para mostrar los botones de login/registro
        window.location.href = '/';
      }
      return;
    }
    
    // Usuario autenticado - proceder con el pago
    // Cerrar el modal primero
    setShowPaymentModal(false);
    
    // Si es Mercado Pago, redirigir al link de pago
    if (method.id === 'mercadopago') {
      // Crear preferencia de pago en el backend
      const createMercadoPagoPayment = async () => {
        try {
          const paymentData = {
            title: pack.title,
            price: pack.price,
            currency: pack.currency,
            description: pack.description,
            quantity: 1
          };

          const response = await fetch(`${MERCADOPAGO_CONFIG.BACKEND_URL}/api/payments/mercadopago/create-preference`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
          });

          const result = await response.json();

          if (result.success && result.preference_id) {
            // Validar que tenemos los datos necesarios
            // Forzar uso de sandbox_init_point para modo de pruebas
            let paymentUrl = result.sandbox_init_point;
            
            if (!paymentUrl) {
              console.warn('No se encontró sandbox_init_point, usando init_point como fallback');
              paymentUrl = result.init_point;
              if (!paymentUrl) {
                throw new Error('No se recibió URL de pago de MercadoPago');
              }
              // Usar fallback pero mostrar advertencia
              console.warn('⚠️ Usando init_point en lugar de sandbox_init_point - puede que no esté en modo sandbox');
            } else {
              console.log('✅ Usando sandbox_init_point para modo de pruebas');
            }
            
            // Redirigir directamente a MercadoPago (más confiable que SDK)
            console.log('🔗 Redirigiendo directamente a MercadoPago:', paymentUrl);
            
            // Mostrar mensaje de confirmación
            alert(`Redirigiendo a Mercado Pago para completar la compra de "${pack.title}" por ${pack.currency} ${pack.price.toFixed(2)}`);
            
            // Redirigir directamente
            window.location.href = paymentUrl;
          } else {
            throw new Error(result.message || 'Error creando preferencia de pago');
          }
        } catch (error) {
          console.error('Error creando preferencia de Mercado Pago:', error);
          alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        }
      };

      // Ejecutar la creación del pago
      createMercadoPagoPayment();
      
      // Llamar callback de compra
      if (onPurchase) {
        onPurchase(pack._id || pack.title);
      }
    } else {
      // Para otros métodos de pago, mantener el comportamiento actual
      setTimeout(() => {
        alert(`¡Compra exitosa! Has comprado "${pack.title}" usando ${method.name}.`);
        if (onPurchase) {
          onPurchase(pack._id || pack.title);
        }
      }, 1000);
    }
  };

  // 🎨 OBTENER COLOR SEGÚN DIFICULTAD
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'principiante':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 🎨 OBTENER COLOR SEGÚN CATEGORÍA
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'yoga':
        return 'bg-purple-100 text-purple-800';
      case 'fitness':
        return 'bg-blue-100 text-blue-800';
      case 'pilates':
        return 'bg-pink-100 text-pink-800';
      case 'meditación':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-zen-300 text-zen-600 hover:text-zen-700 hover:bg-zen-50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver a las clases</span>
            </motion.button>
            
            <div className="flex items-center space-x-4">
              {userEmail && (
                <span className="text-sm text-gray-600">
                  Bienvenido, <span className="font-medium">{userEmail}</span>
                </span>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span>{state.itemCount} en carrito</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Video/Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Video/Image Section */}
              <div className="relative aspect-video bg-gray-900">
                {pack.reelUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster={pack.thumbnail}
                  >
                    <source src={pack.reelUrl} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : pack.thumbnail ? (
                  <img
                    src={pack.thumbnail}
                    alt={pack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zen-600 to-sage-600">
                    <div className="text-center text-white">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-lg font-medium">Vista previa de la clase</p>
                    </div>
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-200"
                  >
                    <svg className="w-8 h-8 text-zen-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Class Details */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(pack.category)}`}>
                    {pack.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pack.difficulty)}`}>
                    {pack.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pack.duration} minutos
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{pack.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{pack.description}</p>

                {/* Instructor Info */}
                <div className="flex items-center space-x-3 mb-6">
                  {pack.teacher?.avatar ? (
                    <img
                      src={pack.teacher.avatar}
                      alt={pack.teacher.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-zen-100 rounded-full flex items-center justify-center">
                      <span className="text-zen-600 font-semibold text-lg">
                        {(pack.teacher?.name || 'Instructor').charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">Instructor</p>
                    <p className="text-gray-600">{pack.teacher?.name || 'Instructor'}</p>
                    {pack.teacher?.country && (
                      <p className="text-sm text-gray-500">{pack.teacher.country}</p>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Qué aprenderás?</h3>
                  <ul className="space-y-2">
                    {pack.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
                  <ul className="space-y-2">
                    {pack.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {pack.currency} {pack.price.toFixed(2)}
                </div>
                <p className="text-gray-600">Acceso de por vida</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                    isAddingToCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : getCurrentUser()
                        ? 'bg-gradient-to-r from-zen-600 to-sage-600 text-white hover:from-zen-700 hover:to-sage-700 shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Agregando al carrito...</span>
                    </div>
                  ) : getCurrentUser() ? (
                    'Proceder al pago'
                  ) : (
                    'Iniciar Sesión para Comprar'
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGoBack}
                  className="w-full py-3 px-6 border-2 border-zen-300 text-zen-600 hover:bg-zen-50 hover:border-zen-400 rounded-2xl font-medium transition-all duration-200"
                >
                  Volver a explorar
                </motion.button>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Acceso inmediato</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Disponible en cualquier dispositivo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Certificado de finalización</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">Soporte 24/7</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-800 font-medium">
                    Compra 100% segura
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Garantía de devolución de 30 días
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        total={pack.price}
        currency={pack.currency}
        itemCount={1}
      />
    </div>
  );
};

export default SingleCard;