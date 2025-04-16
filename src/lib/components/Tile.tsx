import { ThreeElements } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { useDistanceContext } from "../contexts";

type Finger = "indexFinger" | "middleFinger" | "ringFinger" | "pinky";

function Tile(
  props: ThreeElements["mesh"] & {
    color: number;
    name: Finger;
    currentNote: ChartFile.Note | null;
    onScore: () => void;
    onMiss: () => void;
  }
) {
  const { color, name, currentNote, onScore, onMiss } = props;
  const [distances] = useDistanceContext();
  const [isArrowKeyActive, setIsArrowKeyActive] = useState(false);
  const [processedNoteId, setProcessedNoteId] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (name === "indexFinger") setIsArrowKeyActive(true);
          break;
        case "ArrowUp":
          if (name === "middleFinger") setIsArrowKeyActive(true);
          break;
        case "ArrowRight":
          if (name === "pinky") setIsArrowKeyActive(true); 
          break;
        case "ArrowDown":
          if (name === "ringFinger") setIsArrowKeyActive(true); 
          break;
        default:
          break;
      }
    };

    const handleKeyRelease = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (name === "indexFinger") setIsArrowKeyActive(false);
          break;
        case "ArrowUp":
          if (name === "middleFinger") setIsArrowKeyActive(false);
          break;
        case "ArrowRight":
          if (name === "pinky") setIsArrowKeyActive(false);
          break;
        case "ArrowDown":
          if (name === "ringFinger") setIsArrowKeyActive(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [name]);

  const order = ["indexFinger", "middleFinger", "ringFinger", "pinky"]
  const isActive = distances[order.indexOf(name)] < 0.05 || isArrowKeyActive;

  useEffect(() => {
    if (
      currentNote &&
      currentNote.notes[order.indexOf(name)] &&
      processedNoteId !== currentNote.ms
    ) {
      if (isActive) {
        onScore();
      } else {
        onMiss();
      }
      setProcessedNoteId(currentNote.ms);
    } else if (!currentNote) {
      setProcessedNoteId(null);
    }
  }, [currentNote, isActive, name, order, onScore, onMiss, processedNoteId]);

  return (
    <mesh {...props} scale={[1, isActive ? 0.8 : 1, 1]}>
      <boxGeometry args={[1.5, isActive ? 0.2 : 0.1, 1]} />
      <meshStandardMaterial
        color={isActive ? `#${color.toString(16)}` : "rgba(0,0,0)"}
        transparent={true}
      />
    </mesh>
  );
}

export default Tile;
