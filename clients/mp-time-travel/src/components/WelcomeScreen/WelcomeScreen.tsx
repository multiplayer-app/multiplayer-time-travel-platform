import React, { useCallback, memo } from "react";
import QuestionSelector from "components/QuestionSelector";
import { getTimegateProminentPersons } from "services";
import "./welcomeScreen.scss";

const WelcomeScreen = ({ onCharacterPick, pickedCharacter, setQuestion }) => {
  const handleCharacterPick = useCallback(() => {
    getTimegateProminentPersons();
    onCharacterPick();
  }, [onCharacterPick]);

  return (
    <div className="mtt-welcome-container">
      <h1 className="mtt-welcome-title semibold-text">Hello there! 👋</h1>

      <p className="mtt-subtext medium-text">
        {pickedCharacter ? (
          <>
            Enter your message to {pickedCharacter.name}.<br /> Beware..{" "}
            {pickedCharacter.pronoun}’ll try to nudge <br />
            you to try Multiplayer.
          </>
        ) : (
          `Ever wanted to debug with Yoda? Now you can. <br /> Pick a character and see how Multiplayer debugging works.`
        )}
      </p>

      {pickedCharacter ? (
        <QuestionSelector
          setQuestion={setQuestion}
          character={pickedCharacter}
        />
      ) : (
        <button
          className="mtt-button medium-text"
          onClick={handleCharacterPick}
          aria-label="Pick a random character"
        >
          Pick for me
        </button>
      )}
    </div>
  );
};

export default memo(WelcomeScreen);
