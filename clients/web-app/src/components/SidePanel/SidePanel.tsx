import { memo, useEffect, useState } from "react";
import { ReactComponent as LogoFull } from "assets/logo-full.svg";
import { ReactComponent as LogoMobile } from "assets/logo.svg";

import BugOMeter from "components/BugOMeter";
import HamburgerMenu from "components/HamburgerMenu";
import { characters } from "mock/characters";
import { useTimeTravel } from "hooks/useTimeTravel";
import { githubIcon } from "utils/constants";
import "./sidePanel.scss";

const SidePanel = () => {
  const { selectedCharacter } = useTimeTravel();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();

    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className={`mtt-sidepanel mtt-bg-${
        characters.indexOf(selectedCharacter) + 1
      }`}
    >
      {isMobile && <HamburgerMenu />}
      <div className="mtt-logo-container">
        <a
          href="https://www.multiplayer.app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          {isMobile ? (
            <LogoMobile
              className="mtt-logo-mobile"
              height={30}
              width={30}
              color="#493cff"
            />
          ) : (
            <LogoFull className="mtt-logo-main" height={40} width={180} />
          )}
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
