import React from "react";

const CharacterCard = ({ isSelected, onSelect, character }) => {
  return (
    <div
      className={`mtt-character-card ${isSelected ? "card-selected" : ""}`}
      onClick={onSelect}
      title={character.description}
    >
      <img
        src={character.avatar}
        alt={character.description}
        className="mtt-character-avatar"
      />
      <span className="mtt-character-name medium-text">{character.name}</span>
    </div>
  );
};

export default CharacterCard;
