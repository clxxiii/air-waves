import { ThreeElements } from "@react-three/fiber";
import { useFingerContext } from "../context/FingerStateContext";

type Finger = "indexFinger" | "middleFinger" | "ringFinger" | "pinky";

function Tile(props: ThreeElements["mesh"] & { color: number; name: Finger }) {
  const { color, name } = props;

  const { fingerInRange } = useFingerContext();

  return (
    <mesh {...props} scale={[1, fingerInRange[name] ? 0.8 : 1, 1]}>
      <boxGeometry args={[1.5, fingerInRange[name] ? 0.2 : 0.1, 1]} />
      <meshStandardMaterial
        color={fingerInRange[name] ? `#${color.toString(16)}` : "rgba(0,0,0)"}
        transparent={true}
      />
    </mesh>
  );
}

export default Tile;
