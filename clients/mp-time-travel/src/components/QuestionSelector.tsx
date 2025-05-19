import React from "react";

const QuestionSelector = ({ setQuestion, character }) => {
  return (
    <div className="mtt-question-container">
      <h2 className="mtt-question-title semibold-text">
        Or pick a question from here
      </h2>
      <div className="mtt-questions-list">
        {character.questions.map((question, index) => (
          <button
            key={index}
            onClick={() => setQuestion(question)}
            className="mtt-question-button medium-text"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
