import { ArrowRight, BellRing, CheckCircle2, Headphones, ShieldCheck, Sparkles, TrainFront, WalletCards } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DisruptionModal } from '../components/DisruptionModal'
import { TripSummary } from '../components/TripSummary'
import { alternatives, trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'

export function OptionsScreen() {
  const { t, currency } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <TripSummary />

      <section className="disruption-card">
        <div className="disruption-icon" aria-hidden="true">
          <BellRing size={23} />
        </div>
        <div>
          <p className="overline warning-overline">{t('options.disruption.overline')}</p>
          <h1>
            {t('options.disruption.title.lead')} <em>{t('options.disruption.title.emphasis')}</em>
          </h1>
          <p className="disruption-copy">{t('options.disruption.body')}</p>
          <button type="button" className="text-button" onClick={() => setShowDetails(true)}>
            {t('options.disruption.why')} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="action-section">
        <div className="section-heading">
          <div>
            <p className="overline">{t('options.heading.overline')}</p>
            <h2>{t('options.heading.title')}</h2>
          </div>
          <span className="choice-note">
            <Sparkles size={15} aria-hidden="true" /> {t('options.heading.note')}
          </span>
        </div>

        <div className="action-grid">
          <ActionCard
            featured
            icon={<TrainFront />}
            title={t('options.rebook.title')}
            body={t('options.rebook.body')}
            points={[
              t('options.rebook.point1', { count: alternatives.length }),
              t('options.rebook.point2'),
            ]}
            cta={t('options.rebook.cta')}
            to="/journey/rebook"
            recommendedLabel={t('options.recommended')}
          />
          <ActionCard
            icon={<WalletCards />}
            title={t('options.refund.title')}
            body={t('options.refund.body')}
            points={[
              t('options.refund.point1', { amount: currency(trip.farePaid) }),
              t('options.refund.point2'),
            ]}
            cta={t('options.refund.cta')}
            to="/journey/refund"
          />
          <ActionCard
            icon={<Headphones />}
            title={t('options.callback.title')}
            body={t('options.callback.body')}
            points={[t('options.callback.point1'), t('options.callback.point2')]}
            cta={t('options.callback.cta')}
            to="/journey/callback"
          />
        </div>
      </section>

      <section className="reassurance-row">
        <ShieldCheck size={21} aria-hidden="true" />
        <p>
          <strong>{t('options.safety.title')}</strong> {t('options.safety.body')}
        </p>
      </section>

      {showDetails && <DisruptionModal onClose={() => setShowDetails(false)} />}
    </>
  )
}

function ActionCard({
  icon,
  title,
  body,
  points,
  cta,
  to,
  featured = false,
  recommendedLabel,
}: {
  icon: ReactNode
  title: string
  body: string
  points: string[]
  cta: string
  to: string
  featured?: boolean
  recommendedLabel?: string
}) {
  return (
    <article className={`action-card ${featured ? 'featured-card' : ''}`}>
      {recommendedLabel && <div className="recommend-chip">{recommendedLabel}</div>}
      <span className={`action-icon ${featured ? '' : 'quiet'}`} aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
      <ul>
        {points.map(point => (
          <li key={point}>
            <CheckCircle2 size={16} aria-hidden="true" /> {point}
          </li>
        ))}
      </ul>
      <Link className={`${featured ? 'primary-button' : 'secondary-button'} full-button`} to={to}>
        {cta} <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  )
}
