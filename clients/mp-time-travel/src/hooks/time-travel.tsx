import { useState } from "react";

export function useTimeTravel() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);

  return { selectedCharacter, question, setSelectedCharacter, setQuestion };
}
