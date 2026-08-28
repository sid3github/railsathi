import { ArrowRight, Info, ShieldCheck } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'
import { Modal } from './Modal'

export function DisruptionModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  return (
    <Modal labelledBy="disruption-modal-title" onClose={onClose}>
      <span className="modal-icon" aria-hidden="true">
        <Info />
      </span>
      <p className="overline">{t('modal.overline')}</p>
      <h2 id="disruption-modal-title">{t('modal.title')}</h2>
      <p>{t('modal.body')}</p>
      <div className="modal-note">
        <ShieldCheck size={18} aria-hidden="true" />
        <span>
          <strong>{t('modal.noteTitle')}</strong>
          {t('modal.noteBody')}
        </span>
      </div>
      <button type="button" className="primary-button full-button" onClick={onClose}>
        {t('modal.cta')} <ArrowRight size={17} aria-hidden="true" />
      </button>
    </Modal>
  )
}
