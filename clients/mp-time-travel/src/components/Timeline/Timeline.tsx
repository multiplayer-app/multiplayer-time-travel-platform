import { memo, useEffect } from 'react';
import { characters } from 'mock/characters';
import './timeline.scss';
import { getHistoricalEvents } from 'services';

function categorizeCharacters(characters) {
  const bceCe = [];
  const laterCe = [];

  for (const character of characters) {
    if (character.startDate?.isBCE || character.endDate?.isBCE) {
      bceCe.push(character);
    } else {
      laterCe.push(character);
    }
  }

  return { bceCe, laterCe };
}

const Timeline = ({ selectedCharacter, setSelectedCharacter }) => {
  const { bceCe, laterCe } = categorizeCharacters(characters);

  useEffect(() => {
    // Make requests to generate traces
    getHistoricalEvents();
  }, []);

  return (
    <div className='mtt-timeline'>
      <header className='mtt-timeline-header semibold-text'>Timeline</header>

      <div className='mtt-timeline-scroll-container'>
        <div className='mtt-timeline-era-container'>
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
          <div className='mtt-timeline-zero'>0</div>
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
  <div className='mtt-year-divider'>
    <div className='mtt-year-dot' />
    <div className='mtt-year-dot' />
    <div className='mtt-year-h-line' />
    <div className='mtt-year-dot' />
    <div className='mtt-year-dot' />
  </div>
);

const CharacterAvatar = ({ character, selectedCharacter, setSelectedCharacter }) => {
  return (
    <img
      src={character.avatar}
      className={`mtt-character-avatar avatar-sm ${selectedCharacter?.name === character.name ? 'selected' : ''}`}
      alt={character.description}
      onClick={() => setSelectedCharacter(character)}
    />
  );
};

export default memo(Timeline);
