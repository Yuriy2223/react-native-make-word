import { useCallback, useState } from "react";
import { Character, Difficulty } from "../types/types";
import { getRandomColor, shuffleArray } from "../utils/helpers";

export const useGameState = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [originalWord, setOriginalWord] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [lastCheckedWord, setLastCheckedWord] = useState("");

  const startGame = useCallback(
    (word: string) => {
      const upperWord = word.toUpperCase();
      setOriginalWord(upperWord);
      setAttempts(0);
      setIsGameActive(true);
      setShowHint(difficulty === "easy");
      setLastCheckedWord("");

      const shuffled = shuffleArray([...upperWord]);
      const newCharacters: Character[] = shuffled.map((char, index) => ({
        id: `${char}-${index}-${Date.now()}`,
        char,
        color: getRandomColor(),
      }));

      setCharacters(newCharacters);
    },
    [difficulty]
  );

  const resetGame = useCallback(() => {
    setOriginalWord("");
    setCharacters([]);
    setAttempts(0);
    setIsGameActive(false);
    setShowHint(false);
    setLastCheckedWord("");
  }, []);

  const shuffleCharacters = useCallback(() => {
    const shuffled = shuffleArray(characters);
    setCharacters(shuffled);
    setLastCheckedWord("");
  }, [characters]);

  const swapCharacters = useCallback((fromIndex: number, toIndex: number) => {
    setCharacters((prev) => {
      const newChars = [...prev];
      [newChars[fromIndex], newChars[toIndex]] = [
        newChars[toIndex],
        newChars[fromIndex],
      ];
      return newChars;
    });
  }, []);

  const incrementAttempts = useCallback(() => {
    setAttempts((prev) => prev + 1);
  }, []);

  const getCurrentWord = useCallback(() => {
    return characters.map((c) => c.char).join("");
  }, [characters]);

  const toggleHint = useCallback(() => {
    if (difficulty === "medium") {
      setShowHint((prev) => !prev);
    }
  }, [difficulty]);

  return {
    difficulty,
    setDifficulty,
    originalWord,
    characters,
    attempts,
    isGameActive,
    showHint,
    lastCheckedWord,
    setLastCheckedWord,
    startGame,
    resetGame,
    shuffleCharacters,
    swapCharacters,
    incrementAttempts,
    getCurrentWord,
    toggleHint,
  };
};
