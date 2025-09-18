import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

interface CartIconProps {
  onClick?: () => void;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick, className = '' }) => {
  const { state } = useCart();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-zen-600 transition-colors ${className}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg>
      
      {state.itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-zen-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
        >
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </motion.div>
      )}
    </motion.button>
  );
};

export default CartIcon;
