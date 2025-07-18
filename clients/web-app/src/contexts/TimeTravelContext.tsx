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
  const [errorRate, setErrorRate] = useState(0);
  const [isManualRate, setIsManualRate] = useState(false);

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
    navigationUrl,
    errorRate,
    isManualRate,
    setSelectedCharacter,
    setQuestion,
    setNavigationUrl,
    setErrorRate,
    setIsManualRate,
  };

  return (
    <TimeTravelContext.Provider value={value}>
      {children}
    </TimeTravelContext.Provider>
  );
};

export { TimeTravelContext };
