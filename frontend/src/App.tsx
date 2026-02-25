import { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameScene from './components/GameScene';
import Leaderboard from './components/Leaderboard';
import ControlsScreen from './components/ControlsScreen';

export type Screen = 'menu' | 'game' | 'leaderboard' | 'controls';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');

  const navigate = useCallback((s: Screen) => setScreen(s), []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-game-bg">
      {screen === 'menu' && <MainMenu onNavigate={navigate} />}
      {screen === 'game' && <GameScene onNavigate={navigate} />}
      {screen === 'leaderboard' && <Leaderboard onNavigate={navigate} />}
      {screen === 'controls' && <ControlsScreen onNavigate={navigate} />}
    </div>
  );
}
