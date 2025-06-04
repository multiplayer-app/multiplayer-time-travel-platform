import React, { createContext, ReactNode, useEffect, useState } from "react";
import { recorderEventBus } from "@multiplayer-app/session-debugger";
import { getEpoch, getProminentPersons } from "services";

const TimeTravelContext = createContext(undefined);

interface TimeTravelProviderProps {
  children: ReactNode;
}

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({
  children,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);
  const [navigationUrl, setNavigationUrl] = useState({});

  useEffect(() => {
    getEpoch();
  }, []);

  useEffect(() => {
    // Make requests to generate traces
    if (selectedCharacter) {
      getProminentPersons();
    }
  }, [selectedCharacter]);

  useEffect(() => {
    const handleSetUrl = (res) => {
      setNavigationUrl(res?.url);
    };
    recorderEventBus?.on("debug-session:started", handleSetUrl);
    return () => {
      recorderEventBus?.off("debug-session:started", handleSetUrl);
    };
  }, []);

  const value = {
    selectedCharacter,
    question,
    setSelectedCharacter,
    setQuestion,
    navigationUrl,
  };

  return (
    <TimeTravelContext.Provider value={value}>
      {children}
    </TimeTravelContext.Provider>
  );
};

export { TimeTravelContext };
