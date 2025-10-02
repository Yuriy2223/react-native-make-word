import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Difficulty = "easy" | "medium" | "hard";

interface Character {
  id: string;
  char: string;
  position: number;
  color: string;
}

interface GameStats {
  easy: {
    played: number;
    won: number;
    bestTime: number | null;
    totalStars: number;
  };
  medium: {
    played: number;
    won: number;
    bestTime: number | null;
    totalStars: number;
  };
  hard: {
    played: number;
    won: number;
    bestTime: number | null;
    totalStars: number;
  };
  history: GameHistory[];
  totalGames: number;
  totalWins: number;
}

interface GameHistory {
  word: string;
  difficulty: Difficulty;
  time: number;
  attempts: number;
  stars: string;
  won: boolean;
  date: number;
}

const LETTER_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#feca57",
  "#48dbfb",
  "#1dd1a1",
  "#ff9ff3",
  "#a29bfe",
  "#fd79a8",
];

function WordGameScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [textInput, setTextInput] = useState("");
  const [originalWord, setOriginalWord] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState("☆☆☆");
  const [showHint, setShowHint] = useState(false);
  const [lastCheckedWord, setLastCheckedWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    easy: { played: 0, won: 0, bestTime: null, totalStars: 0 },
    medium: { played: 0, won: 0, bestTime: null, totalStars: 0 },
    hard: { played: 0, won: 0, bestTime: null, totalStars: 0 },
    history: [],
    totalGames: 0,
    totalWins: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (startTime && gameStarted) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, gameStarted]);

  useEffect(() => {
    let newStars = "☆☆☆";
    if (attempts === 0) {
      newStars = "⭐⭐⭐";
    } else if (elapsedTime < 30 && attempts === 1) {
      newStars = "⭐⭐⭐";
    } else if (elapsedTime < 60 && attempts <= 2) {
      newStars = "⭐⭐☆";
    } else if (attempts <= 3) {
      newStars = "⭐☆☆";
    }
    setStars(newStars);
  }, [attempts, elapsedTime]);

  const loadStats = async () => {
    try {
      const saved = await SecureStore.getItemAsync("wordGameStats");
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const saveStats = async (newStats: GameStats) => {
    try {
      await SecureStore.setItemAsync("wordGameStats", JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startGame = () => {
    const text = textInput.trim().toUpperCase();
    if (!text) return;

    const length = text.length;
    if (difficulty === "easy" && (length < 3 || length > 5)) {
      Alert.alert("🟢 Легкий рівень", "Потрібно слово від 3 до 5 букв!");
      return;
    }
    if (difficulty === "medium" && (length < 6 || length > 8)) {
      Alert.alert("🟡 Середній рівень", "Потрібно слово від 6 до 8 букв!");
      return;
    }
    if (difficulty === "hard" && length < 9) {
      Alert.alert("🔴 Важкий рівень", "Потрібно слово від 9 букв!");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setOriginalWord(text);
    setAttempts(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameStarted(true);
    setLastCheckedWord("");
    setShowHint(difficulty === "easy");

    const shuffled = shuffleArray([...text]);
    const newCharacters: Character[] = shuffled.map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
      position: index,
      color: LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)],
    }));

    setCharacters(newCharacters);
    setTextInput("");
  };

  const swapCharacters = (index1: number, index2: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCharacters = [...characters];
    [newCharacters[index1], newCharacters[index2]] = [
      newCharacters[index2],
      newCharacters[index1],
    ];
    setCharacters(newCharacters);
  };

  const shuffleLetters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const shuffled = shuffleArray(characters);
    setCharacters(
      shuffled.map((char, index) => ({ ...char, position: index }))
    );
    setLastCheckedWord("");
  };

  const checkWord = () => {
    if (characters.length === 0) return;

    const currentWord = characters.map((c) => c.char).join("");
    if (lastCheckedWord === currentWord) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLastCheckedWord(currentWord);
    setAttempts((prev) => prev + 1);

    const isCorrect = currentWord === originalWord;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      saveGameResult(true);
      Alert.alert("🎉 Вітаємо! 🎉", `Ти склав слово!\n${stars}`);
      setGameStarted(false);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const messages = [
        "Майже вийшло! Спробуй ще раз!",
        "Не здавайся! У тебе все вийде!",
        "Так близько! Ще одна спроба!",
        "Молодець, що стараєшся! Продовжуй!",
        "Ти на правильному шляху! Давай ще раз!",
      ];
      Alert.alert(
        "Спробуй ще!",
        messages[Math.floor(Math.random() * messages.length)]
      );
    }
  };

  const saveGameResult = async (isWin: boolean) => {
    const newStats = { ...stats };
    newStats.totalGames++;
    newStats[difficulty].played++;

    if (isWin) {
      newStats.totalWins++;
      newStats[difficulty].won++;
      newStats[difficulty].totalStars += stars.length;

      if (
        !newStats[difficulty].bestTime ||
        elapsedTime < newStats[difficulty].bestTime!
      ) {
        newStats[difficulty].bestTime = elapsedTime;
      }
    }

    newStats.history.unshift({
      word: originalWord,
      difficulty,
      time: elapsedTime,
      attempts,
      stars,
      won: isWin,
      date: Date.now(),
    });

    if (newStats.history.length > 20) {
      newStats.history = newStats.history.slice(0, 20);
    }

    await saveStats(newStats);
  };

  const resetGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCharacters([]);
    setOriginalWord("");
    setAttempts(0);
    setStartTime(null);
    setElapsedTime(0);
    setStars("☆☆☆");
    setGameStarted(false);
    setLastCheckedWord("");
    setShowHint(false);
    setTextInput("");
  };

  const resetStats = async () => {
    Alert.alert("Скинути статистику?", "Точно хочеш скинути всю статистику?", [
      { text: "Ні", style: "cancel" },
      {
        text: "Так",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("wordGameStats");
          setStats({
            easy: { played: 0, won: 0, bestTime: null, totalStars: 0 },
            medium: { played: 0, won: 0, bestTime: null, totalStars: 0 },
            hard: { played: 0, won: 0, bestTime: null, totalStars: 0 },
            history: [],
            totalGames: 0,
            totalWins: 0,
          });
          setShowStats(false);
        },
      },
    ]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    return diff === "easy"
      ? "🟢 Легко"
      : diff === "medium"
      ? "🟡 Середньо"
      : "🔴 Важко";
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Склади слово 🎨</Text>
          <Text style={styles.subtitle}>Стань чемпіоном складання слів!</Text>

          <View style={styles.difficultyContainer}>
            {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyBtn,
                  difficulty === diff && styles.difficultyBtnActive,
                  diff === "easy" && styles.difficultyEasy,
                  diff === "medium" && styles.difficultyMedium,
                  diff === "hard" && styles.difficultyHard,
                ]}
                onPress={() => {
                  setDifficulty(diff);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === diff && styles.difficultyTextActive,
                  ]}
                >
                  {getDifficultyLabel(diff)}
                </Text>
                <Text
                  style={[
                    styles.difficultySubtext,
                    difficulty === diff && styles.difficultyTextActive,
                  ]}
                >
                  {diff === "easy"
                    ? "3-5 букв"
                    : diff === "medium"
                    ? "6-8 букв"
                    : "9+ букв"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.statsPanel}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <Text style={styles.statLabel}>⏱️ Час</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#e84393" }]}>
              <Text style={styles.statValue}>{attempts}</Text>
              <Text style={styles.statLabel}>🎯 Спроби</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#f39c12" }]}>
              <Text style={styles.statLabel}>⭐ Рейтинг</Text>
              <Text style={styles.starsValue}>{stars}</Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <TextInput
              style={styles.input}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={
                difficulty === "easy"
                  ? "🟢 Введи коротке слово (3-5 букв)"
                  : difficulty === "medium"
                  ? "🟡 Введи середнє слово (6-8 букв)"
                  : "🔴 Введи довге слово (9+ букв)"
              }
              maxLength={20}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.startBtn, !textInput.trim() && styles.btnDisabled]}
              onPress={startGame}
              disabled={!textInput.trim()}
            >
              <Text style={styles.btnText}>Почати гру</Text>
            </TouchableOpacity>
          </View>

          {showHint && originalWord && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{originalWord}</Text>
            </View>
          )}

          {characters.length > 0 && (
            <View style={styles.charactersContainer}>
              {characters.map((char, index) => (
                <TouchableOpacity
                  key={char.id}
                  style={[
                    styles.character,
                    { borderColor: char.color },
                    originalWord &&
                      char.char === originalWord[index] &&
                      lastCheckedWord &&
                      styles.characterCorrect,
                    originalWord &&
                      lastCheckedWord &&
                      char.char !== originalWord[index] &&
                      styles.characterIncorrect,
                  ]}
                  onPress={() => {
                    if (index < characters.length - 1) {
                      swapCharacters(index, index + 1);
                    }
                  }}
                  onLongPress={() => {
                    if (index > 0) {
                      swapCharacters(index, index - 1);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.characterText,
                      { color: char.color },
                      ((originalWord &&
                        char.char === originalWord[index] &&
                        lastCheckedWord) ||
                        (originalWord &&
                          lastCheckedWord &&
                          char.char !== originalWord[index])) && {
                        color: "white",
                      },
                    ]}
                  >
                    {char.char}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {gameStarted && (
            <View style={styles.controls}>
              {difficulty === "medium" && (
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setShowHint(!showHint)}
                >
                  <Text style={styles.btnText}>
                    {showHint ? "🙈 Сховати" : "👀 Підказка"}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={shuffleLetters}
              >
                <Text style={styles.btnText}>🔄 Перемішати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, styles.dangerBtn]}
                onPress={resetGame}
              >
                <Text style={styles.btnText}>🎮 Нова гра</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameStarted && (
            <TouchableOpacity style={styles.checkBtn} onPress={checkWord}>
              <Text style={styles.checkBtnText}>ПЕРЕВІРИТИ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.statsBtn}
            onPress={() => setShowStats(true)}
          >
            <Text style={styles.btnText}>📊 Моя статистика</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Modal visible={showStats} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Твоя статистика</Text>
            <ScrollView>
              <View style={styles.statsSummary}>
                <Text style={styles.statsSummaryValue}>
                  {stats.totalWins} / {stats.totalGames}
                </Text>
                <Text style={styles.statsSummaryLabel}>
                  Перемог / Всього ігор
                </Text>
              </View>

              {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
                <View
                  key={diff}
                  style={[
                    styles.statLevelCard,
                    diff === "easy" && styles.statEasy,
                    diff === "medium" && styles.statMedium,
                    diff === "hard" && styles.statHard,
                  ]}
                >
                  <Text style={styles.statLevelTitle}>
                    {getDifficultyLabel(diff)}
                  </Text>
                  <Text style={styles.statLevelText}>
                    Зіграно: {stats[diff].played} | Виграно: {stats[diff].won}
                  </Text>
                  <Text style={styles.statLevelText}>
                    ⭐ Зірок: {stats[diff].totalStars}
                  </Text>
                  <Text style={styles.statLevelText}>
                    ⏱️ Кращий час:{" "}
                    {stats[diff].bestTime ? `${stats[diff].bestTime}с` : "-"}
                  </Text>
                </View>
              ))}

              {stats.history.length > 0 && (
                <View style={styles.lastGameSection}>
                  <Text style={styles.lastGameTitle}>📜 Остання гра:</Text>
                  <View style={styles.lastGameCard}>
                    <Text>Слово: {stats.history[0].word}</Text>
                    <Text>
                      Рівень: {getDifficultyLabel(stats.history[0].difficulty)}
                    </Text>
                    <Text>
                      Час: {stats.history[0].time}с | Спроби:{" "}
                      {stats.history[0].attempts}
                    </Text>
                    <Text>Результат: {stats.history[0].stars}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.controlBtn, styles.dangerBtn]}
                onPress={resetStats}
              >
                <Text style={styles.btnText}>Скинути</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => setShowStats(false)}
              >
                <Text style={styles.btnText}>Закрити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#667eea",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  difficultyBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 15,
    borderWidth: 3,
    alignItems: "center",
    backgroundColor: "white",
  },
  difficultyBtnActive: {
    backgroundColor: "#667eea",
  },
  difficultyEasy: {
    borderColor: "#55efc4",
  },
  difficultyMedium: {
    borderColor: "#feca57",
  },
  difficultyHard: {
    borderColor: "#ff7675",
  },
  difficultyText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#333",
  },
  difficultyTextActive: {
    color: "white",
  },
  difficultySubtext: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
  },
  statsPanel: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
  },
  starsValue: {
    fontSize: 20,
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: "#667eea",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "white",
  },
  startBtn: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hintContainer: {
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#667eea",
    borderStyle: "dashed",
    marginBottom: 20,
    alignItems: "center",
  },
  hintText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667eea",
    letterSpacing: 8,
  },
  charactersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
    minHeight: 80,
  },
  character: {
    padding: 12,
    borderRadius: 15,
    borderWidth: 4,
    backgroundColor: "white",
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  characterCorrect: {
    backgroundColor: "#00b894",
    borderColor: "#00b894",
  },
  characterIncorrect: {
    backgroundColor: "#d63031",
    borderColor: "#d63031",
  },
  characterText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  controlBtn: {
    flex: 1,
    backgroundColor: "#0984e3",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 100,
  },
  dangerBtn: {
    backgroundColor: "#d63031",
  },
  checkBtn: {
    backgroundColor: "#00b894",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  checkBtnText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  statsBtn: {
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#667eea",
    marginBottom: 20,
  },
  statsSummary: {
    backgroundColor: "#6c5ce7",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  statsSummaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  statsSummaryLabel: {
    fontSize: 14,
    color: "white",
    marginTop: 8,
  },
  statLevelCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  statEasy: {
    backgroundColor: "#00b894",
  },
  statMedium: {
    backgroundColor: "#f39c12",
  },
  statHard: {
    backgroundColor: "#d63031",
  },
  statLevelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  statLevelText: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
  },
  lastGameSection: {
    marginTop: 20,
  },
  lastGameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 10,
  },
  lastGameCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});

export default WordGameScreen;
