import React, { memo } from "react";
import logoR from "../assets/logo.png";

const SidePanel = ({ character }) => {
  return (
    <div
      className="mtt-sidepanel"
      style={
        character && {
          backgroundImage: `url(${character?.panelImg})`,
        }
      }
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
