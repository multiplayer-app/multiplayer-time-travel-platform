import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './ToastContext.scss'

export type ToastVariant = 'success' | 'error'

export interface ShowToastOptions {
  /** Auto-dismiss after this many ms. Set to 0 to keep until dismissed. Default 4500. */
  durationMs?: number
}

export interface ToastItem {
  id: string
  variant: ToastVariant
  message: string
}

export interface ToastContextValue {
  showSuccess: (message: string, options?: ShowToastOptions) => void
  showError: (message: string, options?: ShowToastOptions) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION_MS = 4500

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

interface ToastProviderProps {
  children: ReactNode
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className='mtt-toast-viewport' aria-live='polite' aria-relevant='additions text'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`mtt-toast mtt-toast--${toast.variant}`}
          role={toast.variant === 'error' ? 'alert' : 'status'}
        >
          <span className='mtt-toast__message'>{toast.message}</span>
          <button
            type='button'
            className='mtt-toast__close'
            onClick={() => onDismiss(toast.id)}
            aria-label='Dismiss notification'
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const clearTimer = useCallback((id: string) => {
    const t = timersRef.current.get(id)
    if (t !== undefined) {
      clearTimeout(t)
      timersRef.current.delete(id)
    }
  }, [])

  const dismissToast = useCallback(
    (id: string) => {
      clearTimer(id)
      setToasts((prev) => prev.filter((t) => t.id !== id))
    },
    [clearTimer]
  )

  const pushToast = useCallback((variant: ToastVariant, message: string, options?: ShowToastOptions) => {
    const id = createId()
    const durationMs = options?.durationMs ?? DEFAULT_DURATION_MS

    setToasts((prev) => [...prev, { id, variant, message }])

    if (durationMs > 0) {
      const handle = setTimeout(() => {
        timersRef.current.delete(id)
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, durationMs)
      timersRef.current.set(id, handle)
    }
  }, [])

  const showSuccess = useCallback(
    (message: string, options?: ShowToastOptions) => {
      pushToast('success', message, options)
    },
    [pushToast]
  )

  const showError = useCallback(
    (message: string, options?: ShowToastOptions) => {
      pushToast('error', message, options)
    },
    [pushToast]
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      showSuccess,
      showError,
      dismissToast
    }),
    [showSuccess, showError, dismissToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export { ToastContext }
