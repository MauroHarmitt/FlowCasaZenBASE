export interface TrainingPack {
  id: string;
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
  createdAt: Date;
  isPopular: boolean;
  discount?: number;
}

export const trainingPacks: TrainingPack[] = [
  {
    id: '1',
    title: 'Yoga Matutino para Principiantes',
    description: 'Despierta tu cuerpo y mente con esta rutina de yoga suave de 30 minutos. Perfecta para empezar el día con energía y claridad mental.',
    price: 25,
    currency: 'USD',
    duration: '30 min',
    difficulty: 'Principiante',
    category: 'Yoga',
    teacher: {
      id: 'teacher-1',
      name: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      students: 1250,
      country: 'España'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    exercises: ['Saludo al Sol', 'Posturas de Pie', 'Flexiones hacia adelante', 'Torsiones', 'Relajación final'],
    benefits: ['Mejora la flexibilidad', 'Reduce el estrés', 'Fortalece el core', 'Mejora la postura'],
    requirements: ['Mat de yoga', 'Ropa cómoda', 'Espacio tranquilo'],
    createdAt: new Date('2024-01-15'),
    isPopular: true,
    discount: 20
  },
  {
    id: '2',
    title: 'HIIT Intenso - Quema Calorías',
    description: 'Sesión de alta intensidad de 45 minutos para maximizar la quema de calorías y mejorar tu condición cardiovascular.',
    price: 35,
    currency: 'USD',
    duration: '45 min',
    difficulty: 'Intermedio',
    category: 'Fitness',
    teacher: {
      id: 'teacher-2',
      name: 'Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      students: 890,
      country: 'México'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    exercises: ['Burpees', 'Jumping Jacks', 'Mountain Climbers', 'High Knees', 'Plank Jacks'],
    benefits: ['Quema grasa', 'Mejora resistencia', 'Fortalece músculos', 'Acelera metabolismo'],
    requirements: ['Ropa deportiva', 'Agua', 'Espacio amplio'],
    createdAt: new Date('2024-01-20'),
    isPopular: true
  },
  {
    id: '3',
    title: 'Malabares con Pelotas - Nivel Básico',
    description: 'Aprende los fundamentos del malabarismo con 3 pelotas. Técnicas básicas y progresiones para desarrollar coordinación.',
    price: 20,
    currency: 'USD',
    duration: '25 min',
    difficulty: 'Principiante',
    category: 'Malabares',
    teacher: {
      id: 'teacher-3',
      name: 'Ana Rodríguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      students: 450,
      country: 'Argentina'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    exercises: ['Cascada básica', 'Columnas', 'Mills Mess', 'Trucos de una mano', 'Rutina final'],
    benefits: ['Mejora coordinación', 'Desarrolla concentración', 'Ejercita ambos hemisferios', 'Reduce estrés'],
    requirements: ['3 pelotas de malabares', 'Espacio amplio', 'Paciencia'],
    createdAt: new Date('2024-01-18'),
    isPopular: false
  },
  {
    id: '4',
    title: 'Kung Fu Tradicional - Formas Básicas',
    description: 'Introducción al Kung Fu con formas tradicionales y técnicas de respiración. Desarrolla fuerza, flexibilidad y disciplina mental.',
    price: 40,
    currency: 'USD',
    duration: '50 min',
    difficulty: 'Intermedio',
    category: 'Artes Marciales',
    teacher: {
      id: 'teacher-4',
      name: 'Li Wei',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      students: 320,
      country: 'China'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
    exercises: ['Saludo tradicional', 'Forma del Tigre', 'Técnicas de puño', 'Patadas básicas', 'Meditación final'],
    benefits: ['Desarrolla fuerza', 'Mejora flexibilidad', 'Fortalece disciplina', 'Conexión mente-cuerpo'],
    requirements: ['Ropa cómoda', 'Espacio amplio', 'Actitud respetuosa'],
    createdAt: new Date('2024-01-22'),
    isPopular: true,
    discount: 15
  },
  {
    id: '5',
    title: 'Pilates Core Intenso',
    description: 'Fortalece tu core con esta sesión de Pilates de 35 minutos. Enfoque en estabilidad, control y respiración.',
    price: 30,
    currency: 'USD',
    duration: '35 min',
    difficulty: 'Intermedio',
    category: 'Pilates',
    teacher: {
      id: 'teacher-5',
      name: 'Sofia Martínez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      students: 680,
      country: 'Colombia'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    exercises: ['Hundred', 'Roll Up', 'Single Leg Circles', 'Criss Cross', 'Teaser'],
    benefits: ['Fortalece core', 'Mejora postura', 'Desarrolla control', 'Reduce dolor lumbar'],
    requirements: ['Mat de Pilates', 'Ropa cómoda', 'Concentración'],
    createdAt: new Date('2024-01-25'),
    isPopular: false
  },
  {
    id: '6',
    title: 'Meditación Guiada - Mindfulness',
    description: 'Sesión de meditación mindfulness de 20 minutos para reducir el estrés y mejorar la claridad mental.',
    price: 15,
    currency: 'USD',
    duration: '20 min',
    difficulty: 'Principiante',
    category: 'Meditación',
    teacher: {
      id: 'teacher-6',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      students: 2100,
      country: 'Corea del Sur'
    },
    reelUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    exercises: ['Respiración consciente', 'Body Scan', 'Meditación caminando', 'Loving Kindness', 'Relajación profunda'],
    benefits: ['Reduce estrés', 'Mejora concentración', 'Desarrolla mindfulness', 'Mejora sueño'],
    requirements: ['Lugar tranquilo', 'Ropa cómoda', 'Actitud abierta'],
    createdAt: new Date('2024-01-28'),
    isPopular: true
  }
];
