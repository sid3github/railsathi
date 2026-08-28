import { CalendarDays, Ticket, TrainFront, UserRound } from 'lucide-react'
import { trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'
import { formatPnr } from '../lib/pnr'
import { useJourney } from '../state/useJourney'

export function TripSummary() {
  const { t, date } = useTranslation()
  const { pnr } = useJourney()

  return (
    <section className="trip-summary panel" aria-label={t('trip.overline')}>
      <div className="trip-head">
        <div>
          <p className="overline">{t('trip.overline')}</p>
          <h2>
            {trip.trainNumber} · {t(trip.trainNameKey)}
          </h2>
        </div>
        <span className="live-chip">
          <i aria-hidden="true" /> {t('trip.updateChip')}
        </span>
      </div>

      <div className="route-row">
        <div>
          <strong>{trip.from}</strong>
          <span>{t(`station.${trip.from}`)}</span>
        </div>
        <div className="route-line" aria-hidden="true">
          <TrainFront size={18} />
          <i />
        </div>
        <div className="route-destination">
          <strong>{trip.to}</strong>
          <span>{t(`station.${trip.to}`)}</span>
        </div>
      </div>

      <div className="trip-meta">
        <span>
          <CalendarDays size={15} aria-hidden="true" /> {date(trip.departureDate)}
        </span>
        <span>
          <UserRound size={15} aria-hidden="true" />{' '}
          {t('trip.coachLabel', {
            coach: trip.coach,
            berth: trip.berth,
            type: t(trip.berthTypeKey),
          })}
        </span>
        <span>
          <Ticket size={15} aria-hidden="true" /> {t('trip.pnrLabel', { pnr: formatPnr(pnr) })}
        </span>
      </div>
    </section>
  )
}
