
interface InputDisplayProps {
  inputWord: string;
  targetWord: string;
}

export function InputDisplay({ inputWord, targetWord }: InputDisplayProps) {
  return (
    <div className="mb-12 flex gap-6">
      {targetWord.split('').map((char, index) => (
        <div
          key={index}
          className={`w-24 h-24 ${
            index < inputWord.length
              ? inputWord[index].toLowerCase() === targetWord[index].toLowerCase()
                ? 'bg-gray-500' 
                : 'bg-gray-400'
              : 'bg-gray-500'
          } rounded-lg flex items-center justify-center text-5xl font-bold text-black animate-scale-in transition-all duration-200`}
        >
          {index < inputWord.length ? inputWord[index] : char}
        </div>
      ))}
    </div>
  );
}
