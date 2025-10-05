import { CharacterDisplay } from "@/components/CharacterDisplay";
import { CustomAlert } from "@/components/CustomAlert";
import { DifficultySelector } from "@/components/DifficultySelector";
import { GameControls } from "@/components/GameControls";
import { InputSection } from "@/components/InputSection";
import { StatsPanel } from "@/components/StatsPanel";
import { SuccessModal } from "@/components/SuccessModal";
import { calculateStars, getRandomEncouragementMessage } from "@/utils/helpers";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
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
  const [currentStars, setCurrentStars] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMsg, setEncouragementMsg] = useState("");

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
        setEncouragementMsg(getRandomEncouragementMessage());
        setShowEncouragement(true);
      }, 300);
    }
  };

  const handleReset = () => {
    resetGame();
    setCheckResults([]);
    setShowSuccess(false);
    setCurrentStars(0);
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
        <View style={styles.titleRow}>
          <Image
            source={require("../../assets/favicon.png")}
            style={styles.logo}
          />
          <Text style={styles.titleText}>Склади слово 🎨</Text>
        </View>
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
      </ScrollView>
      <SuccessModal
        visible={showSuccess}
        stars={currentStars}
        onClose={handleSuccessClose}
      />
      <CustomAlert
        visible={showEncouragement}
        message={encouragementMsg}
        type="warning"
        onClose={() => setShowEncouragement(false)}
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
    padding: 12,
    paddingTop: 50,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 24,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hintContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 4,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
