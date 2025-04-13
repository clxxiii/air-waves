import React, { createContext, useState } from "react";

export const FingerStateContext = createContext();

export const FingerStateProvider = ({ children }) => {
  const [fingerInRange, setFingerInRange] = useState({
    indexFinger: false,
    middleFinger: false,
    ringFinger: false,
    pinky: false,
  });

  return (
    <FingerStateContext.Provider value={{ fingerInRange, setFingerInRange }}>
      {children}
    </FingerStateContext.Provider>
  );
};
