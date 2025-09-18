import React, { useState, useEffect } from 'react';
import { getClasses, createClass, updateClass, deleteClass, ClassData, getCurrentUser } from '../services/api';

interface ClassManagementProps {
  onClose: () => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ onClose }) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [currentUser] = useState(getCurrentUser());

  // Estados del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    duration: '',
    difficulty: 'Principiante' as 'Principiante' | 'Intermedio' | 'Avanzado',
    category: 'Yoga' as 'Yoga' | 'Fitness' | 'Crossfit' | 'Malabares' | 'Artes Marciales' | 'Pilates' | 'Meditación',
    reelUrl: '',
    thumbnail: '',
    exercises: [''],
    benefits: [''],
    requirements: [''],
    isPopular: false,
    discount: 0
  });

  const categories = ['Yoga', 'Fitness', 'Crossfit', 'Malabares', 'Artes Marciales', 'Pilates', 'Meditación'];
  const difficulties = ['Principiante', 'Intermedio', 'Avanzado'];

  // Cargar clases del usuario
  useEffect(() => {
    loadUserClasses();
  }, []);

  const loadUserClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClasses({ limit: 100 });
      // Filtrar solo las clases del usuario actual
      const userClasses = response.classes.filter(classItem => 
        classItem.teacher.id === currentUser?.id
      );
      setClasses(userClasses);
    } catch (err: any) {
      setError(err.message || 'Error cargando clases');
      console.error('Error cargando clases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: 'exercises' | 'benefits' | 'requirements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'exercises' | 'benefits' | 'requirements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'exercises' | 'benefits' | 'requirements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      currency: 'USD',
      duration: '',
      difficulty: 'Principiante',
      category: 'Yoga',
      reelUrl: '',
      thumbnail: '',
      exercises: [''],
      benefits: [''],
      requirements: [''],
      isPopular: false,
      discount: 0
    });
    setEditingClass(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Usuario no autenticado');
      return;
    }

    try {
      const classData = {
        ...formData,
        teacher: {
          id: currentUser.id,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          rating: 4.5,
          students: 0,
          country: currentUser.country
        },
        exercises: formData.exercises.filter(ex => ex.trim() !== ''),
        benefits: formData.benefits.filter(ben => ben.trim() !== ''),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        isActive: true
      };

      if (editingClass) {
        await updateClass(editingClass._id!, classData);
      } else {
        await createClass(classData);
      }

      await loadUserClasses();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Error guardando clase');
      console.error('Error guardando clase:', err);
    }
  };

  const handleEdit = (classItem: ClassData) => {
    setEditingClass(classItem);
    setFormData({
      title: classItem.title,
      description: classItem.description,
      price: classItem.price,
      currency: classItem.currency,
      duration: classItem.duration,
      difficulty: classItem.difficulty,
      category: classItem.category,
      reelUrl: classItem.reelUrl,
      thumbnail: classItem.thumbnail,
      exercises: classItem.exercises.length > 0 ? classItem.exercises : [''],
      benefits: classItem.benefits.length > 0 ? classItem.benefits : [''],
      requirements: classItem.requirements.length > 0 ? classItem.requirements : [''],
      isPopular: classItem.isPopular,
      discount: classItem.discount || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (classId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta clase?')) {
      return;
    }

    try {
      await deleteClass(classId);
      await loadUserClasses();
    } catch (err: any) {
      setError(err.message || 'Error eliminando clase');
      console.error('Error eliminando clase:', err);
    }
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingClass ? 'Editar Clase' : 'Crear Nueva Clase'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="ej: 30 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificultad *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Video *
                  </label>
                  <input
                    type="url"
                    name="reelUrl"
                    value={formData.reelUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de la Imagen *
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Arrays dinámicos */}
              {['exercises', 'benefits', 'requirements'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === 'exercises' ? 'Ejercicios' : 
                     field === 'benefits' ? 'Beneficios' : 'Requisitos'}
                  </label>
                  {(formData[field as keyof typeof formData] as string[]).map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(field as any, index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zen-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field as any, index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem(field as any)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    + Agregar
                  </button>
                </div>
              ))}

              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-zen-600 focus:ring-zen-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Marcar como popular
                </label>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700"
                >
                  {editingClass ? 'Actualizar' : 'Crear'} Clase
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Clases</h2>
            <div className="flex space-x-4">
              <button
                onClick={openCreateForm}
                className="px-4 py-2 bg-zen-600 text-white rounded-lg hover:bg-zen-700"
              >
                + Nueva Clase
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zen-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando clases...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes clases creadas</h3>
              <p className="text-gray-600 mb-6">Crea tu primera clase para comenzar a enseñar</p>
              <button
                onClick={openCreateForm}
                className="px-6 py-3 bg-zen-600 text-white rounded-lg hover:bg-zen-700"
              >
                Crear Primera Clase
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <div key={classItem._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={classItem.thumbnail}
                      alt={classItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{classItem.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-zen-600">${classItem.price}</span>
                    <span className="text-sm text-gray-500">{classItem.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-1 bg-zen-100 text-zen-800 text-xs rounded-full">
                      {classItem.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      {classItem.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(classItem._id!)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;
