import { useState } from "react";
import { TipDistanceContext } from "../contexts";
import HandTrackingCanvas from "./HandTrackingCanvas";
import Tile from "./Tile";
import { Canvas, useThree } from "@react-three/fiber";

type Props = {
  setScreen: React.Dispatch<
    React.SetStateAction<"menu" | "game" | "score" | "demo">
  >;
};

function Lighting() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2}></ambientLight>
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    </>
  );
}

function Three() {
  useThree((state) => {
    state.camera.position.x = 0;
    state.camera.position.y = 3;
    state.camera.position.z = 5;

    // Lock camera angle to center
    const y = Math.atan2(state.camera.position.x, state.camera.position.z);
    const x = -1 * Math.atan2(state.camera.position.y, state.camera.position.z);
    state.camera.rotation.set(x, y, 0, "YXZ");
  });

  return <></>;
}

function Demo(props: Props) {
  const distanceState = useState<number[]>([]);
  return (
    <>
      <button className="text-white" onClick={() => props.setScreen("menu")}>
        Back
      </button>


      <div className="w-screen h-screen">
      <TipDistanceContext.Provider value={distanceState}>
        <HandTrackingCanvas />
        <Canvas>
          <Three />
          <Lighting />

          <Tile name="indexFinger" color={0x54bed8} position={[-4, -1, 0]} />
          <Tile name="middleFinger" color={0xe15971} position={[-1.3, -1, 0]} />
          <Tile name="ringFinger" color={0xffe113} position={[1.3, -1, 0]} />
          <Tile name="pinky" color={0x8f48b7} position={[4, -1, 0]} />
        </Canvas>
      </TipDistanceContext.Provider>
      </div>
    </>
  );
}

export default Demo;
