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
        <Text
          style={[styles.buttonText, selected === "easy" && styles.activeText]}
        >
          🟢 ЛЕГКО{"\n"}
          <Text style={styles.small}>3-5 букв</Text>
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
        <Text
          style={[
            styles.buttonText,
            selected === "medium" && styles.activeText,
          ]}
        >
          🟡 СЕРЕДНЬО{"\n"}
          <Text style={styles.small}>6-8 букв</Text>
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
        <Text
          style={[styles.buttonText, selected === "hard" && styles.activeText]}
        >
          🔴 ВАЖКО{"\n"}
          <Text style={styles.small}>9+ букв</Text>
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
    padding: 15,
    borderRadius: 15,
    borderWidth: 3,
    alignItems: "center",
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
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  activeText: {
    color: "#fff",
  },
  small: {
    fontSize: 10,
  },
});
