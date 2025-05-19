import React, { memo } from "react";
import CharacterCard from "./CharacterCard";

const CharacterList = ({
  characters,
  selectedCharacter,
  setSelectedCharacter,
}) => {
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="mtt-character-list">
      <header className="mtt-character-list-header semibold-text">
        Available Personalities
      </header>

      <div className="mtt-characters-row">
        {characters?.length ? (
          characters.map((character) => (
            <CharacterCard
              key={character.name}
              character={character}
              isSelected={character === selectedCharacter}
              onSelect={handleSelectCharacter}
            />
          ))
        ) : (
          <p className="mtt-no-characters medium-text">
            No characters found, please select another year
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(CharacterList);
