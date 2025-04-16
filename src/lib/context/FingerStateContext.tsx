import {
  createContext,
  Dispatch,
  type ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

type Fingers = {
  indexFinger: boolean;
  middleFinger: boolean;
  ringFinger: boolean;
  pinky: boolean;
};

export const FingerStateContext = createContext<{
  fingerInRange: Fingers;
  setFingerInRange: Dispatch<SetStateAction<Fingers>>;
} | null>(null);

export const useFingerContext = () => {
  const context = useContext(FingerStateContext);
  if (!context) {
    throw "useFingerContext must be used within a FingerStateProvider";
  }
  return context;
};

export const FingerStateProvider = ({ children }: { children?: ReactNode }) => {
  const [fingerInRange, setFingerInRange] = useState({
    indexFinger: false,
    middleFinger: false,
    ringFinger: false,
    pinky: false
  });

  return (
    <FingerStateContext.Provider value={{ fingerInRange, setFingerInRange }}>
      {children}
    </FingerStateContext.Provider>
  );
};
