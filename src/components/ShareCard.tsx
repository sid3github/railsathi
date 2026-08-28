import { MoveRight, UsersRound } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import { useToast } from './toast/useToast'

/**
 * Uses the platform share sheet where there is one — which on an Indian passenger's
 * phone usually means WhatsApp — and falls back to copying the link everywhere else.
 */
export function ShareCard() {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    showToast(t('toast.linkCopied'))
  }

  const share = async () => {
    const payload = {
      title: t('brand.name'),
      text: t('confirmed.share.body'),
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        return
      }
      await copyLink()
    } catch (error) {
      // Dismissing the share sheet is a choice, not a failure.
      if (error instanceof DOMException && error.name === 'AbortError') return
      try {
        await copyLink()
      } catch {
        showToast(t('toast.shareFailed'))
      }
    }
  }

  return (
    <div className="share-card">
      <div className="share-icon" aria-hidden="true">
        <UsersRound />
      </div>
      <div>
        <h3>{t('confirmed.share.title')}</h3>
        <p>{t('confirmed.share.body')}</p>
      </div>
      <button type="button" className="secondary-button" onClick={share}>
        {t('confirmed.share.cta')} <MoveRight size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
