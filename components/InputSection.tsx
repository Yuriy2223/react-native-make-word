import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Difficulty } from "../types/types";
import { DIFFICULTY_CONFIG } from "../utils/constants";

interface Props {
  difficulty: Difficulty;
  onStart: (word: string) => void;
}

export const InputSection: React.FC<Props> = ({ difficulty, onStart }) => {
  const [text, setText] = useState("");

  const handleStart = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    const length = trimmed.length;

    if (length < config.min || length > config.max) {
      Alert.alert(
        "Помилка",
        `Потрібно слово від ${config.min} до ${config.max} букв!`
      );
      return;
    }

    onStart(trimmed);
    setText("");
  };

  const placeholder = {
    easy: "🟢 Введи коротке слово (3-5 букв)",
    medium: "🟡 Введи середнє слово (6-8 букв)",
    hard: "🔴 Введи довге слово (9+ букв)",
  }[difficulty];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        maxLength={20}
        autoCapitalize="characters"
      />
      <TouchableOpacity
        style={[styles.button, !text.trim() && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!text.trim()}
      >
        <Text style={styles.buttonText}>Почати гру</Text>
      </TouchableOpacity>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>💡 Як грати:</Text>
        <Text style={styles.instructionsText}>
          • Перетягуй літери на правильні місця{"\n"}• Збери слово в правильному
          порядку{"\n"}• Натисни &quot;Перевірити&quot; щоб дізнатись результат
          {"\n"}• Підказка - якщо складно, подивись оригінальне слово
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: "#667eea",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  instructions: {
    backgroundColor: "#ffeaa7",
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e17055",
    borderStyle: "dashed",
    marginTop: 15,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: "#2d3436",
    lineHeight: 22,
  },
});
