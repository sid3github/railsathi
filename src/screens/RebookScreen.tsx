import { ArrowRight, Clock3, Luggage, TrainFront } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { alternatives, findTrain, trip } from '../data/journey'
import { useTranslation } from '../i18n/useTranslation'
import { useJourney } from '../state/useJourney'

/** How long the demo claims the seats are held. Static so every run reads alike. */
const HOLD_TIME = '09:43'

export function RebookScreen() {
  const { t, currency, duration } = useTranslation()
  const { selectedTrainId, setSelectedTrainId } = useJourney()
  const navigate = useNavigate()
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = findTrain(selectedTrainId)

  // A radiogroup is expected to move selection with the arrow keys, not Tab.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const current = alternatives.findIndex(option => option.id === selectedTrainId)
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const next = (current + (forward ? 1 : -1) + alternatives.length) % alternatives.length
    setSelectedTrainId(alternatives[next].id)
    optionRefs.current[next]?.focus()
  }

  return (
    <section className="review-layout">
      <div className="review-content">
        <div className="screen-title">
          <p className="overline">{t('rebook.overline')}</p>
          <h1>
            {t('rebook.title.line1')}
            <br />
            <em>{t('rebook.title.line2')}</em>
          </h1>
          <p>{t('rebook.lead')}</p>
        </div>

        <div className="alternative-list" role="radiogroup" aria-label={t('rebook.listLabel')} onKeyDown={onKeyDown}>
          {alternatives.map((option, index) => {
            const isSelected = option.id === selectedTrainId
            return (
              <button
                type="button"
                key={option.id}
                ref={node => {
                  optionRefs.current[index] = node
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                className={`alternative-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedTrainId(option.id)}
              >
                <span className="radio" aria-hidden="true">
                  <i />
                </span>
                <div className="alternative-main">
                  <span className="train-label">{t(`rebook.tag.${option.tag}`)}</span>
                  <strong>
                    {option.number} · {t(option.nameKey)}
                  </strong>
                  <div className="time-line">
                    <b>{option.departure}</b>
                    <span>
                      {duration(option.durationMinutes)}
                      <i aria-hidden="true" />
                    </span>
                    <b>
                      {option.arrival}
                      {option.arrivesNextDay && <small> {t('format.nextDay')}</small>}
                    </b>
                  </div>
                  <small>
                    {trip.from} → {trip.to} · {option.coach} · {option.berth}, {t(option.berthTypeKey)}
                  </small>
                </div>
                <div className="price-block">
                  <strong>
                    {option.fareDifference === 0
                      ? t('rebook.noExtra')
                      : t('rebook.extra', { amount: currency(option.fareDifference) })}
                  </strong>
                  <span>{t('rebook.fareProtected')}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <aside className="selection-panel" aria-label={t('rebook.panel.overline')}>
        <div className="selection-heading">
          <span className="action-icon" aria-hidden="true">
            <Luggage size={21} />
          </span>
          <div>
            <p className="overline">{t('rebook.panel.overline')}</p>
            <h3>{t('rebook.panel.title')}</h3>
          </div>
        </div>

        <div className="mini-route">
          <div>
            <b>{selected.departure}</b>
            <span>{t(`station.${trip.from}`)}</span>
          </div>
          <i aria-hidden="true" />
          <div>
            <b>
              {selected.arrival}
              {selected.arrivesNextDay && <small> {t('format.nextDay')}</small>}
            </b>
            <span>{t(`station.${trip.to}`)}</span>
          </div>
        </div>

        <div className="chosen-train">
          <TrainFront size={19} aria-hidden="true" />
          <p>
            <strong>{selected.number}</strong>
            <span>{t(selected.nameKey)}</span>
          </p>
        </div>

        <dl>
          <div>
            <dt>{t('rebook.panel.seat')}</dt>
            <dd>
              {selected.coach} · {selected.berth}, {t(selected.berthTypeKey)}
            </dd>
          </div>
          <div>
            <dt>{t('rebook.panel.amountDue')}</dt>
            <dd className="green">{currency(selected.fareDifference)}</dd>
          </div>
          <div>
            <dt>{t('rebook.panel.refundFrom')}</dt>
            <dd>{currency(trip.farePaid)}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="primary-button full-button"
          onClick={() => navigate('/journey/rebook/confirmed')}
        >
          {t('rebook.confirm')} <ArrowRight size={17} aria-hidden="true" />
        </button>
        <Link className="change-button" to="/journey">
          {t('rebook.back')}
        </Link>
        <p className="hold-time">
          <Clock3 size={14} aria-hidden="true" /> {t('rebook.hold', { time: HOLD_TIME })}
        </p>
      </aside>
    </section>
  )
}
