import { useLeaderboard } from '../lib/useLeaderboard';
import { Screen } from '../App';
import { formatTime } from '../lib/useTimer';
import { Trophy, Medal, ArrowLeft } from 'lucide-react';

interface LeaderboardProps {
  onNavigate: (s: Screen) => void;
  highlightTime?: number;
}

const RANK_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];
const RANK_ICONS  = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ onNavigate, highlightTime }: LeaderboardProps) {
  const { entries } = useLeaderboard();

  return (
    <div className="w-full h-full bg-game-bg flex flex-col items-center justify-start overflow-auto py-8 px-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="text-neon-orange w-8 h-8" />
            <h1 className="text-neon-orange font-black text-4xl tracking-widest">LEADERBOARD</h1>
            <Trophy className="text-neon-orange w-8 h-8" />
          </div>
          <p className="text-neon-blue/50 font-mono text-sm tracking-widest">TOP 10 FASTEST RUNS</p>
        </div>

        {/* Table */}
        <div className="bg-black/60 border border-neon-blue/20 rounded-lg overflow-hidden mb-6">
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <Medal className="w-12 h-12 text-neon-blue/30 mx-auto mb-4" />
              <p className="text-neon-blue/40 font-mono text-lg tracking-widest">NO RECORDS YET</p>
              <p className="text-neon-blue/20 font-mono text-sm mt-2">Complete a run to set the first record!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/20">
                  <th className="text-neon-blue/50 font-mono text-xs tracking-widest py-3 px-4 text-left w-16">RANK</th>
                  <th className="text-neon-blue/50 font-mono text-xs tracking-widest py-3 px-4 text-left">PLAYER</th>
                  <th className="text-neon-blue/50 font-mono text-xs tracking-widest py-3 px-4 text-right">TIME</th>
                  <th className="text-neon-blue/50 font-mono text-xs tracking-widest py-3 px-4 text-right hidden sm:table-cell">DATE</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const isHighlight = highlightTime !== undefined && entry.time === highlightTime;
                  const rankColor = i < 3 ? RANK_COLORS[i] : undefined;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-neon-blue/10 transition-colors
                        ${isHighlight ? 'bg-neon-pink/10' : i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-black text-lg" style={{ color: rankColor || '#4a5568' }}>
                          {i < 3 ? RANK_ICONS[i] : `#${i + 1}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-black tracking-wider text-sm
                          ${isHighlight ? 'text-neon-pink' : 'text-white/80'}`}>
                          {entry.name.toUpperCase()}
                        </span>
                        {isHighlight && <span className="ml-2 text-neon-pink text-xs">← YOU</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-mono font-black text-lg
                          ${i === 0 ? 'text-neon-green' : isHighlight ? 'text-neon-pink' : 'text-neon-blue/80'}`}>
                          {formatTime(entry.time)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <span className="text-neon-blue/30 font-mono text-xs">{entry.date}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2 px-6 py-3 bg-black/60 border-2 border-neon-blue/40
              text-neon-blue font-black tracking-widest hover:border-neon-blue
              hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-200 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO MENU
          </button>
          <button
            onClick={() => onNavigate('game')}
            className="flex items-center gap-2 px-6 py-3 bg-neon-orange/20 border-2 border-neon-orange
              text-neon-orange font-black tracking-widest hover:bg-neon-orange/30
              hover:shadow-[0_0_20px_rgba(255,106,0,0.5)] transition-all duration-200 rounded"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-auto pt-8 text-center">
        <p className="text-neon-blue/20 font-mono text-xs">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'parkour-rush')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue/40 hover:text-neon-blue/60 transition-colors"
          >
            caffeine.ai
          </a>
          {' '}· © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
