import React, { memo } from "react";
import { characters } from "../mock/characters";

function categorizeCharacters(characters) {
  const toYear = (dateObj) => {
    if (!dateObj) return null;
    if (!dateObj.isBCE) {
      return dateObj.date ?? null;
    }
  };

  const bceCe = [];
  const earlyCe = [];
  const laterCe = [];

  for (const character of characters) {
    const start = toYear(character.startDate);
    const end = toYear(character.endDate);
    const year = new Date(start ?? end).getFullYear() ?? null;

    if (character.startDate?.isBCE || character.endDate?.isBCE) {
      bceCe.push(character);
    } else if (year >= 1 && year < 500) {
      earlyCe.push(character);
    } else {
      laterCe.push(character);
    }
  }

  return { bceCe, earlyCe, laterCe };
}

const Timeline = ({ selectedCharacter, setSelectedCharacter, era, setEra }) => {
  const { bceCe, earlyCe, laterCe } = categorizeCharacters(characters);

  return (
    <div className="mtt-timeline">
      <header className="mtt-timeline-header semibold-text">Timeline</header>

      <div className="mtt-timeline-scroll-container">
        <div className="mtt-timeline-era-container">
          <EraToggleButton setEra={setEra} currentEra={era} label="BCE" />
          <YearDivider />
          {bceCe.map((character, index) => (
            <CharacterAvatar
              key={index}
              character={character}
              setSelectedCharacter={setSelectedCharacter}
              selectedCharacter={selectedCharacter}
            />
          ))}
          <YearDivider />
          <EraToggleButton setEra={setEra} currentEra={era} label="CE" />
          {earlyCe.map((character, index) => (
            <CharacterAvatar
              key={index}
              character={character}
              setSelectedCharacter={setSelectedCharacter}
              selectedCharacter={selectedCharacter}
            />
          ))}
          <YearDivider />
          {laterCe.map((character, index) => (
            <CharacterAvatar
              key={index}
              character={character}
              setSelectedCharacter={setSelectedCharacter}
              selectedCharacter={selectedCharacter}
            />
          ))}
          <YearDivider />
        </div>
      </div>
    </div>
  );
};

const YearDivider = () => (
  <div className="mtt-year-divider">
    <div className="mtt-year-dot" />
    <div className="mtt-year-dot" />
    <div className="mtt-year-h-line" />
    <div className="mtt-year-dot" />
    <div className="mtt-year-dot" />
  </div>
);

const EraToggleButton = ({ label, currentEra, setEra }) => {
  return (
    <div
      className={`mtt-timeline-era ${
        currentEra === label ? "mtt-era-selected" : ""
      }`}
      onClick={() => setEra(label)}
    >
      {label}
    </div>
  );
};

const CharacterAvatar = ({
  character,
  selectedCharacter,
  setSelectedCharacter,
}) => {
  return (
    <img
      src={character.avatar}
      className={`mtt-character-avatar avatar-sm ${
        selectedCharacter?.name === character.name ? "selected" : ""
      }`}
      alt={character.description}
      onClick={() => setSelectedCharacter(character)}
    />
  );
};

export default memo(Timeline);
