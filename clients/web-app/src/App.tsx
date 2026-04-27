import Modal from 'react-modal'
import { useEffect, useRef, useState } from 'react'
import SessionRecorder, { UserType } from '@multiplayer-app/session-recorder-react'
import Board from 'components/Board'
import Sandbox from 'components/Sandbox'
import SidePanel from 'components/SidePanel'
import DebuggerLabel from 'components/DebuggerLabel'
import { ToastProvider } from 'contexts/ToastContext'
import { TimeTravelProvider } from 'contexts/TimeTravelContext'
import { useAnonymousTimeTravelerName } from 'hooks/useAnonymousTimeTravelerName'
import { isSandboxClosed } from 'utils/sandboxHelper'
import './App.scss'



// Required for accessibility
Modal.setAppElement('#root')

localStorage.removeItem('mp-recorder-button-position')

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false)
  const userName = useAnonymousTimeTravelerName()

  const widgetLockApplied = useRef(false)

  useEffect(() => {
    const dismissed = isSandboxClosed()
    setIsSandboxOpen(!dismissed)
  }, [])

  useEffect(() => {
    if (widgetLockApplied.current) return

    const el = SessionRecorder?.sessionWidgetButtonElement
    if (!el) return

    const root = el.getRootNode()
    if (!(root instanceof ShadowRoot)) return

    widgetLockApplied.current = true

    const style = document.createElement('style')
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
    `
    root.appendChild(style)
  })

  useEffect(() => {
    if (userName) {
      SessionRecorder.setUserAttributes({
        userName: userName,
        type: UserType.USER
      })
    }
  }, [userName])

  return (
    <div className='mtt-app'>
      <SidePanel />
      <Board />
      <Sandbox isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
      <DebuggerLabel />
    </div>
  )
}

const AppLayout = () => {
  return (
    <ToastProvider>
      <TimeTravelProvider>
        <App />
      </TimeTravelProvider>
    </ToastProvider>
  )
}

export default AppLayout
