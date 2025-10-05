export type Difficulty = "easy" | "medium" | "hard";

export interface Character {
  id: string;
  char: string;
  color: string;
}

export interface GameStats {
  easy: LevelStats;
  medium: LevelStats;
  hard: LevelStats;
  history: GameHistory[];
  totalGames: number;
  totalWins: number;
}

export interface LevelStats {
  played: number;
  won: number;
  bestTime: number | null;
  totalStars: number;
}

export interface GameHistory {
  word: string;
  difficulty: Difficulty;
  time: number;
  attempts: number;
  stars: number;
  won: boolean;
  date: number;
}
