import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

interface AnimatedButtonProps {
  path: string;
  text: string;
  style?: string;
  type: "button" | "submit" | "reset" | undefined;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ path, text, type, style }: AnimatedButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleButtonClick = useCallback(() => {
    router.push(path);
  }, [path]);

  return (
    <button
      type={type}
      className={style ? `${style} hover:bg-indigo-600 focus:outline-none transition-colors duration-300 ${hovered ? 'scale-110' : ''}` : `bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors duration-300 ${hovered ? 'scale-110' : ''
    }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleButtonClick}
    >
      {text}

    </button>
  );
};

export default AnimatedButton;