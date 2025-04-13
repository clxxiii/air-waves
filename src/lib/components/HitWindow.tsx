import { useContext } from "react";
import { SettingsContext } from "../contexts";

function HitWindow() {
  const {
    playfieldDimensions: [playfieldX, playfieldY]
  } = useContext(SettingsContext);

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[playfieldX, playfieldY]} />
      <meshBasicMaterial wireframe={true} />
    </mesh>
  );
}

export default HitWindow;
