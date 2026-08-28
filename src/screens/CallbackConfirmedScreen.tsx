import { ArrowLeft, ArrowRight, Check, Headphones, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { useJourney } from '../state/useJourney'

export function CallbackConfirmedScreen() {
  const { t } = useTranslation()
  const { callback } = useJourney()

  return (
    <section className="confirmed-screen">
      <div className="confirmation-mark" aria-hidden="true">
        <Check />
      </div>
      <p className="overline">{t('callback.confirmed.overline')}</p>
      <h1>
        {t('callback.confirmed.title.line1')}
        <br />
        <em>{t('callback.confirmed.title.line2', { name: t('passenger.name') })}</em>
      </h1>
      <p className="confirmation-lead">{t('callback.confirmed.lead')}</p>

      <article className="confirmed-card solo-card">
        <div className="card-top">
          <span>
            <Headphones size={18} aria-hidden="true" /> {t('callback.overline')}
          </span>
          <Check size={21} aria-hidden="true" />
        </div>
        <h3>
          {t('callback.confirmed.detail', {
            time: t(`callback.time.${callback.time}`).toLowerCase(),
            language: t(`callback.language.${callback.language}`),
          })}
        </h3>
        <p>{t('callback.confirmed.nothing')}</p>
        <p className="warning-row safe-row">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>{t('callback.safety')}</span>
        </p>
        <Link className="text-button" to="/journey/rebook">
          {t('callback.confirmed.changeMind')} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </article>

      <Link className="back-link centered-link" to="/">
        <ArrowLeft size={17} aria-hidden="true" /> {t('confirmed.startOver')}
      </Link>
    </section>
  )
}
