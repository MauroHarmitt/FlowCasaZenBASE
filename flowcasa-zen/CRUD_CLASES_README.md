# 📚 CRUD de Clases - FlowCasaZen

## 🎯 Funcionalidades Implementadas

### ✅ Backend (API)
- **Modelo de Clases**: Esquema completo en MongoDB con validaciones
- **Endpoints CRUD**:
  - `GET /api/classes` - Obtener todas las clases (con filtros y paginación)
  - `GET /api/classes/:id` - Obtener una clase específica
  - `POST /api/classes` - Crear nueva clase (Admin/Teacher)
  - `PUT /api/classes/:id` - Actualizar clase (Admin/Teacher)
  - `DELETE /api/classes/:id` - Eliminar clase (Admin)
- **Filtros y Búsqueda**: Por categoría, dificultad, texto de búsqueda
- **Ordenamiento**: Por popularidad, precio, fecha, rating
- **Población Automática**: Clases por defecto se crean al iniciar el servidor

### ✅ Frontend
- **Home Actualizado**: Ahora obtiene clases desde la API en lugar de datos hardcodeados
- **Componente ClassManagement**: CRUD completo con interfaz intuitiva
- **Integración con Dashboards**: 
  - TeacherDashboard: Botón "Gestionar Clases"
  - AdminDashboard: Botón "Gestionar" en el overview
- **Estados de Carga**: Loading, error y éxito
- **Formularios Dinámicos**: Arrays para ejercicios, beneficios y requisitos

## 🚀 Cómo Usar

### 1. Iniciar el Sistema
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
cd flowcasa-zen
npm start
```

### 2. Acceder como Usuario
- **Estudiante**: Ve las clases en el Home
- **Profesor**: 
  1. Inicia sesión
  2. Ve al Dashboard
  3. Haz clic en "Gestionar Clases"
  4. Crea, edita o elimina tus clases
- **Admin**: 
  1. Inicia sesión como admin
  2. Ve al Panel de Administración
  3. Haz clic en "Gestionar" en la tarjeta de Gestión de Clases
  4. Gestiona todas las clases del sistema

### 3. Crear una Nueva Clase
1. Haz clic en "Nueva Clase" o "Crear Primera Clase"
2. Completa el formulario:
   - **Información básica**: Título, precio, duración, categoría, dificultad
   - **Descripción**: Detalla qué aprenderán los estudiantes
   - **URLs**: Video de demostración e imagen de portada
   - **Arrays dinámicos**: Ejercicios, beneficios, requisitos
   - **Configuración**: Marcar como popular, descuento
3. Haz clic en "Crear Clase"

### 4. Editar una Clase Existente
1. En la lista de clases, haz clic en "Editar"
2. Modifica los campos necesarios
3. Haz clic en "Actualizar Clase"

### 5. Eliminar una Clase
1. En la lista de clases, haz clic en "Eliminar"
2. Confirma la eliminación

## 🔧 Estructura de Datos

```typescript
interface ClassData {
  _id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: 'Yoga' | 'Fitness' | 'Crossfit' | 'Malabares' | 'Artes Marciales' | 'Pilates' | 'Meditación';
  teacher: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    students: number;
    country: string;
  };
  reelUrl: string;
  thumbnail: string;
  exercises: string[];
  benefits: string[];
  requirements: string[];
  isPopular: boolean;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Características de la UI

### Formulario de Clase
- **Campos obligatorios**: Título, descripción, precio, duración, categoría, dificultad, URLs
- **Arrays dinámicos**: Agregar/eliminar ejercicios, beneficios y requisitos
- **Validaciones**: Precios positivos, descuentos 0-100%, URLs válidas
- **UX intuitiva**: Botones claros, confirmaciones, estados de carga

### Lista de Clases
- **Vista de tarjetas**: Imagen, título, descripción, precio, duración
- **Etiquetas**: Categoría y dificultad con colores distintivos
- **Acciones**: Botones de editar y eliminar
- **Estados vacíos**: Mensaje motivacional para crear la primera clase

### Integración con Home
- **Carga desde API**: Reemplaza datos hardcodeados
- **Filtros en tiempo real**: Búsqueda, categoría, dificultad, ordenamiento
- **Estados de UI**: Loading spinner, mensajes de error, reintentos
- **Compatibilidad**: Funciona con el TeacherCard existente

## 🔐 Permisos y Seguridad

- **Profesores**: Pueden crear, editar y ver solo sus propias clases
- **Admins**: Pueden gestionar todas las clases del sistema
- **Estudiantes**: Solo pueden ver las clases en el Home
- **Autenticación**: Todos los endpoints requieren token JWT válido
- **Validación**: Datos validados tanto en frontend como backend

## 🚀 Próximas Mejoras

- [ ] Subida de archivos (imágenes y videos)
- [ ] Sistema de reviews y ratings
- [ ] Categorías personalizadas
- [ ] Plantillas de clases
- [ ] Estadísticas de visualización
- [ ] Sistema de notificaciones
- [ ] Exportar clases a PDF
- [ ] Duplicar clases existentes

## 🐛 Solución de Problemas

### Error: "Servidor no disponible"
- Verifica que el backend esté ejecutándose en el puerto 4000
- Revisa la consola del servidor para errores

### Error: "Token inválido"
- Cierra sesión y vuelve a iniciar sesión
- Verifica que el token no haya expirado

### Las clases no se cargan
- Verifica la conexión a MongoDB
- Revisa los logs del servidor
- Asegúrate de que las clases por defecto se hayan creado

### Error al crear clase
- Verifica que todos los campos obligatorios estén completos
- Asegúrate de que las URLs sean válidas
- Revisa que tengas permisos de profesor o admin

---

¡El CRUD de clases está completamente funcional! 🎉
Los usuarios pueden crear, editar y eliminar clases que se muestran automáticamente en el Home de la plataforma.
