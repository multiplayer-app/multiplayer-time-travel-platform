import React from "react";
import logoR from "../assets/logo.png";

const SidePanel = () => {
  return (
    <div className="mtt-sidepanel">
      <div className="mtt-logo-container">
        <a
          href="https://www.multiplayer.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img src={logoR} className="mtt-logo-main" alt="Multiplayer logo" />
        </a>
      </div>
    </div>
  );
};

export default SidePanel;
