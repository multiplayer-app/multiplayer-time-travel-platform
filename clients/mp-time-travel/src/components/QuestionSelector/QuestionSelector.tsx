import React, { memo, useCallback } from "react";
import "./questionSelector.scss";

const QuestionSelector = ({ setQuestion, character }) => {
  const handleQuestionSelect = useCallback(
    (question: string) => {
      setQuestion(question);
    },
    [setQuestion]
  );

  return (
    <div className="mtt-question-container">
      <h2 className="mtt-question-title semibold-text">
        Or pick a question from here
      </h2>
      <div
        className="mtt-questions-list"
        role="menu"
        aria-label="Suggested questions"
      >
        {character.questions.map((question, index) => (
          <button
            key={`${character.name}-question-${index}`}
            onClick={() => handleQuestionSelect(question)}
            className="mtt-question-button medium-text"
            role="menuitem"
            aria-label={`Ask: ${question}`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(QuestionSelector);
