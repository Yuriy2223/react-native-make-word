import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStats } from "../../hooks/useStats";
import { resetStats } from "../../utils/storage";

export default function StatsScreen() {
  const { stats, reloadStats } = useStats();

  useFocusEffect(
    useCallback(() => {
      reloadStats();
    }, [reloadStats])
  );

  const handleReset = () => {
    Alert.alert("Скинути статистику?", "Точно хочеш скинути всю статистику?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Скинути",
        style: "destructive",
        onPress: async () => {
          await resetStats();
          await reloadStats();
        },
      },
    ]);
  };

  const lastGame = stats.history[0];

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
          <Text style={styles.title}>Твоя статистика</Text>

          <LinearGradient
            colors={["#a29bfe", "#6c5ce7"]}
            style={styles.summaryCard}
          >
            <Text style={styles.summaryValue}>
              {stats.totalWins} / {stats.totalGames}
            </Text>
            <Text style={styles.summaryLabel}>Перемог / Всього ігор</Text>
          </LinearGradient>

          <View style={styles.statsGrid}>
            <LinearGradient
              colors={["#55efc4", "#00b894"]}
              style={styles.levelCard}
            >
              <Text style={styles.levelTitle}>🟢 ЛЕГКО</Text>
              <Text style={styles.levelText}>
                Зіграно: {stats.easy.played} | Виграно: {stats.easy.won}
              </Text>
              <Text style={styles.levelText}>
                ⭐ Зірок: {stats.easy.totalStars}
              </Text>
              <Text style={styles.levelText}>
                ⏱️ Кращий час:{" "}
                {stats.easy.bestTime ? `${stats.easy.bestTime}с` : "-"}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#feca57", "#f39c12"]}
              style={styles.levelCard}
            >
              <Text style={styles.levelTitle}>🟡 СЕРЕДНЬО</Text>
              <Text style={styles.levelText}>
                Зіграно: {stats.medium.played} | Виграно: {stats.medium.won}
              </Text>
              <Text style={styles.levelText}>
                ⭐ Зірок: {stats.medium.totalStars}
              </Text>
              <Text style={styles.levelText}>
                ⏱️ Кращий час:{" "}
                {stats.medium.bestTime ? `${stats.medium.bestTime}с` : "-"}
              </Text>
            </LinearGradient>

            <LinearGradient
              colors={["#ff7675", "#d63031"]}
              style={styles.levelCard}
            >
              <Text style={styles.levelTitle}>🔴 ВАЖКО</Text>
              <Text style={styles.levelText}>
                Зіграно: {stats.hard.played} | Виграно: {stats.hard.won}
              </Text>
              <Text style={styles.levelText}>
                ⭐ Зірок: {stats.hard.totalStars}
              </Text>
              <Text style={styles.levelText}>
                ⏱️ Кращий час:{" "}
                {stats.hard.bestTime ? `${stats.hard.bestTime}с` : "-"}
              </Text>
            </LinearGradient>
          </View>

          {lastGame && (
            <View style={styles.lastGameSection}>
              <Text style={styles.sectionTitle}>📜 Остання гра:</Text>
              <View style={styles.lastGameCard}>
                <Text style={styles.lastGameText}>
                  <Text style={styles.bold}>Слово:</Text> {lastGame.word}
                </Text>
                <Text style={styles.lastGameText}>
                  <Text style={styles.bold}>Рівень:</Text>{" "}
                  {lastGame.difficulty === "easy"
                    ? "🟢 Легко"
                    : lastGame.difficulty === "medium"
                    ? "🟡 Середньо"
                    : "🔴 Важко"}
                </Text>
                <Text style={styles.lastGameText}>
                  <Text style={styles.bold}>Час:</Text> {lastGame.time}с |{" "}
                  <Text style={styles.bold}>Спроби:</Text> {lastGame.attempts}
                </Text>
                <Text style={styles.lastGameText}>
                  <Text style={styles.bold}>Результат:</Text> {lastGame.stars}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <LinearGradient
              colors={["#ff7675", "#d63031"]}
              style={styles.resetGradient}
            >
              <Text style={styles.resetButtonText}>Скинути статистику</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#667eea",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  statsGrid: {
    gap: 15,
    marginBottom: 20,
  },
  levelCard: {
    padding: 15,
    borderRadius: 15,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  lastGameSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
    marginBottom: 10,
  },
  lastGameCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 15,
  },
  lastGameText: {
    fontSize: 14,
    color: "#2d3436",
    marginBottom: 5,
  },
  bold: {
    fontWeight: "bold",
  },
  resetButton: {
    borderRadius: 15,
    overflow: "hidden",
  },
  resetGradient: {
    padding: 15,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
