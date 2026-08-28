import { TrainFront } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark">
          <TrainFront size={18} />
        </span>{' '}
        Rail<span>Sathi</span>
      </div>
      <p>{t('footer.tagline')}</p>
      <small>{t('footer.disclaimer')}</small>
    </footer>
  )
}
