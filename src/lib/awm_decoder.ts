/**
 * Takes an AWM file, and converts it to a JSON-familiar format.
 * Since AWM is timed according to the BPM (for simplicity), this
 * function also converts those timing points into milliseconds.
 */
export default function parseAwm(awm: string): Game.Note[] {
  const lines = awm.replaceAll("\r", "").split("\n");

  // Get resolution & remove line
  const resolution = parseInt(lines[0]);
  lines.splice(0, 1);

  // Sort by time
  lines.sort((a, b) => parseInt(a.split(",")[0]) - parseInt(b.split(",")[0]));

  const notes: Game.Note[] = [];
  let currentBPM = 120;
  let lastEventTime = 0;
  let lastRelativeTime = 0;
  for (const line of lines) {
    const split = line.split(",");

    const msInBeat = (1 / (currentBPM / 60)) * 1000;
    const msInUnit = msInBeat / resolution;
    const relativeNumber = parseInt(split[0]) - lastRelativeTime;
    lastRelativeTime = parseInt(split[0]);

    const eventTime = lastEventTime + relativeNumber * msInUnit;
    lastEventTime = eventTime;

    if (split[1].toLowerCase() == "bpm") {
      currentBPM = parseInt(split[2]);
    }

    if (split[1].toLowerCase() == "point") {
      const position: [number, number] = [
        parseFloat(split[2]),
        parseFloat(split[3])
      ];
      notes.push({
        position,
        time: eventTime,
        type: "point"
      });
    }

    if (split[1].toLowerCase() == "pinch") {
      split.splice(1, 1);
      const startTime = parseInt(split[0]);
      const position: [number, Game.Coordinate][] = [];
      while (split.length > 0) {
        const time = (parseInt(split[0]) - startTime) * msInUnit;
        const coords: [number, number] = [
          parseFloat(split[1]),
          parseFloat(split[2])
        ];
        position.push([time, coords]);
        split.splice(0, 3);
      }
      notes.push({ position, time: eventTime, type: "pinch" });
    }
  }

  return notes;
}
