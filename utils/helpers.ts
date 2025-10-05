import { ENCOURAGEMENT_MESSAGES, LETTER_COLORS } from "./constants";

export const shuffleArray = <T>(array: T[], maxRetries: number = 10): T[] => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  if (
    newArray.join("") === array.join("") &&
    array.length > 1 &&
    maxRetries > 0
  ) {
    return shuffleArray(array, maxRetries - 1);
  }

  return newArray;
};

export const getRandomColor = (): string => {
  return LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)];
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const calculateStars = (attempts: number, elapsed: number): number => {
  if (attempts === 0) return 3;
  if (elapsed < 30 && attempts === 1) return 3;
  if (elapsed < 60 && attempts <= 2) return 2;
  if (attempts <= 3) return 1;
  return 0;
};

export const getRandomEncouragementMessage = (): string => {
  return ENCOURAGEMENT_MESSAGES[
    Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
  ];
};
