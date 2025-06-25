import React, { useMemo } from "react";
import "./suggestionsList.scss";

const SuggestionItem = ({ message, onSelect }) => (
  <div className="mtt-suggestion-item medium-text" onClick={onSelect}>
    {message}
  </div>
);

const SuggestionsList = ({ character, onSelect }) => {
  const getRandomSuggestions = (suggestions: string[]) => {
    return [...suggestions].sort(() => Math.random() - 0.5).slice(0, 3);
  };

  const randomSuggestions = useMemo(() => {
    return getRandomSuggestions(character.suggestions || []);
  }, [character]);

  return (
    <div className="mtt-suggestions-list-wrapper">
      <header className="mtt-suggestions-list-header semibold-text">
        Pick your next message
      </header>
      <div className="mtt-suggestions-list">
        {randomSuggestions?.map((message, index) => (
          <SuggestionItem
            message={message}
            key={index}
            onSelect={() => onSelect(message)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsList;
