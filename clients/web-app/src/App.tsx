import { useEffect, useState } from "react";
import { recorderEventBus } from "@multiplayer-app/session-debugger";
import SidePanel from "components/SidePanel";
import Board from "components/Board";
import NavigationModal from "components/NavigationModal";
import EmailModal from "components/EmailModal";
import { hasSubmittedEmail } from "utils/emailModalStorage";
import DebuggerLabel from "components/DebuggerLabel";
import { TimeTravelProvider } from "contexts/TimeTravelContext";
import { useAnonymousTimeTravelerName } from "hooks/useAnonymousTimeTravelerName";
import "./App.scss";

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(
    !hasSubmittedEmail()
  );
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
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
        <DebuggerLabel />
      </div>
    </TimeTravelProvider>
  );
}

export default App;
