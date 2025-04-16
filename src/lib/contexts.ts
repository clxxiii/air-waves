import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

type State<T> = [T, Dispatch<SetStateAction<T>>];

export const TimePositionContext = createContext<
  [number, Dispatch<SetStateAction<number>> | null]
>([0, null]);

export const TipDistanceContext = createContext<State<number[]> | null>(null)
export const useDistanceContext = () => {
  const context = useContext(TipDistanceContext);
  if (!context) {
    throw "useDistanceContext must be used inside of a TipDistanceProvider"
  }
  return context;
}