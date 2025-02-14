
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
      className={`
        ${variant === 'wide' ? 'px-12' : 'px-3'} 
        py-2.5 
        text-sm 
        font-medium 
        bg-white/90 
        hover:bg-white 
        text-black 
        rounded-lg 
        transition-colors 
        duration-200 
        disabled:opacity-50 
        disabled:cursor-not-allowed
        min-w-[2.5rem]
      `}
    >
      {children}
    </motion.button>
  );
}
