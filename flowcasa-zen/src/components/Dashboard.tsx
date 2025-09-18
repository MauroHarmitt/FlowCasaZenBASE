import React from 'react';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
  isVerified: boolean;
}

interface DashboardProps {
  userData: UserData;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout }) => {
  const isTeacher = userData.role === 'teacher';

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 to-sage-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-sage-800">FlowCasaZen</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-sage-600">
                Hola, {userData.firstName} {userData.lastName}
              </div>
              <button
                onClick={onLogout}
                className="bg-sage-100 hover:bg-sage-200 text-sage-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-sage-800 mb-2">
            Bienvenido a tu Dashboard
          </h2>
          <p className="text-sage-600">
            {isTeacher ? 'Gestiona tus clases y estudiantes' : 'Explora clases de yoga disponibles'}
          </p>
        </div>

        {/* Status Card */}
        <div className={`rounded-lg p-6 mb-8 ${
          userData.isVerified 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              userData.isVerified ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {userData.isVerified ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${
                userData.isVerified ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {userData.isVerified ? 'Cuenta verificada' : 'Verificación pendiente'}
              </h3>
              <p className={`text-sm ${
                userData.isVerified ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {userData.isVerified 
                  ? 'Tu cuenta está completamente activa'
                  : 'Tu cuenta está pendiente de verificación'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content based on role */}
        {isTeacher ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Teacher Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Mis Clases</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Gestiona y crea nuevas clases de yoga
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ver mis clases
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Ingresos</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Revisa tus ganancias y pagos
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ver ingresos
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Estudiantes</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Gestiona tus estudiantes
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ver estudiantes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Clases Disponibles</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Explora clases de yoga disponibles
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ver clases
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Mis Clases</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Clases que has comprado
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Ver mis clases
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-zen-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-zen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-sage-800">Perfil</h3>
              </div>
              <p className="text-sage-600 text-sm mb-4">
                Gestiona tu perfil y preferencias
              </p>
              <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Editar perfil
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
