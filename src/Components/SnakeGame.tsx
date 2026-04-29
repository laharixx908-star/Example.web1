import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { sounds } from '@/src/lib/sounds';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: any[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood!.x && segment.y === newFood!.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        sounds.playMove(); // Use move sound for eating too
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPlaying, gameOver, food, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    sounds.playGameOver();
    if (score > highScore) setHighScore(score);
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const interval = setInterval(moveSnake, 150);
      return () => clearInterval(interval);
    }
  }, [isPlaying, gameOver, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const reset = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPlaying(true);
    setScore(0);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-glass rounded-3xl border border-[#ffffff10] max-w-md w-full mx-auto relative overflow-hidden">
      <div className="w-full flex justify-between mb-8">
        <div>
           <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Current Score</div>
           <div className="text-3xl font-black text-neon-green">{score}</div>
        </div>
        <div className="text-right">
           <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-1">Top Score</div>
           <div className="text-3xl font-black text-gray-300 flex items-center justify-end gap-2">
             {highScore} <Trophy size={20} className="text-[var(--neon-blue)]" />
           </div>
        </div>
      </div>

      <div 
        className="relative bg-black/40 border border-[#ffffff20] rounded-xl overflow-hidden"
        style={{ 
          width: '100%', 
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`rounded-sm z-10 transition-all ${i === 0 ? 'bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]' : 'bg-[var(--neon-green)]/60'}`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1 
            }}
          />
        ))}

        <motion.div
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ repeat: Infinity, duration: 1 }}
           className="bg-[var(--neon-pink)] rounded-full shadow-[0_0_10px_var(--neon-pink)] z-10"
           style={{ 
             gridColumnStart: food.x + 1, 
             gridRowStart: food.y + 1 
           }}
        />

        {(!isPlaying && !gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
             <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={reset}
               className="w-20 h-20 rounded-full bg-[var(--neon-blue)] flex items-center justify-center text-black shadow-[0_0_20px_var(--neon-blue)]"
             >
               <Play fill="black" size={40} className="ml-1" />
             </motion.button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20">
             <div className="text-4xl font-black text-rose-500 mb-6 italic tracking-tighter">WASTED</div>
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={reset}
               className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl uppercase tracking-widest text-sm"
             >
               <RotateCcw size={18} />
               RESPAWN
             </motion.button>
          </div>
        )}
      </div>

      <div className="mt-8 text-gray-500 font-mono text-[10px] text-center uppercase tracking-widest flex items-center gap-4">
        <div className="flex gap-1"><span className="p-1 px-2 border border-[#ffffff20] rounded bg-white/5 text-gray-300">↑↓←→</span> to navigate</div>
      </div>
    </div>
  );
}
