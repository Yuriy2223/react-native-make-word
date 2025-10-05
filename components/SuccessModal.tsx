import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  stars: number;
  onClose: () => void;
}

export const SuccessModal: React.FC<Props> = ({ visible, stars, onClose }) => {
  const renderStars = () => {
    return Array.from({ length: 3 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < stars ? "star" : "star-outline"}
        size={50}
        color="#ffd700"
        style={{ marginHorizontal: 5 }}
      />
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#55efc4", "#00b894"]} style={styles.content}>
          <View style={styles.celebrationIcons}>
            <Ionicons
              name="trophy"
              size={40}
              color="#fff"
              style={styles.trophyIcon}
            />
            <View style={styles.confettiContainer}>
              <Ionicons
                name="sparkles"
                size={24}
                color="#ffd700"
                style={styles.sparkle1}
              />
              <Ionicons
                name="sparkles"
                size={20}
                color="#fff"
                style={styles.sparkle2}
              />
            </View>
          </View>

          <Text style={styles.title}>Вітаємо!</Text>

          <View style={styles.starsContainer}>{renderStars()}</View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <View style={styles.buttonContent}>
              <Ionicons
                name="arrow-forward-circle"
                size={22}
                color="#00b894"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Продовжити</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 40,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    minWidth: 300,
  },
  celebrationIcons: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
  },
  trophyIcon: {
    marginBottom: 10,
  },
  confettiContainer: {
    flexDirection: "row",
    position: "absolute",
    top: -10,
    gap: 8,
  },
  sparkle1: {
    transform: [{ rotate: "-15deg" }],
  },
  sparkle2: {
    transform: [{ rotate: "15deg" }],
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#00b894",
    fontSize: 18,
    fontWeight: "bold",
  },
});
