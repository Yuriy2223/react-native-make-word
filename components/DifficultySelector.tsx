import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Difficulty } from "../types/types";

interface Props {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.easy,
          selected === "easy" && styles.active,
        ]}
        onPress={() => onSelect("easy")}
      >
        <View style={styles.iconWrapper}>
          <Ionicons
            name="ellipse"
            size={24}
            color={selected === "easy" ? "#fff" : "#55efc4"}
          />
        </View>
        <Text
          style={[styles.buttonText, selected === "easy" && styles.activeText]}
        >
          ЛЕГКО
        </Text>
        <Text style={[styles.small, selected === "easy" && styles.activeText]}>
          3-5 букв
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.medium,
          selected === "medium" && styles.active,
        ]}
        onPress={() => onSelect("medium")}
      >
        <View style={styles.iconWrapper}>
          <Ionicons
            name="ellipse"
            size={24}
            color={selected === "medium" ? "#fff" : "#feca57"}
          />
        </View>
        <Text
          style={[
            styles.buttonText,
            selected === "medium" && styles.activeText,
          ]}
        >
          СЕРЕДНЬО
        </Text>
        <Text
          style={[styles.small, selected === "medium" && styles.activeText]}
        >
          6-8 букв
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.hard,
          selected === "hard" && styles.active,
        ]}
        onPress={() => onSelect("hard")}
      >
        <View style={styles.iconWrapper}>
          <Ionicons
            name="ellipse"
            size={24}
            color={selected === "hard" ? "#fff" : "#ff7675"}
          />
        </View>
        <Text
          style={[styles.buttonText, selected === "hard" && styles.activeText]}
        >
          ВАЖКО
        </Text>
        <Text style={[styles.small, selected === "hard" && styles.activeText]}>
          9+ букв
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 15,
    borderWidth: 3,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  easy: {
    borderColor: "#55efc4",
    backgroundColor: "#fff",
  },
  medium: {
    borderColor: "#feca57",
    backgroundColor: "#fff",
  },
  hard: {
    borderColor: "#ff7675",
    backgroundColor: "#fff",
  },
  active: {
    backgroundColor: "#667eea",
    transform: [{ scale: 1.02 }],
  },
  iconWrapper: {
    marginBottom: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 2,
  },
  activeText: {
    color: "#fff",
  },
  small: {
    fontSize: 10,
    textAlign: "center",
    color: "#666",
  },
});
