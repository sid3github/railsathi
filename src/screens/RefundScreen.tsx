import { AlertTriangle, ArrowRight, TrainFront, WalletCards } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { refundStages, trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'

export function RefundScreen() {
  const { t, currency, date } = useTranslation()
  const navigate = useNavigate()
  const expected = refundStages[refundStages.length - 1]

  return (
    <section className="decision-layout">
      <div className="screen-title">
        <p className="overline">{t('refund.overline')}</p>
        <h1>
          {t('refund.title.line1')}
          <br />
          <em>{t('refund.title.line2')}</em>
        </h1>
        <p>{t('refund.lead')}</p>
      </div>

      <div className="decision-panel panel">
        <div className="selection-heading">
          <span className="action-icon" aria-hidden="true">
            <WalletCards size={21} />
          </span>
          <div>
            <p className="overline">{t('refund.overline')}</p>
            <h2>{t('refund.summary.title')}</h2>
          </div>
        </div>

        <dl>
          <div>
            <dt>{t('refund.summary.amount')}</dt>
            <dd className="green">{currency(trip.farePaid)}</dd>
          </div>
          <div>
            <dt>{t('refund.summary.method')}</dt>
            <dd>{t('refund.summary.methodValue')}</dd>
          </div>
          <div>
            <dt>{t('refund.summary.fee')}</dt>
            <dd>{t('refund.summary.feeValue')}</dd>
          </div>
          <div>
            <dt>{t('refund.summary.arrives')}</dt>
            <dd>{date(trip.departureDate, expected.dayOffset)}</dd>
          </div>
        </dl>

        <p className="warning-row">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>{t('refund.warning')}</span>
        </p>

        <button
          type="button"
          className="primary-button full-button"
          onClick={() => navigate('/journey/refund/confirmed')}
        >
          {t('refund.confirm')} <ArrowRight size={17} aria-hidden="true" />
        </button>
        <Link className="secondary-button full-button spaced-button" to="/journey/rebook">
          <TrainFront size={16} aria-hidden="true" /> {t('refund.seeTrains')}
        </Link>
        <Link className="change-button" to="/journey">
          {t('refund.back')}
        </Link>
      </div>
    </section>
  )
}
