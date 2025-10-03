import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  canShowHint: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  onShuffle: () => void;
  onReset: () => void;
  onCheck: () => void;
  isGameActive: boolean;
  isCheckDisabled: boolean;
}

export const GameControls: React.FC<Props> = ({
  canShowHint,
  showHint,
  onToggleHint,
  onShuffle,
  onReset,
  onCheck,
  isGameActive,
  isCheckDisabled,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, !canShowHint && styles.buttonDisabled]}
          onPress={onToggleHint}
          disabled={!canShowHint}
        >
          <LinearGradient
            colors={["#feca57", "#f39c12"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>
              {showHint ? "🙈 Сховати" : "👀 Підказка"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !isGameActive && styles.buttonDisabled]}
          onPress={onShuffle}
          disabled={!isGameActive}
        >
          <LinearGradient
            colors={["#74b9ff", "#0984e3"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>🔄 Перемішати</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onReset}>
          <LinearGradient
            colors={["#ff7675", "#d63031"]}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>🎮 Нова гра</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isGameActive && (
        <TouchableOpacity
          style={[styles.checkButton, isCheckDisabled && styles.buttonDisabled]}
          onPress={onCheck}
          disabled={isCheckDisabled}
        >
          <LinearGradient
            colors={["#55efc4", "#00b894"]}
            style={styles.checkGradient}
          >
            <Text style={styles.checkButtonText}>ПЕРЕВІРИТИ</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  gradient: {
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  checkGradient: {
    padding: 18,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
