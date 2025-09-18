import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClassData, getCurrentUser } from '../services/api';
import { useCart, CartItem } from '../contexts/CartContext';

interface TeacherCardProps {
  pack: ClassData;
  onPurchase: (packId: string) => void;
  onViewDetails: (packId: string) => void;
  onRegister: () => void;
  userEmail?: string;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ pack, onPurchase, onViewDetails, onRegister, userEmail }) => {
  const { addToCart, state } = useCart();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleVideoClick = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

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
    benefits: pack.benefits || [],
    requirements: pack.requirements || [],
    exercises: pack.exercises || [],
  });

  // 🛒 MANEJAR COMPRA
  const handlePurchase = async () => {
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
    
    // También redirigir a SingleCard para mostrar detalles
    onViewDetails(pack._id || pack.title);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Yoga':
        return '🧘‍♀️';
      case 'Fitness':
        return '💪';
      case 'Crossfit':
        return '🏋️‍♂️';
      case 'Malabares':
        return '🎪';
      case 'Artes Marciales':
        return '🥋';
      case 'Pilates':
        return '🤸‍♀️';
      case 'Meditación':
        return '🧘‍♂️';
      default:
        return '🏃‍♀️';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Video Reel Section - 45 segundos */}
      <div 
        className="relative h-56 bg-gray-900 cursor-pointer group flex-shrink-0"
        onClick={handleVideoClick}
        onMouseEnter={() => setIsVideoHovered(true)}
        onMouseLeave={() => setIsVideoHovered(false)}
      >
        {/* Video thumbnail or actual video */}
        <img
          src={pack.thumbnail}
          alt={pack.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with play button */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVideoHovered ? 'bg-opacity-40' : 'bg-opacity-20'
        } flex items-center justify-center`}>
          <div className={`bg-white rounded-full p-4 transition-all duration-300 transform ${
            isVideoHovered ? 'scale-110 shadow-lg' : 'scale-100'
          }`}>
            <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Video duration badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
          45s
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {pack.isPopular && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              🔥 Popular
            </span>
          )}
          {pack.discount && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              -{pack.discount}%
            </span>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-95 text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {getCategoryIcon(pack.category)} {pack.category}
          </span>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Información del profesor */}
        <div className="flex items-center mb-4 flex-shrink-0">
          {/* Avatar del profesor con fallback robusto */}
          {pack.teacher.avatar && pack.teacher.avatar !== '' ? (
            <img
              src={pack.teacher.avatar}
              alt={pack.teacher.name}
              className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-gray-200"
              onError={(e) => {
                console.log('Error loading avatar:', pack.teacher.avatar);
                // Ocultar la imagen y mostrar el fallback
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback: Avatar con inicial */}
          <div 
            className="w-14 h-14 rounded-full mr-4 border-2 border-gray-200 flex items-center justify-center text-white font-bold text-lg"
            style={{
              backgroundColor: '#6366f1',
              display: pack.teacher.avatar && pack.teacher.avatar !== '' ? 'none' : 'flex'
            }}
          >
            {pack.teacher.name ? pack.teacher.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-lg truncate">{pack.teacher.name}</h4>
            <p className="text-sm text-zen-600 font-medium mb-1 truncate">{pack.category} • {pack.teacher.country}</p>
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                {renderStars(pack.teacher.rating)}
                <span className="ml-1 text-sm font-medium text-gray-700">{pack.teacher.rating}</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="ml-2 text-sm text-gray-500">{pack.teacher.students} estudiantes</span>
            </div>
          </div>
        </div>

        {/* Título del servicio/clase */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">{pack.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {showFullDescription ? pack.description : `${pack.description.substring(0, 100)}...`}
            {pack.description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-zen-600 hover:text-zen-700 font-medium ml-1 transition-colors"
              >
                {showFullDescription ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </p>
        </div>

        {/* Información del pack */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
              ⏱️ {pack.duration}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack.difficulty)}`}>
              {pack.difficulty}
            </span>
          </div>
        </div>

        {/* Beneficios destacados */}
        <div className="mb-6 flex-grow">
          <div className="flex flex-wrap gap-2">
            {pack.benefits.slice(0, 2).map((benefit, index) => (
              <span key={index} className="bg-sage-100 text-sage-800 px-3 py-1 rounded-full text-xs font-medium">
                ✓ {benefit}
              </span>
            ))}
            {pack.benefits.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{pack.benefits.length - 2} más
              </span>
            )}
          </div>
        </div>

        {/* Precio y botones - Siempre en la parte inferior */}
        <div className="border-t pt-4 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {pack.discount ? (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-zen-600">
                    {formatPrice(pack.price * (1 - pack.discount / 100), pack.currency)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(pack.price, pack.currency)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-zen-600">
                  {formatPrice(pack.price, pack.currency)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails(pack._id || pack.title)}
              className="flex-1 px-4 py-3 border border-zen-300 text-zen-700 rounded-lg hover:bg-zen-50 transition-colors text-sm font-medium"
            >
              Ver más
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePurchase}
              disabled={isAddingToCart}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium font-semibold transition-all duration-200 ${
                isAddingToCart
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : getCurrentUser()
                    ? 'bg-zen-600 text-white hover:bg-zen-700 shadow-lg hover:shadow-xl'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Agregando...</span>
                </div>
              ) : getCurrentUser() ? (
                'Comprar'
              ) : (
                'Iniciar Sesión para Comprar'
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de video - Reel de 45 segundos */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-5xl w-full max-h-[95vh] shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{pack.title}</h3>
                <p className="text-sm text-gray-600">Reel de 45 segundos • {pack.teacher.name}</p>
              </div>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="relative bg-black rounded-lg overflow-hidden mb-6">
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[50vh]"
                  poster={pack.thumbnail}
                >
                  <source src={pack.reelUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  45 segundos
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Descripción del ejercicio</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {pack.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      ⏱️ {pack.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack.difficulty)}`}>
                      {pack.difficulty}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ejercicios incluidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {pack.exercises.map((exercise, index) => (
                      <span key={index} className="bg-zen-100 text-zen-800 px-3 py-1 rounded-full text-xs font-medium">
                        {exercise}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Beneficios principales</h5>
                    <div className="flex flex-wrap gap-1">
                      {pack.benefits.slice(0, 3).map((benefit, index) => (
                        <span key={index} className="bg-sage-100 text-sage-800 px-2 py-1 rounded-full text-xs">
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherCard;
