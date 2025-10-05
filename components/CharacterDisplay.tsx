import { useCallback, useEffect, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Character as CharacterType } from "../types/types";
import { Character } from "./Character";

interface Props {
  characters: CharacterType[];
  originalWord: string;
  checkResults: (boolean | null)[];
  onSwap: (fromIndex: number, toIndex: number) => void;
}

const devLog = (...args: any[]) => {
  if (__DEV__) {
    console.log(...args);
  }
};

export const CharacterDisplay: React.FC<Props> = ({
  characters,
  checkResults,
  onSwap,
}) => {
  const characterPositions = useRef<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  const characterRefs = useRef<(View | null)[]>([]);
  const updatePositions = useCallback(() => {
    characterRefs.current.forEach((view, index) => {
      if (view && view.measureInWindow) {
        view.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            characterPositions.current[index] = { x, y, width, height };
            devLog(`Position [${index}] ${characters[index]?.char}:`, {
              x: x.toFixed(1),
              y: y.toFixed(1),
            });
          }
        );
      }
    });
  }, [characters]);

  useEffect(() => {
    const timer = setTimeout(updatePositions, 100);
    return () => clearTimeout(timer);
  }, [characters, updatePositions]);

  const handleLayout = (index: number, event: LayoutChangeEvent) => {
    const view = event.target as any;
    if (view && view.measureInWindow) {
      view.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          characterPositions.current[index] = { x, y, width, height };
          devLog(`Updated [${index}] ${characters[index]?.char}:`, {
            x: x.toFixed(1),
            y: y.toFixed(1),
          });
        }
      );
    }
  };

  const handleDragEnd = (
    fromIndex: number,
    absoluteX: number,
    absoluteY: number
  ) => {
    devLog("From:", fromIndex, characters[fromIndex]?.char);
    devLog("Drop at:", absoluteX.toFixed(1), absoluteY.toFixed(1));

    let closestIndex = fromIndex;
    let closestDistance = Infinity;

    characterPositions.current.forEach((pos, index) => {
      if (index === fromIndex || !pos) return;

      const centerX = pos.x + pos.width / 2;
      const centerY = pos.y + pos.height / 2;

      const distance = Math.sqrt(
        Math.pow(absoluteX - centerX, 2) + Math.pow(absoluteY - centerY, 2)
      );

      devLog(
        `[${index}] ${characters[index]?.char} at (${centerX.toFixed(
          1
        )}, ${centerY.toFixed(1)}): distance=${distance.toFixed(1)}`
      );

      if (distance < closestDistance && distance < 100) {
        closestDistance = distance;
        closestIndex = index;
        devLog("  -> NEW CLOSEST");
      }
    });

    devLog("Result:", closestIndex, "distance:", closestDistance.toFixed(1));

    if (closestIndex !== fromIndex) {
      devLog("SWAPPING:", fromIndex, "↔", closestIndex);
      onSwap(fromIndex, closestIndex);
    } else {
      devLog("NO SWAP");
    }
  };

  return (
    <View style={styles.container}>
      {characters.map((char, index) => (
        <View
          key={`${char.id}-${index}`}
          ref={(ref) => {
            characterRefs.current[index] = ref;
          }}
          onLayout={(e) => handleLayout(index, e)}
        >
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
