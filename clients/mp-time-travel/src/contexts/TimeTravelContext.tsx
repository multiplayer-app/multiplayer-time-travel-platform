import React, { createContext, ReactNode, useEffect, useState } from "react";
import { recorderEventBus } from "@multiplayer-app/session-debugger";
import { getEpoch, getProminentPersons } from "services";
import { Character } from "utils/types";

const TimeTravelContext = createContext(undefined);

interface TimeTravelProviderProps {
  children: ReactNode;
}

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({
  children,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);
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
    recorderEventBus?.on("debug-session:stopped", handleSetUrl);
    return () => {
      recorderEventBus?.off("debug-session:stopped", handleSetUrl);
    };
  }, []);

  const value = {
    selectedCharacter,
    question,
    setSelectedCharacter,
    setQuestion,
    navigationUrl,
    setNavigationUrl,
  };

  return (
    <TimeTravelContext.Provider value={value}>
      {children}
    </TimeTravelContext.Provider>
  );
};

export { TimeTravelContext };
