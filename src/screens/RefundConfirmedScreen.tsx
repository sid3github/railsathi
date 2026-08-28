import { ArrowLeft, Check, CheckCircle2, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RefundTracker } from '../components/RefundTracker'
import { ShareCard } from '../components/ShareCard'
import { trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'

export function RefundConfirmedScreen() {
  const { t, currency } = useTranslation()

  return (
    <section className="confirmed-screen">
      <div className="confirmation-mark" aria-hidden="true">
        <Check />
      </div>
      <p className="overline">{t('refund.confirmed.overline')}</p>
      <h1>
        {t('refund.confirmed.title.line1')}
        <br />
        <em>{t('refund.confirmed.title.line2', { name: t('passenger.name') })}</em>
      </h1>
      <p className="confirmation-lead">{t('refund.confirmed.lead')}</p>

      <article className="confirmed-card refund-card solo-card">
        <div className="card-top">
          <span>
            <IndianRupee size={18} aria-hidden="true" /> {t('refund.tracker')}
          </span>
          <CheckCircle2 size={21} aria-hidden="true" />
        </div>
        <h2>{t('refund.onItsWay', { amount: currency(trip.farePaid) })}</h2>
        <p>{t('refund.initiated')}</p>
        <RefundTracker />
      </article>

      <ShareCard />

      <Link className="back-link centered-link" to="/">
        <ArrowLeft size={17} aria-hidden="true" /> {t('confirmed.startOver')}
      </Link>
    </section>
  )
}
