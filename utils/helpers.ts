import { ENCOURAGEMENT_MESSAGES, LETTER_COLORS } from "./constants";

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  if (newArray.join("") === array.join("") && array.length > 1) {
    return shuffleArray(array);
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

export const calculateStars = (attempts: number, elapsed: number): string => {
  if (attempts === 0) return "⭐⭐⭐";
  if (elapsed < 30 && attempts === 1) return "⭐⭐⭐";
  if (elapsed < 60 && attempts <= 2) return "⭐⭐☆";
  if (attempts <= 3) return "⭐☆☆";
  return "☆☆☆";
};

// export const getRandomEncouragementMessage = (): string => {
//   const { ENCOURAGEMENT_MESSAGES } = require("./constants");
//   return ENCOURAGEMENT_MESSAGES[
//     Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
//   ];
// };
export const getRandomEncouragementMessage = (): string => {
  return ENCOURAGEMENT_MESSAGES[
    Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
  ];
};
