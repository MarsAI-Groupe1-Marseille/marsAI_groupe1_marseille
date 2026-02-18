import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig.js'

// ─── Icônes SVG ──────────────────────────────────────────────────────────────

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)

const IconFilm = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
    <line x1="7" y1="2" x2="7" y2="22"/>
    <line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/>
    <line x1="2" y1="17" x2="7" y2="17"/>
    <line x1="17" y1="17" x2="22" y2="17"/>
    <line x1="17" y1="7" x2="22" y2="7"/>
  </svg>
)

const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const IconClapperboard = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.6l13.5-4c1-.3 2.1.3 2.5 1.3Z"/>
    <path d="m6.2 5.3 3.1 3.9"/>
    <path d="m12.4 3.4 3.1 3.9"/>
    <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
  </svg>
)

const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)

const IconTrash = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

// ─── Modal Nouvelle Playlist ─────────────────────────────────────────────────

const NewPlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    const { data } = await axios.post('/admin/jury-list', { name: name.trim() }) 
    const created = data.juryList
    console.log("Playlist créée :", name.trim())

    onCreate({
      id: created?.id || Date.now(),
      name: created?.name || name.trim(),
      films: 0,
      jury: 0,
      status: 'draft'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
        >
          <IconList />
        </div>
        <h2 className="text-base font-bold text-white mb-1">Nouvelle playlist</h2>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Donnez un nom à votre sélection
        </p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ex : Sélection Officielle 2025"
          className="w-full px-4 py-2.5 text-sm rounded-xl mb-4 text-white placeholder-white/30 focus:outline-none transition"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)' }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
            style={{
              background: name.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.1)',
              opacity: name.trim() ? 1 : 0.5,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Card : Configuration Home ───────────────────────────────────────────────

const HomeConfigCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
  >
    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

    <div className="flex items-center justify-between mb-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
      >
        <IconHome />
      </div>
      <span
        className="transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: 'rgba(139,92,246,0.5)' }}
      >
        <IconChevronRight />
      </span>
    </div>

    <h3 className="font-bold text-white mb-1">Configuration Home</h3>
    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Gérez les sections visibles sur la page d'accueil publique
    </p>
    <div className="mt-auto pt-4">
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
        5 sections actives
      </span>
    </div>
  </div>
)

// ─── Card : Playlists ────────────────────────────────────────────────────────

const PlaylistsCard = ({ playlists, onNew, onDelete, onDeleteMany }) => {
  const [selected, setSelected] = useState([])
  const [selectMode, setSelectMode] = useState(false)

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleDeleteMany = () => {
    onDeleteMany(selected)
    setSelected([])
    setSelectMode(false)
  }

  const handleCancelSelect = () => {
    setSelected([])
    setSelectMode(false)
  }

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
        >
          <IconFilm />
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton mode sélection multiple */}
          {playlists.length > 0 && !selectMode && (
            <button
              onClick={() => setSelectMode(true)}
              className="px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'rgba(248,113,113,0.7)', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'rgba(248,113,113,0.7)' }}
            >
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
      <p className="text-xs mb-4 shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Sélections de films du festival
      </p>

      {/* Liste scrollable */}
      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.3) transparent' }}
      >
        {playlists.map(pl => (
          <div
            key={pl.id}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all"
            style={{
              background: selected.includes(pl.id) ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected.includes(pl.id) ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
            }}
          >
            {/* Checkbox en mode sélection multiple */}
            {selectMode && (
              <input
                type="checkbox"
                checked={selected.includes(pl.id)}
                onChange={() => toggleSelect(pl.id)}
                className="cursor-pointer shrink-0"
                style={{ accentColor: '#a78bfa', width: 13, height: 13 }}
              />
            )}
            <div className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: pl.status === 'active' ? '#4ade80' : '#facc15' }} />
            <span
              className="text-sm truncate flex-1"
              style={{ color: selected.includes(pl.id) ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)' }}
            >
              {pl.name}
            </span>
            {!selectMode && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <IconClapperboard /> {pl.films}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <IconUsers /> {pl.jury}
                </span>
                {/* Bouton suppression individuelle */}
                <button
                  onClick={() => onDelete(pl.id)}
                  className="ml-1 p-1 rounded-lg cursor-pointer transition-all"
                  style={{ color: 'rgba(248,113,113,0.35)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.35)'; e.currentTarget.style.background = 'transparent' }}
                  title="Supprimer"
                >
                  <IconTrash size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Barre d'actions en mode sélection multiple */}
      {selectMode ? (
        <div className="mt-3 flex gap-2 shrink-0">
          <button
            onClick={handleCancelSelect}
            className="flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Annuler
          </button>
          <button
            onClick={handleDeleteMany}
            disabled={selected.length === 0}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: selected.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
              color: selected.length > 0 ? '#f87171' : 'rgba(255,255,255,0.2)',
              border: `1px solid ${selected.length > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}`,
              cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <IconTrash size={12} />
            Supprimer {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
        </div>
      ) : (
        /* Bouton ajout fixe en bas */
        <button
          onClick={onNew}
          className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-all cursor-pointer shrink-0 flex items-center justify-center gap-1.5"
          style={{ border: '2px dashed rgba(139,92,246,0.25)', color: 'rgba(139,92,246,0.6)', background: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
            e.currentTarget.style.color = '#c084fc'
            e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'
            e.currentTarget.style.color = 'rgba(139,92,246,0.6)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <IconPlus /> Nouvelle playlist
        </button>
      )}
    </div>
  )
}

// ─── Card : Assigner Films & Jury ────────────────────────────────────────────

const AssignCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="rounded-2xl p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden flex flex-col"
    style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
  >
    <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none"
      style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

    <div className="flex items-center justify-between mb-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
      >
        <IconTarget />
      </div>
      <span
        className="transition-transform duration-300 group-hover:translate-x-1"
        style={{ color: 'rgba(139,92,246,0.5)' }}
      >
        <IconChevronRight />
      </span>
    </div>

    <h3 className="font-bold text-white mb-1">Assigner Films & Jury</h3>
    <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Associez des films et membres du jury à vos playlists
    </p>
    <div className="flex gap-2 flex-wrap mt-auto">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
        <IconClapperboard /> 6 films
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
        <IconUsers /> 5 membres jury
      </span>
    </div>
  </div>
)

// ─── Page Configuration ──────────────────────────────────────────────────────

const Configuration = () => {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('/admin/jury-lists')
        const normalized = (data.playlists || []).map(pl => ({
          id: pl.id,
          name: pl.name,
          films: pl.filmsCount || 0,
          jury: pl.juryCount || 0,
          status: pl.status || 'draft'
        }))
        setPlaylists(normalized)
      } catch (error) {
        console.error('Erreur chargement playlists :', error)
      }
    }

    fetchPlaylists()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/jury-list/${id}`)
      setPlaylists(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Erreur suppression playlist :', error)
    }
  }

  const handleDeleteMany = async (ids) => {
    try {
      await axios.delete('/admin/jury-lists', { data: { ids } })
      setPlaylists(prev => prev.filter(p => !ids.includes(p.id)))
    } catch (error) {
      console.error('Erreur suppression playlists :', error)
    }
  }

  return (
    <div className="p-6 min-h-screen" style={{ background: '#0f0f1a' }}>
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Configuration</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Gérez les paramètres du festival
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch" style={{ gridAutoRows: '320px' }}>
          <HomeConfigCard onClick={() => { /* navigate('/admin/home-config') */ }} />
          <PlaylistsCard
            playlists={playlists}
            onNew={() => setShowModal(true)}
            onDelete={handleDelete}
            onDeleteMany={handleDeleteMany}
          />
          <AssignCard onClick={() => navigate('/competition-animation')} />
        </div>

      </div>

      {showModal && (
        <NewPlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={p => setPlaylists(prev => [...prev, p])}
        />
      )}
    </div>
  )
}

export default Configuration