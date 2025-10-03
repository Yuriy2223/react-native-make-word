import { useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  originalWord,
  checkResults,
  onSwap,
}) => {
  const characterPositions = useRef<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    characterPositions.current[index] = { x, y, width, height };
  };

  const handleDragEnd = (fromIndex: number, x: number, y: number) => {
    let closestIndex = fromIndex;
    let closestDistance = Infinity;

    characterPositions.current.forEach((pos, index) => {
      if (index === fromIndex || !pos) return;

      const centerX = pos.x + pos.width / 2;
      const centerY = pos.y + pos.height / 2;
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== fromIndex) {
      onSwap(fromIndex, closestIndex);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        {characters.map((char, index) => (
          <View key={char.id} onLayout={(e) => handleLayout(index, e)}>
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
