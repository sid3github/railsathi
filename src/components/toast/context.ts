import { createContext } from 'react'

export type ToastContextValue = {
  /** Announce a short, transient confirmation. Politely, via aria-live. */
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
