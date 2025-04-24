import React from 'react';
import { Player } from '../types/game';
import { User, Users } from 'lucide-react';

interface RoundInfoProps {
  roundNumber: number;
  cardsPerPlayer: number;
  dealerId: number;
  starterId: number;
  players: Player[];
}

const RoundInfo: React.FC<RoundInfoProps> = ({
  roundNumber,
  cardsPerPlayer,
  dealerId,
  starterId,
  players
}) => {
  const dealer = players.find(p => p.id === dealerId);
  const starter = players.find(p => p.id === starterId);

  return (
    <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-xl shadow-xl p-6 text-white border border-green-600/30 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-2xl font-bold mb-2">Ronde {roundNumber}</h2>
          <div className="flex items-center mt-1">
            <div className="flex items-center mr-4">
              {Array.from({ length: cardsPerPlayer }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-6 h-9 bg-white rounded-md shadow-lg -ml-3 first:ml-0 transform transition-transform hover:translate-y-[-8px] hover:rotate-0 cursor-pointer border-2 border-white/50"
                  style={{ zIndex: i, transform: `rotate(${(i - cardsPerPlayer/2) * 5}deg)` }}
                ></div>
              ))}
            </div>
            <span className="ml-2 text-lg">{cardsPerPlayer} kaarten per speler</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center bg-green-600/50 px-4 py-2 rounded-full border border-white/20 shadow-lg hover:bg-green-500/50 transition-colors duration-200">
            <User size={18} className="mr-2" />
            <span>Deler: <strong>{dealer?.name || '?'}</strong></span>
          </div>
          
          <div className="flex items-center bg-amber-500/50 px-4 py-2 rounded-full border border-white/20 shadow-lg hover:bg-amber-400/50 transition-colors duration-200">
            <Users size={18} className="mr-2" />
            <span>Start: <strong>{starter?.name || '?'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundInfo;