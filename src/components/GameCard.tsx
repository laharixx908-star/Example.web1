import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { sounds } from '@/src/lib/sounds';

interface GameCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  accent: string;
  multiplayer?: boolean;
  onPlay: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, accent, multiplayer, onPlay }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative bg-[#121212] border border-[#ffffff10] rounded-2xl overflow-hidden shadow-2xl"
    >
      <div 
        className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundColor: `${accent}20`, backgroundImage: `linear-gradient(45deg, ${accent}40, transparent)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
           <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              sounds.playSuccess();
              onPlay();
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center bg-white text-black shadow-xl"
           >
             <Play fill="black" size={32} />
           </motion.button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}></div>
           <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>
        <div className="flex justify-between items-center text-xs font-mono text-gray-500 uppercase tracking-widest">
           <span>multiplayer: {multiplayer ? 'YES' : 'NO'}</span>
           <span>ver: 1.0.4</span>
        </div>
      </div>

      {/* Decorative border glow */}
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-300 group-hover:w-full"
        style={{ width: '0%', backgroundColor: accent, boxShadow: `0 0 15px ${accent}` }}
      ></div>
    </motion.div>
  );
};

export default GameCard;
