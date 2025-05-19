import React, { memo, useCallback } from "react";

const CharacterCard = ({ isSelected, onSelect, character }) => {
  const handleClick = useCallback(() => {
    onSelect(character);
  }, [onSelect, character]);

  return (
    <div
      className={`mtt-character-card ${isSelected ? "card-selected" : ""}`}
      onClick={handleClick}
      title={character.description}
      role="button"
      tabIndex={0}
      aria-label={`Select ${character.name}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <img
        src={character.avatar}
        alt={`${character.name} - ${character.description}`}
        className="mtt-character-avatar"
      />
      <span className="mtt-character-name medium-text">{character.name}</span>
    </div>
  );
};

export default memo(CharacterCard);
