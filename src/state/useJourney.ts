import { useContext } from 'react'
import { JourneyContext } from './journeyContext'

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) throw new Error('useJourney must be used inside a JourneyProvider')
  return context
}
