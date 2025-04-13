import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import HitWindow from "./lib/components/HitWindow";
import { SettingsContext } from "./lib/contexts";
import { parse } from "./lib/ChartParser";
import Notes from "./lib/components/Notes";

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
    state.camera.position.y = 2;
    state.camera.position.z = 10;

    // Lock camera angle to center
    const y = Math.atan2(state.camera.position.x, state.camera.position.z);
    const x = -1 * Math.atan2(state.camera.position.y, state.camera.position.z);
    state.camera.rotation.set(x, y, 0, "YXZ");
  });

  return <></>;
}

function App() {
  const [level, setLevel] = useState<ChartFile.Chart>();

  useEffect(() => {
    fetch("/hello/waves.chart").then((r) => {
      r.text().then((text) => {
        const parsed = parse(text);
        console.log(parsed);
        setLevel(parsed);
      });
    });
  }, []);

  return (
    <div className="h-screen w-screen">
      <Canvas>
        <Three />
        <Lighting />
        <SettingsContext.Provider
          value={{
            playfieldDimensions: [12, 8],
            noteSpeed: 5000,
            approachDistance: 100,
            fadeDistance: 40
          }}
        >
          <HitWindow />
          {level != undefined && <Notes chart={level} />}
        </SettingsContext.Provider>
      </Canvas>
    </div>
  );
}

export default App;
