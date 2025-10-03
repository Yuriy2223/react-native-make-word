import { CharacterDisplay } from "@/components/CharacterDisplay";
import { DifficultySelector } from "@/components/DifficultySelector";
import { GameControls } from "@/components/GameControls";
import { InputSection } from "@/components/InputSection";
import { StatsPanel } from "@/components/StatsPanel";
import { SuccessModal } from "@/components/SuccessModal";
import { calculateStars, getRandomEncouragementMessage } from "@/utils/helpers";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useGameState } from "../../hooks/useGameState";
import { useStats } from "../../hooks/useStats";
import { useTimer } from "../../hooks/useTimer";

export default function GameScreen() {
  const {
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
  } = useGameState();

  const elapsed = useTimer(isGameActive);
  const { saveGameResult } = useStats();
  const [checkResults, setCheckResults] = useState<(boolean | null)[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStars, setCurrentStars] = useState("☆☆☆");

  useEffect(() => {
    if (characters.length > 0) {
      setCheckResults(new Array(characters.length).fill(null));
    }
  }, [characters.length]);

  const handleCheck = async () => {
    const currentWord = getCurrentWord();

    if (lastCheckedWord === currentWord && lastCheckedWord !== "") return;

    setLastCheckedWord(currentWord);
    incrementAttempts();

    const newResults = characters.map(
      (char, index) => char.char === originalWord[index]
    );

    setCheckResults(newResults);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const isCorrect = currentWord === originalWord;

    if (isCorrect) {
      const stars = calculateStars(attempts + 1, elapsed);
      setCurrentStars(stars);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        setShowSuccess(true);
        saveGameResult(
          difficulty,
          originalWord,
          elapsed,
          attempts + 1,
          stars,
          true
        );
      }, 500);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setTimeout(() => {
        Alert.alert("", getRandomEncouragementMessage());
      }, 300);
    }
  };

  const handleReset = () => {
    resetGame();
    setCheckResults([]);
    setShowSuccess(false);
    setCurrentStars("☆☆☆");
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleReset();
  };

  const stars = calculateStars(attempts, elapsed);

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2", "#f093fb"]}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Склади слово 🎨</Text>
          <Text style={styles.subtitle}>Стань чемпіоном складання слів!</Text>

          <DifficultySelector selected={difficulty} onSelect={setDifficulty} />

          <StatsPanel time={elapsed} attempts={attempts} stars={stars} />

          {!isGameActive && (
            <InputSection difficulty={difficulty} onStart={startGame} />
          )}

          {showHint && isGameActive && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{originalWord}</Text>
            </View>
          )}

          {isGameActive && (
            <>
              <CharacterDisplay
                characters={characters}
                originalWord={originalWord}
                checkResults={checkResults}
                onSwap={swapCharacters}
              />

              <GameControls
                canShowHint={difficulty === "medium"}
                showHint={showHint}
                onToggleHint={toggleHint}
                onShuffle={shuffleCharacters}
                onReset={handleReset}
                onCheck={handleCheck}
                isGameActive={isGameActive}
                isCheckDisabled={
                  lastCheckedWord === getCurrentWord() && lastCheckedWord !== ""
                }
              />
            </>
          )}
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        stars={currentStars}
        onClose={handleSuccessClose}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#667eea",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  hintContainer: {
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#667eea",
  },
  hintText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#667eea",
    letterSpacing: 8,
    textAlign: "center",
  },
});
