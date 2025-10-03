import { Animated, StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Props {
  char: string;
  color: string;
  index: number;
  isCorrect: boolean | null;
  onDragEnd: (index: number, x: number, y: number) => void;
}

export const Character: React.FC<Props> = ({
  char,
  color,
  index,
  isCorrect,
  onDragEnd,
}) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const scale = new Animated.Value(1);

  const gesture = Gesture.Pan()
    .onStart(() => {
      scale.setValue(1.2);
    })
    .onUpdate((event) => {
      translateX.setValue(event.translationX);
      translateY.setValue(event.translationY);
    })
    .onEnd((event) => {
      scale.setValue(1);
      onDragEnd(index, event.absoluteX, event.absoluteY);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    });

  const getBackgroundColor = () => {
    if (isCorrect === true) return "#00b894";
    if (isCorrect === false) return "#d63031";
    return "#fff";
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          {
            borderColor: color,
            backgroundColor: getBackgroundColor(),
            transform: [{ translateX }, { translateY }, { scale }],
          },
        ]}
      >
        <Text
          style={[styles.text, { color: isCorrect !== null ? "#fff" : color }]}
        >
          {char}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 5,
    borderRadius: 15,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
