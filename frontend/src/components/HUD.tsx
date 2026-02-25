import { Screen } from '../App';

interface HUDProps {
  timeFormatted: string;
  finished: boolean;
  running: boolean;
  onRestart: () => void;
  onNavigate: (s: Screen) => void;
}

export default function HUD({ timeFormatted, finished, running, onRestart, onNavigate }: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Timer */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div
          className={`font-mono text-4xl font-black tracking-widest px-6 py-2 rounded border-2 backdrop-blur-sm
            ${finished
              ? 'text-neon-pink border-neon-pink shadow-[0_0_20px_rgba(255,45,120,0.8)]'
              : running
              ? 'text-neon-green border-neon-green shadow-[0_0_20px_rgba(57,255,20,0.5)]'
              : 'text-neon-blue border-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.4)]'
            } bg-black/60`}
        >
          {timeFormatted}
        </div>
        {finished && (
          <div className="text-neon-pink font-black text-lg tracking-widest animate-pulse">
            ✓ FINISH!
          </div>
        )}
      </div>

      {/* Controls hint */}
      {!running && !finished && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-neon-blue/70 text-sm font-mono tracking-wider">
            CLICK TO LOCK MOUSE · WASD MOVE · SPACE JUMP · SHIFT RUN
          </p>
          <p className="text-neon-blue/50 text-xs font-mono mt-1">
            Leave the green start zone to begin the timer
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onRestart}
          className="px-4 py-2 bg-black/70 border border-neon-orange text-neon-orange font-black text-sm tracking-widest
            hover:bg-neon-orange/20 hover:shadow-[0_0_15px_rgba(255,106,0,0.6)] transition-all duration-200 rounded"
        >
          ↺ RESTART
        </button>
        <button
          onClick={() => onNavigate('menu')}
          className="px-4 py-2 bg-black/70 border border-neon-blue/50 text-neon-blue/70 font-black text-sm tracking-widest
            hover:bg-neon-blue/10 hover:border-neon-blue hover:text-neon-blue transition-all duration-200 rounded"
        >
          ← MENU
        </button>
      </div>

      {/* Minimap / progress indicator */}
      <div className="absolute bottom-4 left-4 bg-black/70 border border-neon-blue/30 rounded p-2">
        <p className="text-neon-blue/60 text-xs font-mono tracking-wider">PARKOUR RUSH</p>
        <p className="text-neon-blue/40 text-xs font-mono">Double-jump enabled</p>
      </div>
    </div>
  );
}
