import { LinearGradient } from "expo-linear-gradient";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  stars: string;
  onClose: () => void;
}

export const SuccessModal: React.FC<Props> = ({ visible, stars, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={["#55efc4", "#00b894"]} style={styles.content}>
          <Text style={styles.title}>🎉 Вітаємо! 🎉</Text>
          <Text style={styles.stars}>{stars}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Продовжити</Text>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  stars: {
    fontSize: 48,
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  buttonText: {
    color: "#00b894",
    fontSize: 18,
    fontWeight: "bold",
  },
});
