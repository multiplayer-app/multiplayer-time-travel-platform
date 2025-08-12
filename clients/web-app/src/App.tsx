import { useEffect, useState } from "react";
import Modal from "react-modal";
import { recorderEventBus } from "@multiplayer-app/session-recorder-browser";
import SidePanel from "components/SidePanel";
import Board from "components/Board";
import NavigationModal from "components/NavigationModal";
import DebuggerLabel from "components/DebuggerLabel";
import Sandbox from "components/Sandbox";
import { TimeTravelProvider } from "contexts/TimeTravelContext";
import { useAnonymousTimeTravelerName } from "hooks/useAnonymousTimeTravelerName";
import { isSandboxClosed } from "utils/sandboxHelper";
import "./App.scss";

// Required for accessibility
Modal.setAppElement("#root");

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(!isSandboxClosed());
  const userName = useAnonymousTimeTravelerName();

  useEffect(() => {
    const handleNavigationModal = () => {
      setIsNavigationModalOpen(true);
    };
    recorderEventBus?.on(
      "multiplayer-debug-session-response",
      handleNavigationModal
    );

    return () => {
      recorderEventBus?.off(
        "multiplayer-debug-session-response",
        handleNavigationModal
      );
    };
  }, []);

  useEffect(() => {
    window["mpSessionDebuggerMetadata"] = {
      userName: userName,
    };
  }, [userName]);

  return (
    <TimeTravelProvider>
      <div className="mtt-app">
        <SidePanel />
        <Board />
        <NavigationModal
          isOpen={isNavigationModalOpen}
          onClose={() => setIsNavigationModalOpen(false)}
        />
        <Sandbox
          isOpen={isSandboxOpen}
          onClose={() => setIsSandboxOpen(false)}
        />
        <DebuggerLabel />
      </div>
    </TimeTravelProvider>
  );
}

export default App;
