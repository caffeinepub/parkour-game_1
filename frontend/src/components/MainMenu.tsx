import { Screen } from '../App';
import MenuBackground from './MenuBackground';
import { Play, Trophy, Keyboard, Zap } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (s: Screen) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <MenuBackground />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Logo */}
        <div className="mb-2">
          <img
            src="/assets/generated/parkour-logo.dim_512x128.png"
            alt="Parkour Rush"
            className="w-auto h-24 object-contain drop-shadow-[0_0_20px_rgba(255,106,0,0.8)]"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* Fallback title if image fails */}
        <div className="mb-1">
          <h1 className="text-neon-orange font-black text-6xl tracking-widest text-center
            drop-shadow-[0_0_30px_rgba(255,106,0,0.8)] [text-shadow:0_0_40px_rgba(255,106,0,0.6)]">
            PARKOUR
          </h1>
          <h2 className="text-neon-blue font-black text-3xl tracking-[0.5em] text-center
            drop-shadow-[0_0_20px_rgba(0,212,255,0.6)]">
            RUSH
          </h2>
        </div>

        <div className="flex items-center gap-2 mb-10">
          <Zap className="text-neon-green w-4 h-4" />
          <p className="text-neon-green/70 font-mono text-sm tracking-widest">3D OBSTACLE COURSE · BEAT YOUR BEST TIME</p>
          <Zap className="text-neon-green w-4 h-4" />
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-4 w-64">
          <MenuButton
            icon={<Play className="w-5 h-5" />}
            label="START GAME"
            color="orange"
            onClick={() => onNavigate('game')}
            primary
          />
          <MenuButton
            icon={<Trophy className="w-5 h-5" />}
            label="LEADERBOARD"
            color="blue"
            onClick={() => onNavigate('leaderboard')}
          />
          <MenuButton
            icon={<Keyboard className="w-5 h-5" />}
            label="CONTROLS"
            color="green"
            onClick={() => onNavigate('controls')}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center z-10">
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

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  color: 'orange' | 'blue' | 'green';
  onClick: () => void;
  primary?: boolean;
}

const COLOR_MAP = {
  orange: {
    border: 'border-neon-orange',
    text:   'text-neon-orange',
    hover:  'hover:bg-neon-orange/20 hover:shadow-[0_0_25px_rgba(255,106,0,0.6)]',
    bg:     'bg-neon-orange/10',
  },
  blue: {
    border: 'border-neon-blue',
    text:   'text-neon-blue',
    hover:  'hover:bg-neon-blue/20 hover:shadow-[0_0_25px_rgba(0,212,255,0.5)]',
    bg:     'bg-neon-blue/5',
  },
  green: {
    border: 'border-neon-green',
    text:   'text-neon-green',
    hover:  'hover:bg-neon-green/20 hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]',
    bg:     'bg-neon-green/5',
  },
};

function MenuButton({ icon, label, color, onClick, primary }: MenuButtonProps) {
  const c = COLOR_MAP[color];
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 w-full py-4 border-2 ${c.border} ${c.text}
        ${primary ? c.bg : 'bg-black/50'} font-black text-lg tracking-widest
        ${c.hover} transition-all duration-200 rounded
        active:scale-95`}
    >
      {icon}
      {label}
    </button>
  );
}
