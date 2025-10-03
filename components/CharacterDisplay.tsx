import { useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Character as CharacterType } from "../types/types";
import { Character } from "./Character";

interface Props {
  characters: CharacterType[];
  originalWord: string;
  checkResults: (boolean | null)[];
  onSwap: (fromIndex: number, toIndex: number) => void;
}

export const CharacterDisplay: React.FC<Props> = ({
  characters,
  checkResults,
  onSwap,
}) => {
  const characterPositions = useRef<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  const containerRef = useRef<View>(null);
  const containerPosition = useRef({ x: 0, y: 0 });

  const handleContainerLayout = () => {
    containerRef.current?.measureInWindow((x, y) => {
      containerPosition.current = { x, y };
    });
  };

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    characterPositions.current[index] = { x, y, width, height };
  };

  const handleDragEnd = (
    fromIndex: number,
    absoluteX: number,
    absoluteY: number
  ) => {
    const relativeX = absoluteX - containerPosition.current.x;
    const relativeY = absoluteY - containerPosition.current.y;

    let closestIndex = fromIndex;
    let closestDistance = Infinity;

    characterPositions.current.forEach((pos, index) => {
      if (index === fromIndex || !pos) return;

      const centerX = pos.x + pos.width / 2;
      const centerY = pos.y + pos.height / 2;
      const distance = Math.sqrt(
        Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2)
      );

      if (distance < closestDistance && distance < 150) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== fromIndex) {
      onSwap(fromIndex, closestIndex);
    }
  };

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={handleContainerLayout}
    >
      {characters.map((char, index) => (
        <View key={index} onLayout={(e) => handleLayout(index, e)}>
          <Character
            char={char.char}
            color={char.color}
            index={index}
            isCorrect={checkResults[index]}
            onDragEnd={handleDragEnd}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 20,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#667eea",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    minHeight: 150,
  },
});
