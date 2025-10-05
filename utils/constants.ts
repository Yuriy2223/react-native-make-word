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

export const colors = {
  error: ["#ff7675", "#d63031"] as const,
  success: ["#55efc4", "#00b894"] as const,
  warning: ["#feca57", "#f39c12"] as const,
};

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
