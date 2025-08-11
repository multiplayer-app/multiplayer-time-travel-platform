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
      <h1 className="mtt-welcome-title semibold-text">
        {pickedCharacter
          ? "📹 Your session is now recording"
          : "👋 Pick your time travel buddy"}
      </h1>

      <p className="mtt-subtext medium-text">
        {pickedCharacter ? (
          <>
            Start chatting and see where the conversation takes you. <br />
            When something breaks (on purpose 😉), you’ll be able to debug it in
            the Multiplayer sandbox.
          </>
        ) : (
          <>
            We’ll start recording your session as soon as you start chatting.{" "}
            <br />
            Just wait until something breaks (on purpose 😉) and you’ll be able
            to debug it in the Multiplayer sandbox.
          </>
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
