import { useEffect, useState } from "react";
import { Difficulty, GameStats } from "../types/types";
import { getDefaultStats, loadStats, saveStats } from "../utils/storage";

export const useStats = () => {
  const [stats, setStats] = useState<GameStats>(getDefaultStats());

  useEffect(() => {
    loadStats().then(setStats);
  }, []);

  const saveGameResult = async (
    difficulty: Difficulty,
    word: string,
    time: number,
    attempts: number,
    stars: string,
    isWin: boolean
  ) => {
    const newStats = { ...stats };

    newStats.totalGames++;
    newStats[difficulty].played++;

    if (isWin) {
      newStats.totalWins++;
      newStats[difficulty].won++;
      newStats[difficulty].totalStars += stars.length;

      if (
        !newStats[difficulty].bestTime ||
        time < newStats[difficulty].bestTime!
      ) {
        newStats[difficulty].bestTime = time;
      }
    }

    newStats.history.unshift({
      word,
      difficulty,
      time,
      attempts,
      stars,
      won: isWin,
      date: Date.now(),
    });

    if (newStats.history.length > 20) {
      newStats.history = newStats.history.slice(0, 20);
    }

    setStats(newStats);
    await saveStats(newStats);
  };

  return { stats, saveGameResult };
};
