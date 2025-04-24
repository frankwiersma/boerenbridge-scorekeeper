# Boerenbridge Scorekeeper

A beautiful, feature-rich scorekeeper application for the Dutch card game "Boerenbridge" (Farmer's Bridge). This web application helps players track tricks, predictions, scores, and statistics during gameplay.

![Boerenbridge Scorekeeper](https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg?auto=compress&cs=tinysrgb&w=400)

## Features

- **Player Management**: Add 4-6 players with custom names
- **Complete Game Flow**: Handles all aspects of the Boerenbridge game:
  - Trick predictions for each round
  - Recording actual tricks achieved
  - Automatic scoring with bonus points
  - Dealer and starter rotation between rounds
- **Round Progression**: Automatically manages the progression of rounds (1-7 cards and back to 1)
- **Visual Statistics**:
  - Real-time score charts
  - Player prediction patterns
  - "Boldness" statistics to track aggressive play
- **Game History**: Review completed rounds and scores
- **Multilingual**: Available in Dutch and English
- **Offline Support**: Game state saved locally in your browser
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **NSFW Mode**: Add some fun to your game night with alternative terminology

## Game Rules

Boerenbridge is a trick-taking card game similar to Oh Hell or Wizard. The basic rules:

1. The game is played over 13 rounds
2. Each round, players are dealt an increasing number of cards (1-7), then decreasing (7-1)
3. Players predict how many tricks they will win each round
4. Points are awarded as follows:
   - Correct prediction: 10 points + number of tricks won
   - Incorrect prediction: -2 points for each trick off
5. The dealer and starting player rotate each round
6. In the standard rules, the total predicted tricks cannot equal the total available tricks for the last player to predict

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Vite as the build tool
- LocalStorage for game persistence

## Installation

```bash
# Clone the repository
git clone https://github.com/frankwiersma/boerenbridge-scorekeeper.git

# Navigate to the project directory
cd boerenbridge-scorekeeper

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Usage

1. **Start a game**: Enter player names (4-6 players) and click "Start Spel"
2. **Make predictions**: For each player, enter the number of tricks they predict to win
3. **Record tricks**: After the round is played, enter the actual number of tricks won by each player
4. **Track scores**: View the scoreboard and statistics to see who's winning
5. **Complete the game**: After 13 rounds, a winner is declared

### Tips

- Use the language toggle in the top right to switch between Dutch and English
- Try the NSFW mode for a more casual game night atmosphere
- Review round history to analyze player performance
- Watch the boldness statistics to see who's making the riskiest predictions

## Development

### Project Structure

- `/src/components`: React components for the UI
- `/src/types`: TypeScript interfaces and types
- `/src/utils`: Game logic and utility functions
- `/src/App.tsx`: Main application component

### Key Files

- `gameLogic.ts`: Core game rules and calculations
- `GameBoard.tsx`: Main game interface
- `ScoreOverview.tsx`: Scoring and charts
- `PlayerSetup.tsx`: Initial game setup

### Adding Features

To extend this application:

1. Fork the repository
2. Make your changes (e.g., add new statistics, game variants)
3. Submit a pull request

## Contact

- LinkedIn: [frankwiersma](https://www.linkedin.com/in/frankwiersma)
- GitHub: [frankwiersma](https://github.com/frankwiersma/)
- X/Twitter: [frankwiersma_](https://x.com/frankwiersma_/)
- Instagram: [frankwiersma_](https://www.instagram.com/frankwiersma_)