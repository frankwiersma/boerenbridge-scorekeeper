import { GameState } from '../types/game';
import { Language } from '../types/language';

const STORAGE_KEY = 'boerenbridge_game_state';
const LANGUAGE_KEY = 'boerenbridge_language';

// Save game state to localStorage
export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Save language preference
export const saveLanguage = (language: Language): void => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

// Load language preference
export const loadLanguage = (): Language | null => {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
  return savedLanguage || null;
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (error) {
      console.error('Failed to parse saved game state:', error);
      return null;
    }
  }
  return null;
};

// Clear saved game state
export const clearGameState = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};