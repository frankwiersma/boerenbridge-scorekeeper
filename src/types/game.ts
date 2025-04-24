export interface Player {
  id: number;
  name: string;
}

export interface Prediction {
  playerId: number;
  predicted: number;
  achieved: number;
  score: number;
}

export interface Round {
  roundNumber: number;
  cardsPerPlayer: number;
  dealerId: number;
  starterId: number;
  stage?: InputStage;
  activePlayerId?: number;
  predictions: Prediction[];
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  currentRound: number;
  gameStarted: boolean;
  gameCompleted: boolean;
}

export type InputStage = 'prediction' | 'achieved' | 'complete';

export interface RoundState {
  stage: InputStage;
  activePlayerId: number | null;
}