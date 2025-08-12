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
import { useTimeTravel } from "hooks/useTimeTravel";
import "./App.scss";

// Required for accessibility
Modal.setAppElement("#root");

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(!isSandboxClosed());
  const userName = useAnonymousTimeTravelerName();
  const { isManuallyStopped, setIsManuallyStopped } = useTimeTravel();

  useEffect(() => {
    const handleNavigationModal = () => {
      if (isManuallyStopped) {
        setIsManuallyStopped(false);
        return;
      }
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
  }, [isManuallyStopped, setIsManuallyStopped]);

  useEffect(() => {
    window["mpSessionDebuggerMetadata"] = {
      userName: userName,
    };
  }, [userName]);

  return (
    <div className="mtt-app">
      <SidePanel />
      <Board />
      <NavigationModal
        isOpen={isNavigationModalOpen}
        onClose={() => setIsNavigationModalOpen(false)}
      />
      <Sandbox isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
      <DebuggerLabel />
    </div>
  );
}

const AppLayout = () => {
  return (
    <TimeTravelProvider>
      <App />
    </TimeTravelProvider>
  );
};

export default AppLayout;
