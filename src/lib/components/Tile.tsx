import { useState } from "react";
import { ThreeElements } from "@react-three/fiber";

function Tile(props: ThreeElements["mesh"] & { color: number }) {
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0.4);
  const [tileColor, setTileColor] = useState("rgba(0, 0, 0, 0.5)");

  const handlePress = () => {
    setScale(0.8);
    setHeight(0.1);
    setTileColor(`#${props.color.toString(16)}`);
  };

  const handleRelease = () => {
    setScale(1);
    setHeight(0.2);
    setTileColor("rgba(0, 0, 0, 0.5)");
  };

  return (
    <mesh
      {...props}
      scale={[1, scale, 1]}
      onClick={handlePress}
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerOut={handleRelease}
    >
      <boxGeometry args={[1.5, height, 1]} />
      <meshStandardMaterial color={tileColor} transparent={true} />
    </mesh>
  );
}

export default Tile;