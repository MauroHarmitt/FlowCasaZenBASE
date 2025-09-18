import React, { useState, useEffect } from 'react';
import { getPurchasesByTeacher, getTotalSalesByTeacher } from '../utils/purchaseStorage';
import ClassManagement from './ClassManagement';

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

interface TeacherDashboardProps {
  userData: UserData;
  onLogout: () => void;
  onGoHome?: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ userData, onLogout, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sales, setSales] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showClassManagement, setShowClassManagement] = useState(false);

  useEffect(() => {
    const teacherId = userData.id;
    const teacherSales = getPurchasesByTeacher(teacherId);
    const total = getTotalSalesByTeacher(teacherId);
    
    setSales(teacherSales);
    setTotalEarnings(total);
  }, [userData.id]);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'content', label: 'Contenido', icon: '📹' },
    { id: 'packs', label: 'Packs', icon: '📦' },
    { id: 'sales', label: 'Ventas', icon: '💳' },
    { id: 'earnings', label: 'Ingresos', icon: '💰' },
    { id: 'calendar', label: 'Calendario', icon: '📅' }
  ];

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stats cards */}
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-zen-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-zen-600 font-semibold">👥</span>
          </div>
          <div>
            <p className="text-sm text-sage-600">Estudiantes Activos</p>
            <p className="text-2xl font-bold text-sage-800">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-zen-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-zen-600 font-semibold">📦</span>
          </div>
          <div>
            <p className="text-sm text-sage-600">Packs Vendidos</p>
            <p className="text-2xl font-bold text-sage-800">{sales.filter(s => s.status === 'completed').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-zen-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-zen-600 font-semibold">💰</span>
          </div>
          <div>
            <p className="text-sm text-sage-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-sage-800">${totalEarnings}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-zen-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-zen-600 font-semibold">⭐</span>
          </div>
          <div>
            <p className="text-sm text-sage-600">Calificación</p>
            <p className="text-2xl font-bold text-sage-800">-</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-sage-800">Mi Contenido</h3>
          <button className="bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            + Subir Contenido
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button className="p-4 border-2 border-dashed border-sage-300 rounded-lg hover:border-zen-400 hover:bg-zen-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🎬</div>
              <p className="font-medium text-sage-700">Reel Corto</p>
              <p className="text-xs text-sage-500">Máx. 1 minuto</p>
            </div>
          </button>

          <button className="p-4 border-2 border-dashed border-sage-300 rounded-lg hover:border-zen-400 hover:bg-zen-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📹</div>
              <p className="font-medium text-sage-700">Video Largo</p>
              <p className="text-xs text-sage-500">1h - 1h30</p>
            </div>
          </button>

          <button className="p-4 border-2 border-dashed border-sage-300 rounded-lg hover:border-zen-400 hover:bg-zen-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <p className="font-medium text-sage-700">PDF</p>
              <p className="text-xs text-sage-500">Plan de entrenamiento</p>
            </div>
          </button>
        </div>

        <div className="text-center py-8 text-sage-500">
          <div className="text-4xl mb-2">📹</div>
          <p>No tienes contenido subido aún</p>
        </div>
      </div>
    </div>
  );

  const renderPacksTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-sage-800">Mis Clases</h3>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowClassManagement(true)}
              className="bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Gestionar Clases
            </button>
            <button className="bg-sage-600 hover:bg-sage-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              + Crear Pack
            </button>
          </div>
        </div>

        <div className="text-center py-8 text-sage-500">
          <div className="text-4xl mb-2">📦</div>
          <p>No tienes packs creados aún</p>
          <button className="mt-4 bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Crear tu primer pack
          </button>
        </div>
      </div>
    </div>
  );

  const renderEarningsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-6">Gestión de Ingresos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-sage-50 rounded-lg p-4">
            <h4 className="font-semibold text-sage-800 mb-2">Ingresos Totales</h4>
            <p className="text-2xl font-bold text-zen-600">$0.00</p>
          </div>
          
          <div className="bg-sage-50 rounded-lg p-4">
            <h4 className="font-semibold text-sage-800 mb-2">Comisión de la Plataforma</h4>
            <p className="text-2xl font-bold text-sage-600">15%</p>
          </div>
        </div>

        <div className="border-t border-sage-200 pt-6">
          <h4 className="font-semibold text-sage-800 mb-4">Solicitar Retiro</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Monto a retirar"
              className="px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500"
            />
            <select className="px-4 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-zen-500">
              <option value="">Método de pago</option>
              <option value="cbu">CBU</option>
              <option value="mercadopago">MercadoPago</option>
              <option value="lemon">Lemon</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <button className="mt-4 bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Solicitar Retiro
          </button>
        </div>
      </div>
    </div>
  );

  const renderSalesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-sage-800">Ventas Realizadas</h3>
          <div className="text-sm text-sage-600">
            Total: <span className="font-semibold">${totalEarnings}</span>
          </div>
        </div>
        
        {sales.length === 0 ? (
          <div className="text-center py-8 text-sage-500">
            <div className="text-4xl mb-2">💳</div>
            <p>No tienes ventas aún</p>
            <p className="text-sm mt-2">Crea packs y promociona tus clases para empezar a vender</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="border border-sage-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sage-800">{sale.packTitle}</h4>
                    <p className="text-sm text-sage-600">Vendido el {new Date(sale.purchaseDate).toLocaleDateString()}</p>
                    <p className="text-sm text-sage-600">ID de transacción: {sale.transactionId || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-zen-600">
                      ${sale.amount} {sale.currency}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                      sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.status === 'completed' ? 'Completado' :
                       sale.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCalendarTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-sage-200 p-6">
        <h3 className="text-lg font-semibold text-sage-800 mb-6">Calendario de Actividades</h3>
        
        <div className="text-center py-8 text-sage-500">
          <div className="text-4xl mb-2">📅</div>
          <p>Tu calendario está vacío</p>
          <p className="text-sm mt-2">Programa cuándo publicar contenido y organiza tus clases</p>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'content':
        return renderContentTab();
      case 'packs':
        return renderPacksTab();
      case 'sales':
        return renderSalesTab();
      case 'earnings':
        return renderEarningsTab();
      case 'calendar':
        return renderCalendarTab();
      default:
        return renderOverviewTab();
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
            Dashboard de Profesor
          </h2>
          <p className="text-sage-600">
            Gestiona tu contenido, estudiantes e ingresos
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-sage-200 mb-6">
          <div className="flex border-b border-sage-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
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

      {/* Modal de gestión de clases */}
      {showClassManagement && (
        <ClassManagement onClose={() => setShowClassManagement(false)} />
      )}
    </div>
  );
};

export default TeacherDashboard;
