// Every value in this file is synthetic. The Build What Moves India brief requires
// mock data wherever a real system would hold personal information, payments, OTPs
// or government records, so nothing here touches a live railway service.

import type { TranslationKey } from '../i18n/dictionary'

export type StationCode = 'MMCT' | 'NDLS'

export type TrainOption = {
  id: string
  /** Indian Railways-style train number, synthetic. */
  number: string
  /** i18n key for the train's name. */
  nameKey: TranslationKey
  departure: string
  arrival: string
  /** Arrival falls on the day after departure. */
  arrivesNextDay: boolean
  durationMinutes: number
  tag: 'bestMatch' | 'fastest' | 'lowestFare'
  coach: string
  berth: string
  berthTypeKey: TranslationKey
  /** Rupees on top of the fare already paid. Zero means no extra charge. */
  fareDifference: number
}

export type RefundStage = {
  id: 'requested' | 'sentToBank' | 'expected'
  /** Days from today; drives the displayed date. */
  dayOffset: number
  complete: boolean
}

export const DEMO_PNR = '8634112789'

export const trip = {
  pnr: DEMO_PNR,
  passengerName: 'Anita',
  trainNumber: '12951',
  trainNameKey: 'train.12951',
  from: 'MMCT' as StationCode,
  to: 'NDLS' as StationCode,
  /** Departure date, ISO. Fixed so the demo reads the same for every judge. */
  departureDate: '2026-08-28',
  distanceKm: 1384,
  coach: 'B4',
  berth: '34',
  berthTypeKey: 'berth.lower',
  farePaid: 3480,
} as const

export const alternatives: TrainOption[] = [
  {
    id: '12909',
    number: '12909',
    nameKey: 'train.12909',
    departure: '16:55',
    arrival: '08:30',
    arrivesNextDay: true,
    durationMinutes: 935,
    tag: 'bestMatch',
    coach: 'B4',
    berth: '43',
    berthTypeKey: 'berth.lower',
    fareDifference: 0,
  },
  {
    id: '22209',
    number: '22209',
    nameKey: 'train.22209',
    departure: '23:15',
    arrival: '12:10',
    arrivesNextDay: true,
    durationMinutes: 775,
    tag: 'fastest',
    coach: 'B2',
    berth: '12',
    berthTypeKey: 'berth.sideLower',
    fareDifference: 340,
  },
  {
    id: '19019',
    number: '19019',
    nameKey: 'train.19019',
    departure: '00:20',
    arrival: '18:15',
    arrivesNextDay: true,
    durationMinutes: 1075,
    tag: 'lowestFare',
    coach: 'S3',
    berth: '56',
    berthTypeKey: 'berth.middle',
    fareDifference: 0,
  },
]

export const refundStages: RefundStage[] = [
  { id: 'requested', dayOffset: 0, complete: true },
  { id: 'sentToBank', dayOffset: 1, complete: true },
  { id: 'expected', dayOffset: 4, complete: false },
]

export const RECOMMENDED_TRAIN_ID = '12909'

export function findTrain(id: string): TrainOption {
  return alternatives.find(option => option.id === id) ?? alternatives[0]
}
