import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig.js'

// ─── Icônes SVG ──────────────────────────────────────────────────────────────

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>
  </svg>
)
const IconFilm = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
    <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
  </svg>
)
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconClapperboard = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.6l13.5-4c1-.3 2.1.3 2.5 1.3Z"/>
    <path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 3.9"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
  </svg>
)
const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const IconTrash = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconSettings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconLayout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
  </svg>
)
const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconAward = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
)
const IconHandshake = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
  </svg>
)
const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
)
const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const IconMousePointer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/>
  </svg>
)

// ─── Config Home par défaut ───────────────────────────────────────────────────

const DEFAULT_HOME_CONFIG = {
  hero: {
    enabled: true,
    title: 'MARS',
    titleHighlight: 'AI',
    subtitle: "L'intelligence artificielle au service de la création cinématographique. Découvrez une nouvelle ère de narration numérique.",
    subtitle_en: 'Artificial intelligence at the service of cinematic creation. Discover a new era of digital storytelling.',
    ctaPrimary: 'Commencer',
    ctaPrimary_en: 'Get Started',
    ctaSecondary: 'En savoir plus',
    ctaSecondary_en: 'Learn More',
  },
  categories: {
    enabled: true,
    items: [
      { title: 'SCI-FI',  title_en: 'SCI-FI',  desc: 'Exploration des futurs possibles.',  desc_en: 'Exploring possible futures.' },
      { title: 'HORREUR', title_en: 'HORROR',  desc: "Frissons garantis par l'IA.",        desc_en: 'AI-powered thrills guaranteed.' },
      { title: 'ACTION',  title_en: 'ACTION',  desc: 'Adrénaline et cinématiques.',        desc_en: 'Adrenaline and cinematics.' },
      { title: 'DRAME',   title_en: 'DRAMA',   desc: 'Émotions profondes et récits.',      desc_en: 'Deep emotions and narratives.' },
    ],
  },
  awards: {
    enabled: true,
    title: 'Reconnaissance & Awards',
    title_en: 'Recognition & Awards',
    stats: [
      { label: 'Prix à gagner', sub: 'Dotations mensuelles',   sub_en: 'Monthly grants' },
      { label: 'Global',        sub: 'Ouvert au monde entier',  sub_en: 'Open worldwide' },
      { label: 'AI Only',       sub: '100% généré par IA',      sub_en: '100% AI-generated' },
    ],
  },
  partners: {
    enabled: true,
    title: 'Nos Partenaires',
    subtitle: 'Ils font confiance à la plateforme',
    subtitle_en: 'They trust our platform',
  },
}

// ─── Composants utilitaires du modal ─────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative w-10 h-5 rounded-full transition-all cursor-pointer shrink-0 focus:outline-none"
    style={{ background: checked ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.12)' }}
  >
    <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
      style={{ left: checked ? '22px' : '2px' }} />
  </button>
)

const Field = ({ label, value, onChange, multiline = false, placeholder = '' }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
    {multiline ? (
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none resize-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
    )}
  </div>
)

// ─── Champ EN : même structure que Field, badge rouge EN dans le label ────────
const FieldEN = ({ label, value, onChange, multiline = false, placeholder = '' }) => (
  <div className="mb-3">
    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
      {label}
      <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>EN</span>
    </label>
    {multiline ? (
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none resize-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
        onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl text-white placeholder-white/20 focus:outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
        onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'} />
    )}
  </div>
)

const SectionHeader = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
    <span className="text-sm font-bold text-white">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: enabled ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
        {enabled ? 'Visible' : 'Masquée'}
      </span>
      <Toggle checked={enabled} onChange={onChange} />
    </div>
  </div>
)

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
    style={{
      background: active ? 'rgba(139,92,246,0.2)' : 'transparent',
      color: active ? '#c084fc' : 'rgba(255,255,255,0.35)',
      border: active ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
    }}>
    {children}
  </button>
)

// ─── ImageUpload ──────────────────────────────────────────────────────────────

const ImageUpload = ({ value, onChange, label = 'Image' }) => {
  const inputRef = useState(null)
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <IconImage /> {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="relative rounded-xl overflow-hidden transition-all"
        style={{ border: '1px dashed rgba(139,92,246,0.3)', background: 'rgba(255,255,255,0.03)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = value ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)'}
      >
        {value ? (
          <div className="relative group">
            <img src={value} alt={label} className="w-full h-28 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <label className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                style={{ background: 'rgba(139,92,246,0.7)', color: 'white' }}>
                <IconUpload /> Changer
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <button onClick={() => onChange('')} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                style={{ background: 'rgba(239,68,68,0.7)', color: 'white' }}>
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 py-5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
              <IconUpload />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Glissez une image ici</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>ou cliquez pour parcourir</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
    </div>
  )
}

// ─── Modal Configuration Home ─────────────────────────────────────────────────

const HomeConfigModal = ({ onClose }) => {
  const [config, setConfig] = useState(DEFAULT_HOME_CONFIG)
  const [activeTab, setActiveTab] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/admin/home-config')
        if (data?.config) setConfig({ ...DEFAULT_HOME_CONFIG, ...data.config })
      } catch {
        const local = localStorage.getItem('home_config')
        if (local) setConfig(JSON.parse(local))
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.post('/admin/home-config', { config })
    } catch {
      // fallback localStorage si pas d'API encore
    }
    localStorage.setItem('home_config', JSON.stringify(config))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const set = (section, value) => setConfig(prev => ({ ...prev, [section]: value }))

  const TABS = [
    { key: 'hero', icon: <IconLayout />, label: 'Hero' },
    { key: 'categories', icon: <IconGrid />, label: 'Catégories' },
    { key: 'awards', icon: <IconAward />, label: 'Awards' },
    { key: 'partners', icon: <IconHandshake />, label: 'Partenaires' },
  ]

  const activeSections = Object.values(config).filter(s => s.enabled).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #12122a 0%, #0f0f1e 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header — identique */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
              <IconSettings />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Configuration Home</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{activeSections} sections actives</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <IconX />
          </button>
        </div>

        {/* Tabs — identiques */}
        <div className="flex gap-1.5 px-6 py-3 shrink-0 overflow-x-auto" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)}>
              <span className="flex items-center gap-1.5">{t.icon}{t.label}</span>
            </TabBtn>
          ))}
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent' }}>

          {/* ── Hero ── */}
          {activeTab === 'hero' && (
            <div>
              <SectionHeader label="Section Hero" enabled={config.hero.enabled}
                onChange={v => set('hero', { ...config.hero, enabled: v })} />
              <div className={config.hero.enabled ? '' : 'opacity-30 pointer-events-none'}>
                {/* Titre + mot coloré : pas traduits (même texte) */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Titre principal" value={config.hero.title}
                    onChange={v => set('hero', { ...config.hero, title: v })} placeholder="MARS" />
                  <Field label="Mot en couleur (violet)" value={config.hero.titleHighlight}
                    onChange={v => set('hero', { ...config.hero, titleHighlight: v })} placeholder="AI" />
                </div>
                {/* Sous-titre FR puis EN */}
                <Field label="Sous-titre" value={config.hero.subtitle} multiline
                  onChange={v => set('hero', { ...config.hero, subtitle: v })} />
                <FieldEN label="Sous-titre" value={config.hero.subtitle_en ?? ''} multiline
                  onChange={v => set('hero', { ...config.hero, subtitle_en: v })}
                  placeholder="English subtitle..." />
                {/* Boutons FR + EN côte à côte */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bouton principal" value={config.hero.ctaPrimary}
                    onChange={v => set('hero', { ...config.hero, ctaPrimary: v })} placeholder="Commencer" />
                  <FieldEN label="Bouton principal" value={config.hero.ctaPrimary_en ?? ''}
                    onChange={v => set('hero', { ...config.hero, ctaPrimary_en: v })} placeholder="Get Started" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bouton secondaire" value={config.hero.ctaSecondary}
                    onChange={v => set('hero', { ...config.hero, ctaSecondary: v })} placeholder="En savoir plus" />
                  <FieldEN label="Bouton secondaire" value={config.hero.ctaSecondary_en ?? ''}
                    onChange={v => set('hero', { ...config.hero, ctaSecondary_en: v })} placeholder="Learn More" />
                </div>
                {/* Aperçu mini — identique */}
                <div className="mt-2 rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Aperçu</p>
                  <p className="text-lg font-black text-white">
                    {config.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">{config.hero.titleHighlight}</span>
                  </p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{config.hero.subtitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Catégories ── */}
          {activeTab === 'categories' && (
            <div>
              <SectionHeader label="Section Catégories" enabled={config.categories.enabled}
                onChange={v => set('categories', { ...config.categories, enabled: v })} />
              <div className={config.categories.enabled ? '' : 'opacity-30 pointer-events-none'}>
                <div className="space-y-2 mb-3">
                  {config.categories.items.map((item, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold" style={{ color: 'rgba(139,92,246,0.7)' }}>#{i + 1}</span>
                        <button onClick={() => {
                          const items = config.categories.items.filter((_, idx) => idx !== i)
                          set('categories', { ...config.categories, items })
                        }} className="ml-auto p-1 rounded-lg cursor-pointer transition-colors"
                          style={{ color: 'rgba(248,113,113,0.4)', background: 'transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.4)'; e.currentTarget.style.background = 'transparent' }}>
                          <IconTrash size={12} />
                        </button>
                      </div>
                      {/* Titre (pas traduit) + Description FR */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Titre</label>
                          <input value={item.title} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], title: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            Titre
                            <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>EN</span>
                          </label>
                          <input value={item.title_en ?? ''} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], title_en: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} placeholder="English title..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Description</label>
                          <input value={item.desc} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], desc: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            Description
                            <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>EN</span>
                          </label>
                          <input value={item.desc_en ?? ''} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], desc_en: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} placeholder="English description..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>
                      <ImageUpload
                        label="Image de la catégorie"
                        value={item.image || ''}
                        onChange={v => {
                          const items = [...config.categories.items]
                          items[i] = { ...items[i], image: v }
                          set('categories', { ...config.categories, items })
                        }}
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => set('categories', { ...config.categories, items: [...config.categories.items, { title: '', title_en: '', desc: '', desc_en: '' }] })}
                  className="w-full py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  style={{ border: '2px dashed rgba(139,92,246,0.25)', color: 'rgba(139,92,246,0.6)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'; e.currentTarget.style.background = 'rgba(139,92,246,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.background = 'transparent' }}>
                  <IconPlus /> Ajouter une catégorie
                </button>
              </div>
            </div>
          )}

          {/* ── Awards ── */}
          {activeTab === 'awards' && (
            <div>
              <SectionHeader label="Section Awards" enabled={config.awards.enabled}
                onChange={v => set('awards', { ...config.awards, enabled: v })} />
              <div className={config.awards.enabled ? '' : 'opacity-30 pointer-events-none'}>
                {/* Titre section FR + EN */}
                <Field label="Titre de la section" value={config.awards.title}
                  onChange={v => set('awards', { ...config.awards, title: v })} placeholder="Reconnaissance & Awards" />
                <FieldEN label="Titre de la section" value={config.awards.title_en ?? ''}
                  onChange={v => set('awards', { ...config.awards, title_en: v })} placeholder="Recognition & Awards" />
                <p className="text-xs mb-3 mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Statistiques affichées</p>
                <div className="space-y-2">
                  {config.awards.stats.map((stat, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Titre</label>
                          <input value={stat.label} onChange={e => {
                            const stats = [...config.awards.stats]
                            stats[i] = { ...stats[i], label: e.target.value }
                            set('awards', { ...config.awards, stats })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Sous-titre</label>
                          <input value={stat.sub} onChange={e => {
                            const stats = [...config.awards.stats]
                            stats[i] = { ...stats[i], sub: e.target.value }
                            set('awards', { ...config.awards, stats })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                      </div>
                      {/* Sous-titre EN */}
                      <div className="mb-2">
                        <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          Sous-titre
                          <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>EN</span>
                        </label>
                        <input value={stat.sub_en ?? ''} onChange={e => {
                          const stats = [...config.awards.stats]
                          stats[i] = { ...stats[i], sub_en: e.target.value }
                          set('awards', { ...config.awards, stats })
                        }} placeholder="English subtitle..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg text-white focus:outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                          onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.5)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(239,68,68,0.2)'} />
                      </div>
                      <ImageUpload
                        label="Icône / Illustration"
                        value={stat.image || ''}
                        onChange={v => {
                          const stats = [...config.awards.stats]
                          stats[i] = { ...stats[i], image: v }
                          set('awards', { ...config.awards, stats })
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Partenaires ── */}
          {activeTab === 'partners' && (
            <div>
              <SectionHeader label="Section Partenaires" enabled={config.partners.enabled}
                onChange={v => set('partners', { ...config.partners, enabled: v })} />
              <div className={config.partners.enabled ? '' : 'opacity-30 pointer-events-none'}>
                <Field label="Titre de la section" value={config.partners.title}
                  onChange={v => set('partners', { ...config.partners, title: v })} placeholder="Nos Partenaires" />
                <Field label="Sous-titre" value={config.partners.subtitle}
                  onChange={v => set('partners', { ...config.partners, subtitle: v })} placeholder="Ils font confiance à la plateforme" />
                <FieldEN label="Sous-titre" value={config.partners.subtitle_en ?? ''}
                  onChange={v => set('partners', { ...config.partners, subtitle_en: v })} placeholder="They trust our platform" />
              </div>
            </div>
          )}
        </div>

        {/* Footer — identique */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
            style={{
              background: saved ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
              opacity: saving ? 0.7 : 1,
              minWidth: 120,
            }}>
            {saved ? '✓ Sauvegardé' : saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Modal Nouvelle Playlist ──────────────────────────────────────────────────

const NewPlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!name.trim()) return
    const { data } = await axios.post('/admin/jury-list', { name: name.trim() })
    const created = data.juryList
    onCreate({ id: created?.id || Date.now(), name: created?.name || name.trim(), films: 0, jury: 0, status: 'draft' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
          <IconList />
        </div>
        <h2 className="text-base font-bold text-white mb-1">Nouvelle playlist</h2>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Donnez un nom à votre sélection</p>
        <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ex : Sélection Officielle 2025"
          className="w-full px-4 py-2.5 text-sm rounded-xl mb-4 text-white placeholder-white/30 focus:outline-none transition"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }} />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)' }}>
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
            style={{
              background: name.trim() ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.1)',
              opacity: name.trim() ? 1 : 0.5,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}>
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Cards ────────────────────────────────────────────────────────────────────

const HomeConfigCard = ({ onClick, activeSections }) => (
  <div onClick={onClick} className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
        <IconHome />
      </div>
      <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'rgba(139,92,246,0.5)' }}>
        <IconChevronRight />
      </span>
    </div>
    <h3 className="font-bold text-white mb-1">Configuration Home</h3>
    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Gérez les sections visibles sur la page d'accueil publique</p>
    <div className="mt-auto pt-4">
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
        {activeSections} sections actives
      </span>
    </div>
  </div>
)

const PlaylistsCard = ({ playlists, onNew, onDelete, onDeleteMany }) => {
  const [selected, setSelected] = useState([])
  const [selectMode, setSelectMode] = useState(false)
  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleDeleteMany = () => { onDeleteMany(selected); setSelected([]); setSelectMode(false) }

  return (
    <div className="rounded-2xl p-6 transition-all duration-300 flex flex-col"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
          <IconFilm />
        </div>
        <div className="flex items-center gap-2">
          {playlists.length > 0 && !selectMode && (
            <button onClick={() => setSelectMode(true)} className="px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'rgba(248,113,113,0.7)', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'rgba(248,113,113,0.7)' }}>
              Sélectionner
            </button>
          )}
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
            {playlists.length} playlists
          </span>
        </div>
      </div>
      <h3 className="font-bold text-white mb-1 shrink-0">Playlists</h3>
      <p className="text-xs mb-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>Sélections de films du festival</p>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent' }}>
        {playlists.map(pl => (
          <div key={pl.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all"
            style={{ background: selected.includes(pl.id) ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected.includes(pl.id) ? 'rgba(239,68,68,0.25)' : 'transparent'}` }}>
            {selectMode && <input type="checkbox" checked={selected.includes(pl.id)} onChange={() => toggleSelect(pl.id)}
              className="cursor-pointer shrink-0" style={{ accentColor: '#a78bfa', width: 13, height: 13 }} />}
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pl.status === 'active' ? '#4ade80' : '#facc15' }} />
            <span className="text-sm truncate flex-1" style={{ color: selected.includes(pl.id) ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)' }}>{pl.name}</span>
            {!selectMode && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}><IconClapperboard /> {pl.films}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}><IconUsers /> {pl.jury}</span>
                <button onClick={() => onDelete(pl.id)} className="ml-1 p-1 rounded-lg cursor-pointer transition-all"
                  style={{ color: 'rgba(248,113,113,0.35)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.35)'; e.currentTarget.style.background = 'transparent' }}>
                  <IconTrash size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectMode ? (
        <div className="mt-3 flex gap-2 shrink-0">
          <button onClick={() => { setSelected([]); setSelectMode(false) }} className="flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Annuler
          </button>
          <button onClick={handleDeleteMany} disabled={selected.length === 0} className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            style={{ background: selected.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)', color: selected.length > 0 ? '#f87171' : 'rgba(255,255,255,0.2)', border: `1px solid ${selected.length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}>
            <IconTrash size={12} /> Supprimer {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      ) : (
        <button onClick={onNew} className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          style={{ border: '2px dashed rgba(139,92,246,0.25)', color: 'rgba(139,92,246,0.6)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'; e.currentTarget.style.color = '#c084fc'; e.currentTarget.style.background = 'rgba(139,92,246,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.color = 'rgba(139,92,246,0.6)'; e.currentTarget.style.background = 'transparent' }}>
          <IconPlus /> Nouvelle playlist
        </button>
      )}
    </div>
  )
}

const AssignCard = ({ filmsCount, juryCount, onClick }) => (
  <div
    onClick={onClick}
    className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
        <IconTarget />
      </div>
      <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: 'rgba(139,92,246,0.5)' }}>
        <IconChevronRight />
      </span>
    </div>
    <h3 className="font-bold text-white mb-1">Assigner Films & Jury</h3>
    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Associez des films et membres du jury à vos playlists</p>
    <div className="flex gap-2 flex-wrap mt-auto">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
        <IconClapperboard /> {filmsCount} film{filmsCount !== 1 ? 's' : ''}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
        <IconUsers /> {juryCount} membre{juryCount !== 1 ? 's' : ''} jury
      </span>
    </div>
  </div>
)

// ─── Page Configuration ───────────────────────────────────────────────────────

const Configuration = () => {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [filmsCount, setFilmsCount] = useState(0)
  const [juryCount, setJuryCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showHomeModal, setShowHomeModal] = useState(false)
  const [activeSections, setActiveSections] = useState(4)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('/admin/jury-lists')
        const normalized = (data.playlists || []).map(pl => ({
          id: pl.id, name: pl.name,
          films: pl.filmsCount || 0,
          jury: pl.juryCount || 0,
          status: pl.status || 'draft',
        }))
        setPlaylists(normalized)
      } catch (error) {
        console.error('Erreur chargement playlists :', error)
      }
    }
    // Charge le nombre de sections actives depuis le localStorage
    const local = localStorage.getItem('home_config')
    if (local) {
      const cfg = JSON.parse(local)
      setActiveSections(Object.values(cfg).filter(s => s.enabled).length)
    }
    fetchPlaylists()
  }, [])

  useEffect(() => {
    const fetchFilmsAndJury = async () => {
      try {
        const [filmsRes, usersRes] = await Promise.all([
          axios.get('/submissions'),
          axios.get('/users')
        ])
        console.log('Films response:', filmsRes.data)
        console.log('Users response:', usersRes.data)
        
        // Films retourne { data: [...], totalItems, ... }
        const films = filmsRes.data?.data || []
        setFilmsCount(films.length)
        
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || []
        const juries = allUsers.filter(u => u.role === 'jury')
        console.log('Films count:', films.length, 'Jury count:', juries.length)
        setJuryCount(juries.length)
      } catch (error) {
        console.error('Erreur chargement films/jury :', error)
      }
    }

    fetchFilmsAndJury()
  }, [])

  const handleDelete = async (id) => {
    try { await axios.delete(`/admin/jury-list/${id}`); setPlaylists(prev => prev.filter(p => p.id !== id)) }
    catch (e) { console.error(e) }
  }
  const handleDeleteMany = async (ids) => {
    try { await axios.delete('/admin/jury-lists', { data: { ids } }); setPlaylists(prev => prev.filter(p => !ids.includes(p.id))) }
    catch (e) { console.error(e) }
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: '#0f0f1a' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Configuration</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Gérez les paramètres du festival</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch" style={{ gridAutoRows: '320px' }}>
          <HomeConfigCard onClick={() => setShowHomeModal(true)} activeSections={activeSections} />
          <PlaylistsCard
            playlists={playlists}
            onNew={() => setShowModal(true)}
            onDelete={handleDelete}
            onDeleteMany={handleDeleteMany}
          />
          <AssignCard filmsCount={filmsCount} juryCount={juryCount} onClick={() => navigate('/jury-assignment')} />
        </div>
      </div>

      {showModal && <NewPlaylistModal onClose={() => setShowModal(false)} onCreate={p => setPlaylists(prev => [...prev, p])} />}
      {showHomeModal && (
        <HomeConfigModal
          onClose={() => {
            setShowHomeModal(false)
            // Met à jour le compteur de sections actives après fermeture
            const local = localStorage.getItem('home_config')
            if (local) setActiveSections(Object.values(JSON.parse(local)).filter(s => s.enabled).length)
          }}
        />
      )}
    </div>
  )
}

export default Configuration