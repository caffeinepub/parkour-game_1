import { useState } from 'react';
import { formatTime } from '../lib/useTimer';

interface NameEntryDialogProps {
  time: number;
  rank: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function NameEntryDialog({ time, rank, onSubmit, onCancel }: NameEntryDialogProps) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-game-surface border-2 border-neon-pink shadow-[0_0_40px_rgba(255,45,120,0.4)] rounded-lg p-8 w-full max-w-md mx-4">
        <h2 className="text-neon-pink font-black text-3xl tracking-widest text-center mb-2">
          RUN COMPLETE!
        </h2>
        <div className="text-center mb-6">
          <div className="text-neon-green font-mono text-5xl font-black tracking-widest mb-1">
            {formatTime(time)}
          </div>
          <div className="text-neon-blue/70 font-mono text-sm tracking-wider">
            {rank <= 10 ? `🏆 RANK #${rank} ON LEADERBOARD` : 'Keep practicing!'}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-neon-blue/70 font-mono text-xs tracking-widest mb-2 uppercase">
            Enter Your Name (max 12 chars)
          </label>
          <input
            type="text"
            maxLength={12}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit(name)}
            placeholder="PLAYER"
            className="w-full bg-black/60 border-2 border-neon-blue/40 text-neon-blue font-mono text-xl
              tracking-widest px-4 py-3 rounded focus:outline-none focus:border-neon-blue
              focus:shadow-[0_0_15px_rgba(0,212,255,0.4)] placeholder:text-neon-blue/20 uppercase"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSubmit(name)}
            className="flex-1 py-3 bg-neon-pink/20 border-2 border-neon-pink text-neon-pink font-black
              tracking-widest hover:bg-neon-pink/30 hover:shadow-[0_0_20px_rgba(255,45,120,0.5)]
              transition-all duration-200 rounded"
          >
            SAVE SCORE
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-black/40 border-2 border-neon-blue/30 text-neon-blue/50 font-black
              tracking-widest hover:border-neon-blue/60 hover:text-neon-blue/70
              transition-all duration-200 rounded"
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}
