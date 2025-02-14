
interface InputDisplayProps {
  inputWord: string;
  targetWord: string;
}

export function InputDisplay({ inputWord, targetWord }: InputDisplayProps) {
  return (
    <div className="mb-8 flex gap-2">
      {targetWord.split('').map((_, index) => (
        <div
          key={index}
          className={`w-12 h-12 border-2 ${
            inputWord[index] 
              ? inputWord[index].toLowerCase() === targetWord[index].toLowerCase()
                ? 'border-green-500 bg-green-500/20 scale-110' 
                : 'border-red-500 bg-red-500/20'
              : 'border-white/50 bg-white/10'
          } rounded-lg flex items-center justify-center text-2xl font-bold text-white animate-scale-in transition-all duration-200`}
        >
          {inputWord[index] || ''}
        </div>
      ))}
    </div>
  );
}
