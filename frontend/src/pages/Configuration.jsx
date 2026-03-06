import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Settings, CheckCircle, AlertCircle } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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
const IconLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
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
      { key: 'sci_fi',      title: 'SCI-FI',       title_en: 'SCI-FI',       desc: 'Exploration des futurs possibles.',              desc_en: 'Exploration of possible futures.',           image: '/Gemini_Generated_Image_ScFIction.png' },
      { key: 'horror',      title: 'HORREUR',      title_en: 'HORROR',       desc: "Frissons garantis par l'IA.",                    desc_en: 'Guaranteed thrills by AI.',                  image: '/Gemini_Generated_Image_Horreur.png' },
      { key: 'action',      title: 'ACTION',       title_en: 'ACTION',       desc: 'Adrénaline et cinématiques.',                    desc_en: 'Adrenaline and cinematics.',                 image: '/Gemini_Generated_Image_Action.png' },
      { key: 'drama',       title: 'DRAME',        title_en: 'DRAMA',        desc: 'Émotions profondes et récits.',                  desc_en: 'Deep emotions and stories.',                 image: '/Gemini_Generated_Image_Drame.png' },
      { key: 'thriller',    title: 'THRILLER',     title_en: 'THRILLER',     desc: 'Enquête approfonfis et suspense.',               desc_en: 'In-depth investigation and suspense.',       image: '/Gemini_Generated_Image_Thriller.png' },
      { key: 'documentary', title: 'DOCUMENTAIRE', title_en: 'DOCUMENTARY',  desc: 'Reportage et investigation de haut vol.',        desc_en: 'High-level reporting and investigation.',    image: '/Gemini_Generated_Image_Documentaire.png' },
      { key: 'animation',   title: 'ANIMATION',    title_en: 'ANIMATION',    desc: 'Technologie et fantaisie.',                      desc_en: 'Technology and fantasy.',                    image: '/Gemini_Generated_Image_Animation.png' },
      { key: 'history',     title: 'HISTOIRE',     title_en: 'HISTORY',      desc: "Revisite les meilleurs moments de l'histoire.",  desc_en: 'Revisit the best moments that marked history.', image: '/Gemini_Generated_Image_Histoire.png' },
    ],
  },
  awards: {
    enabled: true,
    title: 'Reconnaissance & Awards',
    title_en: 'Recognition & Awards',
    items: [
      { label: 'Prix à gagner', label_en: 'Prize to win',  sub: 'Dotations mensuelles',  sub_en: 'Monthly grants',   image: '' },
      { label: 'Global',        label_en: 'Global',         sub: 'Ouvert au monde entier', sub_en: 'Open worldwide',   image: '' },
      { label: 'AI Only',       label_en: 'AI Only',        sub: '100% généré par IA',     sub_en: '100% AI-generated', image: '' },
    ],
  },
  partners: {
    enabled: true,
    title: 'Nos Partenaires',
    title_en: 'Our Partners', // ← AJOUT
    subtitle: 'Ils font confiance à la plateforme',
    subtitle_en: 'They trust our platform',
    items: [
      { name: 'Gemini',      name_en: 'Gemini',      image: '/Generated_Image_logoGemini01.png',  url: '' },
      { name: 'Nano Banana', name_en: 'Nano Banana', image: '/Generated_Image_logoBanana01.png',  url: '' },
      { name: 'Claude',      name_en: 'Claude',      image: '/Generated_Image_logoClaude01.png',  url: '' },
      { name: 'CapCut',      name_en: 'CapCut',      image: '/Generated_Image_logoCapcut01.png',  url: '' },
    ],
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

const Field = ({ label, value, onChange, multiline = false, placeholder = '', currentMode = 'dark' }) => (
  <div className="mb-3">
    <label className="block text-xs font-medium mb-1.5" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>{label}</label>
    {multiline ? (
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl placeholder-opacity-40 focus:outline-none resize-none transition-colors"
        style={{ 
          background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)', 
          border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
          color: currentMode === 'light' ? '#000000' : '#ffffff'
        }}
        onFocus={e => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)'}
        onBlur={e => e.target.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl placeholder-opacity-40 focus:outline-none transition-colors"
        style={{ 
          background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)', 
          border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
          color: currentMode === 'light' ? '#000000' : '#ffffff'
        }}
        onFocus={e => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)'}
        onBlur={e => e.target.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'} />
    )}
  </div>
)

const FieldEN = ({ label, value, onChange, multiline = false, placeholder = '', currentMode = 'dark' }) => (
  <div className="mb-3">
    <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>
      {label}
      <span style={{ 
        padding: '1px 5px', 
        borderRadius: 4, 
        fontSize: 10, 
        fontWeight: 700, 
        background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', 
        color: '#f87171', 
        border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` 
      }}>EN</span>
    </label>
    {multiline ? (
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl placeholder-opacity-40 focus:outline-none resize-none transition-colors"
        style={{ 
          background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)', 
          border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: currentMode === 'light' ? '#000000' : '#ffffff'
        }}
        onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
        onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-xl placeholder-opacity-40 focus:outline-none transition-colors"
        style={{ 
          background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)', 
          border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
          color: currentMode === 'light' ? '#000000' : '#ffffff'
        }}
        onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
        onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
    )}
  </div>
)

const SectionHeader = ({ label, enabled, onChange, currentMode = 'dark' }) => (
  <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
    <span className="text-sm font-bold" style={{ color: currentMode === 'light' ? '#000000' : '#ffffff' }}>{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: enabled ? '#4ade80' : currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.3)' }}>
        {enabled ? 'Visible' : 'Masquée'}
      </span>
      <Toggle checked={enabled} onChange={onChange} />
    </div>
  </div>
)

const TabBtn = ({ active, onClick, children, currentMode = 'dark' }) => (
  <button onClick={onClick} className="px-2 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
    style={{
      background: active 
        ? currentMode === 'light' ? 'rgba(124, 58, 237, 0.12)' : 'rgba(139,92,246,0.2)'
        : 'transparent',
      color: active 
        ? currentMode === 'light' ? '#7c3aed' : '#c084fc'
        : currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.35)',
      border: active 
        ? `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139,92,246,0.35)'}`
        : '1px solid transparent',
    }}>
    {children}
  </button>
)

// ─── Bouton Supprimer réutilisable ────────────────────────────────────────────
const DeleteBtn = ({ onClick, currentMode = 'dark' }) => (
  <button
    onClick={onClick}
    className="ml-auto p-1 rounded-lg cursor-pointer transition-colors"
    style={{ 
      color: currentMode === 'light' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(248,113,113,0.4)', 
      background: 'transparent' 
    }}
    onMouseEnter={e => { 
      e.currentTarget.style.color = currentMode === 'light' ? '#dc2626' : '#f87171'; 
      e.currentTarget.style.background = currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.1)' 
    }}
    onMouseLeave={e => { 
      e.currentTarget.style.color = currentMode === 'light' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(248,113,113,0.4)'; 
      e.currentTarget.style.background = 'transparent' 
    }}
  >
    <IconTrash size={12} />
  </button>
)

// ─── Bouton Ajouter réutilisable ──────────────────────────────────────────────
const AddBtn = ({ onClick, label, currentMode = 'dark' }) => (
  <button
    onClick={onClick}
    className="w-full py-2 rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
    style={{ 
      border: `2px dashed ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139,92,246,0.25)'}`, 
      color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.6)', 
      background: 'transparent' 
    }}
    onMouseEnter={e => { 
      e.currentTarget.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)'; 
      e.currentTarget.style.background = currentMode === 'light' ? 'rgba(124, 58, 237, 0.05)' : 'rgba(139,92,246,0.05)' 
    }}
    onMouseLeave={e => { 
      e.currentTarget.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139,92,246,0.25)'; 
      e.currentTarget.style.background = 'transparent' 
    }}
  >
    <IconPlus /> {label}
  </button>
)

// ─── ImageUpload ──────────────────────────────────────────────────────────────

const ImageUpload = ({ value, onChange, label = 'Image', currentMode = 'dark' }) => {
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
      <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>
        <IconImage /> {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="relative rounded-xl overflow-hidden transition-all"
        style={{ 
          border: `1px dashed ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139,92,246,0.3)'}`, 
          background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.02)' : 'rgba(255,255,255,0.03)' 
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.6)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = value ? currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.4)' : currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(139,92,246,0.3)'}
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
              style={{ 
                background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139,92,246,0.12)', 
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.25)'}`, 
                color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' 
              }}>
              <IconUpload />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.5)' }}>Glissez une image ici</p>
              <p className="text-xs mt-0.5" style={{ color: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.25)' }}>ou cliquez pour parcourir</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
    </div>
  )
}

// ─── Modal Configuration Home ─────────────────────────────────────────────────

const HomeConfigModal = ({ onClose, currentMode = 'dark' }) => {
  const [config, setConfig] = useState(DEFAULT_HOME_CONFIG)
  const [activeTab, setActiveTab] = useState('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      let finalConfig = { ...DEFAULT_HOME_CONFIG }
      let apiCategories = []
      
      // Essayer de charger depuis l'API (source de vérité pour la BDD)
      try {
        const { data } = await axios.get('/admin/home-config')
        if (data?.config) {
          finalConfig = { ...DEFAULT_HOME_CONFIG, ...data.config }
          apiCategories = finalConfig.categories?.items || []
          console.log('✅ Config chargée depuis l\'API (BDD)', finalConfig)
        }
      } catch (error) {
        console.error('Erreur fetch config API:', error)
      }
      
      // Toujours vérifier localStorage pour compléter
      // (contient peut-être des catégories non encore sauvegardées en BDD)
      const local = localStorage.getItem('home_config')
      if (local) {
        try {
          const localConfig = JSON.parse(local)
          
          // Fusionner les catégories: ajouter celles de localStorage qui ne sont pas en API
          if (localConfig.categories?.items && Array.isArray(localConfig.categories.items)) {
            const mergedCategories = [...apiCategories]
            
            // Créer une map des clés/titres déjà en BDD pour éviter les doublons
            const existingKeys = new Set(apiCategories.map(cat => cat.key || cat.title))
            
            // Ajouter les catégories de localStorage qui ne sont pas en BDD
            for (const localCat of localConfig.categories.items) {
              const catKey = localCat.key || localCat.title
              if (!existingKeys.has(catKey)) {
                mergedCategories.push(localCat)
                console.log('📌 Catégorie de localStorage ajoutée:', localCat.title)
              }
            }
            
            finalConfig.categories = {
              enabled: finalConfig.categories?.enabled ?? true,
              items: mergedCategories
            }
          }
        } catch (e) {
          console.error('Erreur parse localStorage:', e)
        }
      }
      
      // Migrations
      if (finalConfig.awards?.stats && !finalConfig.awards?.items) {
        finalConfig.awards.items = finalConfig.awards.stats.map(s => ({
          label: s.label, label_en: s.label,
          sub: s.sub, sub_en: s.sub_en || s.sub, image: s.image || ''
        }))
        delete finalConfig.awards.stats
      }
      if (!finalConfig.partners?.items) {
        finalConfig.partners = { ...DEFAULT_HOME_CONFIG.partners, ...finalConfig.partners }
      }
      if (!finalConfig.categories?.items || finalConfig.categories?.enabled === undefined) {
        finalConfig.categories = { ...DEFAULT_HOME_CONFIG.categories, ...finalConfig.categories }
      }
      
      setConfig(finalConfig)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('📤 Envoi config à l\'API...', config)
      
      // 1. Envoyer la config à l'API (qui va uploader les base64 vers S3)
      const { data } = await axios.post('/admin/home-config', { config })
      
      console.log('📥 Réponse API:', data)
      
      if (data?.success && data?.config) {
        // 2. Mettre à jour le state avec la config contenant les URLs S3
        setConfig(data.config)
        
        // 3. Sauvegarder la version avec URLs S3 dans localStorage
        localStorage.setItem('home_config', JSON.stringify(data.config))
        
        console.log('✅ Configuration sauvegardée en BDD (images uploadées sur S3)')
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        console.error('❌ API n\'a pas retourné success:true', data)
        alert('❌ Erreur: La sauvegarde a échoué. Vérifiez la console pour plus de détails.')
      }
    } catch (error) {
      console.error('❌ Erreur lors du POST:', error.response?.status, error.response?.data || error.message)
      alert(`❌ Erreur sauvegarde (${error.response?.status || 'réseau'}): ${error.response?.data?.message || error.message}`)
    }
    
    setSaving(false)
  }

  const set = (section, value) => setConfig(prev => ({ ...prev, [section]: value }))

  const TABS = [
    { key: 'hero',       icon: <IconLayout />,    label: 'Hero' },
    { key: 'categories', icon: <IconGrid />,       label: 'Catégories' },
    { key: 'awards',     icon: <IconAward />,      label: 'Awards' },
    { key: 'partners',   icon: <IconHandshake />,  label: 'Partenaires' },
  ]

  const activeSections = Object.values(config).filter(s => s?.enabled).length

  // ── Helpers Awards ──
  const awardsItems = config.awards?.items || []
  const setAwardItem = (i, field, val) => {
    const items = [...awardsItems]
    items[i] = { ...items[i], [field]: val }
    set('awards', { ...config.awards, items })
  }
  const removeAward = (i) => set('awards', { ...config.awards, items: awardsItems.filter((_, idx) => idx !== i) })
  const addAward = () => set('awards', { ...config.awards, items: [...awardsItems, { label: '', label_en: '', sub: '', sub_en: '', image: '' }] })

  // ── Helpers Partners ──
  const partnerItems = config.partners?.items || []
  const setPartnerItem = (i, field, val) => {
    const items = [...partnerItems]
    items[i] = { ...items[i], [field]: val }
    set('partners', { ...config.partners, items })
  }
  const removePartner = (i) => set('partners', { ...config.partners, items: partnerItems.filter((_, idx) => idx !== i) })
  const addPartner = () => set('partners', { ...config.partners, items: [...partnerItems, { name: '', name_en: '', image: '', url: '' }] })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          background: currentMode === 'light'
            ? 'linear-gradient(160deg, #f5f5f5 0%, #ffffff 100%)'
            : 'linear-gradient(160deg, #12122a 0%, #0f0f1e 100%)', 
          border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}` 
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ 
                background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139,92,246,0.15)', 
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.3)'}`, 
                color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' 
              }}>
              <IconSettings />
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: currentMode === 'light' ? '#000000' : '#ffffff' }}>Configuration Home</h2>
              <p className="text-xs" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>{activeSections} sections actives</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{ color: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.4)', background: currentMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.background = currentMode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = currentMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}>
            <IconX />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-1.5 px-3 md:px-6 py-3 shrink-0 overflow-x-auto" style={{ borderBottom: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.06)'}`, scrollbarWidth: 'none' }}>
          {TABS.map(t => (
            <TabBtn key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} currentMode={currentMode}>
              <span className="flex items-center gap-1 md:gap-1.5">{t.icon}<span className="hidden sm:inline">{t.label}</span></span>
            </TabBtn>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.2) transparent' : 'rgba(139,92,246,0.3) transparent' }}>

          {/* ── Hero ── */}
          {activeTab === 'hero' && (
            <div>
              <SectionHeader label="Section Hero" enabled={config.hero.enabled}
                onChange={v => set('hero', { ...config.hero, enabled: v })} currentMode={currentMode} />
              <div className={config.hero.enabled ? '' : 'opacity-30 pointer-events-none'}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Titre principal" value={config.hero.title}
                    onChange={v => set('hero', { ...config.hero, title: v })} placeholder="MARS" currentMode={currentMode} />
                  <Field label="Mot en couleur" value={config.hero.titleHighlight}
                    onChange={v => set('hero', { ...config.hero, titleHighlight: v })} placeholder="AI" currentMode={currentMode} />
                </div>
                <Field label="Sous-titre" value={config.hero.subtitle} multiline
                  onChange={v => set('hero', { ...config.hero, subtitle: v })} currentMode={currentMode} />
                <FieldEN label="Sous-titre" value={config.hero.subtitle_en ?? ''} multiline
                  onChange={v => set('hero', { ...config.hero, subtitle_en: v })} placeholder="English subtitle..." currentMode={currentMode} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bouton principal" value={config.hero.ctaPrimary}
                    onChange={v => set('hero', { ...config.hero, ctaPrimary: v })} placeholder="Commencer" currentMode={currentMode} />
                  <FieldEN label="Bouton principal" value={config.hero.ctaPrimary_en ?? ''}
                    onChange={v => set('hero', { ...config.hero, ctaPrimary_en: v })} placeholder="Get Started" currentMode={currentMode} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bouton secondaire" value={config.hero.ctaSecondary}
                    onChange={v => set('hero', { ...config.hero, ctaSecondary: v })} placeholder="En savoir plus" currentMode={currentMode} />
                  <FieldEN label="Bouton secondaire" value={config.hero.ctaSecondary_en ?? ''}
                    onChange={v => set('hero', { ...config.hero, ctaSecondary_en: v })} placeholder="Learn More" currentMode={currentMode} />
                </div>
                <div className="mt-2 rounded-xl p-4 text-center" style={{ background: currentMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.06)'}` }}>
                  <p className="text-xs mb-1" style={{ color: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.3)' }}>Aperçu</p>
                  <p className="text-lg font-black" style={{ color: currentMode === 'light' ? '#000000' : '#ffffff' }}>
                    {config.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">{config.hero.titleHighlight}</span>
                  </p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>{config.hero.subtitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Catégories ── */}
          {activeTab === 'categories' && (
            <div>
              <SectionHeader label="Section Catégories" enabled={config.categories.enabled}
                onChange={v => set('categories', { ...config.categories, enabled: v })} currentMode={currentMode} />
              <div className={config.categories.enabled ? '' : 'opacity-30 pointer-events-none'}>
                <div className="space-y-2 mb-3">
                  {config.categories.items.map((item, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: currentMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold" style={{ color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.7)' }}>#{i + 1}</span>
                        <DeleteBtn currentMode={currentMode} onClick={() => {
                          const items = config.categories.items.filter((_, idx) => idx !== i)
                          set('categories', { ...config.categories, items })
                        }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>Titre</label>
                          <input value={item.title} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], title: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                            Titre <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', color: '#f87171', border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` }}>EN</span>
                          </label>
                          <input value={item.title_en ?? ''} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], title_en: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} placeholder="English title..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }}
                            onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>Description</label>
                          <input value={item.desc} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], desc: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                            Description <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', color: '#f87171', border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` }}>EN</span>
                          </label>
                          <input value={item.desc_en ?? ''} onChange={e => {
                            const items = [...config.categories.items]
                            items[i] = { ...items[i], desc_en: e.target.value }
                            set('categories', { ...config.categories, items })
                          }} placeholder="English description..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }}
                            onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>
                      <ImageUpload label="Image de la catégorie" value={item.image || ''}
                        currentMode={currentMode}
                        onChange={v => {
                          const items = [...config.categories.items]
                          items[i] = { ...items[i], image: v }
                          set('categories', { ...config.categories, items })
                        }} />
                    </div>
                  ))}
                </div>
                <AddBtn currentMode={currentMode} onClick={() => set('categories', { ...config.categories, items: [...config.categories.items, { title: '', title_en: '', desc: '', desc_en: '', image: '' }] })}
                  label="Ajouter une catégorie" />
              </div>
            </div>
          )}

          {/* ── Awards ── */}
          {activeTab === 'awards' && (
            <div>
              <SectionHeader label="Section Awards" enabled={config.awards.enabled}
                onChange={v => set('awards', { ...config.awards, enabled: v })} currentMode={currentMode} />
              <div className={config.awards.enabled ? '' : 'opacity-30 pointer-events-none'}>
                <Field label="Titre de la section" value={config.awards.title}
                  onChange={v => set('awards', { ...config.awards, title: v })} placeholder="Reconnaissance & Awards" currentMode={currentMode} />
                <FieldEN label="Titre de la section" value={config.awards.title_en ?? ''}
                  onChange={v => set('awards', { ...config.awards, title_en: v })} placeholder="Recognition & Awards" currentMode={currentMode} />

                <p className="text-xs font-semibold mt-1 mb-3" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Statistiques / Awards ({awardsItems.length})
                </p>

                <div className="space-y-2 mb-3">
                  {awardsItems.map((item, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: currentMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold" style={{ color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.7)' }}>#{i + 1}</span>
                        <DeleteBtn currentMode={currentMode} onClick={() => removeAward(i)} />
                      </div>

                      {/* Titre FR + EN */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>Titre</label>
                          <input value={item.label || ''} onChange={e => setAwardItem(i, 'label', e.target.value)}
                            placeholder="Prix à gagner"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                            Titre <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', color: '#f87171', border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` }}>EN</span>
                          </label>
                          <input value={item.label_en || ''} onChange={e => setAwardItem(i, 'label_en', e.target.value)}
                            placeholder="Prize to win"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }}
                            onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>

                      {/* Sous-titre FR + EN */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>Sous-titre</label>
                          <input value={item.sub || ''} onChange={e => setAwardItem(i, 'sub', e.target.value)}
                            placeholder="Dotations mensuelles"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                            Sous-titre <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', color: '#f87171', border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` }}>EN</span>
                          </label>
                          <input value={item.sub_en || ''} onChange={e => setAwardItem(i, 'sub_en', e.target.value)}
                            placeholder="Monthly grants"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }}
                            onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>

                      <ImageUpload label="Icône / Illustration" value={item.image || ''}
                        currentMode={currentMode}
                        onChange={v => setAwardItem(i, 'image', v)} />
                    </div>
                  ))}
                </div>
                <AddBtn currentMode={currentMode} onClick={addAward} label="Ajouter un award" />
              </div>
            </div>
          )}

          {/* ── Partenaires ── */}
          {activeTab === 'partners' && (
            <div>
              <SectionHeader label="Section Partenaires" enabled={config.partners.enabled}
                onChange={v => set('partners', { ...config.partners, enabled: v })} currentMode={currentMode} />
              <div className={config.partners.enabled ? '' : 'opacity-30 pointer-events-none'}>

                {/* ── Titre de la section FR + EN ── */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Titre de la section" value={config.partners.title}
                    onChange={v => set('partners', { ...config.partners, title: v })} placeholder="Nos Partenaires" currentMode={currentMode} />
                  <FieldEN label="Titre de la section" value={config.partners.title_en ?? ''}
                    onChange={v => set('partners', { ...config.partners, title_en: v })} placeholder="Our Partners" currentMode={currentMode} />
                </div>

                <Field label="Sous-titre" value={config.partners.subtitle}
                  onChange={v => set('partners', { ...config.partners, subtitle: v })} placeholder="Ils font confiance à la plateforme" currentMode={currentMode} />
                <FieldEN label="Sous-titre" value={config.partners.subtitle_en ?? ''}
                  onChange={v => set('partners', { ...config.partners, subtitle_en: v })} placeholder="They trust our platform" currentMode={currentMode} />

                <p className="text-xs font-semibold mt-1 mb-3" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Logos partenaires ({partnerItems.length})
                </p>

                <div className="space-y-2 mb-3">
                  {partnerItems.map((item, i) => (
                    <div key={i} className="rounded-xl p-3" style={{ background: currentMode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        {/* Aperçu miniature du logo */}
                        {item.image && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`, background: currentMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-0.5" />
                          </div>
                        )}
                        <span className="text-xs font-bold" style={{ color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.7)' }}>#{i + 1}</span>
                        <DeleteBtn currentMode={currentMode} onClick={() => removePartner(i)} />
                      </div>

                      {/* Nom FR + EN */}
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>Nom</label>
                          <input value={item.name || ''} onChange={e => setPartnerItem(i, 'name', e.target.value)}
                            placeholder="Gemini"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }} />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                            Nom <span style={{ padding: '1px 5px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)', color: '#f87171', border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)'}` }}>EN</span>
                          </label>
                          <input value={item.name_en || ''} onChange={e => setPartnerItem(i, 'name_en', e.target.value)}
                            placeholder="Gemini"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                            style={{ 
                              background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                              border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}`,
                              color: currentMode === 'light' ? '#000000' : '#ffffff'
                            }}
                            onFocus={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239,68,68,0.5)'}
                            onBlur={e => e.target.style.borderColor = currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'} />
                        </div>
                      </div>

                      {/* URL */}
                      <div className="mb-2">
                        <label className="flex items-center gap-1.5 text-xs mb-1" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.35)' }}>
                          <IconLink /> Lien (optionnel)
                        </label>
                        <input value={item.url || ''} onChange={e => setPartnerItem(i, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg focus:outline-none"
                          style={{ 
                            background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
                            border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}`,
                            color: currentMode === 'light' ? '#000000' : '#ffffff'
                          }}
                          onFocus={e => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)'}
                          onBlur={e => e.target.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'} />
                      </div>

                      <ImageUpload label="Logo du partenaire" value={item.image || ''}
                        currentMode={currentMode}
                        onChange={v => setPartnerItem(i, 'image', v)} />
                    </div>
                  ))}
                </div>
                <AddBtn currentMode={currentMode} onClick={addPartner} label="Ajouter un partenaire" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.07)'}` }}>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
            style={{ 
              color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)', 
              background: currentMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = currentMode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = currentMode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'}>
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
            style={{
              background: saved 
                ? 'linear-gradient(135deg,#16a34a,#22c55e)' 
                : currentMode === 'light'
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                  : 'linear-gradient(135deg,#7c3aed,#a855f7)',
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

const NewPlaylistModal = ({ onClose, onCreate, currentMode = 'dark' }) => {
  const { t } = useLanguage()
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
        style={{ 
          background: currentMode === 'light' 
            ? 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' 
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
          border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.1)'}` 
        }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ 
            background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139,92,246,0.15)', 
            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.3)'}`, 
            color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' 
          }}>
          <IconList />
        </div>
        <h2 className="text-base font-bold mb-1" style={{ color: currentMode === 'light' ? '#000000' : '#ffffff' }}>{t('modal_new_playlist_title')}</h2>
        <p className="text-xs mb-4" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>Donnez un nom à votre sélection</p>
        <input autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ex : Sélection Officielle 2025"
          className="w-full px-4 py-2.5 text-sm rounded-xl mb-4 placeholder-opacity-40 focus:outline-none transition"
          style={{ 
            background: currentMode === 'light' ? '#ffffff' : 'rgba(255,255,255,0.06)', 
            border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.12)'}`,
            color: currentMode === 'light' ? '#000000' : '#ffffff',
            placeholderColor: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.3)'
          }} 
          onFocus={e => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)'}
          onBlur={e => e.target.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.12)'}
        />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
            style={{ 
              color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.5)', 
              background: currentMode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255,255,255,0.06)' 
            }}>
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            style={{
              background: name.trim() 
                ? currentMode === 'light'
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' 
                  : 'linear-gradient(135deg,#7c3aed,#a855f7)'
                : currentMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              color: currentMode === 'light' ? '#ffffff' : '#ffffff',
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

const HomeConfigCard = ({ onClick, activeSections, t, currentMode }) => (
  <div onClick={onClick} className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{
      background: currentMode === 'light' 
        ? 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' 
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}`
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = currentMode === 'light' ? '#d1d5db' : 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}>
    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{
          background: currentMode === 'light' 
            ? 'rgba(124, 58, 237, 0.1)' 
            : 'rgba(139,92,246,0.15)',
          border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.3)'}`,
          color: currentMode === 'light' ? '#7c3aed' : '#a78bfa'
        }}>
        <IconHome />
      </div>
      <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.5)' }}>
        <IconChevronRight />
      </span>
    </div>
    <h3 style={{fontWeight: 'bold', color: currentMode === 'light' ? '#000000' : '#ffffff', marginBottom: '4px'}}>{t('config_home_title')}</h3>
    <p className="text-xs" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>{t('config_home_desc')}</p>
    <div className="mt-auto pt-4">
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{
          background: currentMode === 'light' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34,197,94,0.12)',
          color: '#4ade80',
          border: `1px solid ${currentMode === 'light' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34,197,94,0.2)'}`
        }}>
        {activeSections} sections actives
      </span>
    </div>
  </div>
)

const PlaylistsCard = ({ playlists, onNew, onDelete, onDeleteMany, t, currentMode }) => {
  const [selected, setSelected] = useState([])
  const [selectMode, setSelectMode] = useState(false)
  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const handleDeleteMany = () => { onDeleteMany(selected); setSelected([]); setSelectMode(false) }

  return (
    <div className="rounded-2xl p-6 transition-all duration-300 flex flex-col"
      style={{ 
        background: currentMode === 'light' ? 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
        border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}` 
      }}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ 
            background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139,92,246,0.15)', 
            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.3)'}`, 
            color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' 
          }}>
          <IconFilm />
        </div>
        <div className="flex items-center gap-2">
          {playlists.length > 0 && !selectMode && (
            <button onClick={() => setSelectMode(true)} className="px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
              style={{ 
                background: currentMode === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239,68,68,0.1)', 
                color: currentMode === 'light' ? '#dc2626' : 'rgba(248,113,113,0.7)', 
                border: `1px solid ${currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.2)'}` 
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.background = currentMode === 'light' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239,68,68,0.2)'; 
                e.currentTarget.style.color = currentMode === 'light' ? '#991b1b' : '#f87171' 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.background = currentMode === 'light' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239,68,68,0.1)'; 
                e.currentTarget.style.color = currentMode === 'light' ? '#dc2626' : 'rgba(248,113,113,0.7)' 
              }}>
              {t('config_playlists_select')}
            </button>
          )}
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ 
              background: currentMode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255,255,255,0.07)', 
              color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' 
            }}>
            {playlists.length} {t('config_playlists_count')}
          </span>
        </div>
      </div>
      <h3 style={{ fontWeight: 'bold', color: currentMode === 'light' ? '#000000' : '#ffffff', marginBottom: '4px' }} className="shrink-0">{t('config_playlists_title_heading')}</h3>
      <p className="text-xs mb-4 shrink-0" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>{t('config_playlists_desc')}</p>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.2) transparent' : 'rgba(139,92,246,0.3) transparent' }}>
        {playlists.map(pl => (
          <div key={pl.id} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all"
            style={{ 
              background: selected.includes(pl.id) 
                ? currentMode === 'light' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(239,68,68,0.08)' 
                : currentMode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255,255,255,0.03)', 
              border: `1px solid ${selected.includes(pl.id) ? currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.25)' : 'transparent'}` 
            }}>
            {selectMode && <input type="checkbox" checked={selected.includes(pl.id)} onChange={() => toggleSelect(pl.id)}
              className="cursor-pointer shrink-0" style={{ accentColor: currentMode === 'light' ? '#7c3aed' : '#a78bfa', width: 13, height: 13 }} />}
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pl.status === 'active' ? '#4ade80' : '#facc15' }} />
            <span className="text-sm truncate flex-1" style={{ color: selected.includes(pl.id) ? currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' : currentMode === 'light' ? '#000000' : 'rgba(255,255,255,0.7)' }}>{pl.name}</span>
            {!selectMode && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-xs" style={{ color: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.3)' }}><IconClapperboard /> {pl.films}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: currentMode === 'light' ? '#999999' : 'rgba(255,255,255,0.3)' }}><IconUsers /> {pl.jury}</span>
                <button onClick={() => onDelete(pl.id)} className="ml-1 p-1 rounded-lg cursor-pointer transition-all"
                  style={{ color: currentMode === 'light' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(248,113,113,0.35)', background: 'transparent' }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.color = currentMode === 'light' ? '#dc2626' : '#f87171'; 
                    e.currentTarget.style.background = currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)' 
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.color = currentMode === 'light' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(248,113,113,0.35)'; 
                    e.currentTarget.style.background = 'transparent' 
                  }}>
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
            style={{ 
              background: currentMode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255,255,255,0.06)', 
              color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)', 
              border: `1px solid ${currentMode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255,255,255,0.08)'}` 
            }}>
            {t('button_cancel')}
          </button>
          <button onClick={handleDeleteMany} disabled={selected.length === 0} className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            style={{ 
              background: selected.length > 0 ? currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239,68,68,0.15)' : currentMode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255,255,255,0.04)', 
              color: selected.length > 0 ? currentMode === 'light' ? '#dc2626' : '#f87171' : currentMode === 'light' ? '#b0b0b0' : 'rgba(255,255,255,0.2)', 
              border: `1px solid ${selected.length > 0 ? currentMode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239,68,68,0.3)' : currentMode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255,255,255,0.06)'}`, 
              cursor: selected.length === 0 ? 'not-allowed' : 'pointer' 
            }}>
            <IconTrash size={12} /> {t('button_delete')} {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      ) : (
        <button onClick={onNew} className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          style={{ 
            border: `2px dashed ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139,92,246,0.25)'}`, 
            color: currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.6)', 
            background: 'transparent' 
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.6)'; 
            e.currentTarget.style.color = currentMode === 'light' ? '#6d28d9' : '#c084fc'; 
            e.currentTarget.style.background = currentMode === 'light' ? 'rgba(124, 58, 237, 0.05)' : 'rgba(139,92,246,0.08)' 
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(139,92,246,0.25)'; 
            e.currentTarget.style.color = currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.6)'; 
            e.currentTarget.style.background = 'transparent' 
          }}>
          <IconPlus /> {t('button_new_playlist')}
        </button>
      )}
    </div>
  )
}

const AssignCard = ({ filmsCount, juryCount, onClick, t, currentMode }) => (
  <div onClick={onClick} className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{ 
      background: currentMode === 'light' 
        ? 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' 
        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', 
      border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}` 
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = currentMode === 'light' ? '#d1d5db' : 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)'}>
    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
    <div className="flex items-center justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ 
          background: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(139,92,246,0.15)', 
          border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(139,92,246,0.3)'}`, 
          color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' 
        }}>
        <IconTarget />
      </div>
      <span className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: currentMode === 'light' ? 'rgba(124, 58, 237, 0.5)' : 'rgba(139,92,246,0.5)' }}>
        <IconChevronRight />
      </span>
    </div>
    <h3 style={{ fontWeight: 'bold', color: currentMode === 'light' ? '#000000' : '#ffffff', marginBottom: '4px' }}>{t('config_assign_title')}</h3>
    <p className="text-xs mb-4" style={{ color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.4)' }}>{t('config_assign_desc')}</p>
    <div className="flex gap-2 flex-wrap mt-auto">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ 
          background: currentMode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99,102,241,0.15)', 
          color: currentMode === 'light' ? '#6366f1' : '#818cf8', 
          border: `1px solid ${currentMode === 'light' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99,102,241,0.2)'}` 
        }}>
        <IconClapperboard /> {filmsCount} {filmsCount !== 1 ? t('config_film_plural') : t('config_film_singular')}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ 
          background: currentMode === 'light' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168,85,247,0.15)', 
          color: currentMode === 'light' ? '#a855f7' : '#c084fc', 
          border: `1px solid ${currentMode === 'light' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168,85,247,0.2)'}` 
        }}>
        <IconUsers /> {juryCount} {juryCount !== 1 ? t('config_jury_plural') : t('config_jury_singular')}
      </span>
    </div>
  </div>
)

// ─── Page Configuration ───────────────────────────────────────────────────────

const Configuration = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [currentMode, setCurrentMode] = useState('dark')
  const [playlists, setPlaylists] = useState([])
  const [filmsCount, setFilmsCount] = useState(0)
  const [juryCount, setJuryCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showHomeModal, setShowHomeModal] = useState(false)
  const [activeSections, setActiveSections] = useState(4)
  const [adminUser, setAdminUser] = useState({ full_name: "Admin Test", email: "email@exemple.com", job_title: "Directeur", avatar_url: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) { setLoading(false); return }
        const user = JSON.parse(userStr)
        if (user.role !== 'admin') { setLoading(false); return }
        setAdminUser(user)
        setLoading(false)
      } catch (error) {
        console.error('Erreur vérification admin:', error)
        setLoading(false)
      }
    }
    verifyAdmin()

    // Listener pour l'événement personnalisé userAvatarUpdated
    const handleAvatarUpdated = (e) => {
      setAdminUser(prev => ({ ...prev, avatar_url: e.detail.avatar_url }))
    }
    window.addEventListener('userAvatarUpdated', handleAvatarUpdated)
    return () => window.removeEventListener('userAvatarUpdated', handleAvatarUpdated)
  }, [])

  // Mode detection
  useEffect(() => {
    const updateMode = () => {
      const mode = document.documentElement.getAttribute('data-mode') || 'dark';
      setCurrentMode(mode);
    };

    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('/admin/jury-lists')
        const normalized = (data.playlists || []).map(pl => ({
          id: pl.id, name: pl.name,
          films: pl.filmsCount || 0, jury: pl.juryCount || 0, status: pl.status || 'draft',
        }))
        setPlaylists(normalized)
      } catch (error) {
        console.error('Erreur chargement playlists :', error)
      }
    }
    const local = localStorage.getItem('home_config')
    if (local) {
      const cfg = JSON.parse(local)
      setActiveSections(Object.values(cfg).filter(s => s?.enabled).length)
    }
    fetchPlaylists()
  }, [])

  useEffect(() => {
    const fetchFilmsAndJury = async () => {
      try {
        const [filmsRes, usersRes] = await Promise.all([
          axios.get('/submissions', { params: { status: 'approved', page: 1, limit: 1000 } }),
          axios.get('/users')
        ])
        const films = filmsRes.data?.data || []
        setFilmsCount(films.length)
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || []
        setJuryCount(allUsers.filter(u => u.role === 'jury').length)
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
    <div style={{
      minHeight: '100vh',
      background: currentMode === 'light' ? '#ffffff' : 'linear-gradient(to bottom right, rgb(5, 5, 5), rgb(23, 23, 23), rgb(5, 5, 5))',
      color: currentMode === 'light' ? '#000000' : '#ffffff'
    }}>
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 pb-8 md:pb-12">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <span style={{
                  fontSize: '12px',
                  color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '12px'
                }}>{t('admin_space')}</span>
                <h1 style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 'bold',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '16px',
                  lineHeight: '1.2',
                  textTransform: 'capitalize'
                }}>
                  <Settings size={32} /> {t('config_page_title')}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                  lineHeight: '1.6',
                  maxWidth: '900px'
                }}>{t('config_page_desc')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch" style={{ gridAutoRows: '320px' }}>
            <HomeConfigCard onClick={() => setShowHomeModal(true)} activeSections={activeSections} t={t} currentMode={currentMode} />
            <PlaylistsCard playlists={playlists} onNew={() => setShowModal(true)} onDelete={handleDelete} onDeleteMany={handleDeleteMany} t={t} currentMode={currentMode} />
            <AssignCard filmsCount={filmsCount} juryCount={juryCount} onClick={() => navigate('/jury-assignment')} t={t} currentMode={currentMode} />
          </div>
        </div>
      </main>

      {showModal && <NewPlaylistModal onClose={() => setShowModal(false)} onCreate={p => setPlaylists(prev => [...prev, p])} currentMode={currentMode} />}
      {showHomeModal && (
        <HomeConfigModal
          onClose={() => {
            setShowHomeModal(false)
            const local = localStorage.getItem('home_config')
            if (local) setActiveSections(Object.values(JSON.parse(local)).filter(s => s?.enabled).length)
          }}
          currentMode={currentMode}
        />
      )}
    </div>
  )
}

export default Configuration