import React from 'react';
import { Round, Player } from '../types/game';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RoundHistoryProps {
  rounds: Round[];
  players: Player[];
}

const RoundHistory: React.FC<RoundHistoryProps> = ({ rounds, players }) => {
  const [expandedRound, setExpandedRound] = React.useState<number | null>(null);

  // Toggle expanded round
  const toggleRound = (roundNumber: number) => {
    if (expandedRound === roundNumber) {
      setExpandedRound(null);
    } else {
      setExpandedRound(roundNumber);
    }
  };

  // Show all completed rounds (stage is 'complete')
  const completedRounds = rounds.filter(round => 
    round.stage === 'complete'
  );

  if (completedRounds.length === 0) {
    return <div className="text-center text-gray-600">Nog geen rondes voltooid</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold text-green-800 p-4 border-b">Ronde Geschiedenis</h2>
      
      <div className="divide-y divide-gray-200">
        {completedRounds.map((round) => (
          <div key={round.roundNumber} className="overflow-hidden">
            <button
              onClick={() => toggleRound(round.roundNumber)}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50 focus:outline-none"
            >
              <div className="font-medium">Ronde {round.roundNumber} ({round.cardsPerPlayer} kaarten)</div>
              {expandedRound === round.roundNumber ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            
            {expandedRound === round.roundNumber && (
              <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speler</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voorspelling</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Behaald</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {round.predictions.map((prediction) => {
                        const player = players.find(p => p.id === prediction.playerId);
                        return (
                          <tr key={prediction.playerId}>
                            <td className="px-4 py-2 whitespace-nowrap">{player?.name || 'Onbekend'}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{prediction.predicted}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{prediction.achieved}</td>
                            <td className="px-4 py-2 whitespace-nowrap font-semibold">
                              {prediction.score > 0 ? `+${prediction.score}` : prediction.score}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundHistory;