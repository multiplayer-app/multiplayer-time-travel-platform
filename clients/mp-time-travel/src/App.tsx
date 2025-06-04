import { useEffect, useState } from "react";
import { recorderEventBus } from "@multiplayer-app/session-debugger";
import SidePanel from "components/SidePanel";
import Board from "components/Board";
import NavigationModal from "components/NavigationModal";
import EmailModal from "components/EmailModal";
import DebuggerLabel from "components/DebuggerLabel";
import { hasSubmittedEmail } from "utils/emailModalStorage";
import { TimeTravelProvider } from "contexts/TimeTravelContext";
import "./App.scss";

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(
    !hasSubmittedEmail()
  );

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
