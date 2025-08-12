import React, { createContext, ReactNode, useEffect, useState } from "react";
import SessionRecorder, {
  recorderEventBus,
} from "@multiplayer-app/session-recorder-browser";
import { getEpoch, getProminentPersons } from "services";
import { Character } from "utils/types";

const TimeTravelContext = createContext(undefined);

interface TimeTravelProviderProps {
  children: ReactNode;
}

const getNavigationStoredUrl = () => {
  const storedUrl = localStorage.getItem("mp-navigation-url");
  if (!storedUrl || storedUrl === "undefined") return null;
  try {
    return JSON.parse(storedUrl);
  } catch (e) {
    console.error("Failed to parse stored navigation URL:", e);
    return null;
  }
};

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({
  children,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);
  const [question, setQuestion] = useState(null);
  const [navigationUrl, setNavigationUrl] = useState(getNavigationStoredUrl());
  const [errorRate, setErrorRate] = useState(0);
  const [recordingState, setRecordingState] = useState(
    SessionRecorder?.sessionState
  );
  const [isManualRate, setIsManualRate] = useState(false);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);

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
      localStorage.setItem("mp-navigation-url", JSON.stringify(res?.url));
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
    isManuallyStopped,
    setIsManuallyStopped,
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
