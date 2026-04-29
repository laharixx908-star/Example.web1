/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import CustomCursor from './components/CustomCursor';
import GameCard from './components/GameCard';
import TicTacToeGame from './components/TicTacToeGame';
import SnakeGame from './components/SnakeGame';
import VoidRacer from './components/VoidRacer';
import RetroBackground from './components/RetroBackground';
import { sounds } from './lib/sounds';

type ViewState = 'landing' | 'grid' | 'snake' | 'tictactoe' | 'racer';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isIgniting, setIsIgniting] = useState(false);

  const games = [
    {
      id: 'snake',
      title: 'NEON SNAKE',
      description: 'Navigate the grid, collect energy, grow long. Classic arcade reimagined.',
      accent: '#39ff14',
    },
    {
      id: 'tictactoe',
      title: 'TITAN TOE',
      description: 'Strategic alignment in a neon-infused battle for grid supremacy.',
      accent: '#00ffff',
      multiplayer: true
    },
    {
      id: 'racer',
      title: 'VOID RACER',
      description: 'High-speed dodging through the electronic void. Don\'t crash.',
      accent: '#ff00ff',
    }
  ];

  const handleStart = () => {
    if (isIgniting) return;
    setIsIgniting(true);
    sounds.playIgnition();
    // Simulate engine start
    setTimeout(() => {
      setView('grid');
      setIsIgniting(false);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-[var(--neon-blue)]/30 overflow-hidden">
      <CustomCursor />
      <RetroBackground />
      <div className="scanline" />

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 3, opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 0.8, ease: 'easeIn' }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            {/* The Car Rear / License Plate Focus */}
            <div className="relative group cursor-pointer" onClick={handleStart}>
               {/* Car Body Sketch Style */}
               <div className="absolute -top-40 -left-60 -right-60 h-80 bg-gradient-to-t from-gray-900 to-transparent rounded-full opacity-50 blur-3xl" />
               
               {/* Taillights */}
               <motion.div 
                 animate={{ opacity: isIgniting ? [0.8, 1, 0.8] : [0.3, 0.8, 0.3] }}
                 transition={{ repeat: Infinity, duration: 0.2 }}
                 className="absolute -top-12 -left-48 w-32 h-8 bg-red-600 rounded-full blur-md shadow-[0_0_30px_red]" 
               />
               <motion.div 
                 animate={{ opacity: isIgniting ? [0.8, 1, 0.8] : [0.3, 0.8, 0.3] }}
                 transition={{ repeat: Infinity, duration: 0.2 }}
                 className="absolute -top-12 -right-48 w-32 h-8 bg-red-600 rounded-full blur-md shadow-[0_0_30px_red]" 
               />

               {/* Exhaust / Fire effect */}
               {isIgniting && (
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-40 justify-center">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, scale: 1 }}
                        animate={{ opacity: [1, 0], y: [0, 80], scale: [1, 2] }}
                        transition={{ repeat: Infinity, duration: 0.3, delay: Math.random() * 0.2 }}
                        className="w-4 h-4 bg-orange-500 rounded-full blur-sm shadow-[0_0_15px_orange]"
                        style={{ position: 'absolute', left: i < 6 ? -160 : 160 }}
                      />
                    ))}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`blue-${i}`}
                        initial={{ opacity: 0, y: 0, scale: 1 }}
                        animate={{ opacity: [1, 0], y: [0, 40], scale: [1, 1.5] }}
                        transition={{ repeat: Infinity, duration: 0.2, delay: Math.random() * 0.1 }}
                        className="w-3 h-3 bg-cyan-400 rounded-full blur-sm shadow-[0_0_10px_cyan]"
                        style={{ position: 'absolute', left: i < 3 ? -160 : 160 }}
                      />
                    ))}
                 </div>
               )}

                {/* License Plate Button */}
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isIgniting ? { 
                    x: [0, -2, 2, -2, 0],
                    transition: { repeat: Infinity, duration: 0.1 }
                  } : {}}
                  className="license-plate w-80 h-40 flex flex-col items-center justify-center p-4"
                >
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em] mb-1">NEON STATE</div>
                  <div className="text-6xl font-black text-gray-800 tracking-tighter flex items-center justify-center">
                    ST<span className="text-neon-blue inline-block mx-1">★</span>RT
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400" />
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DRIVE SYSTEM</div>
                    <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400" />
                  </div>
                </motion.div>

                {/* Ground Glow */}
                <motion.div 
                  animate={isIgniting ? { 
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1]
                  } : {}}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-96 h-10 bg-neon-blue/20 blur-2xl rounded-full" 
                />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center"
            >
              <h1 className="text-3xl font-black italic tracking-tighter text-white/50 uppercase">
                {isIgniting ? 'Ignition sequence active' : 'Press plate to ignite'}
              </h1>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 md:p-16 max-w-7xl mx-auto min-h-screen"
          >
            <AnimatePresence mode="wait">
              {view === 'grid' && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="space-y-12"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-6xl font-black italic tracking-tighter">SELECT MISSION</h2>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-[0.5em]">System Core: Fully Operational</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                    {games.map((game) => (
                      <GameCard
                        key={game.id}
                        id={game.id}
                        title={game.title}
                        description={game.description}
                        accent={game.accent}
                        multiplayer={game.multiplayer}
                        image=""
                        onPlay={() => setView(game.id as ViewState)}
                      />
                    ))}
                  </div>

                  {/* Quick System Exit */}
                  <div className="flex justify-center pt-20">
                    <button 
                      onClick={() => { sounds.playClick(); setView('landing'); }}
                      className="px-6 py-2 border border-white/10 text-gray-500 hover:text-white hover:border-white/30 rounded-full text-[10px] font-mono transition-all uppercase tracking-widest"
                    >
                      Disable Ignition / Exit
                    </button>
                  </div>
                </motion.div>
              )}

              {view === 'snake' && (
                <motion.div key="game-snake" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <GameControls back={() => setView('grid')} title="NEON SNAKE" />
                  <SnakeGame />
                </motion.div>
              )}

              {view === 'tictactoe' && (
                <motion.div key="game-toe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <GameControls back={() => setView('grid')} title="TITAN TOE" />
                  <TicTacToeGame />
                </motion.div>
              )}

              {view === 'racer' && (
                <motion.div key="game-racer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <GameControls back={() => setView('grid')} title="VOID RACER" />
                  <VoidRacer />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameControls({ back, title }: { back: () => void, title: string }) {
  return (
    <div className="w-full max-w-md flex justify-between items-center mb-8">
      <button 
        onClick={() => { sounds.playClick(); back(); }}
        className="text-[10px] font-mono text-gray-400 hover:text-white uppercase tracking-widest px-4 py-2 bg-white/5 rounded-lg border border-white/10"
      >
        ← ABORT
      </button>
      <h3 className="text-xl font-black italic tracking-tighter text-neon-blue">{title}</h3>
      <div className="w-12" /> {/* alignment spacer */}
    </div>
  );
}

