import debuggerInstance from "@multiplayer-app/session-debugger";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

debuggerInstance.init({
  version: process.env.REACT_APP_SERVICE_VERSION,
  application: process.env.REACT_APP_SERVICE_NAME,
  environment: process.env.REACT_APP_PLATFORM_ENV,
  apiKey: process.env.REACT_APP_SESSION_DEBUGGER_KEY,
  ...(process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL
    ? {
        exporterApiBaseUrl: process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL,
      }
    : {}),
  canvasEnabled: true,
  showWidget: true,
  ignoreUrls: [
    /https:\/\/cdn\.jsdelivr\.net\/.*/,
    /https:\/\/bam\.nr-data\.net\/.*/,
    /posthog\.com.*/,
    /https:\/\/pixel\.source\.app\/.*/,
  ],
  propagateTraceHeaderCorsUrls: [process.env.REACT_APP_BASE_API_URL],
  schemifyDocSpanPayload: true,
  maskDebSpanPayload: false,
  docTraceRatio:
    Number(process.env.REACT_APP_OTLP_MULTIPLAYER_DOC_SPAN_RATIO) || 0.05,
  sampleTraceRatio:
    Number(process.env.REACT_APP_OTLP_MULTIPLAYER_SPAN_RATIO) || 0.04,
  maxCapturingHttpPayloadSize: 100000,
  disableCapturingHttpPayload: false,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
