import { ArrowRight, CircleHelp, HeartHandshake, MoveRight, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import trainAvif1600 from '../assets/hero/train-1600.avif'
import trainAvif900 from '../assets/hero/train-900.avif'
import trainWebp1600 from '../assets/hero/train-1600.webp'
import trainWebp900 from '../assets/hero/train-900.webp'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'
import { formatPnr, validatePnr } from '../lib/pnr'
import { useJourney } from '../state/useJourney'

/** Matches the rendered width of .hero-train so the browser picks the smaller file on phones. */
const HERO_SIZES = '(max-width: 620px) 630px, min(835px, 67vw)'

export function HomeScreen() {
  const { t, number } = useTranslation()
  const { setPnr } = useJourney()
  const navigate = useNavigate()
  const [value, setValue] = useState(formatPnr(trip.pnr))
  const [error, setError] = useState<'empty' | 'format' | null>(null)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const result = validatePnr(value)
    if (!result.ok) {
      setError(result.reason)
      return
    }
    setError(null)
    setPnr(result.pnr)
    navigate('/journey')
  }

  const useDemo = () => {
    setError(null)
    setValue(formatPnr(trip.pnr))
    setPnr(trip.pnr)
    navigate('/journey')
  }

  return (
    <div className="app-shell home-shell">
      <Header />
      <main id="main">
        <section className="hero-section">
          <div className="hero-ambient" />
          <div className="hero-content">
            <h1>
              {t('home.title.line1')}
              <br />
              <em>{t('home.title.line2')}</em>
            </h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>

            <form className="search-card" onSubmit={onSubmit} noValidate>
              <div className="search-label">{t('home.search.label')}</div>
              <div className="search-row">
                <label className="pnr-field">
                  <span>{t('home.search.pnrLabel')}</span>
                  <input
                    value={value}
                    onChange={event => {
                      setValue(event.target.value)
                      if (error) setError(null)
                    }}
                    aria-label={t('home.search.pnrAria')}
                    aria-invalid={error !== null}
                    aria-describedby={error ? 'pnr-error' : 'pnr-hint'}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={14}
                  />
                </label>
                <button type="submit" className="primary-button search-button">
                  {t('home.search.submit')} <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
              {error ? (
                <p className="field-error" id="pnr-error" role="alert">
                  {t(error === 'empty' ? 'home.search.errorEmpty' : 'home.search.errorFormat')}
                </p>
              ) : (
                <p className="field-hint" id="pnr-hint">
                  {t('home.search.hint')}
                </p>
              )}
              <button type="button" className="demo-link" onClick={useDemo}>
                {t('home.search.demoLink')} <ArrowRight size={15} aria-hidden="true" />
              </button>
            </form>

            <p className="privacy-note">
              <ShieldCheck size={15} aria-hidden="true" /> {t('home.privacyNote')}
            </p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-meta">
              <span>{trip.from}</span>
              <i />
              <span>{trip.to}</span>
              <small>{t('format.tonightDistance', { km: number(trip.distanceKm) })}</small>
            </div>
            <picture>
              <source
                type="image/avif"
                srcSet={`${trainAvif900} 900w, ${trainAvif1600} 1600w`}
                sizes={HERO_SIZES}
              />
              <source
                type="image/webp"
                srcSet={`${trainWebp900} 900w, ${trainWebp1600} 1600w`}
                sizes={HERO_SIZES}
              />
              <img
                className="hero-train"
                src={trainWebp1600}
                alt=""
                width={1774}
                height={887}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </section>

        <section className="promise-section" id="how-it-works">
          <div className="promise-heading">
            <h2>
              {t('home.promise.title.line1')}
              <br />
              {t('home.promise.title.line2')}
            </h2>
            <p>{t('home.promise.lead')}</p>
          </div>
          <div className="promise-grid">
            <Promise icon={<CircleHelp />} title={t('home.promise.know.title')} text={t('home.promise.know.text')} />
            <Promise icon={<MoveRight />} title={t('home.promise.path.title')} text={t('home.promise.path.text')} />
            <Promise
              icon={<HeartHandshake />}
              title={t('home.promise.certainty.title')}
              text={t('home.promise.certainty.text')}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Promise({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="promise-card">
      <span className="promise-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}
