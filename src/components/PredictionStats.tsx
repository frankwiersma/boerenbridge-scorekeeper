import React from 'react';
import { GameState, Player } from '../types/game';
import { Crown } from 'lucide-react';

interface PredictionStatsProps {
  gameState: GameState;
  nsfwMode?: boolean;
}

interface PlayerStats {
  totalPredicted: number;
  averagePrediction: number;
  boldnessScore: number;
  correctPredictions: number;
  rank?: number;
}

const PredictionStats: React.FC<PredictionStatsProps> = ({ gameState, nsfwMode = false }) => {
  // Calculate stats for each player
  const playerStats = React.useMemo(() => {
    const stats = new Map<Player, PlayerStats>();
    
    gameState.players.forEach(player => {
      const playerRounds = gameState.rounds.filter(round => 
        round.stage === 'complete'
      );
      
      const predictions = playerRounds.flatMap(round => 
        round.predictions.filter(pred => pred.playerId === player.id)
      );
      
      const totalPredicted = predictions.reduce((sum, pred) => sum + pred.predicted, 0);
      const averagePrediction = predictions.length > 0 
        ? totalPredicted / predictions.length 
        : 0;
      
      // Calculate boldness score (higher predictions = bolder)
      const boldnessScore = predictions.reduce((score, pred) => {
        const roundMaxTricks = pred.predicted / playerRounds[0].cardsPerPlayer;
        return score + roundMaxTricks;
      }, 0);
      
      // Count correct predictions
      const correctPredictions = predictions.filter(
        pred => pred.predicted === pred.achieved
      ).length;
      
      stats.set(player, {
        totalPredicted,
        averagePrediction,
        boldnessScore,
        correctPredictions
      });
    });
    
    return stats;
  }, [gameState]);
  
  // Sort players by boldness score
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    const statsA = playerStats.get(a)!;
    const statsB = playerStats.get(b)!;
    return statsB.boldnessScore - statsA.boldnessScore;
  });

  // Assign ranks to players
  sortedPlayers.forEach((player, index) => {
    const stats = playerStats.get(player);
    if (stats) {
      stats.rank = index + 1;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-xl font-bold text-green-800 mb-4">
        {nsfwMode ? 'Grote Piemel Klassement' : 'Lef Statistieken'}
      </h2>
      
      <div className="grid gap-4">
        {sortedPlayers.map((player, index) => {
          const stats = playerStats.get(player)!;
          const completedRounds = gameState.rounds.filter(r => r.stage === 'complete').length;
          
          return (
            <div 
              key={player.id} 
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {stats.rank === 1 && (
                    <Crown size={20} className="text-amber-500 mr-2" />
                  )}
                  <span className="font-semibold text-lg">
                    {nsfwMode ? `#${stats.rank} ` : ''}{player.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(stats.boldnessScore * 10) / 10} {nsfwMode ? 'cm' : 'lef score'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Totaal voorspeld</div>
                  <div className="font-semibold">{stats.totalPredicted} slagen</div>
                </div>
                <div>
                  <div className="text-gray-600">Gemiddeld per ronde</div>
                  <div className="font-semibold">
                    {Math.round(stats.averagePrediction * 10) / 10} slagen
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Correct voorspeld</div>
                  <div className="font-semibold">
                    {stats.correctPredictions} / {completedRounds} rondes
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Succes ratio</div>
                  <div className="font-semibold">
                    {completedRounds > 0 
                      ? Math.round((stats.correctPredictions / completedRounds) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
              
              {/* Boldness indicator */}
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (stats.boldnessScore / (completedRounds * 2)) * 100)}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <button
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          onClick={() => {
            window.location.hash = nsfwMode ? '' : 'nsfw';
          }}
        >
          {nsfwMode ? '👔 Toon Normale Weergave' : '🍺 NFSW modus'}
        </button>
      </div>
    </div>
  );
};

export default PredictionStats;