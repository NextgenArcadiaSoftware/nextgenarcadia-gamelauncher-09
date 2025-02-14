
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
        const hasInput = index < inputWord.length;
        const letter = hasInput ? inputWord[index] : "";

        return (
          <div
            key={index}
            className={`w-24 h-24 flex items-center justify-center text-4xl font-bold bg-neutral-400 text-black`}
          >
            {letter}
          </div>
        );
      })}
    </motion.div>
  );
}
