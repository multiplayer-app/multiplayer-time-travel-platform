import React from "react";
import { slide as Menu } from "react-burger-menu";
import { githubIcon } from "utils/constants";
import "./hamburgerMenu.scss";

const HamburgerMenu = () => {
  return (
    <Menu width={250} className="hamburger-menu">
      <a
        className="mtt-project-fork"
        rel="noreferrer"
        href="https://github.com/multiplayer-app/multiplayer-time-travel-platform"
        target="_blank"
      >
        <img src={githubIcon} alt="github" />
        <span>Fork this project</span>
      </a>
    </Menu>
  );
};

export default HamburgerMenu;
