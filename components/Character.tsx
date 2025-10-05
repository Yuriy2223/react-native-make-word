import { useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

interface Props {
  char: string;
  color: string;
  index: number;
  isCorrect: boolean | null;
  onDragEnd: (index: number, x: number, y: number) => void;
}

const devLog = (...args: any[]) => {
  if (__DEV__) {
    console.log(...args);
  }
};

export const Character: React.FC<Props> = ({
  char,
  color,
  index,
  isCorrect,
  onDragEnd,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);

  const viewRef = useRef<View>(null);
  const initialPosition = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        scale.setValue(1.2);

        viewRef.current?.measureInWindow((x, y, width, height) => {
          initialPosition.current = { x: x + width / 2, y: y + height / 2 };
          devLog(`[${index}] ${char} initial center:`, initialPosition.current);
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        setIsDragging(false);
        scale.setValue(1);

        const finalX = initialPosition.current.x + gestureState.dx;
        const finalY = initialPosition.current.y + gestureState.dy;

        devLog(`[${index}] ${char} drag end:`, {
          dx: gestureState.dx.toFixed(1),
          dy: gestureState.dy.toFixed(1),
          finalX: finalX.toFixed(1),
          finalY: finalY.toFixed(1),
        });

        onDragEnd(index, finalX, finalY);

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
      ref={viewRef}
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          borderColor: color,
          backgroundColor: getBackgroundColor(),
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
          zIndex: isDragging ? 1000 : 1,
          elevation: isDragging ? 10 : 2,
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
