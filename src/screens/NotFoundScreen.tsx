import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { useTranslation } from '../i18n/useTranslation'

export function NotFoundScreen() {
  const { t } = useTranslation()
  return (
    <div className="app-shell journey-shell">
      <Header compact />
      <main className="journey-main" id="main">
        <section className="message-screen">
          <span className="message-icon" aria-hidden="true">
            <Compass />
          </span>
          <p className="overline">{t('notFound.overline')}</p>
          <h1>{t('notFound.title')}</h1>
          <p className="confirmation-lead">{t('notFound.body')}</p>
          <Link className="primary-button" to="/">
            <ArrowLeft size={17} aria-hidden="true" /> {t('notFound.cta')}
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
