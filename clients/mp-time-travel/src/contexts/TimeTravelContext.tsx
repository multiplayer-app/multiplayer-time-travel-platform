import React, { createContext, ReactNode, useState } from 'react';

const TimeTravelContext = createContext(undefined);

interface TimeTravelProviderProps {
  children: ReactNode;
}

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);

  const value = { selectedCharacter, question, setSelectedCharacter, setQuestion };

  return <TimeTravelContext.Provider value={value}>{children}</TimeTravelContext.Provider>;
};

export { TimeTravelContext };
