import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Difficulty } from "../types/types";
import { DIFFICULTY_CONFIG } from "../utils/constants";
import { CustomAlert } from "./CustomAlert";

interface Props {
  difficulty: Difficulty;
  onStart: (word: string) => void;
}

export const InputSection: React.FC<Props> = ({ difficulty, onStart }) => {
  const [text, setText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleStart = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const config = DIFFICULTY_CONFIG[difficulty];
    const length = trimmed.length;

    if (length < config.min || length > config.max) {
      setAlertMessage(
        `Потрібно слово\nвід ${config.min} до ${config.max} букв!`
      );
      setShowAlert(true);
      return;
    }

    onStart(trimmed);
    setText("");
  };

  const placeholder = {
    easy: "Введи коротке слово (3-5 букв)",
    medium: "Введи середнє слово (6-8 букв)",
    hard: "Введи довге слово (9+ букв)",
  }[difficulty];

  const difficultyIcon = {
    easy: "ellipse" as const,
    medium: "ellipse" as const,
    hard: "ellipse" as const,
  }[difficulty];

  const difficultyColor = {
    easy: "#00b894",
    medium: "#fdcb6e",
    hard: "#d63031",
  }[difficulty];

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.difficultyIcon}>
          <Ionicons name={difficultyIcon} size={16} color={difficultyColor} />
        </View>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor="rgba(102, 126, 234, 0.6)"
          maxLength={20}
          autoCapitalize="characters"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !text.trim() && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!text.trim()}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="play-circle"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Почати гру</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.instructions}>
        <View style={styles.instructionsTitleRow}>
          <Ionicons
            name="bulb"
            size={18}
            color="#d63031"
            style={styles.bulbIcon}
          />
          <Text style={styles.instructionsTitle}>Як грати:</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons
            name="hand-left"
            size={14}
            color="#2d3436"
            style={styles.instructionIcon}
          />
          <Text style={styles.instructionsText}>
            Перетягуй літери на правильні місця
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons
            name="create"
            size={14}
            color="#2d3436"
            style={styles.instructionIcon}
          />
          <Text style={styles.instructionsText}>
            Збери слово в правильному порядку
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons
            name="checkmark-circle"
            size={14}
            color="#2d3436"
            style={styles.instructionIcon}
          />
          <Text style={styles.instructionsText}>
            Натисни &quot;Перевірити&quot; щоб дізнатись результат
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons
            name="eye"
            size={14}
            color="#2d3436"
            style={styles.instructionIcon}
          />
          <Text style={styles.instructionsText}>
            Підказка - якщо складно, подивись оригінальне слово
          </Text>
        </View>
      </View>

      <CustomAlert
        visible={showAlert}
        message={alertMessage}
        type="error"
        onClose={() => setShowAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
  },
  difficultyIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#667eea",
    borderRadius: 15,
    padding: 10,
    paddingLeft: 36,
    fontSize: 22,
    backgroundColor: "rgba(254, 255, 254, 0.95)",
    color: "#667eea",
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
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
  instructionsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulbIcon: {
    marginRight: 6,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63031",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  instructionIcon: {
    marginRight: 8,
    marginTop: 3,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: "#2d3436",
    lineHeight: 22,
  },
});
