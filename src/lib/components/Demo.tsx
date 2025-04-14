import Tile from "./Tile";
import HandTrackingCanvas from "./HandTrackingCanvas";
import { FingerStateProvider } from "../context/FingerStateContext";
import { Canvas, useThree } from "@react-three/fiber";

type Props = {
  setScreen: React.Dispatch<
    React.SetStateAction<"menu" | "game" | "score" | "demo">
  >;
};

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
  return (
    <>
      <button className="text-white" onClick={() => props.setScreen("menu")}>
        Back
      </button>

      <FingerStateProvider>
        <div className="w-screen h-screen">
          <Canvas>
            <Three />

            <Tile name="indexFinger" color={0x54bed8} position={[-4, -1, 0]} />
            <Tile
              name="middleFinger"
              color={0xe15971}
              position={[-1.3, -1, 0]}
            />
            <Tile name="ringFinger" color={0xffe113} position={[1.3, -1, 0]} />
            <Tile name="pinky" color={0x8f48b7} position={[4, -1, 0]} />
          </Canvas>
        </div>
        <HandTrackingCanvas />
      </FingerStateProvider>
    </>
  );
}

export default Demo;
