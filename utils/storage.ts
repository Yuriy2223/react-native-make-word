import { GameStats } from "@/types/types";
import * as SecureStore from "expo-secure-store";

const STATS_KEY = "wordGameStats";

export const getDefaultStats = (): GameStats => ({
  easy: { played: 0, won: 0, bestTime: null, totalStars: 0 },
  medium: { played: 0, won: 0, bestTime: null, totalStars: 0 },
  hard: { played: 0, won: 0, bestTime: null, totalStars: 0 },
  history: [],
  totalGames: 0,
  totalWins: 0,
});

export const loadStats = async (): Promise<GameStats> => {
  try {
    const saved = await SecureStore.getItemAsync(STATS_KEY);
    return saved ? JSON.parse(saved) : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
};

export const saveStats = async (stats: GameStats): Promise<void> => {
  try {
    await SecureStore.setItemAsync(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
};

export const resetStats = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STATS_KEY);
  } catch (error) {
    console.error("Failed to reset stats:", error);
  }
};
