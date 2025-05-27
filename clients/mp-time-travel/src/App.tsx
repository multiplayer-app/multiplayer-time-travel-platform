import { useEffect, useState } from 'react';
import debuggerInstance, { recorderEventBus } from '@multiplayer-app/session-debugger';
import SidePanel from './components/SidePanel';
import Board from './components/Board';
import NavigationModal from './components/NavigationModal';
import EmailModal from './components/EmailModal';
import { hasSubmittedEmail } from 'utils/emailModalStorage';
import { TimeTravelProvider } from './contexts/TimeTravelContext';
import './App.scss';

debuggerInstance.init({
  version: process.env.REACT_APP_SERVICE_VERSION,
  application: process.env.REACT_APP_SERVICE_NAME,
  environment: process.env.REACT_APP_PLATFORM_ENV,
  apiKey: process.env.REACT_APP_SESSION_DEBUGGER_KEY,
  ...(process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL
    ? { exporterApiBaseUrl: process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL }
    : {}),
  canvasEnabled: true,
  showWidget: true,
  ignoreUrls: [
    /https:\/\/cdn\.jsdelivr\.net\/.*/,
    /https:\/\/bam\.nr-data\.net\/.*/,
    /posthog\.com.*/,
    /https:\/\/pixel\.source\.app\/.*/
  ],
  propagateTraceHeaderCorsUrls: [process.env.REACT_APP_BASE_API_URL],
  schemifyDocSpanPayload: true,
  maskDebSpanPayload: false,
  docTraceRatio: Number(process.env.REACT_APP_OTLP_MULTIPLAYER_DOC_SPAN_RATIO) || 0.05,
  sampleTraceRatio: Number(process.env.REACT_APP_OTLP_MULTIPLAYER_SPAN_RATIO) || 0.04,
  maxCapturingHttpPayloadSize: 100000,
  disableCapturingHttpPayload: false
});

function App() {
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(!hasSubmittedEmail());
  const [navigationUrl, setNavigationUrl] = useState({});

  useEffect(() => {
    recorderEventBus?.on('multiplayer-debug-session-response', (res) => {
      setNavigationUrl(res?.url);
      setIsNavigationModalOpen(true);
    });

    return recorderEventBus?.off('multiplayer-debug-session-response');
  }, []);

  return (
    <TimeTravelProvider>
      <div className='mtt-app'>
        <SidePanel />
        <Board />
        <NavigationModal isOpen={isNavigationModalOpen} url={navigationUrl} onClose={() => setIsNavigationModalOpen(false)} />
        <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
      </div>
    </TimeTravelProvider>
  );
}

export default App;
