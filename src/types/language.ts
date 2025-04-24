export type Language = 'nl' | 'en';

export interface Translations {
  [key: string]: {
    nl: string;
    en: string;
  };
}

export const translations: Translations = {
  title: {
    nl: 'Boerenbridge',
    en: 'oh! well',
  },
  subtitle: {
    nl: 'Scorekeeper',
    en: 'Scorekeeper',
  },
  newGame: {
    nl: 'Nieuw Spel',
    en: 'New Game',
  },
  gameCompleted: {
    nl: 'Spel Voltooid!',
    en: 'Game Completed!',
  },
  deleteGame: {
    nl: 'Verwijder Spel',
    en: 'Delete Game',
  },
  showRounds: {
    nl: 'Toon Rondes',
    en: 'Show Rounds',
  },
  hideRounds: {
    nl: 'Verberg Rondes',
    en: 'Hide Rounds',
  },
  confirmNewGame: {
    nl: 'Weet je zeker dat je een nieuw spel wilt starten? Het huidige spel zal verloren gaan.',
    en: 'Are you sure you want to start a new game? The current game will be lost.',
  },
  confirmDeleteGame: {
    nl: 'Weet je zeker dat je alle opgeslagen gegevens wilt verwijderen?',
    en: 'Are you sure you want to delete all saved data?',
  },
  confirm: {
    nl: 'Bevestig',
    en: 'Confirm',
  },
  nsfwMode: {
    nl: '🍺 NSFW modus',
    en: '🍺 NSFW mode',
  },
  normalMode: {
    nl: '👔 Toon Normale Weergave',
    en: '👔 Show Normal View',
  },
  addPlayers: {
    nl: 'Spelers Toevoegen',
    en: 'Add Players',
  },
  minPlayersError: {
    nl: 'Je hebt minstens 2 spelers nodig.',
    en: 'You need at least 2 players.',
  },
  uniqueNamesError: {
    nl: 'Elke speler moet een unieke naam hebben.',
    en: 'Each player must have a unique name.',
  },
  addPlayer: {
    nl: 'Speler toevoegen',
    en: 'Add player',
  },
  startGame: {
    nl: 'Start Spel',
    en: 'Start Game',
  },
  playerPlaceholder: {
    nl: 'Speler',
    en: 'Player',
  },
  removePlayer: {
    nl: 'Verwijder speler',
    en: 'Remove player',
  },
  round: {
    nl: 'Ronde',
    en: 'Round',
  },
  cardsPerPlayer: {
    nl: 'kaarten per speler',
    en: 'cards per player',
  },
  dealer: {
    nl: 'Deler',
    en: 'Dealer',
  },
  starter: {
    nl: 'Start',
    en: 'Starts',
  },
  predictions: {
    nl: 'Voorspellingen',
    en: 'Predictions',
  },
  achieved: {
    nl: 'Behaald',
    en: 'Achieved',
  },
  score: {
    nl: 'Score',
    en: 'Score',
  },
  scoreboard: {
    nl: 'Scorebord',
    en: 'Scoreboard',
  },
  roundHistory: {
    nl: 'Ronde Geschiedenis',
    en: 'Round History',
  },
  noRoundsCompleted: {
    nl: 'Nog geen rondes voltooid',
    en: 'No rounds completed yet',
  },
  prediction: {
    nl: 'Voorspelling',
    en: 'Prediction',
  },
  tricks: {
    nl: 'slagen',
    en: 'tricks',
  },
  boldnessStats: {
    nl: 'Lef Statistieken',
    en: 'Boldness Statistics',
  },
  totalPredicted: {
    nl: 'Totaal voorspeld',
    en: 'Total predicted',
  },
  averagePerRound: {
    nl: 'Gemiddeld per ronde',
    en: 'Average per round',
  },
  correctlyPredicted: {
    nl: 'Correct voorspeld',
    en: 'Correctly predicted',
  },
  successRate: {
    nl: 'Succes ratio',
    en: 'Success rate',
  },
  rounds: {
    nl: 'rondes',
    en: 'rounds',
  },
  boldnessScore: {
    nl: 'lef score',
    en: 'boldness score',
  },
  predictionsComplete: {
    nl: 'Voorspellingen Compleet',
    en: 'Predictions Complete',
  },
  startRound: {
    nl: 'Start Ronde',
    en: 'Start Round',
  },
  enterAchieved: {
    nl: 'Behaalde Slagen Invoeren',
    en: 'Enter Achieved Tricks',
  },
  confirmAchieved: {
    nl: 'Bevestig Behaalde Slagen',
    en: 'Confirm Achieved Tricks',
  },
  totalReached: {
    nl: '✓ Totaal van {0} slagen is bereikt!',
    en: '✓ Total of {0} tricks reached!',
  },
  remainingTricks: {
    nl: 'Nog {0} {1} te verdelen (totaal moet {2} zijn)',
    en: '{0} {1} remaining (total must be {2})',
  },
  trick: {
    nl: 'slag',
    en: 'trick',
  },
  enterPredictions: {
    nl: 'Voorspellingen invoeren',
    en: 'Enter predictions',
  },
  enterAchievedTricks: {
    nl: 'Behaalde slagen invoeren',
    en: 'Enter achieved tricks',
  },
  nextRound: {
    nl: 'Bezig met volgende ronde...',
    en: 'Preparing next round...',
  }
};