import { createContext } from 'react'

export type CallbackTime = 'now' | 'hour' | 'evening'
export type CallbackLanguage = 'hindi' | 'english'

export type CallbackPreferences = {
  time: CallbackTime
  language: CallbackLanguage
}

export type JourneyContextValue = {
  pnr: string
  setPnr: (pnr: string) => void
  selectedTrainId: string
  setSelectedTrainId: (id: string) => void
  callback: CallbackPreferences
  setCallback: (preferences: CallbackPreferences) => void
}

export const JourneyContext = createContext<JourneyContextValue | null>(null)
