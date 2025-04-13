import { useContext, useState } from "react";
import { ThreeElements } from "@react-three/fiber";
import { FingerStateContext } from "../context/FingerStateContext";

function Tile(props: ThreeElements["mesh"] & { color: number; name: string }) {
  const { color, name } = props;

  const { fingerInRange } = useContext(FingerStateContext);

  return (
    <mesh {...props} scale={[1, fingerInRange[name] ? 0.8 : 1, 1]}>
      <boxGeometry args={[1.5, fingerInRange[name] ? 0.2 : 0.1, 1]} />
      <meshStandardMaterial
        color={
          fingerInRange[name] ? `#${color.toString(16)}` : "rgba(0,0,0,0.5)"
        }
        transparent={true}
      />
    </mesh>
  );
}

export default Tile;
