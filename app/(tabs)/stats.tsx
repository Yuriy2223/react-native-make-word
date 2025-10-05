import { CustomAlert } from "@/components/CustomAlert";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reloadStats();
    }, [reloadStats])
  );

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = async () => {
    await resetStats();
    await reloadStats();
    setShowResetConfirm(false);
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
          <View style={styles.titleContainer}>
            <Ionicons
              name="stats-chart"
              size={28}
              color="#667eea"
              style={styles.titleIcon}
            />
            <Text style={styles.title}>Твоя статистика</Text>
          </View>

          <LinearGradient
            colors={["#a29bfe", "#6c5ce7"]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryIconWrapper}>
              <Ionicons name="trophy" size={32} color="#fff" />
            </View>
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
              <View style={styles.levelTitleRow}>
                <Ionicons
                  name="ellipse"
                  size={16}
                  color="#fff"
                  style={styles.levelIcon}
                />
                <Text style={styles.levelTitle}>ЛЕГКО</Text>
              </View>
              <View style={styles.statRow}>
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.levelText}>
                  Зіграно: {stats.easy.played} | Виграно: {stats.easy.won}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Зірок: {stats.easy.totalStars}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="time" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Кращий час:{" "}
                  {stats.easy.bestTime ? `${stats.easy.bestTime}с` : "-"}
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#feca57", "#f39c12"]}
              style={styles.levelCard}
            >
              <View style={styles.levelTitleRow}>
                <Ionicons
                  name="ellipse"
                  size={16}
                  color="#fff"
                  style={styles.levelIcon}
                />
                <Text style={styles.levelTitle}>СЕРЕДНЬО</Text>
              </View>
              <View style={styles.statRow}>
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.levelText}>
                  Зіграно: {stats.medium.played} | Виграно: {stats.medium.won}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Зірок: {stats.medium.totalStars}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="time" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Кращий час:{" "}
                  {stats.medium.bestTime ? `${stats.medium.bestTime}с` : "-"}
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#ff7675", "#d63031"]}
              style={styles.levelCard}
            >
              <View style={styles.levelTitleRow}>
                <Ionicons
                  name="ellipse"
                  size={16}
                  color="#fff"
                  style={styles.levelIcon}
                />
                <Text style={styles.levelTitle}>ВАЖКО</Text>
              </View>
              <View style={styles.statRow}>
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={14}
                  color="#fff"
                />
                <Text style={styles.levelText}>
                  Зіграно: {stats.hard.played} | Виграно: {stats.hard.won}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="star" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Зірок: {stats.hard.totalStars}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="time" size={14} color="#fff" />
                <Text style={styles.levelText}>
                  Кращий час:{" "}
                  {stats.hard.bestTime ? `${stats.hard.bestTime}с` : "-"}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {lastGame && (
            <View style={styles.lastGameSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color="#667eea"
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Остання гра:</Text>
              </View>
              <View style={styles.lastGameCard}>
                <View style={styles.lastGameRow}>
                  <Ionicons
                    name="text"
                    size={16}
                    color="#2d3436"
                    style={styles.lastGameIcon}
                  />
                  <Text style={styles.lastGameText}>
                    <Text style={styles.bold}>Слово:</Text> {lastGame.word}
                  </Text>
                </View>
                <View style={styles.lastGameRow}>
                  <Ionicons
                    name="ellipse"
                    size={16}
                    color={
                      lastGame.difficulty === "easy"
                        ? "#00b894"
                        : lastGame.difficulty === "medium"
                        ? "#f39c12"
                        : "#d63031"
                    }
                    style={styles.lastGameIcon}
                  />
                  <Text style={styles.lastGameText}>
                    <Text style={styles.bold}>Рівень:</Text>{" "}
                    {lastGame.difficulty === "easy"
                      ? "Легко"
                      : lastGame.difficulty === "medium"
                      ? "Середньо"
                      : "Важко"}
                  </Text>
                </View>
                <View style={styles.lastGameRow}>
                  <Ionicons
                    name="time"
                    size={16}
                    color="#2d3436"
                    style={styles.lastGameIcon}
                  />
                  <Text style={styles.lastGameText}>
                    <Text style={styles.bold}>Час:</Text> {lastGame.time}с |{" "}
                    <Text style={styles.bold}>Спроби:</Text> {lastGame.attempts}
                  </Text>
                </View>
                <View style={styles.lastGameRow}>
                  <Ionicons
                    name="star"
                    size={16}
                    color="#2d3436"
                    style={styles.lastGameIcon}
                  />
                  <Text style={styles.lastGameText}>
                    <Text style={styles.bold}>Результат:</Text> {lastGame.stars}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <LinearGradient
              colors={["#ff7675", "#d63031"]}
              style={styles.resetGradient}
            >
              <View style={styles.resetButtonContent}>
                <Ionicons
                  name="trash"
                  size={20}
                  color="#fff"
                  style={styles.resetIcon}
                />
                <Text style={styles.resetButtonText}>Скинути статистику</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomAlert
        visible={showResetConfirm}
        message="Скинути статистику?"
        type="error"
        onConfirm={confirmReset}
        confirmText="ТАК"
        onClose={() => setShowResetConfirm(false)}
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
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#667eea",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  summaryIconWrapper: {
    marginBottom: 10,
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
  levelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelIcon: {
    marginRight: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
  },
  lastGameSection: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
  lastGameCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 15,
  },
  lastGameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lastGameIcon: {
    marginRight: 8,
  },
  lastGameText: {
    fontSize: 14,
    color: "#2d3436",
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  resetButton: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#d63031",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resetGradient: {
    padding: 15,
    alignItems: "center",
  },
  resetButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resetIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
