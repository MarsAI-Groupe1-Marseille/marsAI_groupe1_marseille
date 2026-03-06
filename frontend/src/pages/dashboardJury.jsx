// Indique à Next.js que ce composant s’exécute côté navigateur. Obligatoire car on utilise 
// Obligatoire ici car on utilise :
// useState
// useRef
// interactions (clic, modal, scroll…)
"use client";

// useRef : Permet de manipuler directement un élément du DOM comme contrôler le scroll horizontal du slider.
// X Icone de la fermeture de la modal
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

export default function DashboardJury() {
  const { t } = useLanguage();
  // Gère l'ouverture de la modal.
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  // Référence vers le conteneur scrollable des vidéos.
  const sliderRef = useRef(null);
  const [currentMode, setCurrentMode] = useState('dark');
  
  // États pour les playlists
  const [playlists, setPlaylists] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluatedVideoIds, setEvaluatedVideoIds] = useState(new Set());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mode = document.documentElement.getAttribute('data-mode') || 'dark';
      setCurrentMode(mode);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    const initialMode = document.documentElement.getAttribute('data-mode') || 'dark';
    setCurrentMode(initialMode);
    return () => observer.disconnect();
  }, []);

  const resolvePosterUrl = (poster) => {
    if (!poster) return '/images/placeholder.jpg';
    if (poster.startsWith('http://') || poster.startsWith('https://')) return poster;
    const normalized = poster.startsWith('/') ? poster : `/${poster}`;
    return `${import.meta.env.VITE_API_URL}${normalized}`;
  };

  // Récupérer les playlists et les votes de l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les playlists et les votes en parallèle
        const [playlistsRes, votesRes] = await Promise.all([
          axios.get('/jury/my-playlists'),
          axios.get('/jury/my-votes')
        ]);

        // Extraire les votes et les IDs des films évalués
        if (votesRes.data.success && votesRes.data.votes) {
          setVotes(votesRes.data.votes);
          const evaluated = new Set(votesRes.data.votes.map(v => v.submission_id));
          setEvaluatedVideoIds(evaluated);
        }

        if (playlistsRes.data.success && playlistsRes.data.playlists) {
          // Les données de l'API sont déjà au bon format
          setPlaylists(playlistsRes.data.playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            videos: (playlist.videos || []).map(video => ({
              id: video.id,
              title: video.title,
              director: video.director?.full_name || t('dashboard_jury_unknown_director'),
              thumbnail: resolvePosterUrl(video.poster),
              youtubeId: video.youtubeId,
              status: 'pas'
            }))
          })));
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tableau de classes Taiwind pour donner une couleur différentes à chaque playlist.
  const gradients = [
    "from-purple-700 via-indigo-600 to-purple-900",
    "from-pink-600 via-rose-500 to-red-700",
    "from-cyan-500 via-blue-600 to-indigo-800",
  ];


// Calcul des statistiques à partir des votes du jury
  const liked = votes.filter(v => v.vote_status === "LIKE").length;
  const disliked = votes.filter(v => v.vote_status === "DISLIKE").length;
  const discussion = votes.filter(v => v.vote_status === "DISCUSS").length;
  
  // Nombre total de films assignés
  const totalFilmsAssigned = playlists.reduce((acc, playlist) => acc + (playlist.videos?.length || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to right, rgba(76, 29, 149, 0.8) 0%, rgba(112, 26, 117, 0.4) 40%, transparent 100%)',
      backgroundColor: currentMode === 'light' ? '#ffffff' : '#0f0f0f',
      color: currentMode === 'light' ? '#000000' : '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-6">

        {/* BLOCS STATISTIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-14">

          <StatCard            title={t('dashboard_jury_films_assigned')}
            value={totalFilmsAssigned}
            gradient="from-blue-500 to-cyan-600"
            currentMode={currentMode}
          />

          <StatCard            title={t('dashboard_jury_like')}
            value={liked}
            gradient="from-green-500 to-emerald-600"
            currentMode={currentMode}
          />

          <StatCard
            title={t('dashboard_jury_dislike')}
            value={disliked}
            gradient="from-red-500 to-rose-600"
            currentMode={currentMode}
          />

          <StatCard
            title={t('dashboard_jury_discuss')}
            value={discussion}
            gradient="from-yellow-400 to-orange-500"
            currentMode={currentMode}
          />

        </div>

        {/* HEADER */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: currentMode === 'light' ? '2.25rem' : '3rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
            backgroundImage: 'linear-gradient(to right, #a78bfa, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t('dashboard_jury_my_playlists')}
          </h1>
          <p style={{ color: currentMode === 'light' ? '#999999' : '#a3a3a3' }}>
            {t('dashboard_jury_select_playlist')}
          </p>
        </header>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              animation: 'spin 1s linear infinite',
              borderRadius: '50%',
              height: '3rem',
              width: '3rem',
              borderBottomWidth: '2px',
              borderBottomColor: '#a78bfa'
            }}></div>
            <p style={{ color: currentMode === 'light' ? '#999999' : '#a3a3a3', marginTop: '1rem' }}>{t('dashboard_jury_loading')}</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#ef4444' }}>
            <p>{t('dashboard_jury_error_loading')}</p>
          </div>
        )}

        {/* PLAYLIST GRID */}
        {/* Affichage conditionnel des playlists : Si aucune playlist n'est sélectionnée alors on affiche la grille. */}
        {!loading && !error && !selectedPlaylist && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '80rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {playlists.map((playlist, i) => (
              <div
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                style={{
                  cursor: 'pointer',
                  borderRadius: '1.5rem',
                  padding: '4px',
                  backgroundImage: `linear-gradient(135deg, var(--grad${i % 3}))`,
                  transform: 'scale(1)',
                  transition: 'transform 0.3s',
                  '--grad0': 'rgb(126, 34, 206), rgb(79, 70, 229)',
                  '--grad1': 'rgb(236, 72, 153), rgb(244, 63, 94)',
                  '--grad2': 'rgb(34, 211, 238), rgb(37, 99, 235)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#1a1a1a',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  height: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: currentMode === 'light' ? '#000000' : '#ffffff' }}>
                    {playlist.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */} 
        {/* Si une playlist existe alors afficher la modal */}
        {selectedPlaylist && (
          <section style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: currentMode === 'light' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 50
          }}>
            
            <div style={{
              backgroundImage: 'linear-gradient(135deg, rgba(126, 58, 237, 0.15), rgba(124, 58, 237, 0.1))',
              backgroundColor: currentMode === 'light' ? '#ffffff' : '#1a1a1a',
              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : 'rgba(147, 51, 234, 0.25)'}`,
              backdropFilter: 'blur(12px)',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '80rem',
              padding: '2rem',
              position: 'relative'
            }}>

              <button
                onClick={() => setSelectedPlaylist(null)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  color: currentMode === 'light' ? '#666666' : '#d1d5db',
                  cursor: 'pointer',
                  fontSize: '28px',
                  background: 'none',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = currentMode === 'light' ? '#000000' : '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = currentMode === 'light' ? '#666666' : '#d1d5db'}
              >
                ✕
              </button>

              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                marginBottom: '2rem',
                color: currentMode === 'light' ? '#7c3aed' : '#c084fc'
              }}>
                {selectedPlaylist.name}
              </h2>

              {/* SLIDER */}
              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <div
                  ref={sliderRef}
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1.5rem',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {selectedPlaylist.videos.map((video) => {
                    const isEvaluated = evaluatedVideoIds.has(video.id);
                    return (
                    <Link
                      key={video.id}
                      // Redirection vers la page notation jury
                      to={`/notationjury/${video.id}`}
                      style={{
                        position: 'relative',
                        flexShrink: 0,
                        width: '224px',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#262626',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        textDecoration: 'none',
                        display: 'block',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          style={{
                            width: '100%',
                            height: '160px',
                            objectFit: 'cover',
                            transition: 'transform 0.5s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />

                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          opacity: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.3s'
                        }}
                        onMouseEnter={(e) => e.style.opacity = '1'}
                        onMouseLeave={(e) => e.style.opacity = '0'}>

                          <div style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: '#ffffff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000000',
                            fontSize: '20px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            transform: 'scale(1)',
                            transition: 'transform 0.3s'
                          }}>
                            ▶
                          </div>
                        </div>

                        {/* Badge évalué */}
                        {isEvaluated && (
                          <div style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            backgroundColor: '#22c55e',
                            color: '#ffffff',
                            borderRadius: '50%',
                            padding: '0.375rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>

                      <div style={{ padding: '1rem' }}>
                        <p style={{
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: currentMode === 'light' ? '#000000' : '#ffffff'
                        }}>
                          {video.title}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: currentMode === 'light' ? '#999999' : '#a3a3a3'
                        }}>
                          {video.director}
                        </p>
                      </div>
                    </Link>
                    );
                  })}
                </div>

                {/* CHEVRONS */}
                <button
                  onClick={() =>
                    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '-1rem',
                    transform: 'translateY(-50%)',
                    backgroundColor: currentMode === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.8)'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)'; }}
                  onFocus={() => { const parent = document.querySelector('[data-slider]')?.parentElement; if (parent) parent.style.display = 'block'; }}
                >
                  ◀
                </button>

                <button
                  onClick={() =>
                    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-1rem',
                    transform: 'translateY(-50%)',
                    backgroundColor: currentMode === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.8)'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)'; }}
                  onFocus={() => { const parent = document.querySelector('[data-slider]')?.parentElement; if (parent) parent.style.display = 'block'; }}
                >
                  ▶
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Animations */}
      {/* @keyframes fadeIn et scaleIn Ajoute animation : Apparition douce Zoom léger */}
      <style jsx>{`
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
// Composant réutilisable avec Props : title, value et gradient pour personnaliser le contenu et le style de chaque carte statistique.
function StatCard({ title, value, gradient, currentMode }) {
  const gradientMap = {
    'from-blue-500 to-cyan-600': { light: 'rgba(59, 130, 246, 0.1)', dark: 'rgba(59, 130, 246, 0.15)', border: currentMode === 'light' ? '#bfdbfe' : 'rgba(59, 130, 246, 0.3)' },
    'from-green-500 to-emerald-600': { light: 'rgba(16, 185, 129, 0.1)', dark: 'rgba(16, 185, 129, 0.15)', border: currentMode === 'light' ? '#d1fae5' : 'rgba(16, 185, 129, 0.3)' },
    'from-red-500 to-rose-600': { light: 'rgba(239, 68, 68, 0.1)', dark: 'rgba(239, 68, 68, 0.15)', border: currentMode === 'light' ? '#fecaca' : 'rgba(239, 68, 68, 0.3)' },
    'from-yellow-400 to-orange-500': { light: 'rgba(217, 119, 6, 0.1)', dark: 'rgba(217, 119, 6, 0.15)', border: currentMode === 'light' ? '#fed7aa' : 'rgba(217, 119, 6, 0.3)' }
  };
  
  const colors = gradientMap[gradient] || gradientMap['from-blue-500 to-cyan-600'];

  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: '1rem',
      backgroundColor: currentMode === 'light' ? colors.light : colors.dark,
      border: `1px solid ${colors.border}`,
      textAlign: 'center',
      boxShadow: currentMode === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : '0 10px 15px -3px rgba(0,0,0,0.3)',
      transition: 'transform 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <p style={{ fontSize: '0.875rem', opacity: 0.8, color: currentMode === 'light' ? '#666666' : '#a3a3a3' }}>{title}</p>
      <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.5rem', color: currentMode === 'light' ? '#000000' : '#ffffff' }}>{value}</h3>
    </div>
  );
}
