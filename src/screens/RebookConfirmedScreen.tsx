import { ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, IndianRupee, Ticket, TrainFront } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RefundTracker } from '../components/RefundTracker'
import { ShareCard } from '../components/ShareCard'
import { useToast } from '../components/toast/useToast'
import { findTrain, trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'
import { useJourney } from '../state/useJourney'

export function RebookConfirmedScreen() {
  const { t, currency, date } = useTranslation()
  const { selectedTrainId } = useJourney()
  const { showToast } = useToast()
  const train = findTrain(selectedTrainId)

  const savePlan = () => {
    try {
      localStorage.setItem(
        'railsathi.savedPlan',
        JSON.stringify({ train: train.number, coach: train.coach, berth: train.berth }),
      )
    } catch {
      // Saving is a convenience; a viewer who blocks site data still sees the plan.
    }
    showToast(t('toast.planSaved'))
  }

  return (
    <section className="confirmed-screen">
      <div className="confirmation-mark" aria-hidden="true">
        <Check />
      </div>
      <p className="overline">{t('confirmed.overline')}</p>
      <h1>
        {t('confirmed.title.line1')}
        <br />
        <em>{t('confirmed.title.line2', { name: trip.passengerName })}</em>
      </h1>
      <p className="confirmation-lead">{t('confirmed.lead')}</p>

      <div className="confirmed-grid">
        <article className="confirmed-card itinerary-card">
          <div className="card-top">
            <span>
              <TrainFront size={18} aria-hidden="true" /> {t('confirmed.newJourney')}
            </span>
            <BadgeCheck size={22} aria-hidden="true" />
          </div>
          <h3>{t(train.nameKey)}</h3>
          <div className="journey-times">
            <div>
              <b>{train.departure}</b>
              <span>{t(`station.${trip.from}`)}</span>
              <small>{date(trip.departureDate)}</small>
            </div>
            <i aria-hidden="true" />
            <div>
              <b>
                {train.arrival}
                {train.arrivesNextDay && <small> {t('format.nextDay')}</small>}
              </b>
              <span>{t(`station.${trip.to}`)}</span>
              <small>{date(trip.departureDate, train.arrivesNextDay ? 1 : 0)}</small>
            </div>
          </div>
          <div className="seat-banner">
            <Ticket size={17} aria-hidden="true" />
            <span>
              {t('confirmed.seatIs')}{' '}
              <strong>
                {train.coach} · {train.berth}, {t(train.berthTypeKey)}
              </strong>
            </span>
          </div>
          <button type="button" className="text-button" onClick={savePlan}>
            {t('confirmed.savePlan')} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </article>

        <article className="confirmed-card refund-card">
          <div className="card-top">
            <span>
              <IndianRupee size={18} aria-hidden="true" /> {t('refund.tracker')}
            </span>
            <CheckCircle2 size={21} aria-hidden="true" />
          </div>
          <h3>{t('refund.onItsWay', { amount: currency(trip.farePaid) })}</h3>
          <p>{t('refund.initiated')}</p>
          <RefundTracker />
          <Link className="text-button" to="/journey/refund/confirmed">
            {t('refund.viewDetails')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </article>
      </div>

      <ShareCard />

      <Link className="back-link centered-link" to="/">
        <ArrowLeft size={17} aria-hidden="true" /> {t('confirmed.startOver')}
      </Link>
    </section>
  )
}
