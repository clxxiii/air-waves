import { createContext, Dispatch, SetStateAction } from "react";

type GameSettings = {
  playfieldDimensions: [number, number];
  noteSpeed: number;
  approachDistance: number;
};

export const TimePositionContext = createContext<
  [number, Dispatch<SetStateAction<number>> | null]
>([0, null]);
export const SettingsContext = createContext<GameSettings>({
  playfieldDimensions: [0, 0],
  noteSpeed: 0,
  approachDistance: 0
});
