
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

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex gap-4 mb-12"
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const isCorrect = inputWord[index] === targetWord[index];
        const hasInput = index < inputWord.length;

        return (
          <div
            key={index}
            className={`w-16 h-20 flex items-center justify-center text-3xl font-bold rounded-xl border-2 transition-colors duration-300 ${
              hasInput
                ? isCorrect
                  ? "bg-green-500 border-green-400 text-white"
                  : "bg-red-500 border-red-400 text-white"
                : "bg-white/10 border-white/20 text-white"
            }`}
          >
            {hasInput ? inputWord[index] : ""}
          </div>
        );
      })}
    </motion.div>
  );
}
