import React, { useEffect, useMemo, useState } from "react";
import Timeline from "./Timeline";
import CharacterList from "./CharacterList";
import WelcomeScreen from "./WelcomeScreen";
import MultiplayerChat from "./MultiplayerChat";
import { characters } from "../mock/characters";

const INITIAL_YEAR = 1960;

const getFullYear = (date) => {
  return date ? new Date(date).getFullYear() : null;
};

const Board = () => {
  const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    setQuestion(null);
  }, [selectedCharacter]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const startYear = getFullYear(character.startDate?.date);
      const endYear = getFullYear(character.endDate?.date);
      return (
        (!startYear || selectedYear >= startYear) &&
        (!endYear || selectedYear <= endYear)
      );
    });
  }, [selectedYear]);

  const onCharacterPick = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    setSelectedCharacter(randomCharacter);
    setSelectedYear(new Date(randomCharacter.startDate.date).getFullYear());
  };

  return (
    <div className="mtt-board">
      <div className="mtt-board-head">
        <Timeline setSelectedCharacter={setSelectedCharacter} />
        <CharacterList
          characters={filteredCharacters}
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
      </div>
      {!question && (
        <WelcomeScreen
          onCharacterPick={onCharacterPick}
          pickedCharacter={selectedCharacter}
          setQuestion={setQuestion}
        />
      )}
      <MultiplayerChat
        character={selectedCharacter}
        preselectedQuestion={question}
        setQuestion={setQuestion}
      />
      <div className="mtt-terms-info medium-text">
        By messaging Multiplayer Time Travel, you agree to our{" "}
        <a
          href="https://www.multiplayer.app/terms-of-service/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Terms
        </a>{" "}
        and have read our{" "}
        <a
          href="https://www.multiplayer.app/privacy/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default Board;
