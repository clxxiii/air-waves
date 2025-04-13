import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import HitWindow from "./lib/components/HitWindow";
import { SettingsContext } from "./lib/contexts";
import { parse } from "./lib/ChartParser";
import Notes from "./lib/components/Notes";
import Menu from './lib/components/Menu.tsx';
import Game from './lib/components/Game'; 
import Score from './lib/components/Score.tsx';

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

function App() {
  const [screen, setScreen] = useState<'menu' | 'game' | 'score' >('menu');
  const [score, setScore] = useState(100);
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
      <div className="App">
        {screen === 'menu' && <Menu setScreen={setScreen} />}
        {screen === 'game' && <Game setScreen={setScreen} setScore={setScore} />}
        {screen === 'score' && <Score score={score} setScreen={setScreen} />}
    </div>
    </div>
  );
}

export default App;
