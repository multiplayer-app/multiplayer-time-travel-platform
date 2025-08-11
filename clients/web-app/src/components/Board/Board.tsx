import { useEffect, memo, useCallback } from "react";
import debuggerInstance from "@multiplayer-app/session-recorder-browser";
import Timeline from "components/Timeline";
import CharacterList from "components/CharacterList";
import WelcomeScreen from "components/WelcomeScreen";
import MultiplayerChat from "components/MultiplayerChat";
import { characters } from "mock/characters";

import "./board.scss";
import { triggerMouseEvent } from "utils/triggerMouseEvent";
import { useTimeTravel } from "hooks/useTimeTravel";
import { SessionState } from "utils/types";

const TERMS_URL = "https://www.multiplayer.app/terms-of-service/";
const PRIVACY_URL = "https://www.multiplayer.app/privacy/";

const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};

const Board = () => {
  const { selectedCharacter, setSelectedCharacter, question, setQuestion } =
    useTimeTravel();

  useEffect(() => {
    setQuestion(null);
    if (
      selectedCharacter &&
      debuggerInstance?.sessionState !== SessionState.started
    ) {
      debuggerInstance.start?.();
    }
  }, [selectedCharacter, setQuestion]);

  const handleCharacterPick = useCallback(() => {
    setSelectedCharacter(getRandomCharacter());
  }, [setSelectedCharacter]);

  const onDebuggerOpen = () => {
    triggerMouseEvent(debuggerInstance?.sessionWidgetButtonElement);
  };

  return (
    <div className="mtt-board">
      <div className="mtt-board-head">
        <Timeline
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
        <CharacterList
          characters={characters}
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
        onDebuggerOpen={onDebuggerOpen}
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
