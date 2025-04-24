import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { calculateTotalScore } from '../utils/gameLogic';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScoreOverviewProps {
  gameState: GameState;
}

interface ChartDataPoint {
  round: number;
  [key: string]: number | string;
}

const ScoreOverview: React.FC<ScoreOverviewProps> = ({ gameState }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Generate chart data when rounds or scores change
  useEffect(() => {
    if (gameState.rounds.length === 0) return;
    
    const data: ChartDataPoint[] = [];
    const cumulativePredictions: { [key: string]: number } = {};
    
    // Generate cumulative score data for each round
    for (let i = 0; i < gameState.rounds.length; i++) {
      const round = gameState.rounds[i];
      if (!round.predictions[0].score) continue; // Skip rounds without scores
      
      const dataPoint: ChartDataPoint = { round: round.roundNumber };
      
      // Calculate cumulative score for each player up to this round
      gameState.players.forEach((player, index) => {
        // Get all completed rounds up to this one
        const completedRounds = gameState.rounds.slice(0, i + 1);
        const score = calculateTotalScore(player.id, completedRounds);
        dataPoint[player.name] = score;
        
        // Add prediction data
        const prediction = round.predictions.find(p => p.playerId === player.id);
        if (prediction) {
          cumulativePredictions[player.name] = (cumulativePredictions[player.name] || 0) + prediction.predicted;
          dataPoint[`${player.name}_predicted`] = prediction.predicted;
          dataPoint[`${player.name}_cumulative_predicted`] = cumulativePredictions[player.name];
        }
      });
      
      data.push(dataPoint);
    }
    
    setChartData(data);
  }, [gameState]);

  // Generate player colors for the chart
  const getPlayerColor = (index: number) => {
    const colors = ['#2E7D32', '#1565C0', '#C62828', '#6A1B9A'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-green-800 mb-4">Scorebord</h2>
      
      {/* Current standings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {gameState.players.map((player, index) => {
          const score = calculateTotalScore(player.id, gameState.rounds);
          return (
            <div 
              key={player.id}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center"
              style={{ borderLeft: `4px solid ${getPlayerColor(index)}` }}
            >
              <div className="font-semibold text-gray-800">{player.name}</div>
              <div className="text-2xl font-bold text-green-800">{score}</div>
            </div>
          );
        })}
      </div>
      
      {/* Score chart */}
      {chartData.length > 0 && (
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="round" 
                label={{ value: 'Ronde', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                yAxisId="score"
                label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => Math.round(value)}
                allowDecimals={false}
              />
              <YAxis 
                yAxisId="prediction"
                orientation="right"
                label={{ value: 'Cumulatieve Voorspelling', angle: 90, position: 'insideRight' }}
                tickFormatter={(value) => Math.round(value)}
                allowDecimals={false}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name.endsWith('_predicted')) {
                    return [`Voorspelling: ${value}`, name.replace('_predicted', '')];
                  } else if (name.endsWith('_cumulative_predicted')) {
                    return [`Totaal voorspeld: ${value}`, name.replace('_cumulative_predicted', '')];
                  }
                  return [`Score: ${value}`, name];
                }}
              />
              <Legend />
              {gameState.players.map((player, index) => (
                <React.Fragment key={player.id}>
                  <Line
                    type="monotone"
                    dataKey={player.name}
                    name={player.name}
                    yAxisId="score"
                    stroke={getPlayerColor(index)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={`${player.name}_cumulative_predicted`}
                    name={`${player.name} (totaal voorspeld)`}
                    yAxisId="prediction"
                    stroke={getPlayerColor(index)}
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    dot={{ r: 2 }}
                  />
                </React.Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ScoreOverview;