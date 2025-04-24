import React, { useState, useEffect } from 'react';
import { GameState, Round, RoundState, InputStage } from '../types/game';
import { createNewRound, getInitialRoundState, updateRoundScores, isGameComplete } from '../utils/gameLogic';
import { saveGameState } from '../utils/storage';
import RoundInfo from './RoundInfo';
import RoundInput from './RoundInput';
import ScoreOverview from './ScoreOverview';
import PredictionStats from './PredictionStats';
import Toast from './Toast';
import RoundHistory from './RoundHistory';
import { Layers, Trash2 } from 'lucide-react';
import { clearGameState } from '../utils/storage';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
  onResetGame: () => void;
  nsfwMode?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onUpdateGameState, onResetGame, nsfwMode }) => {
  const [currentRoundState, setCurrentRoundState] = useState<RoundState | null>(null);
  const [currentRoundData, setCurrentRoundData] = useState<Round | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'warning' | 'error' } | null>(null);

  // Initialize or update current round data when gameState changes
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameCompleted) {
      const currentRound = gameState.rounds[gameState.currentRound - 1];
      setCurrentRoundData(currentRound || null);
      setCurrentRoundState(prevState => {
        // Only update if stage or activePlayerId changed, or if currentRound is null
        if (!currentRound) return null;
        if (!prevState || 
            prevState.stage !== currentRound.stage || 
            prevState.activePlayerId !== currentRound.activePlayerId) {
          return getInitialRoundState(currentRound);
        }
        return prevState;
      });
    }
  }, [gameState, onUpdateGameState]);

  // Create new round if needed
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameCompleted && !gameState.rounds[gameState.currentRound - 1]) {
      const newRound = createNewRound(gameState);
      const updatedRounds = [...gameState.rounds, newRound];
      
      onUpdateGameState({
        ...gameState,
        rounds: updatedRounds
      });
    }
  }, [gameState, onUpdateGameState]);

  // Handle completion of a round
  const handleRoundComplete = (completedRound: Round) => {
    // Calculate scores for the round
    const scoredRound = updateRoundScores(completedRound);
    
    // Update rounds in game state
    const updatedRounds = [...gameState.rounds];
    updatedRounds[gameState.currentRound - 1] = scoredRound;
    
    // Check if this was the last round
    const nextRound = gameState.currentRound + 1;
    const gameCompleted = isGameComplete(nextRound);
    
    // Update game state
    const updatedGameState = {
      ...gameState,
      rounds: updatedRounds,
      currentRound: nextRound,
      gameCompleted
    };
    
    onUpdateGameState(updatedGameState);
    saveGameState(updatedGameState);
    
    // If game is not complete, automatically set up next round
    if (!gameCompleted) {
      const newRound = createNewRound(updatedGameState);
      const newRounds = [...updatedRounds, newRound];
      
      const finalGameState = {
        ...updatedGameState,
        rounds: newRounds
      };
      
      onUpdateGameState(finalGameState);
      saveGameState(finalGameState);
      
      setCurrentRoundData(newRound);
      setCurrentRoundState(getInitialRoundState(newRound));
    }
  };

  // Update stage of current round
  const updateRoundStage = (stage: InputStage, activePlayerId: number | null) => {
    if (currentRoundState) {
      setCurrentRoundState({
        ...currentRoundState,
        stage,
        activePlayerId
      });
    }
  };

  // Update current round data
  const updateCurrentRound = (updatedRound: Round) => {
    if (currentRoundData) {
      setCurrentRoundData(updatedRound);
      
      // Update round in game state but don't advance to next round yet
      const updatedRounds = [...gameState.rounds];
      updatedRounds[gameState.currentRound - 1] = updatedRound;
      
      const updatedGameState = {
        ...gameState,
        rounds: updatedRounds
      };
      
      onUpdateGameState(updatedGameState);
      saveGameState(updatedGameState);
    }
  };

  // Toggle round history view
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleClearStorage = () => {
    setToast({
      message: 'Weet je zeker dat je alle opgeslagen gegevens wilt verwijderen?',
      type: 'warning'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {gameState.gameCompleted ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Spel Voltooid!</h2>
          <ScoreOverview gameState={gameState} />
          <button
  onClick={onResetGame}
  className="flex items-center py-2 px-4 bg-green-100 text-green-800 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
>
  <Layers size={18} className="mr-2" />
  nieuw spel
</button>
        </div>
      ) : (
        <>
          {currentRoundData && currentRoundState && (
            <>
              <RoundInfo 
                roundNumber={gameState.currentRound} 
                cardsPerPlayer={currentRoundData.cardsPerPlayer}
                dealerId={currentRoundData.dealerId}
                starterId={currentRoundData.starterId}
                players={gameState.players}
              />
              
              <div className="mt-6">
                <RoundInput
                  round={currentRoundData}
                  roundState={currentRoundState}
                  players={gameState.players}
                  onUpdateRound={updateCurrentRound}
                  onUpdateStage={updateRoundStage}
                  onRoundComplete={handleRoundComplete}
                />
              </div>
            </>
          )}
          
          <div className="mt-8">
            <ScoreOverview gameState={gameState} />
          </div>
          
          <div className="mt-8">
            <PredictionStats gameState={gameState} nsfwMode={nsfwMode} />
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={toggleHistory}
              className="flex items-center py-2 px-4 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors"
            >
              <Layers size={18} className="mr-2" />
              {showHistory ? 'Verberg Rondes' : 'Toon Rondes'}
            </button>
            <button
              onClick={handleClearStorage}
              className="flex items-center py-2 px-4 bg-red-100 text-red-800 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              title="Verwijder opgeslagen spel"
            >
              <Trash2 size={18} className="mr-2" />
              Verwijder Spel
            </button>
          </div>
          
          {showHistory && gameState.rounds.length > 0 && (
            <div className="mt-4">
              <RoundHistory rounds={gameState.rounds} players={gameState.players} />
            </div>
          )}
        </>
      )}
      
      {/* Toast notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          actionLabel="Bevestig"
          onAction={() => {
            clearGameState();
            onResetGame();
            setToast(null);
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;