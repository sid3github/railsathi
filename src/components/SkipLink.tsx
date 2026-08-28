import { useTranslation } from '../i18n/useTranslation'

export function SkipLink() {
  const { t } = useTranslation()
  return (
    <a className="skip-link" href="#main">
      {t('nav.skipToContent')}
    </a>
  )
}
