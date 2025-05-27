import React, { memo } from "react";
import CharacterCard from "components/CharacterCard";
import "./characterList.scss";
import { useTimeTravel } from "hooks/time-travel";

const CharacterList = ({ characters }) => {
  const { selectedCharacter, setSelectedCharacter } = useTimeTravel();

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
              onSelect={setSelectedCharacter}
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
