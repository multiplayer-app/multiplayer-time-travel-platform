import { useEffect, useState } from "react";
import { recorderEventBus } from "@multiplayer-app/session-debugger";
import SidePanel from "components/SidePanel";
import Board from "components/Board";
import NavigationModal from "components/NavigationModal";
import DebuggerLabel from "components/DebuggerLabel";
import { TimeTravelProvider } from "contexts/TimeTravelContext";
import "./App.scss";

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);

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
        <DebuggerLabel />
      </div>
    </TimeTravelProvider>
  );
}

export default App;
