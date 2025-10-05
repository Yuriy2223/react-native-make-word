import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { formatTime } from "../utils/helpers";

interface Props {
  time: number;
  attempts: number;
  stars: number;
}

export const StatsPanel: React.FC<Props> = ({ time, attempts, stars }) => {
  const renderStars = () => {
    return Array.from({ length: 3 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < stars ? "star" : "star-outline"}
        size={18}
        color="#fff"
        style={{ marginHorizontal: 1 }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#a29bfe", "#6c5ce7"]} style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="time" size={20} color="#fff" />
        </View>
        <Text style={styles.label}>Час</Text>
        <Text style={styles.value}>{formatTime(time)}</Text>
      </LinearGradient>

      <LinearGradient colors={["#fd79a8", "#e84393"]} style={styles.card}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="target" size={20} color="#fff" />
        </View>
        <Text style={styles.label}>Спроби</Text>
        <Text style={styles.value}>{attempts}</Text>
      </LinearGradient>

      <LinearGradient colors={["#feca57", "#f39c12"]} style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="star" size={20} color="#fff" />
        </View>
        <Text style={styles.label}>Рейтинг</Text>
        <View style={styles.starsContainer}>{renderStars()}</View>
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
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
