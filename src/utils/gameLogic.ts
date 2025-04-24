import { GameState, Player, Prediction, Round, RoundState } from '../types/game';

// Calculate the number of cards per player for a given round
export const calculateCardsPerPlayer = (roundNumber: number, playerCount: number): number => {
  // In classic Boerenbridge, we start with 1 card and go up to 7, then back down to 1
  const totalRounds = 13; // 1-7 and back to 1
  let cards = roundNumber <= 7 ? roundNumber : 14 - roundNumber;
  
  // Ensure we don't deal more cards than are in the deck 
  // (52 cards divided by number of players)
  const maxCards = Math.floor(52 / playerCount);
  return Math.min(cards, maxCards);
};

// Create a new round
export const createNewRound = (gameState: GameState): Round => {
  const { players, currentRound, rounds } = gameState;
  
  // Determine dealer (rotates with each round)
  const dealerId = currentRound % players.length;
  
  // Starter is the player to the left of the dealer
  const starterId = (dealerId + 1) % players.length;
  
  // Calculate cards per player for this round
  const cardsPerPlayer = calculateCardsPerPlayer(currentRound, players.length);
  
  // Create empty predictions for each player
  const predictions: Prediction[] = players.map(player => ({
    playerId: player.id,
    predicted: 0,
    achieved: 0,
    score: 0
  }));
  
  return {
    roundNumber: currentRound,
    cardsPerPlayer,
    dealerId,
    starterId,
    stage: 'prediction',
    activePlayerId: starterId,
    predictions
  };
};

// Calculate score for a player in a round
export const calculateScore = (predicted: number, achieved: number): number => {
  // Basic scoring: 10 points for correct prediction + number of tricks
  if (predicted === achieved) {
    return 10 + achieved;
  }
  // -2 points per trick off
  return -2 * Math.abs(predicted - achieved);
};

// Calculate total score for a player across all rounds
export const calculateTotalScore = (playerId: number, rounds: Round[]): number => {
  return rounds.reduce((total, round) => {
    const playerPrediction = round.predictions.find(p => p.playerId === playerId);
    return total + (playerPrediction?.score || 0);
  }, 0);
};

// Check if all players have completed their predictions for the current round stage
export const isStageComplete = (round: Round, stage: 'prediction' | 'achieved' | 'stake'): boolean => {
  return round.predictions.every(prediction => {
    if (stage === 'prediction') return typeof prediction.predicted === 'number';
    if (stage === 'achieved') return prediction.achieved >= 0;
    if (stage === 'stake') return prediction.stake > 0;
    return false;
  });
};

// Calculate total available tricks for a round
export const getTotalAvailableTricks = (round: Round): number => {
  return round.cardsPerPlayer * round.predictions.length;
};

// Calculate remaining tricks to be achieved
export const getRemainingTricks = (round: Round): number => {
  const totalAvailable = getTotalAvailableTricks(round);
  const totalAchieved = getTotalAchievedTricks(round);
  return totalAvailable - totalAchieved;
};

// Get next player in input sequence
export const getNextPlayer = (
  currentPlayerId: number | null, 
  players: Player[], 
  starterId: number
): number => {
  // If no current player or at the end of the list, start from the starter
  if (currentPlayerId === null) {
    return starterId;
  }
  
  // Find current player index
  const currentIndex = players.findIndex(p => p.id === currentPlayerId);
  
  // Move to next player or wrap around
  return players[(currentIndex + 1) % players.length].id;
};

// Update scores for a round after all inputs are complete
export const updateRoundScores = (round: Round): Round => {
  const updatedPredictions = round.predictions.map(prediction => ({
    ...prediction,
    score: calculateScore(prediction.predicted, prediction.achieved)
  }));
  
  return {
    ...round,
    predictions: updatedPredictions
  };
};

// Get initial RoundState
export const getInitialRoundState = (round: Round | null): RoundState | null => {
  if (!round) return null;
  
  return {
    stage: 'prediction',
    activePlayerId: round.starterId
  };
};

// Check if the game is complete (all rounds played)
export const isGameComplete = (currentRound: number): boolean => {
  return currentRound > 13; // 13 rounds in standard Boerenbridge (1-7 and back to 1)
};

// Get player name by ID
export const getPlayerById = (players: Player[], playerId: number): Player | undefined => {
  return players.find(player => player.id === playerId);
};

// Calculate the total tricks predicted in a round
export const getTotalPredictedTricks = (round: Round): number => {
  return round.predictions.reduce((total, pred) => total + pred.predicted, 0);
};

// Calculate the total tricks achieved in a round
export const getTotalAchievedTricks = (round: Round): number => {
  return round.predictions.reduce((total, pred) => total + pred.achieved, 0);
};

// Initialize a new game
export const initializeNewGame = (players: Player[]): GameState => {
  return {
    players,
    rounds: [],
    currentRound: 1,
    gameStarted: true,
    gameCompleted: false
  };
};

// Validate a round according to Wizard rules
export const validateRound = (round: Round): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const totalTricks = round.cardsPerPlayer * round.predictions.length;
  
  // Get total predicted tricks
  const totalPredicted = getTotalPredictedTricks(round);
  
  // Get total achieved tricks
  const totalAchieved = getTotalAchievedTricks(round);
  
  if (totalPredicted === totalTricks) {
    errors.push(`Totaal voorspelde slagen (${totalPredicted}) mag niet gelijk zijn aan het aantal beschikbare slagen (${totalTricks})`);
  }
  
  if (totalAchieved !== totalTricks) {
    errors.push(`Totaal behaalde slagen (${totalAchieved}) moet gelijk zijn aan het aantal beschikbare slagen (${totalTricks})`);
  }
  
  round.predictions.forEach(prediction => {
    // Predictions must be between 0 and total tricks
    if (prediction.predicted < 0 || prediction.predicted > totalTricks) {
      errors.push(`Ongeldige voorspelling voor speler ${prediction.playerId}: ${prediction.predicted} (moet tussen 0 en ${totalTricks} zijn)`);
    }
    
    // Achieved tricks must be between 0 and total tricks
    if (prediction.achieved < 0 || prediction.achieved > totalTricks) {
      errors.push(`Ongeldig aantal behaalde slagen voor speler ${prediction.playerId}: ${prediction.achieved} (moet tussen 0 en ${totalTricks} zijn)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};