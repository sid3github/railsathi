import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { JourneyProgress } from '../components/JourneyProgress'
import { useTranslation } from '../i18n/useTranslation'

export function JourneyLayout() {
  const { t } = useTranslation()
  return (
    <div className="app-shell journey-shell">
      <Header compact />
      <main className="journey-main" id="main">
        <div className="journey-topline">
          <Link className="back-link" to="/">
            <ArrowLeft size={17} aria-hidden="true" /> {t('journey.back')}
          </Link>
          <span className="demo-pill">
            <Sparkles size={14} aria-hidden="true" /> {t('journey.demoPill')}
          </span>
        </div>
        <JourneyProgress />
        <Outlet />
      </main>
    </div>
  )
}
