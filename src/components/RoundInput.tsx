import React from 'react';
import { Round, RoundState, Player, InputStage, Prediction } from '../types/game';
import { getNextPlayer, getTotalPredictedTricks, getTotalAchievedTricks, validateRound, getTotalAvailableTricks, calculateScore } from '../utils/gameLogic';
import TrickInput from './TrickInput';
import Toast from './Toast';

interface RoundInputProps {
  round: Round;
  roundState: RoundState;
  players: Player[];
  onUpdateRound: (round: Round) => void;
  onUpdateStage: (stage: InputStage, activePlayerId: number | null) => void;
  onRoundComplete: (round: Round) => void;
}

const RoundInput: React.FC<RoundInputProps> = ({
  round,
  roundState,
  players,
  onUpdateRound,
  onUpdateStage,
  onRoundComplete
}) => {
  const [allPredictionsComplete, setAllPredictionsComplete] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type?: 'warning' | 'error' } | null>(null);
  
  // State for managing predictions for all players simultaneously
  const [predictedTricks, setPredictedTricks] = React.useState<{ [key: number]: number }>(() => {
    // Initialize with current prediction values from round
    return round.predictions.reduce((acc, pred) => {
      acc[pred.playerId] = pred.predicted >= 0 ? pred.predicted : 0;
      return acc;
    }, {} as { [key: number]: number });
  });
  
  // State for managing achieved tricks
  const [achievedTricks, setAchievedTricks] = React.useState<{ [key: number]: number }>(() => {
    // Initialize with current achieved values from round
    return round.predictions.reduce((acc, pred) => {
      acc[pred.playerId] = pred.achieved >= 0 ? pred.achieved : 0;
      return acc;
    }, {} as { [key: number]: number });
  });
  
  // Calculate total tricks available for this round
  const totalTricksAvailable = getTotalAvailableTricks(round);
  
  // Calculate total predicted tricks
  const totalPredicted = React.useMemo(() => 
    Object.values(predictedTricks).reduce((sum, val) => sum + val, 0),
    [predictedTricks]
  );
  
  // Allow overbidding - this is permitted in the game
  
  // Calculate total achieved tricks
  const totalAchieved = React.useMemo(() => 
    Object.values(achievedTricks).reduce((sum, val) => sum + val, 0),
    [achievedTricks]
  );

  // Find prediction for the active player
  const activePlayer = players.find(p => p.id === roundState.activePlayerId);
  
  // Find prediction for the active player
  const currentPlayerPrediction = round.predictions.find(
    p => p.playerId === roundState.activePlayerId
  );
  
  // Handle prediction change via +/- buttons
  const handlePredictionChange = (playerId: number, delta: number) => {
    const current = predictedTricks[playerId] || 0;
    const newValue = Math.max(0, Math.min(totalTricksAvailable, current + delta));
    
    if (newValue === current) return;
    
    const newPredicted = { ...predictedTricks, [playerId]: newValue };
    setPredictedTricks(newPredicted);
  };

  // Handle submitting all predictions
  const handleSubmitPredictions = () => {
    // Calculate total predicted tricks
    const totalPredicted = Object.values(predictedTricks).reduce((sum, val) => sum + val, 0);
    
    // No check for overbidding as it's allowed in the game
    
    // Update all predictions at once
    const updatedPredictions = round.predictions.map(pred => ({
      ...pred,
      predicted: predictedTricks[pred.playerId]
    }));
    
    // Update the round with all predictions
    const updatedRound = {
      ...round,
      predictions: updatedPredictions,
      stage: 'achieved',
      activePlayerId: round.starterId
    };
    
    onUpdateRound(updatedRound);
    onUpdateStage('achieved', round.starterId);
    setAllPredictionsComplete(true);
  };
  
  // Handle prediction update (original method kept for compatibility)
  const handlePredictionUpdate = (value: number) => {
    const totalPredicted = getTotalPredictedTricks(round);
    const currentPrediction = currentPlayerPrediction?.predicted || 0;
    const otherPredictions = totalPredicted - currentPrediction;
    const nextPlayerId = getNextPlayer(roundState.activePlayerId, players, round.starterId);
    
    // Check if this is the last player to predict
    const isLastPredictor = getNextPlayer(roundState.activePlayerId, players, round.starterId) === round.starterId;
    
    // If this is the last player, validate the total prediction
    if (isLastPredictor) {
      const disallowedPrediction = totalTricksAvailable - otherPredictions;
      const newTotal = otherPredictions + value;
      
      if (newTotal >= totalTricksAvailable) {
        setToast({
          message: `Je kunt niet ${value} slagen voorspellen omdat het totaal (${newTotal}) groter of gelijk zou zijn aan het aantal beschikbare slagen (${totalTricksAvailable}). Kies een lager aantal.`,
          type: 'warning'
        });
        return;
      }
    }
    
    const updatedPredictions = round.predictions.map(pred => {
      if (pred.playerId === roundState.activePlayerId) {
        return { ...pred, predicted: value };
      }
      return pred;
    });
    
    // Check if all players have made predictions - moved before usage
    const allPredicted = updatedPredictions.every(pred => pred.predicted >= 0);
    
    const updatedRound = {
      ...round,
      predictions: updatedPredictions,
      activePlayerId: nextPlayerId,
      stage: allPredicted ? 'achieved' : 'prediction'
    };
    
    // Update the round first
    onUpdateRound(updatedRound);
    
    if (allPredicted) {
      setAllPredictionsComplete(true);
      onUpdateStage('achieved', round.starterId);
    } else {
      onUpdateStage('prediction', nextPlayerId);
    }
  };
  
  // Handle achieved tricks update
  const handleAchievedUpdate = (value: number) => {
    const currentPlayerAchieved = round.predictions.find(p => p.playerId === roundState.activePlayerId)?.achieved || 0;
    const otherPlayersAchieved = getTotalAchievedTricks(round) - currentPlayerAchieved;
    const newTotalAchieved = otherPlayersAchieved + value;

    // Check if this would exceed total available tricks
    if (newTotalAchieved > totalTricksAvailable) {
      setToast({
        message: `Het totaal aantal behaalde slagen kan niet meer zijn dan ${totalTricksAvailable}.`,
        type: 'error'
      });
      return;
    }

    const updatedPredictions = round.predictions.map(pred => {
      if (pred.playerId === roundState.activePlayerId) {
        return { ...pred, achieved: value };
      }
      return pred;
    });
    
    const nextPlayerId = getNextPlayer(roundState.activePlayerId, players, round.starterId);
    
    const updatedRound = {
      ...round,
      predictions: updatedPredictions,
      stage: 'achieved',
      activePlayerId: nextPlayerId
    };
    
    onUpdateRound(updatedRound);
    
    // Check if all players have input achieved tricks
    const isLastPlayer = nextPlayerId === round.starterId;
    
    // Validate total achieved equals cards per player
    if (isLastPlayer) {
      const finalTotalAchieved = getTotalAchievedTricks(updatedRound);
      if (finalTotalAchieved !== totalTricksAvailable) {
        setToast({
          message: `Het totaal aantal behaalde slagen (${finalTotalAchieved}) moet gelijk zijn aan ${totalTricksAvailable}.`,
          type: 'error'
        });
        return;
      }
      onUpdateStage('stake', round.starterId);
    } else {
      onUpdateStage('achieved', nextPlayerId);
    }
  };
  
  const handleStartRoundPlay = () => {
    setAllPredictionsComplete(false);
    
    // Update round state to achieved stage
    const updatedRound = {
      ...round,
      stage: 'achieved',
      activePlayerId: round.starterId
    };
    
    onUpdateRound(updatedRound);
    onUpdateStage('achieved', round.starterId);
  };
  
  const handleAchievedChange = (playerId: number, delta: number) => {
    const current = achievedTricks[playerId] || 0;
    const newValue = Math.max(0, Math.min(totalTricksAvailable, current + delta));
    
    if (newValue === current) return;
    
    const newAchieved = { ...achievedTricks, [playerId]: newValue };
    setAchievedTricks(newAchieved);
  };
  
  const handleSubmitAchieved = () => {
    // First, update predictions with current achievedTricks state
    const updatedPredictions = round.predictions.map(pred => ({
      ...pred,
      achieved: achievedTricks[pred.playerId]
    }));
    
    // Calculate total from updated predictions
    const submittedTotal = updatedPredictions.reduce((sum, pred) => sum + pred.achieved, 0);
    
    if (submittedTotal !== totalTricksAvailable) {
      setToast({
        message: `Het totaal aantal behaalde slagen (${submittedTotal}) moet gelijk zijn aan het aantal beschikbare slagen (${totalTricksAvailable}).`,
        type: 'error'
      });
      return;
    }
    
    // Calculate scores and complete the round
    const finalRound = {
      ...round,
      predictions: updatedPredictions.map(pred => ({
        ...pred,
        score: calculateScore(pred.predicted, pred.achieved)
      })),
      stage: 'complete',
      activePlayerId: null
    };
    
    onUpdateRound(finalRound);
    onRoundComplete(finalRound);
  };
  
  // Render appropriate input based on current stage
  const renderInputStage = () => {
    if (!activePlayer) return null;
    
    switch (roundState.stage) {
      case 'prediction':
        // New UI for predictions with +/- buttons for all players
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-center mb-4">Voorspellingen Invoeren</h3>
            <div className="space-y-4">
              {round.predictions.map((pred) => {
                const player = players.find(p => p.id === pred.playerId);
                const predicted = predictedTricks[pred.playerId] || 0;
                
                return (
                  <div key={pred.playerId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{player?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handlePredictionChange(pred.playerId, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{predicted}</span>
                      <button
                        onClick={() => handlePredictionChange(pred.playerId, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-lg mb-4 text-green-600">
                Totaal voorspeld: {totalPredicted} slagen {totalPredicted !== totalTricksAvailable && 
                `(${totalPredicted > totalTricksAvailable ? 'meer' : 'minder'} dan beschikbare ${totalTricksAvailable} slagen)`}
              </div>
              
              <button
                onClick={handleSubmitPredictions}
                className="w-full py-3 rounded-md transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                Bevestig Voorspellingen
              </button>
            </div>
          </div>
        );
        
      case 'achieved':
        const remainingTricks = totalTricksAvailable - totalAchieved;
        
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-center mb-4">Behaalde Slagen Invoeren</h3>
            <div className="space-y-4">
              {round.predictions.map((pred) => {
                const player = players.find(p => p.id === pred.playerId);
                const achieved = achievedTricks[pred.playerId] || 0;
                
                return (
                  <div key={pred.playerId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{player?.name}</span>
                      <div className="text-sm text-gray-600">Voorspelling: {pred.predicted}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAchievedChange(pred.playerId, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{achieved}</span>
                      <button
                        onClick={() => handleAchievedChange(pred.playerId, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <div className={`text-lg mb-4 ${remainingTricks === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {remainingTricks === 0 
                  ? `✓ Totaal van ${totalTricksAvailable} slagen is bereikt!`
                  : `Nog ${remainingTricks} ${remainingTricks === 1 ? 'slag' : 'slagen'} te verdelen (totaal moet ${totalTricksAvailable} zijn)`}
              </div>
              
              <button
                onClick={handleSubmitAchieved}
                disabled={remainingTricks !== 0}
                className={`w-full py-3 rounded-md transition-colors ${
                  remainingTricks === 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Bevestig Behaalde Slagen
              </button>
            </div>
          </div>
        );
      default:
        return <div>Bezig met volgende ronde...</div>;
    }
  };
  
  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        {roundState.stage === 'prediction' 
          ? 'Voorspellingen invoeren' 
          : 'Behaalde slagen invoeren'}
      </h3>
      
      {/* Input for active player */}
      {renderInputStage()}
      
      {/* Progress summary */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {players.map((player) => {
          const prediction = round.predictions.find(p => p.playerId === player.id);
          if (!prediction) return null;
          
          const isActive = player.id === roundState.activePlayerId;
          const isComplete = prediction.predicted > 0;
          
          return (
            <div 
              key={player.id}
              className={`p-2 rounded-md text-sm ${
                isActive 
                  ? 'bg-green-100 border-2 border-green-500 shadow-md' 
                  : isComplete 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-gray-50 text-gray-500'
              }`}
            >
              <div className="font-semibold">{player.name}</div>
              {typeof prediction.predicted === 'number' && prediction.predicted >= 0 && (
                <div className="mt-1">
                  <span className="text-sm">Voorspelling: </span>
                  <span className="font-medium">{prediction.predicted}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default RoundInput;