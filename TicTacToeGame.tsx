import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '@/src/lib/sounds';
import { X, Circle, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every(s => s !== null)) return { winner: 'Draw' as const, line: null };
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    
    sounds.playMove();
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'Draw') sounds.playGameOver();
      else sounds.playSuccess();
    }
  }, [board]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    sounds.playClick();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-glass rounded-3xl border border-[#ffffff10] max-w-md w-full mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black italic tracking-tighter mb-2 text-neon-blue">TIC TAC TOE</h2>
        <div className="text-gray-400 font-mono text-sm">
          {winner ? (
            winner === 'Draw' ? "IT'S A DRAW!" : `PLAYER ${winner} WINS!`
          ) : (
            `NEXT PLAYER: ${isXNext ? 'X' : 'O'}`
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold bg-[#1a1a2e]/50 border border-[#ffffff10] transition-colors
              ${winningLine?.includes(i) ? 'bg-[var(--neon-green)]/20 border-[var(--neon-green)]/50 text-[var(--neon-green)]' : ''}
              ${!cell && !winner ? 'hover:border-[var(--neon-blue)]/50 cursor-pointer' : 'cursor-default'}
            `}
          >
            <AnimatePresence mode="wait">
              {cell === 'X' && (
                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                  <X size={48} className="text-[#ff0055] drop-shadow-[0_0_10px_#ff0055]" />
                </motion.div>
              )}
              {cell === 'O' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Circle size={40} className="text-[#00ffe1] drop-shadow-[0_0_10px_#00ffe1]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px var(--neon-purple)' }}
        whileTap={{ scale: 0.95 }}
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-purple)] rounded-full font-bold text-sm tracking-widest uppercase shadow-lg shadow-[var(--neon-purple)]/20"
      >
        <RotateCcw size={18} />
        REMATCH
      </motion.button>
    </div>
  );
}
