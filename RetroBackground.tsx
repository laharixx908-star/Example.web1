import React from 'react';
import { motion } from 'motion/react';

const Particle: React.FC<{ delay: number }> = ({ delay }) => {
  const size = Math.random() * 4 + 1;
  const left = Math.random() * 100;
  const duration = Math.random() * 10 + 10;

  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0, x: `${left}vw` }}
      animate={{ 
        y: '-10vh', 
        opacity: [0, 0.3, 0],
        x: [`${left}vw`, `${left + (Math.random() * 10 - 5)}vw`]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        delay,
        ease: 'linear'
      }}
      className="absolute rounded-full bg-[var(--neon-blue)] blur-[1px]"
      style={{ width: size, height: size }}
    />
  );
};

export default function RetroBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-2]">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#0a0a1a_0%,_#050505_100%)]" />
      
      {/* Moving Grid */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(var(--neon-blue) 1px, transparent 1px), linear-gradient(90deg, var(--neon-blue) 1px, transparent 1px)',
             backgroundSize: '100px 100px',
             perspective: '800px'
           }}>
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '0px 100px'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{ transform: 'rotateX(60deg) translateY(-30%) scale(2)', transformOrigin: 'top' }}
        />
      </div>

      {/* Floating Shards and Code */}
      {[...Array(8)].map((_, i) => (
        <React.Fragment key={`meta-${i}`}>
          <motion.div
            initial={{ opacity: 0, x: `${Math.random() * 100}vw`, y: '110vh' }}
            animate={{ opacity: [0, 0.2, 0], y: '-10vh' }}
            transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, delay: i * 3, ease: 'linear' }}
            className="absolute font-mono text-[8px] text-[var(--neon-blue)]/40 pointer-events-none"
          >
            {`0x${Math.random().toString(16).slice(2, 10).toUpperCase()} // SYSTEM_LOAD_${i}`}
          </motion.div>
          
          <motion.div
            initial={{ 
              opacity: 0, 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
              rotate: 0 
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              rotate: 360,
              y: ['100vh', '-10vh']
            }}
            transition={{ 
              duration: Math.random() * 20 + 10, 
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear'
            }}
            className="absolute border border-white/10 bg-white/5 backdrop-blur-sm"
            style={{ 
              width: Math.random() * 100 + 50, 
              height: Math.random() * 50 + 20,
              transform: `skew(${Math.random() * 20}deg)`
            }}
          >
            <div className="w-full h-1 bg-[var(--neon-blue)]/30" />
            <div className="p-1 flex gap-1">
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="w-1 h-1 bg-white/20 rounded-full" />
            </div>
          </motion.div>
        </React.Fragment>
      ))}

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}

      {/* Nebula Globs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%']
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[var(--neon-purple)] rounded-full blur-[150px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%']
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-[var(--neon-blue)] rounded-full blur-[150px]"
      />
    </div>
  );
}
