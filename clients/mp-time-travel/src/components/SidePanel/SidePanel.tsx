import { memo } from 'react';
import { ReactComponent as LogoFull } from 'assets/logo-full.svg';

import { characters } from 'mock/characters';
import { useTimeTravel } from 'hooks/useTimeTravel';
import './sidePanel.scss';

const SidePanel = () => {
  const { selectedCharacter } = useTimeTravel();

  return (
    <div className={`mtt-sidepanel mtt-bg-${characters.indexOf(selectedCharacter) + 1}`}>
      <div className='mtt-logo-container'>
        <a href='https://www.multiplayer.app/' target='_blank' rel='noreferrer noopener'>
          <LogoFull className='mtt-logo-main' height={40} width={180} />
        </a>
      </div>
    </div>
  );
};

export default memo(SidePanel);
