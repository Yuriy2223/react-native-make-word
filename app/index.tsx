import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

type DifficultyLevel = "easy" | "medium" | "hard";

interface DifficultyConfig {
  min: number;
  max: number;
  label: string;
  hint: boolean | "toggle";
}

const DIFFICULTIES: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { min: 3, max: 5, label: "🟢 ЛЕГКО", hint: true },
  medium: { min: 6, max: 8, label: "🟡 СЕРЕДНЬО", hint: "toggle" },
  hard: { min: 9, max: 99, label: "🔴 ВАЖКО", hint: false },
};

interface Character {
  id: string;
  char: string;
  index: number;
  color: string;
  status: "none" | "correct" | "incorrect";
  animation: Animated.Value;
}

interface LevelStats {
  played: number;
  won: number;
  bestTime: number | null;
  totalStars: number;
}

interface LastGame {
  word: string;
  difficulty: DifficultyLevel;
  time: number;
  attempts: number;
  stars: string;
  won: boolean;
}

interface GameStats {
  easy: LevelStats;
  medium: LevelStats;
  hard: LevelStats;
  totalGames: number;
  totalWins: number;
  lastGame: LastGame | null;
}

export default function WordGame() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [inputText, setInputText] = useState("");
  const [originalWord, setOriginalWord] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastCheckedWord, setLastCheckedWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [stats, setStats] = useState<GameStats>(getDefaultStats());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  function getDefaultStats(): GameStats {
    return {
      easy: { played: 0, won: 0, bestTime: null, totalStars: 0 },
      medium: { played: 0, won: 0, bestTime: null, totalStars: 0 },
      hard: { played: 0, won: 0, bestTime: null, totalStars: 0 },
      totalGames: 0,
      totalWins: 0,
      lastGame: null,
    };
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function calculateStars(): string {
    if (attempts === 0) return "⭐⭐⭐";
    if (elapsedTime < 30 && attempts === 1) return "⭐⭐⭐";
    if (elapsedTime < 60 && attempts <= 2) return "⭐⭐☆";
    if (attempts <= 3) return "⭐☆☆";
    return "☆☆☆";
  }

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    if (newArray.join("") === array.join("") && array.length > 1) {
      return shuffleArray(array);
    }
    return newArray;
  }

  function startGame() {
    const text = inputText.trim().toUpperCase();
    if (!text) return;

    const config = DIFFICULTIES[difficulty];
    if (text.length < config.min || text.length > config.max) {
      Alert.alert(
        "Помилка",
        `${config.label}\nПотрібно слово від ${config.min} до ${config.max} букв!`
      );
      return;
    }

    setOriginalWord(text);
    setAttempts(0);
    setLastCheckedWord("");
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameStarted(true);

    if (config.hint === true) setShowHint(true);
    else if (config.hint === "toggle") setShowHint(false);
    else setShowHint(false);

    const letters = shuffleArray([...text]);
    const charsWithState: Character[] = letters.map((char, index) => ({
      id: Math.random().toString(),
      char,
      index,
      color: LETTER_COLORS[Math.floor(Math.random() * LETTER_COLORS.length)],
      status: "none",
      animation: new Animated.Value(0),
    }));

    setCharacters(charsWithState);
    setInputText("");

    charsWithState.forEach((item, idx) => {
      Animated.spring(item.animation, {
        toValue: 1,
        delay: idx * 100,
        useNativeDriver: true,
      }).start();
    });
  }

  // function swapCharacters(fromIndex: number, toIndex: number) {
  //   setCharacters((prev) => {
  //     const newChars = [...prev];
  //     [newChars[fromIndex], newChars[toIndex]] = [
  //       newChars[toIndex],
  //       newChars[fromIndex],
  //     ];
  //     return newChars.map((ch) => ({
  //       ...ch,

  //       status: "none" as const,
  //     }));
  //   });
  //   setLastCheckedWord("");
  // }
  function swapCharacters(fromIndex: number, toIndex: number) {
    setCharacters((prev) => {
      const newChars = [...prev];
      [newChars[fromIndex], newChars[toIndex]] = [
        newChars[toIndex],
        newChars[fromIndex],
      ];
      return newChars.map((ch, idx) => ({
        // додай idx тут
        ...ch,
        index: idx,
        status: "none" as const,
      }));
    });
    setLastCheckedWord("");
  }

  function shuffleLetters() {
    const shuffled = shuffleArray(characters);
    setCharacters(shuffled.map((ch) => ({ ...ch, status: "none" as const })));
    setLastCheckedWord("");
  }

  function checkWord() {
    const currentWord = characters.map((ch) => ch.char).join("");
    if (lastCheckedWord === currentWord && lastCheckedWord !== "") return;

    setLastCheckedWord(currentWord);
    setAttempts((prev) => prev + 1);

    const isCorrect = currentWord === originalWord;

    setCharacters((prev) =>
      prev.map((ch, idx) => {
        const newStatus: "correct" | "incorrect" =
          ch.char === originalWord[idx] ? "correct" : "incorrect";
        Animated.sequence([
          Animated.timing(ch.animation, {
            toValue: 1.3,
            duration: 200,
            delay: idx * 100,
            useNativeDriver: true,
          }),
          Animated.timing(ch.animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        return { ...ch, status: newStatus };
      })
    );

    if (isCorrect) {
      setTimeout(() => {
        const stars = calculateStars();
        saveGameResult(true, stars);
        Alert.alert("🎉 Вітаємо! 🎉", `Ти виграв!\n\n${stars}`, [
          { text: "Нова гра", onPress: resetGame },
        ]);
      }, characters.length * 100 + 800);
    } else {
      setTimeout(() => {
        const messages = [
          "Майже вийшло! Спробуй ще раз!",
          "Не здавайся! У тебе все вийде!",
          "Так близько! Ще одна спроба!",
        ];
        Alert.alert(
          "💪",
          messages[Math.floor(Math.random() * messages.length)]
        );
      }, characters.length * 100 + 300);
    }
  }

  function saveGameResult(isWin: boolean, stars: string) {
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

    newStats.lastGame = {
      word: originalWord,
      difficulty,
      time: elapsedTime,
      attempts: attempts + 1,
      stars,
      won: isWin,
    };

    setStats(newStats);
  }

  function resetGame() {
    setOriginalWord("");
    setCharacters([]);
    setInputText("");
    setStartTime(null);
    setElapsedTime(0);
    setAttempts(0);
    setShowHint(false);
    setLastCheckedWord("");
    setGameStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function Character({ item, index }: { item: Character; index: number }) {
    const pan = useRef(new Animated.ValueXY()).current;
    const scale = useRef(new Animated.Value(1)).current;

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          Animated.spring(scale, {
            toValue: 1.2,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: (e, gesture) => {
          console.log("Release:", { dx: gesture.dx, dy: gesture.dy, index });
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }).start();

          const moveThreshold = 80;
          if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
            if (gesture.dx > moveThreshold && index < characters.length - 1) {
              swapCharacters(index, index + 1);
            } else if (gesture.dx < -moveThreshold && index > 0) {
              swapCharacters(index, index - 1);
            }
          }

          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;

    const animatedStyle = {
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { scale: Animated.multiply(scale, item.animation) },
      ],
    };

    const statusStyle =
      item.status === "correct"
        ? styles.characterCorrect
        : item.status === "incorrect"
        ? styles.characterIncorrect
        : {};

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.character,
          statusStyle,
          animatedStyle,
          { borderColor: item.color },
        ]}
      >
        <Text
          style={[
            styles.characterText,
            { color: item.status === "none" ? item.color : "#fff" },
          ]}
        >
          {item.char}
        </Text>
      </Animated.View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>🎨 Склади слово 🎨</Text>
      <Text style={styles.subtitle}>Стань чемпіоном складання слів!</Text>

      <View style={styles.difficultySelector}>
        {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.difficultyBtn,
              difficulty === key && styles.difficultyBtnActive,
              key === "easy" && styles.difficultyEasy,
              key === "medium" && styles.difficultyMedium,
              key === "hard" && styles.difficultyHard,
            ]}
            onPress={() => setDifficulty(key)}
          >
            <Text style={styles.difficultyText}>{DIFFICULTIES[key].label}</Text>
            <Text style={styles.difficultySubtext}>
              {DIFFICULTIES[key].min}-
              {DIFFICULTIES[key].max === 99 ? "∞" : DIFFICULTIES[key].max} букв
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsPanel}>
        <View style={[styles.statCard, { backgroundColor: "#6c5ce7" }]}>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
          <Text style={styles.statLabel}>⏱️ Час</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#e84393" }]}>
          <Text style={styles.statValue}>{attempts}</Text>
          <Text style={styles.statLabel}>🎯 Спроби</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#f39c12" }]}>
          <Text style={styles.statLabel}>⭐ Рейтинг</Text>
          <Text style={styles.starsDisplay}>{calculateStars()}</Text>
        </View>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Напиши слово для гри!"
          maxLength={20}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.startBtn, !inputText.trim() && styles.btnDisabled]}
          onPress={startGame}
          disabled={!inputText.trim()}
        >
          <Text style={styles.startBtnText}>Почати гру</Text>
        </TouchableOpacity>
      </View>

      {gameStarted && DIFFICULTIES[difficulty].hint === "toggle" && (
        <TouchableOpacity
          onPress={() => setShowHint(!showHint)}
          style={styles.hintBtn}
        >
          <Text style={styles.hintBtnText}>
            {showHint ? "🙈 Сховати" : "👀 Підказка"}
          </Text>
        </TouchableOpacity>
      )}

      {showHint && originalWord && (
        <View style={styles.hintDisplay}>
          <Text style={styles.hintText}>{originalWord}</Text>
        </View>
      )}

      <View style={styles.gameArea}>
        {characters.length === 0 && gameStarted && (
          <Text style={styles.emptyText}>Завантаження...</Text>
        )}
        {characters.length === 0 && !gameStarted && (
          <Text style={styles.emptyText}>Обери складність і почни гру!</Text>
        )}
        <View style={styles.charactersContainer}>
          {characters.map((item, index) => (
            <Character key={item.id} item={item} index={index} />
          ))}
        </View>
      </View>

      {gameStarted && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnShuffle]}
            onPress={shuffleLetters}
          >
            <Text style={styles.controlBtnText}>🔄 Перемішати</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnReset]}
            onPress={resetGame}
          >
            <Text style={styles.controlBtnText}>🎮 Нова гра</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameStarted && (
        <TouchableOpacity style={styles.checkBtn} onPress={checkWord}>
          <Text style={styles.checkBtnText}>ПЕРЕВІРИТИ</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.controlBtn, styles.btnStats]}
        onPress={() => setShowStatsModal(true)}
      >
        <Text style={styles.controlBtnText}>📊 Моя статистика</Text>
      </TouchableOpacity>

      <Modal visible={showStatsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Твоя статистика</Text>

            <View style={styles.statsSummary}>
              <Text style={styles.statsSummaryValue}>
                {stats.totalWins} / {stats.totalGames}
              </Text>
              <Text style={styles.statsSummaryLabel}>
                Перемог / Всього ігор
              </Text>
            </View>

            {(Object.keys(DIFFICULTIES) as DifficultyLevel[]).map((key) => (
              <View
                key={key}
                style={[
                  styles.statLevelCard,
                  key === "easy" && styles.statEasy,
                  key === "medium" && styles.statMedium,
                  key === "hard" && styles.statHard,
                ]}
              >
                <Text style={styles.statLevelTitle}>
                  {DIFFICULTIES[key].label}
                </Text>
                <Text style={styles.statLevelText}>
                  Зіграно: {stats[key].played} | Виграно: {stats[key].won}
                </Text>
                <Text style={styles.statLevelText}>
                  ⭐ Зірок: {stats[key].totalStars}
                </Text>
                <Text style={styles.statLevelText}>
                  ⏱️ Кращий час:{" "}
                  {stats[key].bestTime ? `${stats[key].bestTime}с` : "-"}
                </Text>
              </View>
            ))}

            {stats.lastGame && (
              <View style={styles.lastGameSection}>
                <Text style={styles.lastGameTitle}>📜 Остання гра:</Text>
                <View style={styles.lastGameCard}>
                  <Text>Слово: {stats.lastGame.word}</Text>
                  <Text>
                    Рівень: {DIFFICULTIES[stats.lastGame.difficulty].label}
                  </Text>
                  <Text>
                    Час: {stats.lastGame.time}с | Спроби:{" "}
                    {stats.lastGame.attempts}
                  </Text>
                  <Text>Результат: {stats.lastGame.stars}</Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.controlBtn, styles.btnReset]}
                onPress={() => {
                  Alert.alert(
                    "Скинути статистику?",
                    "Точно хочеш скинути всю статистику?",
                    [
                      { text: "Ні", style: "cancel" },
                      {
                        text: "Так",
                        onPress: () => setStats(getDefaultStats()),
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.controlBtnText}>Скинути</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, styles.btnPrimary]}
                onPress={() => setShowStatsModal(false)}
              >
                <Text style={styles.controlBtnText}>Закрити</Text>
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
    backgroundColor: "#667eea",
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 40 : 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
    opacity: 0.9,
  },
  difficultySelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  difficultyBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 3,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  difficultyBtnActive: {
    backgroundColor: "#667eea",
  },
  difficultyEasy: {
    borderColor: "#00b894",
  },
  difficultyMedium: {
    borderColor: "#f39c12",
  },
  difficultyHard: {
    borderColor: "#d63031",
  },
  difficultyText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  difficultySubtext: {
    fontSize: 10,
    marginTop: 2,
  },
  statsPanel: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 10,
    color: "#fff",
    marginTop: 4,
  },
  starsDisplay: {
    fontSize: 16,
    marginTop: 4,
  },
  inputSection: {
    gap: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 3,
    borderColor: "#667eea",
  },
  startBtn: {
    backgroundColor: "#764ba2",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  startBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnDisabled: {
    opacity: 0.4,
  },
  hintBtn: {
    backgroundColor: "#fdcb6e",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  hintBtnText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  hintDisplay: {
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#667eea",
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 12,
  },
  hintText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667eea",
    letterSpacing: 8,
  },
  gameArea: {
    minHeight: 120,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 3,
    borderColor: "#667eea",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 16,
  },
  charactersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  character: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 3,
    margin: 4,
  },
  characterText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  characterCorrect: {
    backgroundColor: "#00b894",
    borderColor: "#00b894",
  },
  characterIncorrect: {
    backgroundColor: "#d63031",
    borderColor: "#d63031",
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  controlBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  controlBtnText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
  },
  btnShuffle: {
    backgroundColor: "#0984e3",
  },
  btnReset: {
    backgroundColor: "#d63031",
  },
  btnStats: {
    backgroundColor: "#6c5ce7",
    marginTop: 24,
  },
  btnPrimary: {
    backgroundColor: "#0984e3",
  },
  checkBtn: {
    backgroundColor: "#00b894",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 16,
  },
  checkBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667eea",
    textAlign: "center",
    marginBottom: 20,
  },
  statsSummary: {
    backgroundColor: "#6c5ce7",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  statsSummaryValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  statsSummaryLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  statLevelCard: {
    padding: 12,
    borderRadius: 12,
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  statLevelText: {
    color: "#fff",
    fontSize: 12,
  },
  lastGameSection: {
    marginTop: 16,
  },
  lastGameTitle: {
    color: "#667eea",
    fontWeight: "bold",
    marginBottom: 8,
  },
  lastGameCard: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
});
