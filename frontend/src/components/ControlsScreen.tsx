import { Screen } from '../App';
import { ArrowLeft, Keyboard, Mouse } from 'lucide-react';

interface ControlsScreenProps {
  onNavigate: (s: Screen) => void;
}

const CONTROLS = [
  { key: 'W / ↑',       action: 'Move Forward',       category: 'movement' },
  { key: 'S / ↓',       action: 'Move Backward',      category: 'movement' },
  { key: 'A / ←',       action: 'Strafe Left',         category: 'movement' },
  { key: 'D / →',       action: 'Strafe Right',        category: 'movement' },
  { key: 'SHIFT',        action: 'Sprint (faster run)', category: 'movement' },
  { key: 'SPACE',        action: 'Jump',                category: 'action' },
  { key: 'SPACE (air)',  action: 'Double Jump',         category: 'action' },
  { key: 'CLICK',        action: 'Lock Mouse for Look', category: 'mouse' },
  { key: 'MOUSE MOVE',   action: 'Look Around (camera)', category: 'mouse' },
  { key: 'ESC',          action: 'Unlock Mouse',        category: 'mouse' },
];

const CATEGORY_COLORS: Record<string, string> = {
  movement: 'text-neon-blue',
  action:   'text-neon-green',
  mouse:    'text-neon-orange',
};

export default function ControlsScreen({ onNavigate }: ControlsScreenProps) {
  return (
    <div className="w-full h-full bg-game-bg flex flex-col items-center justify-center overflow-auto py-8 px-4">
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Keyboard className="text-neon-blue w-7 h-7" />
            <h1 className="text-neon-blue font-black text-4xl tracking-widest">CONTROLS</h1>
            <Mouse className="text-neon-blue w-7 h-7" />
          </div>
          <p className="text-neon-blue/40 font-mono text-sm tracking-widest">HOW TO PLAY</p>
        </div>

        <div className="bg-black/60 border border-neon-blue/20 rounded-lg overflow-hidden mb-6">
          {CONTROLS.map((c, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-6 py-3 border-b border-neon-blue/10
                ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
            >
              <kbd className={`font-mono font-black text-sm tracking-widest px-3 py-1 rounded
                border ${CATEGORY_COLORS[c.category]} border-current bg-black/40`}>
                {c.key}
              </kbd>
              <span className="text-white/70 font-mono text-sm tracking-wide">{c.action}</span>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-neon-orange/5 border border-neon-orange/20 rounded-lg p-4 mb-6">
          <h3 className="text-neon-orange font-black text-sm tracking-widest mb-2">💡 PRO TIPS</h3>
          <ul className="space-y-1">
            <li className="text-white/60 font-mono text-xs">• Use double-jump to cross large gaps</li>
            <li className="text-white/60 font-mono text-xs">• Sprint + jump for maximum distance</li>
            <li className="text-white/60 font-mono text-xs">• Timer starts when you leave the green zone</li>
            <li className="text-white/60 font-mono text-xs">• Fall off? You'll respawn at the start</li>
            <li className="text-white/60 font-mono text-xs">• Moving platforms glow orange — time your jumps!</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-2 px-6 py-3 bg-black/60 border-2 border-neon-blue/40
              text-neon-blue font-black tracking-widest hover:border-neon-blue
              hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-200 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
