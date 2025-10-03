import { useRef } from "react";
import { Animated, PanResponder, StyleSheet, Text } from "react-native";

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
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scale.setValue(1.2);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        scale.setValue(1);
        onDragEnd(index, gestureState.moveX, gestureState.moveY);

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const getBackgroundColor = () => {
    if (isCorrect === true) return "#00b894";
    if (isCorrect === false) return "#d63031";
    return "#fff";
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          borderColor: color,
          backgroundColor: getBackgroundColor(),
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
        },
      ]}
    >
      <Text
        style={[styles.text, { color: isCorrect !== null ? "#fff" : color }]}
      >
        {char}
      </Text>
    </Animated.View>
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
