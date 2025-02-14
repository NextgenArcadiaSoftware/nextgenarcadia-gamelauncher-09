
import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';

interface InputDisplayProps {
  inputWord: string;
  targetWord: string;
}

export function InputDisplay({ inputWord, targetWord }: InputDisplayProps) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (inputWord.length > 0 && inputWord !== targetWord.slice(0, inputWord.length)) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [inputWord, targetWord]);

  // For debugging
  console.log('Input Word:', inputWord);
  console.log('Target Word:', targetWord);
  console.log('Input Length:', inputWord.length);

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex gap-4 mb-12"
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const hasInput = index < inputWord.length;
        const letter = hasInput ? inputWord[index] : "";
        
        // Compare with target word regardless of case
        const isCorrect = hasInput && 
          inputWord[index].toUpperCase() === targetWord[index].toUpperCase();

        return (
          <div
            key={index}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-bold 
              ${hasInput 
                ? isCorrect 
                  ? 'bg-emerald-400 text-white' 
                  : 'bg-rose-400 text-white'
                : 'bg-neutral-400 text-black'
              } 
              transition-colors duration-300`}
          >
            {letter}
          </div>
        );
      })}
    </motion.div>
  );
}
