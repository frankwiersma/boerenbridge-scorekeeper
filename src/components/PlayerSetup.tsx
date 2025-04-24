import React, { useState } from 'react';
import { Player } from '../types/game';
import { UserPlus, Trash2, Wand2 } from 'lucide-react';
import { clearGameState } from '../utils/storage';

interface PlayerSetupProps {
  onPlayersConfirmed: (players: Player[]) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onPlayersConfirmed }) => {
  const [players, setPlayers] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string>('');

  const randomNames = [
    'Zeus', 'Apollo', 'Athena', 'Hermes',
    'Artemis', 'Poseidon', 'Hera', 'Ares',
    'Hades', 'Iris', 'Atlas', 'Nike'
  ];

  // Add a player input field
  const addPlayerField = () => {
    if (players.length < 6) {
      setPlayers([...players, '']);
    }
  };

  // Remove a player input field
  const removePlayer = (index: number) => {
    if (players.length > 4) {
      const updatedPlayers = [...players];
      updatedPlayers.splice(index, 1);
      setPlayers(updatedPlayers);
    }
  };

  // Update player name
  const updatePlayerName = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = name;
    setPlayers(updatedPlayers);
  };

  // Fill with random names
  const fillRandomNames = () => {
    const shuffled = [...randomNames]
      .sort(() => Math.random() - 0.5)
      .slice(0, players.length);
    setPlayers(shuffled);
    setError('');
  };

  // Confirm players and start game
  const confirmPlayers = () => {
    // Validate player names (non-empty and unique)
    const nonEmptyPlayers = players.filter(name => name.trim() !== '');
    
    if (nonEmptyPlayers.length < 4) {
      setError('Je hebt minstens 4 spelers nodig.');
      return;
    }
    
    const uniqueNames = new Set(nonEmptyPlayers.map(name => name.trim().toLowerCase()));
    if (uniqueNames.size !== nonEmptyPlayers.length) {
      setError('Elke speler moet een unieke naam hebben.');
      return;
    }
    
    // Create player objects with IDs
    const playerObjects: Player[] = nonEmptyPlayers.map((name, index) => ({
      id: index,
      name: name.trim()
    }));
    
    onPlayersConfirmed(playerObjects);
  };

  const handleClearStorage = () => {
    clearGameState();
    setPlayers(['', '', '', '']);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={fillRandomNames}
          className="p-2 text-purple-500 hover:text-purple-700 focus:outline-none transition-colors duration-200 bg-white/80 rounded-full"
          title="Vul met willekeurige namen"
        >
          <Wand2 size={18} />
        </button>
        <button
          onClick={handleClearStorage}
          className="p-2 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200 bg-white/80 rounded-full"
          title="Verwijder opgeslagen spel"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Spelers Toevoegen</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={player}
              onChange={(e) => updatePlayerName(index, e.target.value)}
              placeholder={`Speler ${index + 1}`}
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              maxLength={20}
            />
            {players.length > 4 && (
              <button
                onClick={() => removePlayer(index)}
                className="p-2 text-red-500 hover:text-red-700 focus:outline-none transform hover:scale-110 transition-transform duration-200"
                aria-label="Verwijder speler"
              >
                <span className="text-xl">×</span>
              </button>
            )}
          </div>
        ))}
      </div>
      
      {players.length < 6 && (
        <button
          onClick={addPlayerField}
          className="mt-6 flex items-center justify-center w-full py-2 px-4 text-green-700 hover:text-green-900 focus:outline-none border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 transition-colors duration-200"
        >
          <UserPlus size={18} className="mr-1" />
          <span>Speler toevoegen</span>
        </button>
      )}
      
      <div className="mt-8">
        <button
          onClick={confirmPlayers}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
        >
          Start Spel
        </button>
      </div>
    </div>
  );
};

export default PlayerSetup;