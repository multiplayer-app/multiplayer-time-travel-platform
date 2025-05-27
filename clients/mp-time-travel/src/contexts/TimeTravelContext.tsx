import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { getEpoch, getProminentPersons } from 'services';

const TimeTravelContext = createContext(undefined);

interface TimeTravelProviderProps {
  children: ReactNode;
}

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    getEpoch();
  }, []);

  useEffect(() => {
    // Make requests to generate traces
    if (selectedCharacter) {
      getProminentPersons();
    }
  }, [selectedCharacter]);

  const value = { selectedCharacter, question, setSelectedCharacter, setQuestion };

  return <TimeTravelContext.Provider value={value}>{children}</TimeTravelContext.Provider>;
};

export { TimeTravelContext };
