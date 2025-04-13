import { useEffect, useState } from "react";
import { TimePositionContext } from "../contexts";
import Note from "./Note";

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
    <TimePositionContext.Provider value={[timePosition, setTimePosition]}>
      {chart.notes.expert?.map((note, k) => <Note note={note} key={k}></Note>)}
    </TimePositionContext.Provider>
  );
}

export default Notes;
