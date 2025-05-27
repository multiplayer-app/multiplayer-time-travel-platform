import React, { memo } from "react";
import logoR from "assets/logo.png";
import { characters } from "mock/characters";
import "./sidePanel.scss";
import { useTimeTravel } from "hooks/time-travel";

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
          <img
            src={logoR}
            className="mtt-logo-main"
            alt="Multiplayer logo"
            width="auto"
            height="40px"
            loading="lazy"
          />
        </a>
      </div>
    </div>
  );
};

export default memo(SidePanel);
