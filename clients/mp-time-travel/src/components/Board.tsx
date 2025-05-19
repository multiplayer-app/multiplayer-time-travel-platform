import React, { useEffect, useMemo, useState, memo, useCallback } from "react";
import Timeline from "./Timeline";
import CharacterList from "./CharacterList";
import WelcomeScreen from "./WelcomeScreen";
import MultiplayerChat from "./MultiplayerChat";
import { characters } from "../mock/characters";

const TERMS_URL = "https://www.multiplayer.app/terms-of-service/";
const PRIVACY_URL = "https://www.multiplayer.app/privacy/";

const Board = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [question, setQuestion] = useState(null);
  const [era, setEra] = useState("BCE");

  useEffect(() => {
    setQuestion(null);
    setEra(
      selectedCharacter?.startDate?.isBCE || selectedCharacter?.endDate?.isBCE
        ? "BCE"
        : "CE"
    );
  }, [selectedCharacter]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      return era === "BCE"
        ? character.startDate?.isBCE || character.endDate?.isBCE
        : !character.startDate?.isBCE && !character.endDate?.isBCE;
    });
  }, [era]);

  const handleCharacterPick = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];

    setSelectedCharacter(randomCharacter);
  }, []);

  return (
    <div className="mtt-board">
      <div className="mtt-board-head">
        <Timeline
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          setEra={setEra}
        />

        <CharacterList
          characters={filteredCharacters}
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
      </div>

      {!question && (
        <WelcomeScreen
          onCharacterPick={handleCharacterPick}
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
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Terms of Service"
        >
          Terms
        </a>{" "}
        and have read our{" "}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default memo(Board);
