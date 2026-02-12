import { useState, useEffect, useRef } from "react";
import axios from '../config/axiosConfig';
import { Search, ChevronRight, ChevronLeft, Check, X, Clock, Globe, Users, LayoutDashboard, Film as FilmIcon, BarChart3, Calendar, Settings } from "lucide-react";

/* ─────────────────────────── DONNÉES ─────────────────────────── */
const INITIAL_FILMS = [
  { id: 1,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: true, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 2,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 3,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "attente", avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 4,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "refuse",  avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 5,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: true, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 6,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "attente", avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 7,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 8,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 9,  titre: "SYNTHETICA : L'AUBE", real: "Julien Dupond", date: "12/01/2026", statut: "valide",  avant: false, synopsis: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques.", duree: 87, email: "julien@example.com", ville: "Paris", tags: "Science-Fiction, IA", youtubeId: "dQw4w9WgXcQ" },
  { id: 10, titre: "NOVA DIMENSION",       real: "Sophie Martin",  date: "08/01/2026", statut: "attente", avant: false, synopsis: "Un voyage à travers les dimensions parallèles et les réalités alternatives.", duree: 95, email: "sophie@example.com", ville: "Lyon", tags: "Aventure, Science-Fiction", youtubeId: "dQw4w9WgXcQ" },
  { id: 11, titre: "L'OMBRE DU FUTUR",     real: "Marc Leblanc",   date: "05/01/2026", statut: "valide",  avant: false, synopsis: "Une histoire de dystopie technologique et de rébellion humaine.", duree: 102, email: "marc@example.com", ville: "Marseille", tags: "Thriller, Drame", youtubeId: "dQw4w9WgXcQ" },
  { id: 12, titre: "FRAGMENTS",            real: "Amira Khoury",   date: "03/01/2026", statut: "refuse",  avant: false, synopsis: "Des fragments de mémoires entrecroisées dans une réalité fragmentée.", duree: 76, email: "amira@example.com", ville: "Toulouse", tags: "Expérimental, Drame", youtubeId: "dQw4w9WgXcQ" },
  { id: 13, titre: "ÉQUINOXE",             real: "Thomas Roux",    date: "01/01/2026", statut: "valide",  avant: true, synopsis: "L'équilibre fragile entre lumière et obscurité, nature et technologie.", duree: 88, email: "thomas@example.com", ville: "Nice", tags: "Poétique, Nature", youtubeId: "dQw4w9WgXcQ" },
  { id: 14, titre: "LUX PERPETUA",         real: "Elena Vasquez",  date: "29/12/2025", statut: "attente", avant: false, synopsis: "La lumière éternelle dans les profondeurs de l'âme humaine.", duree: 93, email: "elena@example.com", ville: "Bordeaux", tags: "Poétique, Philosophie", youtubeId: "dQw4w9WgXcQ" },
  { id: 15, titre: "RESONANCE",            real: "David Chen",     date: "27/12/2025", statut: "valide",  avant: false, synopsis: "Les échos de musique cosmique résonnent à travers les mondes.", duree: 84, email: "david@example.com", ville: "Lille", tags: "Musique, Sci-Fi", youtubeId: "dQw4w9WgXcQ" },
  { id: 16, titre: "SABLE & CENDRES",      real: "Nina Duval",     date: "24/12/2025", statut: "refuse",  avant: false, synopsis: "Poussière du temps, cendres du passé et sable de l'avenir.", duree: 79, email: "nina@example.com", ville: "Nantes", tags: "Expérimental, Drame", youtubeId: "dQw4w9WgXcQ" },
  { id: 17, titre: "HYPNOSIS",             real: "Paul Bernard",   date: "20/12/2025", statut: "valide",  avant: false, synopsis: "Un voyage hypnotique à travers les labyrinthes de l'inconscient.", duree: 91, email: "paul@example.com", ville: "Strasbourg", tags: "Psychologique, Drame", youtubeId: "dQw4w9WgXcQ" },
  { id: 18, titre: "ZÉRO GRAVITÉ",         real: "Laure Simon",    date: "18/12/2025", statut: "attente", avant: false, synopsis: "Perte de gravité, perte de sens, perte de repères.", duree: 86, email: "laure@example.com", ville: "Versailles", tags: "Philosophie, Science-Fiction", youtubeId: "dQw4w9WgXcQ" },
  { id: 19, titre: "MONOLITHE",            real: "Kenji Tanaka",   date: "15/12/2025", statut: "valide",  avant: true, synopsis: "Un monolithe de silence au cœur de la modernité effrénée.", duree: 97, email: "kenji@example.com", ville: "Cannes", tags: "Monumentalité, Art", youtubeId: "dQw4w9WgXcQ" },
  { id: 20, titre: "CIRCUIT FERMÉ",        real: "Fatima Ndiaye",  date: "12/12/2025", statut: "valide",  avant: false, synopsis: "Une boucle infinie d'énergie, de mouvement et de transformation.", duree: 82, email: "fatima@example.com", ville: "Grenoble", tags: "Abstrait, Énergie", youtubeId: "dQw4w9WgXcQ" },
];

const PER_PAGE = 9;

const GRADIENTS = [
  "from-violet-600 to-violet-800",
  "from-blue-600 to-blue-800",
  "from-cyan-600 to-cyan-800",
  "from-purple-600 to-purple-800",
  "from-indigo-600 to-indigo-800",
  "from-fuchsia-600 to-fuchsia-800",
  "from-rose-600 to-rose-800",
  "from-orange-600 to-orange-800",
];



/* ─────────────────────────── BADGE STATUT ────────────────────── */
const BADGE_CONFIG = {
  valide:  { cls: "bg-green-900 text-green-200", label: "VALIDÉ" },
  attente: { cls: "bg-amber-900 text-amber-200", label: "EN ATTENTE" },
  refuse:  { cls: "bg-red-900 text-red-200", label: "REFUSÉ" },
};

function Badge({ statut }) {
  const cfg = BADGE_CONFIG[statut] || BADGE_CONFIG.attente;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${cfg.cls}`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────── TOGGLE ──────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex w-14 h-7 rounded-full cursor-pointer"
      style={{
        background: checked ? '#10b981' : '#d1d5db',
      }}>
      <input type="checkbox" checked={checked} onChange={onChange}
        className="sr-only" />
      <span className="absolute inset-0 rounded-full transition-colors"
        style={{ background: checked ? '#10b981' : '#d1d5db' }}>
        <span className="absolute top-1 transition-all duration-200 w-5 h-5 bg-white rounded-full shadow"
          style={{ left: checked ? '24px' : '2px' }} />
      </span>
    </label>
  );
}

/* ─────────────────────────── MODAL DÉTAIL FILM ─────────────────── */
function FilmDetailModal({ film, isOpen, onClose, onApprove, onReject }) {
  if (!isOpen || !film) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec fermeture */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{film.titre}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition text-neutral-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Lecteur vidéo */}
          <div className="bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="420"
              src={`https://www.youtube.com/embed/${film.youtubeId}`}
              title={film.titre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Réalisateur</p>
              <p className="text-white font-bold text-lg mt-1">{film.real}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Durée</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock size={16} className="text-violet-400" />
                <p className="text-white font-bold text-lg">{film.duree} min</p>
              </div>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Email</p>
              <p className="text-white font-bold text-lg mt-1 truncate">{film.email}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4">
              <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Localisation</p>
              <div className="flex items-center gap-2 mt-1">
                <Globe size={16} className="text-violet-400" />
                <p className="text-white font-bold text-lg">{film.ville}</p>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold mb-2">Synopsis</p>
            <p className="text-neutral-200 leading-relaxed">{film.synopsis}</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {film.tags.split(',').map((tag, idx) => (
              <span key={idx} className="bg-violet-900 text-violet-200 px-3 py-1 rounded-full text-sm font-semibold">
                {tag.trim()}
              </span>
            ))}
          </div>

          {/* Boutons Action */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <button
              onClick={() => { onApprove(); onClose(); }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Check size={18} /> Approuver
            </button>
            <button
              onClick={() => { onReject(); onClose(); }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <X size={18} /> Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── TOAST ───────────────────────────── */
function Toast({ toast }) {
  return (
    <div className={`fixed bottom-8 right-8 bg-neutral-900 text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-2xl border border-neutral-800 flex items-center gap-3 transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      style={{ zIndex: 9999 }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: toast.color }} />
      {toast.msg}
    </div>
  );
}

/* ─────────────────────────── SIDEBAR ─────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",            key: "dashboard"   },
  { icon: FilmIcon,        label: "Gestion Films",        key: "films"       },
  { icon: Users,           label: "Jury",                 key: "jury"        },
  { icon: BarChart3,       label: "Résultats & Classement", key: "resultats" },
  { icon: Calendar,        label: "Événements",           key: "evenements"  },
  { icon: Settings,        label: "Configuration",        key: "config"      },
];

function Sidebar({ active }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-neutral-950 flex flex-col p-7 z-10 border-r border-neutral-800">
      {/* Logo */}
      <div className="mb-8 bg-violet-600 text-white font-bold text-sm px-3 py-2 rounded w-fit tracking-wider">
        MARS.A.I
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ icon: IconComp, label, key }) => {
          const isActive = key === active;
          return (
            <div key={key} className={`flex items-center gap-3 px-5 py-3 rounded-lg cursor-pointer transition-all text-sm font-semibold uppercase tracking-wider ${
              isActive 
                ? 'bg-violet-600 text-white border-l-4 border-violet-400' 
                : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-900'
            }`}>
              <IconComp size={16} className={isActive ? 'opacity-100' : 'opacity-70'} />
              {label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

/* ─────────────────────────── COMPOSANT PRINCIPAL ─────────────── */
export default function GestionFilms() {
  const [films, setFilms]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFilms, setTotalFilms] = useState(0);
  const [query, setQuery]         = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage]           = useState(1);
  const [statutFilter, setStatutFilter] = useState("");
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast]         = useState({ visible: false, msg: "", color: "#4f8ef7" });
  const toastTimer                = useRef(null);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1); // Reset à la page 1 lors d'une recherche
    }, 500); // 500ms de délai

    return () => clearTimeout(timer);
  }, [query]);

  // Mapping des statuts backend -> frontend
  const mapStatus = (backendStatus) => {
    const statusMap = {
      'approved': 'valide',
      'rejected': 'refuse',
      'submitted': 'attente'
    };
    return statusMap[backendStatus] || 'attente';
  };

  // Mapping des statuts frontend -> backend
  const mapStatusToBackend = (frontendStatus) => {
    const statusMap = {
      'valide': 'approved',
      'refuse': 'rejected',
      'attente': 'submitted'
    };
    return statusMap[frontendStatus] || '';
  };

  // Mapping des données backend vers format frontend
  const mapFilmData = (backendFilm) => {
    return {
      id: backendFilm.id,
      titre: backendFilm.title_original,
      real: backendFilm.Director ? `${backendFilm.Director.first_name} ${backendFilm.Director.last_name}` : 'N/A',
      date: new Date(backendFilm.createdAt).toLocaleDateString('fr-FR'),
      statut: mapStatus(backendFilm.approval_status),
      avant: false, // À adapter selon votre logique
      synopsis: backendFilm.synopsis_original || '',
      duree: Math.floor(backendFilm.duration_seconds / 60) || 0,
      email: backendFilm.Director?.email || 'N/A',
      ville: backendFilm.Director?.city || 'N/A',
      tags: backendFilm.theme_tags || '',
      youtubeId: backendFilm.youtube_id || '',
      posterUrl: backendFilm.poster_url || ''
    };
  };

  // Fonction pour récupérer les films depuis l'API
  const fetchFilms = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: PER_PAGE,
        search: debouncedQuery,
        status: mapStatusToBackend(statutFilter)
      };

      const response = await axios.get('/submissions', { params });
      
      const mappedFilms = response.data.data.map(mapFilmData);
      setFilms(mappedFilms);
      setTotalPages(response.data.totalPages);
      setTotalFilms(response.data.totalItems);
    } catch (error) {
      console.error("Erreur lors de la récupération des films:", error);
      showToast("Erreur lors du chargement des films", "#f05a5a");
      setFilms([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect pour charger les films au montage et lors des changements de filtres
  useEffect(() => {
    fetchFilms();
  }, [page, debouncedQuery, statutFilter]);

  /* helpers */
  const showToast = (msg, color) => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, msg, color });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400);
  };

  // Fonction pour modérer un film (approuver ou rejeter)
  const moderateFilm = async (filmId, action) => {
    try {
      const endpoint = `/admin/moderation/${filmId}`;
      const payload = action === 'approved' 
        ? { status: 'approved' }
        : { 
            status: 'rejected', 
            issue_type: 'quality', 
            description: 'Film rejeté par l\'administrateur' 
          };

      await axios.post(endpoint, payload);
      
      const labels = { 
        'approved': "Film approuvé ✓", 
        'rejected': "Film rejeté" 
      };
      const colors = { 
        'approved': "#2ac98e", 
        'rejected': "#f05a5a" 
      };
      
      showToast(labels[action], colors[action]);
      
      // Recharger les films après modération
      fetchFilms();
    } catch (error) {
      console.error("Erreur lors de la modération:", error);
      showToast("Erreur lors de la modération du film", "#f05a5a");
    }
  };

  const changeStatut = (id, statut) => {
    // Mapping frontend -> backend
    const backendAction = statut === 'valide' ? 'approved' : 'rejected';
    moderateFilm(id, backendAction);
  };

  const toggleAvant = (id, val) => {
    // Cette fonctionnalité nécessiterait une route backend dédiée
    // Pour l'instant on garde le comportement local
    setFilms(prev => prev.map(f => f.id === id ? { ...f, avant: val } : f));
    showToast(val ? "Film mis en avant" : "Retiré de la mise en avant", "#4f8ef7");
  };


  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* MAIN */}
      <main className="flex-1 p-9 min-h-screen">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-7">
          <span className="text-xs text-neutral-400 uppercase tracking-widest">
            Back-Office Officiel
          </span>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-neutral-200 uppercase tracking-wide">Administrateur</div>
              <div className="text-xs text-violet-400">admin@email.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center font-bold text-sm">A</div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-bold">Admin Management</span>
          <h1 className="text-5xl font-bold text-white mb-2">GESTION FILMS</h1>
          <p className="text-neutral-400 text-sm">Gérez l'intégralité des soumissions, approuvez ou rejetez les films soumis.</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden shadow-lg">

          {/* Search & Filter */}
          <div className="p-5 border-b border-neutral-800">
            <div className="flex gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={16} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher un film ou un réalisateur…"
                  className="w-full border border-neutral-700 rounded-lg pl-9 pr-4 py-2 bg-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:border-violet-500 focus:bg-neutral-800 focus:outline-none transition"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStatutFilter(""); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition ${
                    statutFilter === ""
                      ? "bg-violet-600 text-white border border-violet-500"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => { setStatutFilter("valide"); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition ${
                    statutFilter === "valide"
                      ? "bg-green-700 text-white border border-green-600"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  Validé
                </button>
                <button
                  onClick={() => { setStatutFilter("attente"); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition ${
                    statutFilter === "attente"
                      ? "bg-amber-700 text-white border border-amber-600"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  En attente
                </button>
                <button
                  onClick={() => { setStatutFilter("refuse"); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition ${
                    statutFilter === "refuse"
                      ? "bg-red-700 text-white border border-red-600"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-neutral-300"
                  }`}
                >
                  Refusé
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-neutral-400">Chargement des films...</div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-800 border-b border-neutral-700">
                    {["Affiche", "Titre", "Réalisateur", "Statut", "Date", "Actions", ""].map(h => (
                      <th key={h} className="text-xs font-bold uppercase text-neutral-400 px-4 py-3 text-left tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {films.map(f => {
                    return (
                      <tr key={f.id} className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors">

                        {/* Affiche */}
                        <td className="px-4 py-3">
                          <div className="w-16 h-20 rounded overflow-hidden bg-neutral-800 flex items-center justify-center">
                            {f.posterUrl ? (
                              <img 
                                src={`http://localhost:3000${f.posterUrl}`} 
                                alt={f.titre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80"%3E%3Crect fill="%23262626" width="64" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="24"%3E🎬%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="text-neutral-600 text-2xl">🎬</div>
                            )}
                          </div>
                        </td>

                        {/* Titre */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-sm text-white">{f.titre}</div>
                          <div className="text-xs text-neutral-400">Film soumis</div>
                        </td>

                        {/* Réalisateur */}
                        <td className="px-4 py-3 text-neutral-300 font-medium text-sm">{f.real}</td>

                        {/* Statut */}
                        <td className="px-4 py-3"><Badge statut={f.statut} /></td>

                        {/* Date */}
                        <td className="px-4 py-3 text-neutral-400 font-medium text-sm">{f.date}</td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-nowrap">
                            <button
                              onClick={() => changeStatut(f.id, "valide")}
                              disabled={f.statut === 'valide'}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-green-900 text-green-200 border border-green-700 hover:bg-green-800 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check size={13} /> Approuver
                            </button>
                            <button
                              onClick={() => changeStatut(f.id, "refuse")}
                              disabled={f.statut === 'refuse'}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider bg-red-900 text-red-200 border border-red-700 hover:bg-red-800 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X size={13} /> Rejeter
                            </button>
                          </div>
                        </td>

                        {/* Détail */}
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => { setSelectedFilm(f); setIsModalOpen(true); }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-700 bg-neutral-800 text-violet-400 hover:border-violet-500 hover:bg-neutral-700 transition"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {films.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-neutral-400 text-sm">
                        Aucun film trouvé {query && `pour « ${query} »`}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center gap-3 p-6 border-t border-neutral-800">
            <div className="flex gap-2">
              {/* Précédent */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`w-8 h-8 rounded border flex items-center justify-center transition ${
                  page === 1 
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-600 opacity-50 cursor-not-allowed'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-violet-500 hover:text-violet-400'
                }`}
              >
                <ChevronLeft size={14} />
              </button>

              {/* Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-semibold transition ${
                    p === page
                      ? 'border-violet-500 bg-violet-600 text-white'
                      : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-violet-500 hover:text-violet-400'
                  }`}
                >
                  {p}
                </button>
              ))}

              {/* Suivant */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className={`w-8 h-8 rounded border flex items-center justify-center transition ${
                  page === totalPages || totalPages === 0
                    ? 'border-neutral-700 bg-neutral-900 text-neutral-600 opacity-50 cursor-not-allowed'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:border-violet-500 hover:text-violet-400'
                }`}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              Page {page} sur {totalPages || 1} — {totalFilms} film{totalFilms > 1 ? "s" : ""} trouvé{totalFilms > 1 ? "s" : ""}
            </div>
          </div>

        </div>{/* /card */}
      </main>

      <FilmDetailModal 
        film={selectedFilm} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onApprove={() => selectedFilm && changeStatut(selectedFilm.id, "valide")}
        onReject={() => selectedFilm && changeStatut(selectedFilm.id, "refuse")}
      />
      <Toast toast={toast} />
    </div>
  );
}
