import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      containerRef.current?.measureInWindow((x, y) => {
        containerPosition.current = { x, y };
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [characters]);

  const handleContainerLayout = () => {
    containerRef.current?.measureInWindow((x, y) => {
      containerPosition.current = { x, y };
    });
  };

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    characterPositions.current[index] = { x, y, width, height };
    // console.log(`Layout [${index}] ${characters[index]?.char}:`, {
    //   x: x.toFixed(1),
    //   y: y.toFixed(1),
    // });
  };

  const handleDragEnd = (
    fromIndex: number,
    absoluteX: number,
    absoluteY: number
  ) => {
    // console.log("=== DRAG END ===");
    // console.log("From:", fromIndex, characters[fromIndex]?.char);
    // console.log("Absolute:", absoluteX, absoluteY);
    // console.log("Container:", containerPosition.current);

    const relativeX = absoluteX - containerPosition.current.x;
    const relativeY = absoluteY - containerPosition.current.y;

    // console.log("Relative:", relativeX, relativeY);
    // console.log("Available positions:", characterPositions.current.length);

    const fromPos = characterPositions.current[fromIndex];
    if (!fromPos) {
      // console.log("NO FROM POSITION");
      return;
    }
    const fromCenterY = fromPos.y + fromPos.height / 2;
    // console.log("From center Y:", fromCenterY.toFixed(1));

    let closestIndex = fromIndex;
    let closestDistance = Infinity;

    characterPositions.current.forEach((pos, index) => {
      if (index === fromIndex || !pos) return;

      const centerX = pos.x + pos.width / 2;
      const centerY = pos.y + pos.height / 2;
      const distanceY = Math.abs(fromCenterY - centerY);

      // console.log(
      //   `[${index}] ${characters[index]?.char}: distanceY=${distanceY.toFixed(
      //     1
      //   )}`
      // );

      if (distanceY > 50) {
        // console.log("  -> DIFFERENT ROW");
        return;
      }

      const distance = Math.sqrt(
        Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2)
      );

      // console.log(`  -> distance=${distance.toFixed(1)}`);

      if (distance < closestDistance && distance < 100) {
        closestDistance = distance;
        closestIndex = index;
        // console.log("  -> NEW CLOSEST");
      }
    });

    // console.log("Result:", closestIndex, "distance:", closestDistance);

    if (closestIndex !== fromIndex) {
      // console.log("SWAPPING:", fromIndex, "↔", closestIndex);
      onSwap(fromIndex, closestIndex);
    } else {
      // console.log("NO SWAP");
    }
  };

  return (
    <View
      ref={containerRef}
      style={styles.container}
      onLayout={handleContainerLayout}
    >
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 6,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#667eea",
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    minHeight: 150,
  },
});
