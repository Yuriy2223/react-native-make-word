export const LETTER_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#feca57",
  "#48dbfb",
  "#1dd1a1",
  "#ff9ff3",
  "#a29bfe",
  "#fd79a8",
];

export const DIFFICULTY_CONFIG = {
  easy: { min: 3, max: 5, hint: true },
  medium: { min: 6, max: 8, hint: "toggle" },
  hard: { min: 9, max: 20, hint: false },
} as const;

export const ENCOURAGEMENT_MESSAGES = [
  "Майже вийшло!\nСпробуй ще раз!",
  "Не здавайся!\nУ тебе все вийде!",
  "Так близько!\nЩе одна спроба!",
  "Молодець, що стараєшся!\nПродовжуй!",
  "Ти на правильному шляху!\nДавай ще раз!",
];
