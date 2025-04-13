declare global {
  namespace Game {
    type Coordinate = [number, number];

    type Point = {
      type: "point";
      time: number;
      position: Coordinate;
    };

    type Pinch = {
      type: "pinch";
      time: number;
      position: [number, Coordinate][];
    };

    type Note = Point | Pinch;
  }

  type ChartINI = {
    Events: string[][];
    Song: string[][];
    SyncTrack: string[][];
    ExpertSingle?: string[][];
    HardSingle?: string[][];
    NormalSingle?: string[][];
    EasySingle?: string[][];
  };

  namespace ChartFile {
    type Chart = {
      events: Event[];
      notes: ChartFile.Notes;
      timing: Timing[];
    };

    type EventType =
      | "section"
      | "phrase_start"
      | "phrase_end"
      | "lyric"
      | string;
    type Event = {
      ms: number;
      raw: string;
      point: number;

      type: EventType;
      value: string;
    };

    type Notes = {
      expert?: Note[];
      hard?: Note[];
      normal?: Note[];
      easy?: Note[];
    };

    type NoteType = "strum" | "hopo" | "tap";
    type NotePositionType =
      | "green"
      | "red"
      | "yellow"
      | "blue"
      | "orange"
      | "force"
      | "tap";
    type Note = {
      ms: number;
      raw: string;
      point: number;

      notes: boolean[];
      powered: boolean;
      type?: NoteType;
      duration: number[];
    };

    type Timing = TimeSignature | BPMChange;
    type TimeSignature = {
      ms: number;
      raw: string;
      point: number;

      top: number;
      bottom: number;
    };

    type BPMChange = {
      ms: number;
      raw: string;
      point: number;

      bpm: number;
    };
  }
}

export {};

export const isPoint = (n: Game.Note): n is Game.Point => n.type == "point";
export const isPinch = (n: Game.Note): n is Game.Pinch => n.type == "pinch";
