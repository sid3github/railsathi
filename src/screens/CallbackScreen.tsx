import { ArrowRight, Headphones, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import type { CallbackLanguage, CallbackTime } from '../state/journeyContext'
import { useJourney } from '../state/useJourney'

const TIMES: CallbackTime[] = ['now', 'hour', 'evening']
const LANGUAGES: CallbackLanguage[] = ['hindi', 'english']

export function CallbackScreen() {
  const { t } = useTranslation()
  const { callback, setCallback } = useJourney()
  const navigate = useNavigate()

  return (
    <section className="decision-layout">
      <div className="screen-title">
        <p className="overline">{t('callback.overline')}</p>
        <h1>
          {t('callback.title.line1')}
          <br />
          <em>{t('callback.title.line2')}</em>
        </h1>
        <p>{t('callback.lead')}</p>
      </div>

      <div className="decision-panel panel">
        <div className="selection-heading">
          <span className="action-icon" aria-hidden="true">
            <Headphones size={21} />
          </span>
          <div>
            <p className="overline">{t('callback.overline')}</p>
            <h2>{t('callback.panelTitle')}</h2>
          </div>
        </div>

        <fieldset className="choice-group">
          <legend>{t('callback.languageLabel')}</legend>
          <div className="choice-list">
            {LANGUAGES.map(option => (
              <label key={option} className={`choice ${callback.language === option ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="callback-language"
                  value={option}
                  checked={callback.language === option}
                  onChange={() => setCallback({ ...callback, language: option })}
                />
                <span>{t(`callback.language.${option}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="choice-group">
          <legend>{t('callback.timeLabel')}</legend>
          <div className="choice-list">
            {TIMES.map(option => (
              <label key={option} className={`choice ${callback.time === option ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="callback-time"
                  value={option}
                  checked={callback.time === option}
                  onChange={() => setCallback({ ...callback, time: option })}
                />
                <span>{t(`callback.time.${option}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="warning-row safe-row">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>{t('callback.safety')}</span>
        </p>

        <button
          type="button"
          className="primary-button full-button"
          onClick={() => navigate('/journey/callback/confirmed')}
        >
          {t('callback.confirm')} <ArrowRight size={17} aria-hidden="true" />
        </button>
        <Link className="change-button" to="/journey">
          {t('callback.back')}
        </Link>
      </div>
    </section>
  )
}
