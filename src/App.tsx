import React, { useState, useEffect } from 'react';
import { GameState, Player } from './types/game';
import { Language, translations } from './types/language';
import { initializeNewGame } from './utils/gameLogic';
import { saveGameState, loadGameState, clearGameState, loadLanguage, saveLanguage } from './utils/storage';
import PlayerSetup from './components/PlayerSetup';
import GameBoard from './components/GameBoard';
import { Club, Heart, Diamond, Spade, AlertTriangle } from 'lucide-react';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentSuit, setCurrentSuit] = useState(0);
  const [nsfwMode, setNsfwMode] = useState(false);
  const [language, setLanguage] = useState<Language>(() => loadLanguage() || 'nl');
  const [toast, setToast] = useState<{ message: string; type?: 'warning' | 'error' } | null>(null);
  
  // Rotate through suit icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuit((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const SuitIcon = [Club, Heart, Diamond, Spade][currentSuit];
  
  // Try to load saved game on initial render
  useEffect(() => {
    const savedGame = loadGameState();
    if (savedGame) {
      setGameState(savedGame);
    }
  }, []);
  
  // Handle NSFW mode toggle
  useEffect(() => {
    const handleHashChange = () => {
      setNsfwMode(window.location.hash === '#nsfw');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Handle player setup and start new game
  const handlePlayersConfirmed = (players: Player[]) => {
    const newGameState = initializeNewGame(players);
    setGameState(newGameState);
    saveGameState(newGameState);
  };
  
  // Update game state
  const handleUpdateGameState = (newState: GameState) => {
    setGameState(newState);
  };
  
  // Reset game
  const handleResetGame = () => {
    setToast({
      message: translations.confirmNewGame[language],
      type: 'warning'
    });
  };
  
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'nl' ? 'en' : 'nl';
      saveLanguage(newLang);
      return newLang;
    });
  };
  
  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center bg-fixed before:content-[''] before:absolute before:inset-0 before:bg-green-900/90 before:backdrop-blur-sm relative">
      <div className="relative z-10 py-8 px-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={toggleLanguage}
          className="p-2 hover:opacity-75 focus:outline-none transition-opacity duration-200"
          title={language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
        >
          <img 
            src={language === 'nl' 
              ? 'https://flagcdn.com/w40/gb.png'
              : 'https://flagcdn.com/w40/nl.png'
            }
            alt={language === 'nl' ? 'English' : 'Nederlands'}
            width="20"
            height="15"
            className="rounded-sm shadow-sm"
          />
        </button>
      </div>
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-16 h-16 mr-4">
            <SuitIcon 
              size={64} 
              className="absolute inset-0 text-amber-400 transition-all duration-500 transform opacity-100 scale-100"
            />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-1">{translations.title[language]}</h1>
            <p className="text-amber-300 text-lg">{translations.subtitle[language]}</p>
          </div>
        </div>
        {gameState?.gameStarted && !gameState?.gameCompleted && (
          <div className="mt-2">
            <button
              onClick={handleResetGame}
              className="text-red-400 hover:text-red-300 text-sm focus:outline-none transition-colors duration-200"
            >
              {translations.newGame[language]}
            </button>
          </div>
        )}
      </header>
      
      <main className="max-w-4xl mx-auto">
        {!gameState?.gameStarted ? (
          <PlayerSetup onPlayersConfirmed={handlePlayersConfirmed} language={language} />
        ) : (
          <GameBoard 
            gameState={gameState} 
            onUpdateGameState={handleUpdateGameState}
            onResetGame={handleResetGame}
            nsfwMode={nsfwMode}
            language={language}
          />
        )}
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-300 text-sm">
        <p>© 2025 {translations.title[language]}</p>
        <div className="mt-4 flex justify-center items-center gap-4 text-gray-400">
          <a href="https://www.linkedin.com/in/frankwiersma" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/frankwiersma/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://x.com/frankwiersma_/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
          <a href="https://www.instagram.com/frankwiersma_" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </footer>
      
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          actionLabel={translations.confirm[language]}
          onAction={() => {
            clearGameState();
            setGameState(null);
            setToast(null);
          }}
        />
      )}
      </div>
    </div>
  );
}

export default App;