import { createContext, Dispatch, SetStateAction } from "react";


export const TimePositionContext = createContext<
  [number, Dispatch<SetStateAction<number>> | null]
>([0, null]);
