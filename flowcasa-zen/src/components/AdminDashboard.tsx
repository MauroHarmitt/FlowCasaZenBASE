import React, { useState, useEffect } from 'react';
import { getUsers, UserDataLegacy } from '../utils/userStorage';
import ClassManagement from './ClassManagement';

interface AdminDashboardProps {
  userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  onLogout: () => void;
  onGoHome?: () => void;
}

type AdminTab = 'overview' | 'teachers' | 'students' | 'reports' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onLogout, onGoHome }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<UserDataLegacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClassManagement, setShowClassManagement] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const teachers = users.filter(user => user.role === 'teacher');
  const students = users.filter(user => user.role === 'student');
  const pendingTeachers = teachers.filter(teacher => !teacher.isVerified);

  const renderOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Panel de Administración</h2>
      
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudiantes</p>
              <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profesores</p>
              <p className="text-2xl font-semibold text-gray-900">{teachers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gestión de Clases</p>
                <p className="text-lg font-semibold text-gray-900">CRUD Completo</p>
              </div>
            </div>
            <button 
              onClick={() => setShowClassManagement(true)}
              className="bg-zen-600 hover:bg-zen-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Gestionar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTeachers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                    <span className="text-sage-600 font-medium">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'teacher' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'teacher' ? 'Profesor' : 'Estudiante'}
                  </span>
                  {user.role === 'teacher' && !user.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeachers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sage-800">Gestión de Profesores</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors">
            Exportar Lista
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Profesores ({teachers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{teacher.profession || 'No especificado'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {teacher.documentType} - {teacher.documentNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {teacher.isVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!teacher.isVerified && (
                        <button className="text-green-600 hover:text-green-900">
                          Aprobar
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">
                        Ver
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sage-800">Gestión de Estudiantes</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors">
            Exportar Lista
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Estudiantes ({students.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intereses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{student.country}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {student.interests?.slice(0, 2).map((interest, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {interest}
                        </span>
                      ))}
                      {student.interests && student.interests.length > 2 && (
                        <span className="text-xs text-gray-500">+{student.interests.length - 2} más</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Ver
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Suspender
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Reportes y Estadísticas</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de usuarios por mes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Registros por Mes</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Gráfico de registros por mes</p>
          </div>
        </div>

        {/* Distribución por país */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución por País</h3>
          <div className="space-y-3">
            {Array.from(new Set(users.map(u => u.country))).slice(0, 5).map((country) => {
              const count = users.filter(u => u.country === country).length;
              const percentage = (count / users.length) * 100;
              return (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-zen-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reportes de contenido */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Reportes de Contenido</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-800">Contenido Inapropiado</p>
                <p className="text-sm text-red-600">Video de yoga con contenido inadecuado</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  Revisar
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                  Descartar
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800">Spam</p>
                <p className="text-sm text-yellow-600">Múltiples comentarios repetitivos</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                  Revisar
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sage-800">Configuración del Sistema</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de comisiones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comisiones de la Plataforma</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comisión por venta (%)
              </label>
              <input
                type="number"
                defaultValue="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comisión mínima (USD)
              </label>
              <input
                type="number"
                defaultValue="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
              />
            </div>
            <button className="w-full px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors">
              Guardar Configuración
            </button>
          </div>
        </div>

        {/* Configuración de notificaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Nuevos registros de profesores</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-zen-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Reportes de contenido</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-zen-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Estadísticas semanales</span>
              <input type="checkbox" className="w-4 h-4 text-zen-600" />
            </div>
            <button className="w-full px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors">
              Guardar Preferencias
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de sistema */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración del Sistema</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Límite de archivos por profesor (MB)
            </label>
            <input
              type="number"
              defaultValue="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de sesión (horas)
            </label>
            <input
              type="number"
              defaultValue="24"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700 transition-colors">
              Guardar Cambios
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Restaurar Valores
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: '📊' },
    { id: 'teachers', name: 'Profesores', icon: '👨‍🏫' },
    { id: 'students', name: 'Estudiantes', icon: '👨‍🎓' },
    { id: 'reports', name: 'Reportes', icon: '📈' },
    { id: 'settings', name: 'Configuración', icon: '⚙️' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zen-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-sage-800">FlowCasaZen Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Bienvenido, <span className="font-medium">{userData.firstName} {userData.lastName}</span>
              </div>
              {onGoHome && (
                <button
                  onClick={onGoHome}
                  className="px-4 py-2 text-sm font-medium text-zen-700 bg-zen-100 border border-zen-300 rounded-lg hover:bg-zen-200 transition-colors"
                >
                  🏠 Ir al Home
                </button>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-zen-500 text-zen-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'teachers' && renderTeachers()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* Modal de gestión de clases */}
      {showClassManagement && (
        <ClassManagement onClose={() => setShowClassManagement(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
