import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// 🛒 TIPOS PARA EL CARRITO
export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  difficulty: string;
  duration: number;
  instructor: string;
  image?: string;
  videoUrl?: string;
  benefits: string[];
  requirements: string[];
  exercises: string[];
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
}

// 🎯 ACCIONES DEL CARRITO
type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } };

// 📊 ESTADO INICIAL
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// 🔄 REDUCER DEL CARRITO
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Si el item ya existe, no lo agregamos de nuevo (cada clase es única)
        return state;
      }
      
      const newItems = [...state.items, action.payload];
      const total = newItems.reduce((sum, item) => sum + item.price, 0);
      
      return {
        items: newItems,
        total,
        itemCount: newItems.length,
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.price, 0);
      
      return {
        items: newItems,
        total,
        itemCount: newItems.length,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    case 'UPDATE_QUANTITY': {
      // Para clases individuales, la cantidad siempre es 1
      return state;
    }
    
    default:
      return state;
  }
};

// 🏪 CONTEXTO DEL CARRITO
const CartContext = createContext<CartContextType | undefined>(undefined);

// 🎁 PROVEEDOR DEL CARRITO
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // 💾 CARGAR CARRITO DESDE LOCALSTORAGE AL INICIALIZAR
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.items.length > 0) {
      // Restaurar el carrito guardado
      savedCart.items.forEach(item => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
      });
    }
  }, []);

  // 💾 GUARDAR CARRITO EN LOCALSTORAGE CUANDO CAMBIE
  useEffect(() => {
    if (state.items.length > 0) {
      saveCartToStorage(state);
    }
  }, [state]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// 🎯 HOOK PARA USAR EL CARRITO
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 💾 PERSISTENCIA EN LOCALSTORAGE
export const saveCartToStorage = (cart: CartState) => {
  try {
    localStorage.setItem('flowcasa-zen-cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const loadCartFromStorage = (): CartState => {
  try {
    const savedCart = localStorage.getItem('flowcasa-zen-cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return initialState;
};
