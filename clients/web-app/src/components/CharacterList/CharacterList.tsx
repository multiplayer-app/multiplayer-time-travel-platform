import { memo, useEffect, useRef } from "react";
import CharacterCard from "components/CharacterCard";
import "./characterList.scss";

const CharacterList = ({
  characters,
  selectedCharacter,
  setSelectedCharacter,
}) => {
  const charactersRowRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const targetElement = charactersRowRef.current;
    if (!targetElement) return;

    const handleWheel = (e) => {
      if (targetElement && e.deltaY) {
        e.preventDefault();
        targetElement.scrollLeft += e.deltaY;
      }
    };

    targetElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      targetElement.removeEventListener("wheel", handleWheel);
    };
  }, [characters]);

  useEffect(() => {
    characterRef?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedCharacter]);

  return (
    <div className="mtt-character-list">
      <header className="mtt-character-list-header semibold-text">
        Available Personalities
      </header>
      <div className="mtt-characters-row" ref={charactersRowRef}>
        {characters?.length ? (
          characters.map((character) => {
            const isSelected = character === selectedCharacter;
            return (
              <div key={character.name} ref={isSelected ? characterRef : null}>
                <CharacterCard
                  character={character}
                  isSelected={isSelected}
                  onSelect={setSelectedCharacter}
                />
              </div>
            );
          })
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
