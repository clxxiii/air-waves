import { useEffect, useState } from "react";
import { TimePositionContext } from "../contexts";
import Note from "./Note";
import Tile from "./Tile";

function Notes(props: { chart: ChartFile.Chart }) {
  const { chart } = props;

  const [timePosition, setTimePosition] = useState(0);

  const start = () => {
    const frametime = 16;
    console.log("Starting...");
    let counter = 0;
    setInterval(() => {
      counter = counter + frametime;
      setTimePosition(counter);
    }, frametime);
  };

  useEffect(start, []);

  return (
    <>
      <TimePositionContext.Provider value={[timePosition, setTimePosition]}>
        {chart.notes.expert?.map((note, k) => (
          <Note note={note} key={k} />
        ))}
      </TimePositionContext.Provider>
      <Tile color={0x54bed8} position={[-4, -1, 0]} />
      <Tile color={0xe15971} position={[-1.3, -1, 0]} />
      <Tile color={0xffe113} position={[1.3, -1, 0]} />
      <Tile color={0x8f48b7} position={[4, -1, 0]} />
    </>
  );
}

export default Notes;
