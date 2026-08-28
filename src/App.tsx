import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, BadgeCheck, BellRing, CalendarDays, Check, CheckCircle2,
  CircleHelp, Clock3, Headphones, HeartHandshake, IndianRupee, Info, Languages,
  Luggage, Menu, MoveRight, ShieldCheck, Sparkles, Ticket, TrainFront, UserRound,
  UsersRound, WalletCards, X,
} from 'lucide-react'
import heroTrain from './assets/indian-express-hero-v2.png'
import './App.css'

type Screen = 'home' | 'options' | 'review' | 'confirmed'

const trip = {
  pnr: '8634 112 789', train: '12951 · Mumbai Rajdhani', from: 'Mumbai Central',
  fromCode: 'MMCT', to: 'New Delhi', toCode: 'NDLS', date: '28 Aug 2026', coach: 'B4 · 34, Lower',
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [language, setLanguage] = useState<'EN' | 'हि'>('EN')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState('12909 · Mumbai–New Delhi Garib Rath')
  const [showDetails, setShowDetails] = useState(false)
  const isHindi = language === 'हि'

  const startJourney = () => { setScreen('options'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const goHome = () => { setScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  if (screen === 'home') return <div className="app-shell home-shell">
    <Header language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onPlan={startJourney} />
    <main>
      <section className="hero-section">
        <div className="hero-ambient" />
        <div className="hero-content">
          <h1>Travel plans change.<br /><em>Your certainty shouldn’t.</em></h1>
          <p className="hero-subtitle">A clear, personal plan for delays, cancellations and missed connections—before the confusion begins.</p>
          <div className="search-card">
            <div className="search-label">Find your travel plan</div>
            <div className="search-row"><label className="pnr-field"><span>Enter a PNR</span><input aria-label="PNR number" defaultValue="8634 112 789" inputMode="numeric" /></label><button className="primary-button search-button" onClick={startJourney}>View my plan <ArrowRight size={18} /></button></div>
            <button className="demo-link" onClick={startJourney}>Use the demo journey <ArrowRight size={15} /></button>
          </div>
          <p className="privacy-note"><ShieldCheck size={15} /> No login, password, OTP or payment details.</p>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="hero-visual-meta"><span>MMCT</span><i /><span>NDLS</span><small>Tonight · 1,384 km</small></div><img className="hero-train" src={heroTrain} alt="" /></div>
      </section>
      <section className="promise-section"><div className="promise-heading"><h2>One disruption.<br />One clear next step.</h2><p>RailSathi translates uncertainty into a plan you can understand in a glance.</p></div><div className="promise-grid"><Promise icon={<CircleHelp />} title="Know what changed" text="Plain-language updates, not railway jargon." /><Promise icon={<MoveRight />} title="See the best path" text="Every option, cost and trade-off in one view." /><Promise icon={<HeartHandshake />} title="Leave with certainty" text="Rebook, follow a refund or share a travel plan." /></div></section>
    </main><Footer />
  </div>

  return <div className="app-shell journey-shell">
    <Header compact language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onPlan={() => setScreen('options')} />
    <main className="journey-main"><div className="journey-topline"><button className="back-link" onClick={goHome}><ArrowLeft size={17} /> All journeys</button><span className="demo-pill"><Sparkles size={14} /> {isHindi ? 'डेमो यात्रा' : 'Demo journey'} · synthetic data</span></div><JourneyProgress screen={screen} />
      {screen === 'options' && <OptionsScreen language={language} onContinue={() => { setScreen('review'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} onDetails={() => setShowDetails(true)} />}
      {screen === 'review' && <ReviewScreen selectedTrain={selectedTrain} setSelectedTrain={setSelectedTrain} onBack={() => setScreen('options')} onConfirm={() => { setScreen('confirmed'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
      {screen === 'confirmed' && <ConfirmedScreen onHome={goHome} />}
    </main>{showDetails && <DetailsModal onClose={() => setShowDetails(false)} />}
  </div>
}

function Header({ compact = false, language, setLanguage, menuOpen, setMenuOpen, onPlan }: { compact?: boolean, language: 'EN' | 'हि', setLanguage: (language: 'EN' | 'हि') => void, menuOpen: boolean, setMenuOpen: (open: boolean) => void, onPlan: () => void }) {
  return <header className={`site-header ${compact ? 'compact-header' : ''}`}><button className="brand" onClick={onPlan} aria-label="RailSathi home"><span className="brand-mark"><TrainFront size={20} /></span><span>Rail<span>Sathi</span></span></button><nav className={menuOpen ? 'nav-open' : ''}><button onClick={onPlan}>My journey</button><button onClick={onPlan}>How it works</button><button onClick={onPlan}>Help centre</button></nav><div className="header-actions"><button className="language-toggle" onClick={() => setLanguage(language === 'EN' ? 'हि' : 'EN')} aria-label="Change language"><Languages size={16} /> {language}</button><button className="help-button" onClick={onPlan}><Headphones size={16} /> <span>Need help?</span></button><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></div></header>
}

function Promise({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) { return <article className="promise-card"><span className="promise-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article> }

function JourneyProgress({ screen }: { screen: Screen }) { const current = screen === 'options' ? 1 : screen === 'review' ? 2 : 3; const steps = ['Understand', 'Choose', 'Travel easy']; return <div className="progress-wrap" aria-label="Journey progress">{steps.map((step, index) => <div className={`progress-step ${index + 1 <= current ? 'active' : ''} ${index + 1 < current ? 'complete' : ''}`} key={step}><span>{index + 1 < current ? <Check size={14} /> : index + 1}</span><p>{step}</p></div>)}</div> }

function OptionsScreen({ language, onContinue, onDetails }: { language: 'EN' | 'हि', onContinue: () => void, onDetails: () => void }) { return <>
  <section className="trip-summary panel"><div className="trip-head"><div><p className="overline">Your journey</p><h2>{trip.train}</h2></div><span className="live-chip"><i /> Journey update</span></div><div className="route-row"><div><strong>{trip.fromCode}</strong><span>{trip.from}</span></div><div className="route-line"><TrainFront size={18} /><i /></div><div className="route-destination"><strong>{trip.toCode}</strong><span>{trip.to}</span></div></div><div className="trip-meta"><span><CalendarDays size={15} /> {trip.date}</span><span><UserRound size={15} /> {trip.coach}</span><span><Ticket size={15} /> PNR {trip.pnr}</span></div></section>
  <section className="disruption-card"><div className="disruption-icon"><BellRing size={23} /></div><div><p className="overline warning-overline">Your plan needs attention</p><h1>Your train has been <em>cancelled.</em></h1><p className="disruption-copy">We know this is frustrating. The good news: your fare is protected and you have a few simple ways to keep moving.</p><button className="text-button" onClick={onDetails}>Why was it cancelled? <ArrowRight size={15} /></button></div></section>
  <section className="action-section"><div className="section-heading"><div><p className="overline">Your best next step</p><h2>Choose what works for you</h2></div><span className="choice-note"><Sparkles size={15} /> Based on your travel date</span></div><div className="action-grid"><article className="action-card featured-card"><div className="recommend-chip">Recommended</div><span className="action-icon"><TrainFront /></span><h3>Find another train</h3><p>Reach Delhi today with reserved seats on nearby departures.</p><ul><li><CheckCircle2 size={16} /> 3 options with seats available</li><li><CheckCircle2 size={16} /> No change fee on this journey</li></ul><button className="primary-button full-button" onClick={onContinue}>See train options <ArrowRight size={17} /></button></article><article className="action-card"><span className="action-icon quiet"><WalletCards /></span><h3>Take a full refund</h3><p>Cancel this trip and get your fare back to the original payment method.</p><ul><li><CheckCircle2 size={16} /> ₹3,480 refund initiated now</li><li><CheckCircle2 size={16} /> Usually arrives in 3–5 days</li></ul><button className="secondary-button full-button" onClick={onContinue}>Track my refund <ArrowRight size={17} /></button></article><article className="action-card"><span className="action-icon quiet"><Headphones /></span><h3>Talk it through</h3><p>Get a call from a travel support guide who can help you decide.</p><ul><li><CheckCircle2 size={16} /> Hindi and English support</li><li><CheckCircle2 size={16} /> No PNR or OTP on a call</li></ul><button className="secondary-button full-button" onClick={() => alert('Demo: a travel guide will call Anita in 5 minutes.')}>Request a callback <ArrowRight size={17} /></button></article></div></section>
  <section className="reassurance-row"><ShieldCheck size={21} /><p><strong>This is a safe demo.</strong> All journey details, seat availability and refunds shown here are synthetic. RailSathi never asks for your password, OTP or bank details.</p></section><p className="language-note">Prefer {language === 'EN' ? 'Hindi' : 'English'}? <button>{language === 'EN' ? 'भाषा बदलें' : 'Switch language'}</button></p>
</> }

function ReviewScreen({ selectedTrain, setSelectedTrain, onBack, onConfirm }: { selectedTrain: string, setSelectedTrain: (value: string) => void, onBack: () => void, onConfirm: () => void }) {
  const options = [{ train: '12909 · Mumbai–New Delhi Garib Rath', dep: '16:55', arr: '08:30', duration: '15h 35m', tag: 'Best match', seats: 'B4 · 43, Lower', price: '₹0 extra' }, { train: '22209 · Mumbai–New Delhi Duronto', dep: '23:15', arr: '12:10', duration: '12h 55m', tag: 'Fastest', seats: 'B2 · 12, Side lower', price: '+ ₹340' }, { train: '19019 · Dehradun Express', dep: '00:20', arr: '18:15', duration: '17h 55m', tag: 'Lowest fare', seats: 'S3 · 56, Middle', price: '₹0 extra' }]
  return <section className="review-layout"><div className="review-content"><div className="screen-title"><p className="overline">A simpler way forward</p><h1>Here are your best<br /><em>ways to Delhi.</em></h1><p>We’ve held three seats for the next 10 minutes. Choose the journey that feels right.</p></div><div className="alternative-list">{options.map(option => <button className={`alternative-card ${selectedTrain === option.train ? 'selected' : ''}`} onClick={() => setSelectedTrain(option.train)} key={option.train}><span className="radio"><i /></span><div className="alternative-main"><span className="train-label">{option.tag}</span><strong>{option.train}</strong><div className="time-line"><b>{option.dep}</b><span>{option.duration}<i /></span><b>{option.arr}</b></div><small>{trip.fromCode} → {trip.toCode} · {option.seats}</small></div><div className="price-block"><strong>{option.price}</strong><span>Fare protected</span></div></button>)}</div></div><aside className="selection-panel"><div className="selection-heading"><span className="action-icon"><Luggage size={21} /></span><div><p className="overline">Your new plan</p><h3>One last check</h3></div></div><div className="mini-route"><div><b>16:55</b><span>Mumbai Central</span></div><i /><div><b>08:30 <small>+1</small></b><span>New Delhi</span></div></div><div className="chosen-train"><TrainFront size={19} /><p><strong>{selectedTrain.split(' · ')[0]}</strong><span>{selectedTrain.split(' · ')[1]}</span></p></div><dl><div><dt>Your seat</dt><dd>B4 · 43, Lower</dd></div><div><dt>Amount due</dt><dd className="green">₹0</dd></div><div><dt>Refund from cancelled train</dt><dd>₹3,480</dd></div></dl><button className="primary-button full-button" onClick={onConfirm}>Confirm my new plan <ArrowRight size={17} /></button><button className="change-button" onClick={onBack}>Back to all choices</button><p className="hold-time"><Clock3 size={14} /> Seats held for 09:43</p></aside></section>
}

function ConfirmedScreen({ onHome }: { onHome: () => void }) { return <section className="confirmed-screen"><div className="confirmation-mark"><Check /></div><p className="overline">Your journey is sorted</p><h1>You’re all set,<br /><em>Anita.</em></h1><p className="confirmation-lead">Your new train and refund are confirmed. We’ve put everything you need in one calm place.</p><div className="confirmed-grid"><article className="confirmed-card itinerary-card"><div className="card-top"><span><TrainFront size={18} /> New journey</span><BadgeCheck size={22} /></div><h3>Garib Rath to New Delhi</h3><div className="journey-times"><div><b>16:55</b><span>Mumbai Central</span><small>Today, 28 Aug</small></div><i /><div><b>08:30 <small>+1</small></b><span>New Delhi</span><small>Tomorrow, 29 Aug</small></div></div><div className="seat-banner"><Ticket size={17} /><span>Your seat is <strong>B4 · 43, Lower</strong></span></div><button className="text-button">Save travel plan <ArrowRight size={15} /></button></article><article className="confirmed-card refund-card"><div className="card-top"><span><IndianRupee size={18} /> Refund tracker</span><CheckCircle2 size={21} /></div><h3>₹3,480 is on its way.</h3><p>Your refund for the cancelled train has been initiated to your original payment method.</p><div className="refund-track"><span className="done"><Check size={12} /></span><i /><span className="done"><Check size={12} /></span><i /><span>3</span></div><div className="refund-stages"><span>Requested<br /><b>Today</b></span><span>Sent to bank<br /><b>Tomorrow</b></span><span>Expected<br /><b>1 Sep</b></span></div><button className="text-button">View refund details <ArrowRight size={15} /></button></article></div><div className="share-card"><div className="share-icon"><UsersRound /></div><div><h3>Travelling with someone who worries?</h3><p>Send them a simple link with your new train details and live journey status.</p></div><button className="secondary-button" onClick={() => alert('Demo: a travel plan link was copied.')}>Share my plan <MoveRight size={16} /></button></div><button className="back-link centered-link" onClick={onHome}><ArrowLeft size={17} /> Start a different demo</button></section> }

function DetailsModal({ onClose }: { onClose: () => void }) { return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="details-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={onClose} aria-label="Close"><X /></button><span className="modal-icon"><Info /></span><p className="overline">Journey update</p><h2 id="modal-title">Why was this train cancelled?</h2><p>In this demo, the Mumbai Rajdhani was cancelled due to operational changes. In a real service, this message would explain the reason using verified railway information.</p><div className="modal-note"><ShieldCheck size={18} /><span><strong>What this means for you</strong>Your full fare is protected. You can rebook, take a refund, or ask for support.</span></div><button className="primary-button full-button" onClick={onClose}>Show my choices <ArrowRight size={17} /></button></div></div> }

function Footer() { return <footer><div className="footer-brand"><span className="brand-mark"><TrainFront size={18} /></span> Rail<span>Sathi</span></div><p>A clearer journey, from disruption to destination.</p><small>Independent concept prototype · Not affiliated with Indian Railways or IRCTC</small></footer> }

export default App
