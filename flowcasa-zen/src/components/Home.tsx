import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingCartIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import TeacherCard from './TeacherCard';
import CartIcon from './CartIcon';
import CartSidebar from './CartSidebar';
import { getClasses, ClassData, getCurrentUser } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { clearSession } from '../utils/sessionManager';

interface HomeProps {
  onLogin: () => void;
  onRegister: () => void;
  userEmail?: string;
  onViewPackDetails?: (packId: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Home: React.FC<HomeProps> = ({ onLogin, onRegister, userEmail, onViewPackDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 🛒 CONTEXTO DEL CARRITO
  const { state: cartState, addToCart } = useCart();
  
  // Verificación de seguridad para cartState
  const safeCartState = cartState || { items: [], total: 0, itemCount: 0 };

  // Verificar si hay un usuario autenticado
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);
        console.log('Usuario actual en Home:', user);
        
        // Si hay un usuario, verificar que el token sea válido
        if (user && user.firstName) {
          const token = localStorage.getItem('flowcasa-zen-token');
          if (!token) {
            console.warn('Usuario encontrado pero sin token, limpiando sesión');
            setCurrentUser(null);
            localStorage.removeItem('flowcasa-zen-session');
          }
        }
      } catch (error) {
        console.error('Error verificando sesión de usuario:', error);
        setCurrentUser(null);
      }
    };

    checkUserSession();
    
    // Escuchar cambios en el localStorage para actualizar el estado
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flowcasa-zen-session' || e.key === 'flowcasa-zen-token') {
        checkUserSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const categories = ['all', 'Yoga', 'Fitness', 'Crossfit', 'Malabares', 'Artes Marciales', 'Pilates', 'Meditación'];
  const difficulties = ['all', 'Principiante', 'Intermedio', 'Avanzado'];
  const sortOptions = [
    { value: 'popular', label: 'Más populares' },
    { value: 'price-low', label: 'Precio: Menor a mayor' },
    { value: 'price-high', label: 'Precio: Mayor a menor' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'rating', label: 'Mejor valorados' }
  ];

  // Cargar clases desde la API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getClasses({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          search: searchTerm || undefined,
          sortBy,
          limit: 50
        });
        setClasses(response.classes);
      } catch (err: any) {
        setError(err.message || 'Error cargando clases');
        console.error('Error cargando clases:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [selectedCategory, selectedDifficulty, searchTerm, sortBy]);

  // Las clases ya vienen filtradas y ordenadas desde la API
  const filteredPacks = classes || [];

  const handlePurchase = (packId: string) => {
    // La lógica de compra ahora se maneja en TeacherCard
    // Este método se mantiene para compatibilidad pero no se usa
    console.log('Comprando pack:', packId);
  };

  const handleViewDetails = (packId: string) => {
    if (onViewPackDetails) {
      onViewPackDetails(packId);
    } else {
      console.log('Viendo detalles del pack:', packId);
      alert('Página de detalles en desarrollo. ¡Pronto estará disponible!');
    }
  };

  // 🚪 FUNCIÓN DE LOGOUT
  const handleLogout = () => {
    const shouldLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    
    if (shouldLogout) {
      try {
        console.log('🚪 Iniciando proceso de logout...');
        
        // Limpiar sesión completa usando el sessionManager
        clearSession();
        
        // Limpiar también manualmente por seguridad
        localStorage.removeItem('flowcasa-zen-session');
        localStorage.removeItem('flowcasa-zen-token');
        localStorage.removeItem('flowcasa-zen-refresh');
        
        // Limpiar cookies manualmente
        document.cookie = 'flowcasa-zen-session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
        document.cookie = 'flowcasa-zen-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
        document.cookie = 'flowcasa-zen-refresh=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
        
        // Actualizar estado local
        setCurrentUser(null);
        
        console.log('✅ Sesión limpiada completamente');
        
        // Mostrar mensaje de confirmación
        alert('Sesión cerrada exitosamente. ¡Gracias por usar FlowCasaZen!');
        
        // Recargar la página para asegurar que todo se actualice
        window.location.reload();
      } catch (error) {
        console.error('❌ Error cerrando sesión:', error);
        // Fallback: limpiar manualmente
        localStorage.removeItem('flowcasa-zen-session');
        localStorage.removeItem('flowcasa-zen-token');
        localStorage.removeItem('flowcasa-zen-refresh');
        setCurrentUser(null);
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Headless UI */}
      <Disclosure
        as="nav"
        className="relative bg-white dark:bg-gray-900 shadow-sm after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200 dark:after:bg-gray-700"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-zen-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>

            {/* Logo and brand */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
            <div className="flex items-center">
                  {/* 🎨 LOGO OFICIAL (FAVICON) */}
                  <img 
                    src="/imgbrowser.png" 
                    alt="FlowCasaZen" 
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
                    onError={(e) => {
                      // Fallback al texto si la imagen no se carga
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  {/* Fallback al texto original */}
                  <h1 className="text-2xl font-bold text-sage-800 hidden">FlowCasaZen</h1>
                  
                  {/* 🏷️ TEXTO DE LA MARCA */}
                  <div className="ml-3">
                    <span className="text-2xl sm:text-3xl md:text-4xl corinthia-bold text-white leading-tight">Yoga&RemoteFitCenter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side items */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Cart Icon with Notification Counter */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-2 text-gray-400 hover:text-gray-900 focus:outline-2 focus:outline-offset-2 focus:outline-zen-500 transition-all duration-200"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View cart</span>
                <ShoppingCartIcon aria-hidden="true" className="size-6" />
                
                {/* 🛒 CONTADOR DE NOTIFICACIONES DEL CARRITO */}
                {safeCartState.itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse shadow-lg border-2 border-white">
                    {safeCartState.itemCount > 99 ? '99+' : safeCartState.itemCount}
                  </span>
                )}
              </button>

              {/* User menu or login/register buttons */}
              {currentUser ? (
                <div className="flex items-center space-x-2 ml-3">
                  {/* User Status with Green Light */}
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="text-xs font-medium text-green-700">Online</span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="relative rounded-full p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-2 focus:outline-offset-2 focus:outline-red-500 transition-all duration-200"
                    title="Cerrar Sesión"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Cerrar sesión</span>
                    <ArrowRightOnRectangleIcon aria-hidden="true" className="size-5" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zen-500">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <div className="w-8 h-8 bg-zen-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </MenuButton>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-green-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-zen-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                      </div>
                          <div>
                          <div className="text-sm font-medium text-gray-900">{currentUser?.firstName || 'Usuario'} {currentUser?.lastName || ''}</div>
                          <div className="text-xs text-gray-500">{currentUser?.email || ''}</div>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">Conectado</span>
                            </div>
                          </div>
                        </div>
                        </div>
                        
                      <MenuItem>
                        <button
                          onClick={() => {
                            if (currentUser?.role === 'admin') {
                              window.location.href = '/admin-dashboard';
                            } else if (currentUser?.role === 'teacher') {
                              window.location.href = '/teacher-dashboard';
                            } else {
                              window.location.href = '/student-dashboard';
                            }
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-zen-50 data-focus:bg-zen-50 data-focus:outline-hidden"
                        >
                          <div className="flex items-center space-x-3">
                            <UserIcon className="w-4 h-4 text-zen-600" />
                          <span>Mi Dashboard</span>
                          </div>
                        </button>
                      </MenuItem>
                        
                      <MenuItem>
                        <button
                          onClick={() => {
                            document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-8')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-zen-50 data-focus:bg-zen-50 data-focus:outline-hidden"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>Explorar Clases</span>
                          </div>
                        </button>
                      </MenuItem>
                        
                      <MenuItem>
                        <button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="block w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-zen-50 data-focus:bg-zen-50 data-focus:outline-hidden"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-4 h-4 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Ir al Inicio</span>
                          </div>
                        </button>
                      </MenuItem>

                      <div className="border-t border-gray-100 my-1"></div>

                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 data-focus:bg-red-50 data-focus:outline-hidden"
                        >
                          <div className="flex items-center space-x-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Cerrar Sesión</span>
                          </div>
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={onLogin}
                    className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium hover:border-blue-400 text-sm"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={onRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 bg-white border-t border-gray-200">
            {currentUser ? (
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-zen-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{currentUser?.firstName || 'Usuario'} {currentUser?.lastName || ''}</div>
                      <div className="text-xs text-gray-500">{currentUser?.email || ''}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Conectado</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Cerrar Sesión"
                  >
                    <ArrowRightOnRectangleIcon className="size-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <button
                  onClick={onLogin}
                  className="block w-full text-left px-3 py-2 text-zen-600 border border-zen-300 rounded-lg hover:bg-zen-50 transition-colors font-medium"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={onRegister}
                  className="block w-full text-left px-3 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors font-medium"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        {/* Imagen de fondo responsive */}
        <picture className="absolute inset-0 w-full h-full">
          {/* Imagen para móviles (2.2MB - más pequeña) */}
          <source 
            media="(max-width: 768px)" 
            srcSet="/generated-image-9f066d80-c099-4594-b9e8-2b16393c3ce1.png"
          />
          {/* Imagen para tablets (2.4MB - mediana) */}
          <source 
            media="(max-width: 1024px)" 
            srcSet="/generated-image-4409945f-1afd-462c-8743-f9c502b0ee2e.png"
          />
          {/* Imagen para desktop (1.5MB - grande pero optimizada) */}
          <img 
            src="/generated-image-cb3888eb-012c-424d-b498-7ffee3d34405.png" 
            alt="Generated yoga background"
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={() => console.log('✅ Imagen responsive cargada correctamente')}
            onError={() => console.log('❌ Error cargando imagen responsive')}
          />
        </picture>
        
        {/* Overlay muy sutil para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/15 via-black/10 to-black/15"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bitcount-grid-double-bold">
            Crea tu propia rutina de ejercicios
          </h2>
          
          {/* 🌍 CONECTAR CON ALUMNOS */}
          <p className="text-xl md:text-2xl mb-6 text-zen-100 max-w-3xl mx-auto leading-relaxed">
            Conéctate con alumnos de todo el mundo y lleva sus entrenamientos al siguiente nivel.
          </p>
          
          {/* 🏃‍♀️ DESCRIPCIÓN DE ENTRENAMIENTOS */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-zen-100 leading-relaxed">
              Accede a tus planes en vivo, graba tus propias rutinas y diseña programas completos para que tus alumnos transformen su bienestar de forma remota, sencilla y sin complicaciones.
            </p>
          </div>
          {!currentUser && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button
                onClick={() => {
                  // Scroll hacia las clases disponibles
                  document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-8')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200"
              >
                Comenzar
              </button>
              <button 
                onClick={onRegister}
                className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Registrarse
              </button>
            </div>
          )}
          {currentUser && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    window.location.href = '/admin-dashboard';
                  } else if (currentUser?.role === 'teacher') {
                    window.location.href = '/teacher-dashboard';
                  } else {
                    window.location.href = '/student-dashboard';
                  }
                }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Ir a mi Dashboard
              </button>
              <button 
                onClick={() => {
                  // Scroll to classes section
                  document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-8')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Explorar Clases
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 border-2 border-red-300 text-red-200 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                title="Cerrar sesión"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-zen-100">Clases disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-zen-100">Profesores expertos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-zen-100">Estudiantes activos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y búsqueda */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar clases, profesores o categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              {/* Categoría */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Dificultad */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              >
                <option value="all">Todas las dificultades</option>
                {difficulties.slice(1).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sección de presentación */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Profesores y Servicios Destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce a nuestros profesores certificados y descubre sus clases especializadas. 
            Cada uno incluye un reel de 45 segundos para que veas exactamente qué aprenderás.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Clases Disponibles ({filteredPacks.length})
            </h3>
            <div className="text-sm text-gray-600">
              {loading ? 'Cargando...' : `Mostrando ${filteredPacks.length} clases`}
            </div>
          </div>
        </div>

        {/* Estados de carga y error */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zen-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando clases...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-red-400 text-8xl mb-6">⚠️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error cargando clases</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Grid de cards mejorado */}
        {!loading && !error && filteredPacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPacks.map((pack) => (
              <TeacherCard
                key={pack._id || pack.title}
                pack={pack}
                onPurchase={handlePurchase}
                onViewDetails={handleViewDetails}
                onRegister={onRegister}
                userEmail={userEmail}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredPacks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No se encontraron clases</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Intenta ajustar tus filtros de búsqueda para encontrar más clases disponibles.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSortBy('popular');
              }}
              className="px-8 py-3 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Call to action */}
        {filteredPacks.length > 0 && !currentUser && (
          <div className="mt-16 text-center bg-gradient-to-r from-zen-50 to-sage-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para comenzar tu transformación?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya están transformando sus vidas con nuestras clases especializadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onRegister}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Registrarse Gratis
              </button>
              <button
                onClick={onLogin}
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
        {filteredPacks.length > 0 && currentUser && (
          <div className="mt-16 text-center bg-gradient-to-r from-zen-50 to-sage-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido de vuelta, {currentUser?.firstName || 'Usuario'}!
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Continúa tu transformación con nuestras clases especializadas. ¡Hay nuevas clases esperándote!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  if (currentUser?.role === 'admin') {
                    window.location.href = '/admin-dashboard';
                  } else if (currentUser?.role === 'teacher') {
                    window.location.href = '/teacher-dashboard';
                  } else {
                    window.location.href = '/student-dashboard';
                  }
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ir a mi Dashboard
              </button>
              <button
                onClick={() => {
                  // Scroll to classes section
                  document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.xl\\:grid-cols-3.gap-8')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explorar Clases
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <strong className="block text-center text-xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              ¿Quieres recibir las últimas noticias de FlowCasaZen?
            </strong>

            <form className="mt-6">
              <div className="relative max-w-lg">
                <label className="sr-only" htmlFor="email"> Email </label>

                <input
                  className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                />

                <button
                  className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Suscribirse
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
            <div className="mx-auto max-w-sm lg:max-w-none">
              <p className="mt-4 text-center text-gray-500 lg:text-left lg:text-lg dark:text-gray-400">
                Tu plataforma de yoga y fitness online. Conecta con los mejores profesores del mundo y transforma tu bienestar desde cualquier lugar.
              </p>

              <div className="mt-6 flex justify-center gap-4 lg:justify-start">
                <a
                  className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only"> Facebook </span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a
                  className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only"> Instagram </span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                <a
                  className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only"> Twitter </span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                    />
                  </svg>
                </a>

                <a
                  className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sr-only"> YouTube </span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3 lg:text-left">
            <div>
                <strong className="font-medium text-gray-900 dark:text-white"> Servicios </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Yoga
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Fitness
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Pilates
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Meditación
                    </a>
                  </li>
              </ul>
            </div>

            <div>
                <strong className="font-medium text-gray-900 dark:text-white"> Nosotros </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Acerca de
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Profesores
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Historia
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Nuestro Equipo
                    </a>
                  </li>
              </ul>
            </div>

            <div>
                <strong className="font-medium text-gray-900 dark:text-white"> Soporte </strong>

                <ul className="mt-6 space-y-1">
                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Preguntas Frecuentes
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Contacto
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-700 transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                    >
                      Chat en Vivo
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-100 pt-8 dark:border-gray-800">
            <p className="text-center text-xs/relaxed text-gray-500 dark:text-gray-400">
              © FlowCasaZen 2024. Todos los derechos reservados.

              <br />

              Desarrollado con
              <a
                href="#"
                className="text-gray-700 underline transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
              >
                React
              </a>
              y
              <a
                href="#"
                className="text-gray-700 underline transition hover:text-gray-700/75 dark:text-white dark:hover:text-white/75"
              >
                Tailwind CSS
              </a>
              .
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          // Aquí se podría implementar la lógica para proceder al checkout
          console.log('Proceder al checkout desde el sidebar');
        }}
      />
    </div>
  );
};

export default Home;
