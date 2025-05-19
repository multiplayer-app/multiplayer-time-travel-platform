import React from "react";
import CharacterCard from "./CharacterCard";

const CharacterList = ({
  characters,
  selectedCharacter,
  setSelectedCharacter,
}) => {
  return (
    <div className="mtt-character-list">
      <header className="mtt-character-list-header semibold-text">
        Available Personalities
      </header>
      <div className="mtt-characters-row">
        {characters?.length ? (
          characters.map((i, index) => (
            <div key={index}>
              <CharacterCard
                character={i}
                isSelected={i === selectedCharacter}
                onSelect={() => setSelectedCharacter(i)}
              />
            </div>
          ))
        ) : (
          <p
            className="medium-text"
            style={{ color: "#888", fontSize: "14px" }}
          >
            No characters found, please select another year
          </p>
        )}
      </div>
    </div>
  );
};

export default CharacterList;
