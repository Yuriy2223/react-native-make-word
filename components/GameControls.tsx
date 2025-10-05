import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
            <Ionicons
              name={showHint ? "eye-off" : "eye"}
              size={22}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {showHint ? "Сховати" : "Підказка"}
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
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={22}
              color="#fff"
            />
            <Text style={styles.buttonText}>Перемішати</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onReset}>
          <LinearGradient
            colors={["#ff7675", "#d63031"]}
            style={styles.gradient}
          >
            <Ionicons name="game-controller" size={22} color="#fff" />
            <Text style={styles.buttonText}>Нова гра</Text>
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
            <View style={styles.checkContent}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#fff"
                style={styles.checkIcon}
              />
              <Text style={styles.checkButtonText}>ПЕРЕВІРИТИ</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
  },
  emoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
  },
  checkButton: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#00b894",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  checkGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  checkContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginRight: 6,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});
