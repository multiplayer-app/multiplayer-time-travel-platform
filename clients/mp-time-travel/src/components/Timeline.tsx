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

const Timeline = ({ selectedCharacter, setSelectedCharacter }) => {
  const { bceCe, earlyCe, laterCe } = categorizeCharacters(characters);

  return (
    <div className="mtt-timeline">
      <header className="mtt-timeline-header semibold-text">Timeline</header>

      <div className="mtt-timeline-scroll-container">
        <div className="mtt-timeline-years-container">
          <div className="mtt-timeline-years-ticks">
            <div className="mtt-timeline-year-cm">
              <span className="mtt-timeline-year">BCE</span>
            </div>
            <YearDivider />
            {bceCe.map((character, index) => {
              return (
                <img
                  key={index}
                  src={character.avatar}
                  className={`mtt-character-avatar avatar-sm ${
                    selectedCharacter?.name === character.name ? "selected" : ""
                  }`}
                  alt={character.description}
                  onClick={() => setSelectedCharacter(character)}
                />
              );
            })}
            <YearDivider />
            <div className="mtt-timeline-year-cm">
              <span className="mtt-timeline-year">CE</span>
            </div>
            {earlyCe.map((character, index) => {
              return (
                <img
                  key={index}
                  src={character.avatar}
                  className={`mtt-character-avatar avatar-sm ${
                    selectedCharacter?.name === character.name ? "selected" : ""
                  }`}
                  alt={character.description}
                  onClick={() => setSelectedCharacter(character)}
                />
              );
            })}
            <YearDivider />
            {laterCe.map((character, index) => {
              return (
                <img
                  key={index}
                  src={character.avatar}
                  className={`mtt-character-avatar avatar-sm ${
                    selectedCharacter?.name === character.name ? "selected" : ""
                  }`}
                  alt={character.description}
                  onClick={() => setSelectedCharacter(character)}
                />
              );
            })}
            <YearDivider />
          </div>
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

export default memo(Timeline);
