import { useMemo, useState, type ReactNode } from 'react'
import { DEMO_PNR, RECOMMENDED_TRAIN_ID } from '../data/journey'
import { JourneyContext, type CallbackPreferences } from './journeyContext'

const DEFAULT_CALLBACK: CallbackPreferences = { time: 'now', language: 'hindi' }

/**
 * Journey choices live here rather than in the URL so the flow stays readable, but
 * every value has a sensible default. That means a deep link someone was sent — say
 * straight to the confirmation screen — still renders a complete, coherent plan.
 */
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [pnr, setPnr] = useState(DEMO_PNR)
  const [selectedTrainId, setSelectedTrainId] = useState(RECOMMENDED_TRAIN_ID)
  const [callback, setCallback] = useState<CallbackPreferences>(DEFAULT_CALLBACK)

  const value = useMemo(
    () => ({ pnr, setPnr, selectedTrainId, setSelectedTrainId, callback, setCallback }),
    [pnr, selectedTrainId, callback],
  )

  return <JourneyContext value={value}>{children}</JourneyContext>
}
