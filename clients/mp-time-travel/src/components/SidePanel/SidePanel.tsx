import { memo } from "react";
import { ReactComponent as LogoFull } from "assets/logo-full.svg";

import BugOMeter from "components/BugOMeter";
import { characters } from "mock/characters";
import { useTimeTravel } from "hooks/useTimeTravel";
import { githubIcon } from "utils/constants";
import "./sidePanel.scss";

const SidePanel = () => {
  const { selectedCharacter } = useTimeTravel();

  return (
    <div
      className={`mtt-sidepanel mtt-bg-${
        characters.indexOf(selectedCharacter) + 1
      }`}
    >
      <div className="mtt-logo-container">
        <a
          href="https://www.multiplayer.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <LogoFull className="mtt-logo-main" height={40} width={180} />
        </a>
      </div>
      <div className="mtt-sidepanel-footer">
        <BugOMeter />
        <a
          className="mtt-project-fork"
          rel="noreferrer"
          href="https://github.com/multiplayer-app/multiplayer-time-travel-platform"
          target="_blank"
        >
          <img src={githubIcon} alt="github" />
          <span>Fork this project</span>
        </a>
      </div>
    </div>
  );
};

export default memo(SidePanel);
