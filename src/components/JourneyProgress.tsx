import { Check } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { JOURNEY_STEPS, stepForPath } from '../lib/journeyStep'

export function JourneyProgress() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const current = stepForPath(pathname)

  return (
    <ol className="progress-wrap" aria-label={t('journey.progressLabel')}>
      {JOURNEY_STEPS.map((step, index) => {
        const position = index + 1
        const isComplete = position < current
        const isCurrent = position === current
        return (
          <li
            key={step}
            className={`progress-step ${position <= current ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span>{isComplete ? <Check size={14} aria-hidden="true" /> : position}</span>
            <p>{t(`journey.step.${step}`)}</p>
          </li>
        )
      })}
    </ol>
  )
}
