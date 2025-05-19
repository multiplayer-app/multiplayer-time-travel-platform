import React from "react";
import debuggerInstance from "@multiplayer-app/session-debugger";
import SidePanel from "./components/SidePanel";
import Board from "./components/Board";
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
  return (
    <div className="mtt-app">
      <SidePanel />
      <Board />
    </div>
  );
}

export default App;
