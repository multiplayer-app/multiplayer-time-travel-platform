import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import SessionRecorder, {
  recorderEventBus,
  UserType,
} from "@multiplayer-app/session-recorder-react";
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

localStorage.removeItem("mp-recorder-button-position");

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const userName = useAnonymousTimeTravelerName();
  const { isManuallyStopped, setIsManuallyStopped } = useTimeTravel();

  const widgetLockApplied = useRef(false);

  useEffect(() => {
    const dismissed = isSandboxClosed();
    setIsSandboxOpen(!dismissed);
  }, []);

  useEffect(() => {
    if (widgetLockApplied.current) return;

    const el = SessionRecorder?.sessionWidgetButtonElement;
    if (!el) return;

    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot)) return;

    widgetLockApplied.current = true;

    const style = document.createElement("style");
    style.textContent = `
      .mp-session-debugger-button {
        left: 24px !important;
        bottom: 24px !important;
        right: unset !important;
        top: unset !important;
        position: absolute !important;
        touch-action: none !important;
        border-radius: 36px 0 0 36px !important;
        z-index: 19 !important;
        transition: none !important;
      }
    `;
    root.appendChild(style);
  });

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
      handleNavigationModal,
    );

    return () => {
      recorderEventBus?.off(
        "multiplayer-debug-session-response",
        handleNavigationModal,
      );
    };
  }, [isManuallyStopped, setIsManuallyStopped]);

  useEffect(() => {
    if (userName) {
      SessionRecorder.setSessionAttributes({
        userName: userName,
        type: UserType.USER,
      });
    }
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
