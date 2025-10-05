import { colors } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  type?: "error" | "success" | "warning";
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

export const CustomAlert: React.FC<Props> = ({
  visible,
  title,
  message,
  type = "error",
  onClose,
  onConfirm,
  confirmText,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient colors={colors[type]} style={styles.gradient}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttons}>
              {onConfirm && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  <Text style={styles.buttonText}>{confirmText || "Так"}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>
                  {onConfirm ? "НІ" : "Зрозуміло"}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "70%",
    maxWidth: 400,
  },
  gradient: {
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 26,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
    width: 150,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
  button: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
  },
});
