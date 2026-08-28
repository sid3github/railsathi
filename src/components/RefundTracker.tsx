import { Check } from 'lucide-react'
import { Fragment } from 'react'
import { refundStages, trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'

export function RefundTracker() {
  const { t, date } = useTranslation()

  return (
    <>
      <div className="refund-track" aria-hidden="true">
        {refundStages.map((stage, index) => (
          <Fragment key={stage.id}>
            {index > 0 && <i />}
            <span className={stage.complete ? 'done' : ''}>
              {stage.complete ? <Check size={12} /> : index + 1}
            </span>
          </Fragment>
        ))}
      </div>
      <ol className="refund-stages">
        {refundStages.map(stage => (
          <li key={stage.id}>
            {t(`refund.stage.${stage.id}`)}
            <br />
            <b>{date(trip.departureDate, stage.dayOffset)}</b>
          </li>
        ))}
      </ol>
    </>
  )
}
