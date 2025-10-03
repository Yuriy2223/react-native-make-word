import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { formatTime } from "../utils/helpers";

interface Props {
  time: number;
  attempts: number;
  stars: string;
}

export const StatsPanel: React.FC<Props> = ({ time, attempts, stars }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#a29bfe", "#6c5ce7"]} style={styles.card}>
        <Text style={styles.value}>{formatTime(time)}</Text>
        <Text style={styles.label}>⏱️ Час</Text>
      </LinearGradient>

      <LinearGradient colors={["#fd79a8", "#e84393"]} style={styles.card}>
        <Text style={styles.value}>{attempts}</Text>
        <Text style={styles.label}>🎯 Спроби</Text>
      </LinearGradient>

      <LinearGradient colors={["#feca57", "#f39c12"]} style={styles.card}>
        <Text style={styles.label}>⭐ Рейтинг</Text>
        <Text style={styles.stars}>{stars}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: "#fff",
  },
  stars: {
    fontSize: 20,
    color: "#fff",
    marginTop: 5,
  },
});
