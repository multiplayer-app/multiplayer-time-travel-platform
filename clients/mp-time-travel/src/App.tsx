import React, { useEffect, useState } from "react";
import debuggerInstance, {
  recorderEventBus,
} from "@multiplayer-app/session-debugger";
import SidePanel from "./components/SidePanel";
import Board from "./components/Board";
import NavigationModal from "./components/NavigationModal";
import EmailModal from "./components/EmailModal";
import { hasSubmittedEmail } from "utils/emailModalStorage";
import "./App.scss";

debuggerInstance.init({
  version: "0.0.1",
  application: "multiplayer-web-app",
  environment: process.env.REACT_APP_PLATFORM_ENV,
  apiKey: process.env.REACT_APP_SESSION_DEBUGGER_KEY,
  exporterApiBaseUrl: process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL,
  canvasEnabled: true,
  showWidget: true,
  ignoreUrls: [
    /https:\/\/cdn\.jsdelivr\.net\/.*/,
    /https:\/\/bam\.nr-data\.net\/.*/,
    /posthog\.com.*/,
    /https:\/\/pixel\.source\.app\/.*/,
  ],
  propagateTraceHeaderCorsUrls: new RegExp(
    `${process.env.REACT_APP_API_BASE_URL}\.*`,
    "i"
  ),
  schemifyDocSpanPayload: true,
  maskDebSpanPayload: false,
  docTraceRatio: 0.3,
  sampleTraceRatio: 0.3,
  maxCapturingHttpPayloadSize: 100000,
  disableCapturingHttpPayload: false,
});

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(
    !hasSubmittedEmail()
  );
  const [navigationUrl, setNavigationUrl] = useState({});

  useEffect(() => {
    recorderEventBus?.on("multiplayer-debug-session-response", (res) => {
      setNavigationUrl(res?.url);
      setIsNavigationModalOpen(true);
    });

    return recorderEventBus?.off("multiplayer-debug-session-response");
  }, []);

  return (
    <div className="mtt-app">
      <SidePanel />
      <Board />
      <NavigationModal
        isOpen={isNavigationModalOpen}
        url={navigationUrl}
        onClose={() => setIsNavigationModalOpen(false)}
      />
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}

export default App;
