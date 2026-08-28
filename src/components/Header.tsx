import { Headphones, Languages, Menu, TrainFront, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LANGUAGE_LABEL } from '../i18n/dictionary'
import { useTranslation } from '../i18n/useTranslation'

export function Header({ compact = false }: { compact?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, language, setLanguage } = useTranslation()
  const close = () => setMenuOpen(false)

  return (
    <header className={`site-header ${compact ? 'compact-header' : ''}`}>
      <Link className="brand" to="/" aria-label={t('brand.homeAria')} onClick={close}>
        <span className="brand-mark">
          <TrainFront size={20} />
        </span>
        <span>
          Rail<span>Sathi</span>
        </span>
      </Link>

      <nav className={menuOpen ? 'nav-open' : ''} aria-label={t('nav.myJourney')}>
        <NavLink to="/journey" onClick={close}>
          {t('nav.myJourney')}
        </NavLink>
        <Link to="/#how-it-works" onClick={close}>
          {t('nav.howItWorks')}
        </Link>
        <NavLink to="/journey/callback" onClick={close}>
          {t('nav.helpCentre')}
        </NavLink>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="language-toggle"
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          aria-label={t('nav.changeLanguage')}
        >
          <Languages size={16} /> {LANGUAGE_LABEL[language]}
        </button>
        <Link className="help-button" to="/journey/callback" onClick={close}>
          <Headphones size={16} /> <span>{t('nav.needHelp')}</span>
        </Link>
        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('nav.toggleMenu')}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
