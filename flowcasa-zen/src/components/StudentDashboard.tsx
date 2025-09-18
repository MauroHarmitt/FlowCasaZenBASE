import React, { useState, useEffect } from 'react';
import { getPurchasesByStudent, getTotalPurchasesByStudent } from '../utils/purchaseStorage';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  isVerified: boolean;
  isFirstLogin?: boolean;
  interests?: string[];
}

interface StudentDashboardProps {
  userData: UserData;
  onLogout: () => void;
  onGoHome?: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userData, onLogout, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [purchases, setPurchases] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const studentId = `student_${userData.email}`;
    const studentPurchases = getPurchasesByStudent(studentId);
    const total = getTotalPurchasesByStudent(studentId);
    
    setPurchases(studentPurchases);
    setTotalSpent(total);
  }, [userData.email]);

  const tabs = [
    { id: 'explore', label: 'Explorar', icon: '🔍' },
    { id: 'my-content', label: 'Mis Clases', icon: '📚' },
    { id: 'favorites', label: 'Favoritos', icon: '❤️' },
    { id: 'purchases', label: 'Compras', icon: '🛒' }
  ];

  const renderExploreTab = () => (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-4">Buscar Profesores</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select className="px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500">
            <option value="">Todas las especialidades</option>
            <option value="yoga">Yoga</option>
            <option value="fitness">Fitness</option>
            <option value="pilates">Pilates</option>
          </select>
          
          <select className="px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500">
            <option value="">Todos los idiomas</option>
            <option value="español">Español</option>
            <option value="inglés">Inglés</option>
          </select>
          
          <select className="px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500">
            <option value="">Todos los horarios</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
        </div>
        
        <button className="w-full bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          Buscar Profesores
        </button>
      </div>

      {/* Featured teachers */}
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-4">Profesores Destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-sage-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-zen-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-zen-600 font-semibold">P{i}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sage-800">Profesor {i}</h4>
                  <p className="text-sm text-sage-600">Especialista en Yoga</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-sage-600">⭐ 4.8 (120 reseñas)</span>
                <button className="text-zen-600 hover:text-zen-700 font-medium text-sm">
                  Seguir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-sage-800">Mis Clases Compradas</h3>
          <div className="text-sm text-sage-600">
            Total gastado: <span className="font-semibold">${totalSpent}</span>
          </div>
        </div>
        
        {purchases.length === 0 ? (
          <div className="text-center py-8 text-sage-500">
            <div className="text-4xl mb-2">📚</div>
            <p>No tienes clases compradas aún</p>
            <button className="mt-4 bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Explorar Clases
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="border border-sage-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sage-800">{purchase.packTitle}</h4>
                    <p className="text-sm text-sage-600">Profesor: {purchase.teacherName}</p>
                    <p className="text-sm text-sage-600">
                      Comprado el {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-zen-600">
                      ${purchase.amount} {purchase.currency}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status === 'completed' ? 'Completado' :
                       purchase.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </span>
                  </div>
                </div>
                {purchase.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-sage-200">
                    <button className="bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                      Acceder a la Clase
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFavoritesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-4">Rutinas Favoritas</h3>
        <div className="text-center py-8 text-sage-500">
          <div className="text-4xl mb-2">❤️</div>
          <p>No tienes rutinas favoritas aún</p>
        </div>
      </div>
    </div>
  );

  const renderPurchasesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-4">Historial de Compras</h3>
        <div className="text-center py-8 text-sage-500">
          <div className="text-4xl mb-2">🛒</div>
          <p>No tienes compras registradas</p>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'explore':
        return renderExploreTab();
      case 'my-content':
        return renderMyContentTab();
      case 'favorites':
        return renderFavoritesTab();
      case 'purchases':
        return renderPurchasesTab();
      default:
        return renderExploreTab();
    }
  };

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
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="bg-zen-100 hover:bg-zen-200 text-zen-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  🏠 Ir al Home
                </button>
              )}
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
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-sage-800 mb-2">
            ¡Bienvenido, {userData.firstName}!
          </h2>
          <p className="text-sage-600">
            Explora clases de yoga y fitness, encuentra profesores y mejora tu práctica
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 mb-6">
          <div className="flex border-b border-sage-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-zen-600 border-b-2 border-zen-600 bg-zen-50'
                    : 'text-sage-600 hover:text-sage-800 hover:bg-sage-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default StudentDashboard;
