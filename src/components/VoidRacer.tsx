import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { sounds } from '@/src/lib/sounds';
import { Trophy, RotateCcw } from 'lucide-react';

export default function VoidRacer() {
  const [playerPosition, setPlayerPosition] = useState(1); // 0: left, 1: center, 2: right
  const [obstacles, setObstacles] = useState<{ id: number; lane: number; y: number; type: 'hazard' | 'energy' }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNitro, setIsNitro] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  const spawnObstacle = () => {
    const lane = Math.floor(Math.random() * 3);
    const type = Math.random() > 0.8 ? 'energy' : 'hazard';
    setObstacles(prev => [...prev, { id: Date.now(), lane, y: -100, type }]);
  };

  const restart = () => {
    setObstacles([]);
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setIsPlaying(true);
    setPlayerPosition(1);
    setIsNitro(false);
    sounds.playSuccess();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setObstacles(prev => {
        const speed = 10 + (scoreRef.current / 500) + (isNitro ? 15 : 0);
        const next = prev
          .map(obs => ({ ...obs, y: obs.y + speed }))
          .filter(obs => obs.y < 800);
        
        // Collision check
        const collision = next.find(obs => 
          obs.y > 550 && obs.y < 650 && obs.lane === playerPosition
        );

        if (collision) {
          if (collision.type === 'hazard') {
            setGameOver(true);
            setIsPlaying(false);
            sounds.playGameOver();
            if (scoreRef.current > highScore) setHighScore(scoreRef.current);
          } else {
            // Energy core
            sounds.playSuccess();
            setIsNitro(true);
            scoreRef.current += 100;
            setTimeout(() => setIsNitro(false), 2000);
            return next.filter(o => o.id !== collision.id);
          }
        }

        return next;
      });
      
      scoreRef.current += isNitro ? 3 : 1;
      setScore(scoreRef.current);
    }, 16);

    const spawnInterval = setInterval(spawnObstacle, isNitro ? 400 : 800);

    return () => {
      clearInterval(interval);
      clearInterval(spawnInterval);
    };
  }, [isPlaying, gameOver, playerPosition, highScore, isNitro]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerPosition(p => Math.max(0, p - 1));
        sounds.playMove();
      }
      if (e.key === 'ArrowRight') {
        setPlayerPosition(p => Math.min(2, p + 1));
        sounds.playMove();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-glass rounded-3xl border border-[#ffffff10] max-w-md w-full mx-auto relative overflow-hidden h-[600px]">
      <div className="absolute top-4 left-0 w-full flex justify-between px-6 z-20">
        <div className="text-neon-pink font-black text-2xl tracking-tighter">{score}</div>
        <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
          <Trophy size={14} /> {highScore}
        </div>
      </div>

      {/* Road Grid */}
      <div className={`relative w-full h-full bg-[#0a0a1f] border-x border-white/10 overflow-hidden transition-all duration-300 ${isNitro ? 'shadow-[inset_0_0_50px_var(--neon-blue)]' : ''}`}>
        {/* Sky / Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a1a4e_0%,_transparent_100%)] opacity-30" />

        {/* Lanes */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-white/5" />
          <div className="flex-1 border-r border-white/5" />
          <div className="flex-1" />
        </div>

        {/* Dynamic Speed Lines */}
        <div className="absolute inset-0">
          {[...Array(isNitro ? 20 : 8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 800, opacity: [0, 0.5, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: isNitro ? 0.2 : 0.6, 
                delay: i * 0.1, 
                ease: 'linear' 
              }}
              className={`absolute w-[1px] ${isNitro ? 'bg-cyan-300 h-40' : 'bg-white/20 h-20'}`}
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <motion.div
            key={obs.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-1/3 p-4 flex items-center justify-center transition-all duration-75"
            style={{ 
              top: obs.y, 
              left: `${(obs.lane * 33.33)}%`,
              height: '80px'
            }}
          >
            {obs.type === 'hazard' ? (
              <div className="w-full h-full bg-gradient-to-br from-rose-500 to-[#9d00ff] rounded-xl shadow-[0_0_20px_#ff0055] border-2 border-white/20" />
            ) : (
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 bg-[var(--neon-blue)] rounded-full shadow-[0_0_30px_var(--neon-blue)] flex items-center justify-center border-4 border-white"
              >
                <div className="w-4 h-4 bg-white rounded-full animate-ping" />
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Player Car */}
        <motion.div
          animate={{ 
            x: `${(playerPosition * 100)}%`,
            y: isNitro ? [0, -2, 2, 0] : 0 
          }}
          transition={{ 
            x: { type: 'spring', damping: 15 },
            y: { repeat: Infinity, duration: 0.1 }
          }}
          className="absolute bottom-10 left-0 w-1/3 h-20 p-2 z-10"
        >
          <div className={`w-full h-full rounded-2xl relative transition-all duration-300 ${isNitro ? 'bg-white scale-110 shadow-[0_0_40px_white]' : 'bg-[var(--neon-blue)] shadow-[0_0_25px_var(--neon-blue)]'}`}>
            {/* Windshield */}
            <div className="absolute top-2 left-3 right-3 h-4 bg-black/40 rounded-t-lg" />
            {/* Nitro Flames */}
            {isNitro && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                <motion.div animate={{ height: [20, 60, 20] }} transition={{ repeat: Infinity, duration: 0.1 }} className="w-2 bg-gradient-to-t from-transparent to-cyan-400 blur-sm" />
                <motion.div animate={{ height: [20, 60, 20] }} transition={{ repeat: Infinity, duration: 0.1, delay: 0.05 }} className="w-2 bg-gradient-to-t from-transparent to-cyan-400 blur-sm" />
              </div>
            )}
            <div className="absolute -bottom-1 -left-1 w-3 h-1 bg-red-500 shadow-[0_0_10px_red]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-1 bg-red-500 shadow-[0_0_10px_red]" />
          </div>
        </motion.div>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30 p-8 text-center">
            <h2 className="text-2xl font-black italic mb-6">VOID RACER</h2>
            <p className="text-gray-400 text-sm mb-8">Catch blue CORES for NITRO boost. Dodge the hazards.</p>
            <button onClick={() => setIsPlaying(true)} className="px-12 py-5 bg-white text-black font-black rounded-full shadow-[0_0_30px_white] tracking-widest text-lg">
              IGNITE ENGINE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-30">
            <div className="text-6xl font-black text-rose-500 mb-8 italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">CRASHED</div>
            <button onClick={restart} className="flex items-center gap-4 px-10 py-4 bg-white text-black font-bold rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95">
              <RotateCcw size={24} /> <span className="tracking-widest">RESPAWN</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-4">
        <div className="flex gap-2">
          <span className="p-1 px-3 border border-white/20 rounded-md bg-white/5">←</span>
          <span className="p-1 px-3 border border-white/20 rounded-md bg-white/5">→</span>
        </div>
        TO MANEUVER
      </div>
    </div>
  );
}
