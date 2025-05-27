import { useEffect, useState } from 'react';
import { recorderEventBus } from '@multiplayer-app/session-debugger';
import SidePanel from './components/SidePanel';
import Board from './components/Board';
import NavigationModal from './components/NavigationModal';
import EmailModal from './components/EmailModal';
import { hasSubmittedEmail } from 'utils/emailModalStorage';
import { TimeTravelProvider } from './contexts/TimeTravelContext';
import './App.scss';

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
