
import { motion } from "framer-motion";
import React from 'react';

interface KeyboardButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'wide';
}

export function KeyboardButton({ children, onClick, disabled, variant = 'default' }: KeyboardButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${
        variant === 'wide' ? 'col-span-2' : ''
      } p-4 text-2xl font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </motion.button>
  );
}
