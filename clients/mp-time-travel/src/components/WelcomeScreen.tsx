import React from "react";
import QuestionSelector from "./QuestionSelector";

const WelcomeScreen = ({ onCharacterPick, pickedCharacter, setQuestion }) => {
  return (
    <div className="mtt-welcome-container">
      <h1 className="mtt-welcome-title semibold-text">Hello there! 👋</h1>
      <p className="mtt-subtext medium-text">
        {pickedCharacter ? (
          <>
            Enter your message to {pickedCharacter.name}.<br /> Beware..{" "}
            {pickedCharacter.pronoun}’ll try to nudge <br />
            you into installing Multiplayer.
          </>
        ) : (
          <>Pick a character to start chatting.</>
        )}
      </p>
      {pickedCharacter ? (
        <QuestionSelector setQuestion={setQuestion} character={pickedCharacter}/>
      ) : (
        <button className="mtt-button medium-text" onClick={onCharacterPick}>
          Pick for me
        </button>
      )}
    </div>
  );
};

export default WelcomeScreen;
