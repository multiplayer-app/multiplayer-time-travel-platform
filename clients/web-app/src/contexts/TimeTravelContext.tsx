import React, { createContext, ReactNode, useEffect, useState } from 'react'
import SessionRecorder, { recorderEventBus } from '@multiplayer-app/session-recorder-react'
import { getEpoch, getProminentPersons } from 'services'
import { Character } from 'utils/types'
import NavigationModal from 'components/NavigationModal'

const TimeTravelContext = createContext(undefined)

interface TimeTravelProviderProps {
  children: ReactNode
}

const getNavigationStoredUrl = () => {
  const storedUrl = localStorage.getItem('mp-navigation-url')
  if (!storedUrl || storedUrl === 'undefined') return null
  try {
    return JSON.parse(storedUrl)
  } catch (e) {
    console.error('Failed to parse stored navigation URL:', e)
    return null
  }
}

export const TimeTravelProvider: React.FC<TimeTravelProviderProps> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null)
  const [question, setQuestion] = useState(null)
  const [navigationUrl, setNavigationUrl] = useState(getNavigationStoredUrl())
  const [recordingState, setRecordingState] = useState(SessionRecorder?.sessionState)
  const [isManuallyStopped, setIsManuallyStopped] = useState(false)
  const [isNavigationModalOpen, setIsNavigationModalOpen] = useState(false)

  useEffect(() => {
    getEpoch()
  }, [])

  useEffect(() => {
    // Make requests to generate traces
    if (selectedCharacter) {
      getProminentPersons()
    }
  }, [selectedCharacter])

  useEffect(() => {
    const handleSetUrl = (url: string) => {
      if (!url) return
      setNavigationUrl(url)
      localStorage.setItem('mp-navigation-url', url)
    }
    recorderEventBus?.on('debug-session:auto-created', handleSetUrl)

    return () => {
      recorderEventBus?.off('debug-session:auto-created', handleSetUrl)
    }
  }, [])

  useEffect(() => {
    const handleNavigationModal = () => {
      if (isManuallyStopped) {
        setIsManuallyStopped(false)
        return
      }
      if (navigationUrl) {
        setIsNavigationModalOpen(true)
      }
    }
    recorderEventBus?.on('debug-session-ready', handleNavigationModal)
    return () => {
      recorderEventBus?.off('debug-session-ready', handleNavigationModal)
    }
  }, [isManuallyStopped, setIsManuallyStopped])

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'MULTIPLAYER_SESSION_DEBUGGER_LIB') {
        const { action, payload } = event.data
        if (action === 'state-change') {
          setRecordingState(payload)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const value = {
    selectedCharacter,
    question,
    navigationUrl,
    recordingState,
    isManuallyStopped,
    setIsManuallyStopped,
    setSelectedCharacter,
    setQuestion,
    setNavigationUrl
  }

  return (
    <TimeTravelContext.Provider value={value}>
      {children}
      <NavigationModal
        navigationUrl={navigationUrl}
        isOpen={isNavigationModalOpen}
        onClose={() => setIsNavigationModalOpen(false)}
      />
    </TimeTravelContext.Provider>
  )
}

export { TimeTravelContext }
