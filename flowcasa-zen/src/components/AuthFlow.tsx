import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegistrationFlow from './RegistrationFlow';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentInterests from './StudentInterests';
import TeacherTutorial from './TeacherTutorial';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import Home from './Home';
import SingleCard from './SingleCard';
import PaymentSuccess from './PaymentSuccess';
import { updateStudentInterestsLegacy, markAsNotFirstLogin, getCurrentUser, saveUserSession, clearUserSession, UserDataLegacy } from '../utils/userStorage';
import { clearSession } from '../utils/sessionManager';
import { getClasses, ClassData } from '../services/api';

type AuthStep = 'home' | 'login' | 'register' | 'student-interests' | 'teacher-tutorial' | 'dashboard' | 'admin-login' | 'admin-dashboard' | 'single-card' | 'payment-success';

const AuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('home');
  const [userData, setUserData] = useState<UserDataLegacy | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<ClassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión existente al cargar la aplicación
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          // Convertir UserData a UserDataLegacy
          const legacyUser: UserDataLegacy = {
            ...currentUser,
            password: '', // No tenemos la contraseña en la sesión
            createdAt: new Date(currentUser.createdAt)
          };
          setUserData(legacyUser);
          // Redirigir según el rol y estado del usuario
          if (currentUser.role === 'admin') {
            setCurrentStep('admin-dashboard');
          } else if (currentUser.isFirstLogin) {
            if (currentUser.role === 'student') {
              setCurrentStep('student-interests');
            } else if (currentUser.role === 'teacher') {
              setCurrentStep('teacher-tutorial');
            } else {
              setCurrentStep('dashboard');
            }
          } else {
            setCurrentStep('dashboard');
          }
        } else {
          // 🌐 NO HAY USUARIO AUTENTICADO - PERMITIR NAVEGACIÓN LIBRE
          setCurrentStep('home');
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        // 🌐 ERROR EN SESIÓN - PERMITIR NAVEGACIÓN LIBRE
        setCurrentStep('home');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Manejar rutas de pago
  useEffect(() => {
    const handlePaymentRoutes = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      
      if (path === '/payment/success') {
        setCurrentStep('payment-success');
      }
    };

    handlePaymentRoutes();
  }, []);

  const handleLoginSuccess = (user: UserDataLegacy) => {
    setUserData(user);
    // Convertir UserDataLegacy a UserData para la sesión
    const apiUser = {
      ...user,
      createdAt: user.createdAt.toISOString()
    };
    // ❌ NO GUARDAR SESIÓN AQUÍ - Ya se guardó en verifyCredentials con el token real
    // saveUserSession(apiUser, 'dummy-token'); // ❌ ESTO ERA EL PROBLEMA!
    
    if (user.role === 'admin') {
      setCurrentStep('admin-dashboard');
    } else if (user.isFirstLogin) {
      if (user.role === 'student') {
        setCurrentStep('student-interests');
      } else if (user.role === 'teacher') {
        setCurrentStep('teacher-tutorial');
      } else {
        setCurrentStep('dashboard');
      }
    } else {
      setCurrentStep('dashboard');
    }
  };

  const handleGoToRegister = () => {
    setCurrentStep('register');
  };

  const handleGoToLogin = () => {
    setCurrentStep('login');
  };

  const handleGoToHome = () => {
    // 🌐 PERMITIR ACCESO AL HOME SIN AUTENTICACIÓN (NAVEGACIÓN LIBRE)
    setCurrentStep('home');
  };

  const handleGoToAdminLogin = () => {
    setCurrentStep('admin-login');
  };

  const handleGoToUserLogin = () => {
    setCurrentStep('login');
  };


  const handleLogout = () => {
    const shouldLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    
    if (shouldLogout) {
      try {
        console.log('🚪 Iniciando proceso de logout desde AuthFlow...');
        
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
        
        // Limpiar sesión del localStorage (método legacy)
        clearUserSession();
        
        // Actualizar estado local
        setUserData(null);
        setCurrentStep('home');
        
        console.log('✅ Sesión limpiada completamente desde AuthFlow');
        
        // Mostrar mensaje de confirmación
        alert('Sesión cerrada exitosamente');
        
      } catch (error) {
        console.error('❌ Error durante el logout:', error);
        alert('Error al cerrar sesión. Por favor, recarga la página.');
      }
    }
  };

  const handleStudentInterestsComplete = (interests: string[]) => {
    if (userData) {
      // Actualizar en la base de datos
      updateStudentInterestsLegacy(userData.id, interests);
      
      // Actualizar estado local
      setUserData({ ...userData, interests, isFirstLogin: false });
      setCurrentStep('dashboard');
    }
  };

  const handleTeacherTutorialComplete = () => {
    if (userData) {
      // Actualizar en la base de datos
      markAsNotFirstLogin(userData.id);
      
      // Actualizar estado local
      setUserData({ ...userData, isFirstLogin: false });
      setCurrentStep('dashboard');
    }
  };

  const handleViewPackDetails = async (packId: string) => {
    try {
      setSelectedPackId(packId);
      // Obtener el pack específico desde la API
      const response = await getClasses({ limit: 1000 }); // Obtener todas las clases
      const pack = response.classes.find(p => p._id === packId || p.title === packId);
      if (pack) {
        setSelectedPack(pack);
        setCurrentStep('single-card');
      } else {
        console.error('Pack no encontrado:', packId);
        // Volver al home si no se encuentra el pack
        setCurrentStep('home');
      }
    } catch (error) {
      console.error('Error obteniendo pack:', error);
      setCurrentStep('home');
    }
  };

  const handleGoBackToHome = () => {
    setSelectedPackId(null);
    setSelectedPack(null);
    setCurrentStep('home');
  };

  const handlePurchasePack = (packId: string) => {
    // Aquí se podría actualizar el estado del usuario con la compra
    console.log('Pack comprado:', packId);
    // Por ahora, volvemos al home
    setCurrentStep('home');
  };

  const handleRegistrationComplete = (user: UserDataLegacy) => {
    // Después del registro, el usuario va directamente al dashboard
    setUserData(user);
    setCurrentStep('dashboard');
  };

  // Mostrar loading mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zen-50 to-sage-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zen-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Cargando...</p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 'home':
      // 🌐 PERMITIR ACCESO LIBRE AL HOME (SIN AUTENTICACIÓN REQUERIDA)
      return (
        <Home
          onLogin={handleGoToLogin}
          onRegister={handleGoToRegister}
          userEmail={userData?.email}
          onViewPackDetails={handleViewPackDetails}
        />
      );

    case 'login':
      return (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={handleGoToRegister}
          onGoToAdminLogin={handleGoToAdminLogin}
        />
      );

    case 'admin-login':
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onGoToUserLogin={handleGoToUserLogin}
        />
      );

    case 'admin-dashboard':
      return (
        <AdminDashboard
          userData={userData!}
          onLogout={handleLogout}
          onGoHome={handleGoBackToHome}
        />
      );

    case 'single-card':
      // 🌐 PERMITIR ACCESO LIBRE A SINGLE CARD (SIN AUTENTICACIÓN REQUERIDA)
      if (!selectedPack) {
        return (
          <Home
            onLogin={handleGoToLogin}
            onRegister={handleGoToRegister}
            userEmail={userData?.email}
            onViewPackDetails={handleViewPackDetails}
          />
        );
      }
      return (
        <SingleCard
          pack={selectedPack as any}
          userEmail={userData?.email}
          onGoBack={handleGoBackToHome}
          onPurchase={handlePurchasePack}
          onRegister={handleGoToRegister}
        />
      );

    case 'register':
      return (
        <RegistrationFlow 
          onGoToLogin={handleGoToLogin} 
          onGoToDashboard={handleRegistrationComplete}
        />
      );

    case 'student-interests':
      return (
        <StudentInterests
          onComplete={handleStudentInterestsComplete}
          onSkip={() => handleStudentInterestsComplete([])}
        />
      );

    case 'teacher-tutorial':
      return (
        <TeacherTutorial
          onComplete={handleTeacherTutorialComplete}
          onSkip={handleTeacherTutorialComplete}
        />
      );

    case 'dashboard':
      return userData?.role === 'teacher' ? (
        <TeacherDashboard
          userData={userData}
          onLogout={handleLogout}
          onGoHome={handleGoBackToHome}
        />
      ) : (
        <StudentDashboard
          userData={userData!}
          onLogout={handleLogout}
          onGoHome={handleGoBackToHome}
        />
      );

    case 'payment-success':
      return <PaymentSuccess />;

    default:
      // 🌐 CASO DEFAULT - PERMITIR NAVEGACIÓN LIBRE
      return (
        <Home
          onLogin={handleGoToLogin}
          onRegister={handleGoToRegister}
          userEmail={userData?.email}
          onViewPackDetails={handleViewPackDetails}
        />
      );
  }
};

export default AuthFlow;