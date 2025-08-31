import { useEffect, useRef, useState } from "react";
import { TimePositionContext } from "../contexts";
import Note from "./Note";
import Tile from "./Tile";
import base from "../base";
import { parse } from "../ChartParser";
import HandTrackingCanvas from "./HandTrackingCanvas";

function Notes(props: { level: string }) {
  const { level } = props;

  const frametime = 16;
  const [timePosition, setTimePosition] = useState(0);
  const [loading, load] = useState(false);
  const [chart, setChart] = useState<ChartFile.Chart | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const audio = new Audio();

  const start = () => {
    load(true);

    Promise.all([
      // Get chart file
      new Promise<ChartFile.Chart>((resolve) => {
        fetch(`${base}/${level}/waves.chart`).then((r) => {
          r.text().then((text) => {
            const parsed = parse(text);
            resolve(parsed);
          });
        });
      }),
      // Get song file
      new Promise<HTMLAudioElement>((resolve) => {
        audio.src = `${base}/${level}/song.ogg`;
        audio.addEventListener("canplay", () => resolve(audio));
      })
    ])
      .then(([chart, audio]) => {
        load(false);
        setChart(chart);
        if (!audio || !chart) throw "Failed.";
        console.log({ audio, chart });

        interval.current = setInterval(() => {
          const ms = audio.currentTime * 1000;
          setTimePosition(ms);
        }, frametime);
        audio.addEventListener("timeupdate", () => {
          const ms = audio.currentTime * 1000;
          setTimePosition(ms);
        });
        audio.play();
      })
      .finally(() => {
        load(false);
      });
  };

  useEffect(start, [level]);

  return (
    <>
      {!loading && (
        <>
          <TimePositionContext.Provider value={[timePosition, setTimePosition]}>
            {chart && (<HandTrackingCanvas />)}
            {chart &&
              chart.notes.expert?.map((note, k) => (
                <Note note={note} key={k} />
              ))}
          </TimePositionContext.Provider>
          <Tile name="indexFinger" color={0x54bed8} position={[-4, -1, 0]} />
          <Tile name="middleFinger" color={0xe15971} position={[-1.3, -1, 0]} />
          <Tile name="ringFinger" color={0xffe113} position={[1.3, -1, 0]} />
          <Tile name="pinky" color={0x8f48b7} position={[4, -1, 0]} />
        </>
      )}
    </>
  );
}

export default Notes;
