import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'

/** Shown by the error boundary, so it must not depend on router or journey state. */
export function ErrorScreen() {
  const { t } = useTranslation()
  return (
    <div className="app-shell journey-shell">
      <main className="journey-main" id="main">
        <section className="message-screen">
          <span className="message-icon warning-icon" aria-hidden="true">
            <TriangleAlert />
          </span>
          <p className="overline">{t('error.overline')}</p>
          <h1>{t('error.title')}</h1>
          <p className="confirmation-lead">{t('error.body')}</p>
          <button type="button" className="primary-button" onClick={() => window.location.reload()}>
            <RefreshCw size={16} aria-hidden="true" /> {t('error.cta')}
          </button>
        </section>
      </main>
    </div>
  )
}
