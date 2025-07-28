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
  const [recordingState, setRecordingState] = useState(null);
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "MULTIPLAYER_SESSION_DEBUGGER_LIB") {
        const { action, payload } = event.data;
        if (action === "state-change") {
          setRecordingState(payload);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const value = {
    selectedCharacter,
    question,
    navigationUrl,
    errorRate,
    isManualRate,
    recordingState,
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
