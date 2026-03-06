import React, { useEffect, useState } from "react";
import { Plus, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../config/axiosConfig.js";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

/**
 * ============================================================
 * COMPOSANT: JuryAssignment
 * ============================================================
 * Cette page permet aux admins/modos de gérer une compétition
 * animée : sélectionner les films à juger et assigner les jurés.
 * 
 * Structure:
 * - Header avec titre et boutons de sauvegarde
 * - Section 1: Gestion des films (disponibles ↔ sélectionnés)
 * - Section 2: Gestion des jurés (disponibles ↔ assignés)
 */

export default function JuryAssignment() {
  const { t } = useLanguage();
  const { user } = useAuth();
  // ========================================================================
  // ÉTAT: Mode clair/sombre
  // ========================================================================
  const [currentMode, setCurrentMode] = useState('dark');

  // ========================================================================
  // ÉTATS: Données provenant de la base
  // ========================================================================
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [allFilms, setAllFilms] = useState([]);
  const [allJurors, setAllJurors] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedFilms, setSelectedFilms] = useState([]);
  const [jurors, setJurors] = useState([]);
  const [assignedJurors, setAssignedJurors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ========================================================================
  // ÉTAT 5: PAGINATION
  // ========================================================================
  // Gestion de la pagination pour films et jurés
  const itemsPerPage = 6;
  const playlistsPerPage = 6;
  const [currentPagePlaylists, setCurrentPagePlaylists] = useState(0);
  const [currentPageFilmsAvailable, setCurrentPageFilmsAvailable] = useState(0);
  const [currentPageFilmsSelected, setCurrentPageFilmsSelected] = useState(0);
  const [currentPageJurorsAvailable, setCurrentPageJurorsAvailable] = useState(0);
  const [currentPageJurorsAssigned, setCurrentPageJurorsAssigned] = useState(0);

  const formatDuration = (seconds) => {
    if (!seconds) return t('jury_assignment_duration_unknown');
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  };

  const mapFilmFromSubmission = (submission) => ({
    id: submission.id,
    title: submission.title_original,
    durationSeconds: submission.duration_seconds || 0,
    duration: formatDuration(submission.duration_seconds)
  });

  const mapJurorFromUser = (user) => ({
    id: user.id,
    name: user.full_name || user.email || "Jury",
    role: user.role || "jury",
    email: user.email
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsRes, submissionsRes, usersRes] = await Promise.all([
          axios.get("/admin/jury-lists"),
          axios.get("/submissions", {
            params: { status: "approved", page: 1, limit: 1000, lang: "fr" }
          }),
          axios.get("/users")
        ]);

        const playlistData = playlistsRes.data.playlists || [];
        const approvedFilms = (submissionsRes.data.data || []).map(mapFilmFromSubmission);
        const juryUsers = (usersRes.data || [])
          .filter(user => user.role === "jury")
          .map(mapJurorFromUser);

        setPlaylists(playlistData);
        setAllFilms(approvedFilms);
        setAllJurors(juryUsers);
        setCurrentPlaylistId(playlistData[0]?.id || null);
      } catch (error) {
        console.error("Erreur chargement competition animation :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentPlaylist = playlists.find(pl => pl.id === currentPlaylistId);
    const playlistFilms = (currentPlaylist?.films || []).map(film => ({
      id: film.id,
      title: film.title_original || film.title || "Sans titre",
      durationSeconds: film.duration_seconds || 0,
      duration: formatDuration(film.duration_seconds)
    }));
    const playlistJurors = (currentPlaylist?.jury || []).map(mapJurorFromUser);

    const selectedFilmIds = new Set(playlistFilms.map(film => film.id));
    const selectedJurorIds = new Set(playlistJurors.map(juror => juror.id));

    setSelectedFilms(playlistFilms);
    setAssignedJurors(playlistJurors);
    setFilms(allFilms.filter(film => !selectedFilmIds.has(film.id)));
    setJurors(allJurors.filter(juror => !selectedJurorIds.has(juror.id)));

    setCurrentPageFilmsAvailable(0);
    setCurrentPageFilmsSelected(0);
    setCurrentPageJurorsAvailable(0);
    setCurrentPageJurorsAssigned(0);
  }, [currentPlaylistId, playlists, allFilms, allJurors]);

  // ========================================================================
  // EFFET: Détection du mode clair/sombre
  // ========================================================================
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setCurrentMode(document.documentElement.getAttribute('data-mode') || 'dark');
    });
    
    observer.observe(document.documentElement, { attributes: true });
    setCurrentMode(document.documentElement.getAttribute('data-mode') || 'dark');
    
    return () => observer.disconnect();
  }, []);

  // ========================================================================
  // FONCTION: paginate() - Utilitaire pour calculer les items paginés
  // ========================================================================
  // Retourne une slice des items selon la page actuelle et le nombre par page
  const paginate = (dataArray, pageNumber, perPage = itemsPerPage) => {
    const startIdx = pageNumber * perPage;
    return dataArray.slice(startIdx, startIdx + perPage);
  };

  // ========================================================================
  // FONCTION: getTotalPages() - Calcule le nombre total de pages
  // ========================================================================
  const getTotalPages = (dataArray, perPage = itemsPerPage) => {
    return Math.ceil(dataArray.length / perPage);
  };

  // ========================================================================
  // FONCTION: handleAddFilm()
  // ========================================================================
  // Ajoute un film de la liste "Disponibles" vers "Sélectionnés"
  // Paramètre: film = l'objet film à ajouter
  const handleAddFilm = async (film) => {
    if (!currentPlaylistId || selectedFilms.find(f => f.id === film.id)) return;

    try {
      await axios.post("/admin/assigne-film", {
        jury_list_id: currentPlaylistId,
        submission_id: film.id
      });

      setPlaylists(prev => prev.map(pl => {
        if (pl.id !== currentPlaylistId) return pl;
        const nextFilms = [...(pl.films || []), {
          id: film.id,
          title_original: film.title,
          duration_seconds: film.durationSeconds || 0
        }];
        return { ...pl, films: nextFilms };
      }));
    } catch (error) {
      console.error("Erreur assignation film :", error);
    }
  };


  // ========================================================================
  // FONCTION: handleRemoveFilm()
  // ========================================================================
  // Retire un film de "Sélectionnés" et le remet dans "Disponibles"
  // Paramètre: filmId = l'ID du film à retirer
  const handleRemoveFilm = async (filmId) => {
    if (!currentPlaylistId) return;

    try {
      await axios.delete("/admin/assigne-film", {
        data: { jury_list_id: currentPlaylistId, submission_id: filmId }
      });

      setPlaylists(prev => prev.map(pl => {
        if (pl.id !== currentPlaylistId) return pl;
        const nextFilms = (pl.films || []).filter(film => film.id !== filmId);
        return { ...pl, films: nextFilms };
      }));
    } catch (error) {
      console.error("Erreur retrait film :", error);
    }
  };

  // ========================================================================
  // FONCTION: handleAddJuror()
  // ========================================================================
  // Ajoute un juré de "Disponibles" vers "Assignés"
  // Paramètre: juror = l'objet juré à assigner
  const handleAddJuror = async (juror) => {
    if (!currentPlaylistId || assignedJurors.find(j => j.id === juror.id)) return;

    try {
      await axios.post("/admin/assigne-jury", {
        jury_list_id: currentPlaylistId,
        user_id: juror.id
      });

      setPlaylists(prev => prev.map(pl => {
        if (pl.id !== currentPlaylistId) return pl;
        const nextJurors = [...(pl.jury || []), {
          id: juror.id,
          full_name: juror.name,
          email: juror.email,
          role: "jury"
        }];
        return { ...pl, jury: nextJurors };
      }));
    } catch (error) {
      console.error("Erreur assignation jury :", error);
    }
  };

  // ========================================================================
  // FONCTION: handleRemoveJuror()
  // ========================================================================
  // Retire un juré de "Assignés" et le remet dans "Disponibles"
  // Paramètre: jurorId = l'ID du juré à retirer
  const handleRemoveJuror = async (jurorId) => {
    if (!currentPlaylistId) return;

    try {
      await axios.delete("/admin/assigne-jury", {
        data: { jury_list_id: currentPlaylistId, user_id: jurorId }
      });

      setPlaylists(prev => prev.map(pl => {
        if (pl.id !== currentPlaylistId) return pl;
        const nextJurors = (pl.jury || []).filter(juror => juror.id !== jurorId);
        return { ...pl, jury: nextJurors };
      }));
    } catch (error) {
      console.error("Erreur retrait jury :", error);
    }
  };

  // ========================================================================
  // RENDU JSX: Retourner la structure HTML/React de la page
  // ========================================================================
  const currentPlaylist = playlists.find(pl => pl.id === currentPlaylistId);

  return (
    <div style={{
      minHeight: '100vh',
      background: currentMode === 'light' 
        ? '#ffffff' 
        : 'linear-gradient(to bottom right, #0a0e27, #1a1f3a, #0f1628)'
    }}>
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-12 pb-8 md:pb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left side - Title and description */}
              <div className="text-center md:text-left">
                <span style={{
                  fontSize: '0.75rem',
                  color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '0.75rem'
                }}>
                  {t('admin_space')}
                </span>
                <h1 style={{
                  display: 'flex',
                  justifyContent: currentMode === 'light' ? 'center' : 'flex-start',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: 'clamp(1.875rem, 8vw, 3rem)',
                  fontWeight: 'bold',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '1rem',
                  lineHeight: '1.25'
                }}>
                  <Users size={32} />
                  {t('jury_assignment_title')}
                </h1>
                <p style={{
                  fontSize: '0.875rem',
                  color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                  lineHeight: '1.5',
                  maxWidth: '32rem'
                }}>
                  {t('jury_assignment_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              SECTION 0: LISTE DES PLAYLISTS
              ============================================================ */}
          <section className="mb-8">
            <div style={{
              backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
              border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
              borderRadius: '0.75rem',
              overflow: 'hidden'
            }}>
              <div style={{
                background: currentMode === 'light'
                  ? 'linear-gradient(to right, #7c3aed, #6d28d9)'
                  : 'linear-gradient(to right, #7c3aed, #6d28d9)',
                padding: '2rem',
                paddingY: '1rem'
              }}>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>
                  {t('jury_assignment_playlists')}
                </h2>
              </div>
              <div style={{ padding: '2rem' }}>
                {isLoading ? (
                  <div style={{
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3'
                  }}>
                    {t('jury_assignment_loading')}
                  </div>
                ) : playlists.length === 0 ? (
                  <div style={{
                    color: currentMode === 'light' ? '#999999' : '#737373'
                  }}>
                    {t('jury_assignment_no_playlists')}
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {paginate(playlists, currentPagePlaylists, playlistsPerPage).map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => setCurrentPlaylistId(playlist.id)}
                        style={{
                          textAlign: 'left',
                          border: `1px solid ${playlist.id === currentPlaylistId 
                            ? (currentMode === 'light' ? '#7c3aed' : 'rgba(139,92,246,0.8)') 
                            : (currentMode === 'light' ? '#e5e5e5' : 'rgba(255,255,255,0.08)')}`,
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          transition: 'all 0.3s ease',
                          backgroundColor: playlist.id === currentPlaylistId 
                            ? (currentMode === 'light' ? 'rgba(124,58,237,0.1)' : 'rgba(139,92,246,0.1)')
                            : (currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.03)'),
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          color: currentMode === 'light' ? '#000000' : '#ffffff',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {playlist.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                          marginTop: '0.25rem'
                        }}>
                          {playlist.films?.length || 0} films · {playlist.jury?.length || 0} jurys
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {playlists.length > playlistsPerPage && (
                  <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      onClick={() => setCurrentPagePlaylists(Math.max(0, currentPagePlaylists - 1))}
                      disabled={currentPagePlaylists === 0}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPagePlaylists === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPagePlaylists === 0 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span style={{
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      fontSize: '0.875rem'
                    }}>
                      Page {currentPagePlaylists + 1} / {getTotalPages(playlists, playlistsPerPage)}
                    </span>
                    <button
                      onClick={() => setCurrentPagePlaylists(Math.min(getTotalPages(playlists, playlistsPerPage) - 1, currentPagePlaylists + 1))}
                      disabled={currentPagePlaylists >= getTotalPages(playlists, playlistsPerPage) - 1}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPagePlaylists >= getTotalPages(playlists, playlistsPerPage) - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPagePlaylists >= getTotalPages(playlists, playlistsPerPage) - 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================
              SECTION 1: GESTION DES FILMS
              ============================================================
            Deux colonnes: Films disponibles vs Films sélectionnés
        */}
        <section className="mb-8">
          {/* Card principal avec header dégradé */}
          <div style={{
            backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
            border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
            borderRadius: '0.75rem',
            overflow: 'hidden'
          }}>
            {/* Header avec fond dégradé violet */}
            <div style={{
              background: currentMode === 'light'
                ? 'linear-gradient(to right, #7c3aed, #6d28d9)'
                : 'linear-gradient(to right, #7c3aed, #6d28d9)',
              padding: '2rem',
              paddingY: '1rem'
            }}>
              {/* Titre blanc de la section */}
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {t('jury_assignment_section_films')}
              </h2>
            </div>
            {/* Grille 2 colonnes (1 colonne sur petit écran, 2 sur large) */}
            <div style={{
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* ============================================================
                  COLONNE GAUCHE: FILMS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec le nombre de films disponibles */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '1rem'
                }}>
                  {t('jury_assignment_films_available')} ({films.length})
                </h3>
                {/* Conteneur liste: bordure grise, fond semi-transparent, bord inférieur entre items */}
                <div style={{
                  border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.03)',
                  overflow: 'hidden'
                }}>
                  {/* SI des films sont disponibles, afficher chacun */}
                  {films.length > 0 ? (
                    // .map() = boucle sur chaque film du tableau paginé
                    paginate(films, currentPageFilmsAvailable).map((film) => (
                      // Key = identifiant unique pour React (id du film)
                      <div
                        key={film.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingX: '1rem',
                          paddingY: '0.75rem',
                          backgroundColor: currentMode === 'light' ? '#ffffff' : undefined,
                          borderBottom: currentMode === 'light' ? `1px solid #e5e5e5` : `1px solid rgba(255,255,255,0.05)`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          ':hover': {
                            backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.05)'
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#ffffff' : 'transparent';
                        }}
                      >
                        {/* Texte: titre + durée */}
                        <div style={{ flex: 1 }}>
                          {/* Titre du film en gras */}
                          <div style={{
                            fontWeight: '500',
                            color: currentMode === 'light' ? '#000000' : '#f5f5f5'
                          }}>
                            {film.title}
                          </div>
                          {/* Durée en petit texte gris */}
                          <div style={{
                            fontSize: '0.75rem',
                            color: currentMode === 'light' ? '#999999' : '#737373',
                            marginTop: '0.25rem'
                          }}>
                            {film.duration}
                          </div>
                        </div>
                        {/* Bouton "+ " pour ajouter le film */}
                        <button
                          onClick={() => handleAddFilm(film)}
                          style={{
                            marginLeft: '1rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            ':hover': {
                              backgroundColor: '#7c3aed',
                              color: '#ffffff'
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7c3aed';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                          }}
                        >
                          {/* Icône "+" de lucide-react (18px) */}
                          <Plus size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // SI aucun film disponible, afficher message vide
                    <div style={{
                      paddingX: '1rem',
                      paddingY: '1.5rem',
                      textAlign: 'center',
                      color: currentMode === 'light' ? '#999999' : '#737373'
                    }}>
                      {t('jury_assignment_all_films_selected')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Films Disponibles */}
                {films.length > itemsPerPage && (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      onClick={() => setCurrentPageFilmsAvailable(Math.max(0, currentPageFilmsAvailable - 1))}
                      disabled={currentPageFilmsAvailable === 0}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPageFilmsAvailable === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPageFilmsAvailable === 0 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span style={{
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      fontSize: '0.875rem'
                    }}>
                      Page {currentPageFilmsAvailable + 1} / {getTotalPages(films)}
                    </span>
                    <button
                      onClick={() => setCurrentPageFilmsAvailable(Math.min(getTotalPages(films) - 1, currentPageFilmsAvailable + 1))}
                      disabled={currentPageFilmsAvailable >= getTotalPages(films) - 1}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPageFilmsAvailable >= getTotalPages(films) - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPageFilmsAvailable >= getTotalPages(films) - 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>

{/* ============================================================
                  COLONNE DROITE: FILMS SÉLECTIONNÉS
                  ============================================================ */}
              <div>
                {/* Titre avec nombre de films sélectionnés */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '1rem'
                }}>
                  {t('jury_assignment_films_selected')} ({selectedFilms.length})
                </h3>
                {/* Conteneur liste: même style que la colonne gauche */}
                <div style={{
                  border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.03)',
                  overflow: 'hidden'
                }}>
                  {/* SI des films sont sélectionnés, afficher chacun */}
                  {selectedFilms.length > 0 ? (
                    // .map() = boucle sur chaque film sélectionné paginé
                    paginate(selectedFilms, currentPageFilmsSelected).map((film) => (
                      <div
                        key={film.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingX: '1rem',
                          paddingY: '0.75rem',
                          backgroundColor: currentMode === 'light' ? '#ffffff' : undefined,
                          borderBottom: currentMode === 'light' ? `1px solid #e5e5e5` : `1px solid rgba(255,255,255,0.05)`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#ffffff' : 'transparent';
                        }}
                      >
                        {/* Texte: titre + durée (même que colonne gauche) */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: '500',
                            color: currentMode === 'light' ? '#000000' : '#f5f5f5'
                          }}>
                            {film.title}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: currentMode === 'light' ? '#999999' : '#737373',
                            marginTop: '0.25rem'
                          }}>
                            {film.duration}
                          </div>
                        </div>
                        {/* Bouton "X" (Trash icon) pour retirer le film */}
                        <button
                          onClick={() => handleRemoveFilm(film.id)}
                          style={{
                            marginLeft: '1rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.2)';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                          }}
                        >
                          {/* Icône "Trash" de lucide-react (18px) = symbole suppression */}
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // SI aucun film sélectionné, afficher message vide
                    <div style={{
                      paddingX: '1rem',
                      paddingY: '1.5rem',
                      textAlign: 'center',
                      color: currentMode === 'light' ? '#999999' : '#737373'
                    }}>
                      {t('jury_assignment_no_films')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Films Sélectionnés - TOUJOURS VISIBLE */}
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => setCurrentPageFilmsSelected(Math.max(0, currentPageFilmsSelected - 1))}
                    disabled={currentPageFilmsSelected === 0}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                      border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      cursor: currentPageFilmsSelected === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentPageFilmsSelected === 0 ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span style={{
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    fontSize: '0.875rem'
                  }}>
                    Page {currentPageFilmsSelected + 1} / {getTotalPages(selectedFilms)}
                  </span>
                  <button
                    onClick={() => setCurrentPageFilmsSelected(Math.min(getTotalPages(selectedFilms) - 1, currentPageFilmsSelected + 1))}
                    disabled={currentPageFilmsSelected >= getTotalPages(selectedFilms) - 1}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                      border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      cursor: currentPageFilmsSelected >= getTotalPages(selectedFilms) - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPageFilmsSelected >= getTotalPages(selectedFilms) - 1 ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2: GESTION DES JURÉS
            ============================================================
            Même structure que Section 1 mais pour les jurés
        */}
        <section>
          {/* Card principal avec header dégradé (même style que Section 1) */}
          <div style={{
            backgroundColor: currentMode === 'light' ? '#ffffff' : '#171717',
            border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
            borderRadius: '0.75rem',
            overflow: 'hidden'
          }}>
            {/* Header dégradé violet */}
            <div style={{
              background: currentMode === 'light'
                ? 'linear-gradient(to right, #7c3aed, #6d28d9)'
                : 'linear-gradient(to right, #7c3aed, #6d28d9)',
              padding: '2rem',
              paddingY: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: '#ffffff'
              }}>
                {t('jury_assignment_section_jurors')}
              </h2>
            </div>
            {/* Grille 2 colonnes (responsive: 1 mobile, 2 desktop) */}
            <div style={{
              padding: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* ============================================================
                  COLONNE GAUCHE: JURÉS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec compteur */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '1rem'
                }}>
                  {t('jury_assignment_jurors_available')} ({jurors.length})
                </h3>
                {/* Conteneur liste */}
                <div style={{
                  border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.03)',
                  overflow: 'hidden'
                }}>
                  {/* SI des jurés disponibles existent */}
                  {jurors.length > 0 ? (
                    // Boucle sur chaque juré non assigné paginé
                    paginate(jurors, currentPageJurorsAvailable).map((juror) => (
                      <div
                        key={juror.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingX: '1rem',
                          paddingY: '0.75rem',
                          backgroundColor: currentMode === 'light' ? '#ffffff' : undefined,
                          borderBottom: currentMode === 'light' ? `1px solid #e5e5e5` : `1px solid rgba(255,255,255,0.05)`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#ffffff' : 'transparent';
                        }}
                      >
                        {/* Flex container pour avatar + infos */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          flex: 1
                        }}>
                          {/* Avatar circulaire: dégradé violet avec initiale du nom */}
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #a855f7, #6d28d9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            {/* Prendre la 1ère lettre du nom (juror.name[0]) */}
                            {juror.name[0]}
                          </div>
                          {/* Infos texte: nom + rôle */}
                          <div>
                            {/* Nom du juré en blanc */}
                            <div style={{
                              fontWeight: '500',
                              color: currentMode === 'light' ? '#000000' : '#f5f5f5'
                            }}>
                              {juror.name}
                            </div>
                            {/* Rôle/fonction en gris clair */}
                            <div style={{
                              fontSize: '0.75rem',
                              color: currentMode === 'light' ? '#999999' : '#737373'
                            }}>
                              {juror.role}
                            </div>
                          </div>
                        </div>
                        {/* Bouton "+" pour assigner le juré */}
                        <button
                          onClick={() => handleAddJuror(juror)}
                          style={{
                            marginLeft: '1rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7c3aed';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                          }}
                        >
                          {/* Icône "+" */}
                          <Plus size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // Message si tous les jurés sont déjà assignés
                    <div style={{
                      paddingX: '1rem',
                      paddingY: '1.5rem',
                      textAlign: 'center',
                      color: currentMode === 'light' ? '#999999' : '#737373'
                    }}>
                      {t('jury_assignment_all_jurors_assigned')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Jurés Disponibles */}
                {jurors.length > itemsPerPage && (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      onClick={() => setCurrentPageJurorsAvailable(Math.max(0, currentPageJurorsAvailable - 1))}
                      disabled={currentPageJurorsAvailable === 0}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPageJurorsAvailable === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentPageJurorsAvailable === 0 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span style={{
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      fontSize: '0.875rem'
                    }}>
                      Page {currentPageJurorsAvailable + 1} / {getTotalPages(jurors)}
                    </span>
                    <button
                      onClick={() => setCurrentPageJurorsAvailable(Math.min(getTotalPages(jurors) - 1, currentPageJurorsAvailable + 1))}
                      disabled={currentPageJurorsAvailable >= getTotalPages(jurors) - 1}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                        border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                        color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                        cursor: currentPageJurorsAvailable >= getTotalPages(jurors) - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPageJurorsAvailable >= getTotalPages(jurors) - 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* ============================================================
                  COLONNE DROITE: JURÉS ASSIGNÉS
                  ============================================================ */}
              <div>
                {/* Titre avec compteur */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '1rem'
                }}>
                  {t('jury_assignment_jurors_assigned')} ({assignedJurors.length})
                </h3>
                {/* Conteneur liste */}
                <div style={{
                  border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                  borderRadius: '0.5rem',
                  backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.03)',
                  overflow: 'hidden'
                }}>
                  {/* SI des jurés assignés existent */}
                  {assignedJurors.length > 0 ? (
                    // Boucle sur chaque juré assigné paginé
                    paginate(assignedJurors, currentPageJurorsAssigned).map((juror) => (
                      <div
                        key={juror.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingX: '1rem',
                          paddingY: '0.75rem',
                          backgroundColor: currentMode === 'light' ? '#ffffff' : undefined,
                          borderBottom: currentMode === 'light' ? `1px solid #e5e5e5` : `1px solid rgba(255,255,255,0.05)`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#f5f5f5' : 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#ffffff' : 'transparent';
                        }}
                      >
                        {/* Flex container pour avatar + infos (même que colonne gauche) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          flex: 1
                        }}>
                          {/* Avatar circulaire: dégradé VERT (au lieu de violet) pour montrer qu'il est assigné */}
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #10b981, #047857)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                          }}>
                            {/* Initiale du nom */}
                            {juror.name[0]}
                          </div>
                          {/* Infos: nom + rôle assigné */}
                          <div>
                            <div style={{
                              fontWeight: '500',
                              color: currentMode === 'light' ? '#000000' : '#f5f5f5'
                            }}>
                              {juror.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: currentMode === 'light' ? '#999999' : '#737373'
                            }}>
                              {juror.role}
                            </div>
                          </div>
                        </div>
                        {/* Bouton "X" pour désassigner le juré */}
                        <button
                          onClick={() => handleRemoveJuror(juror.id)}
                          style={{
                            marginLeft: '1rem',
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.2)';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = currentMode === 'light' ? '#666666' : '#a3a3a3';
                          }}
                        >
                          {/* Icône "Trash" = supprimer l'assignation */}
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // Message si aucun juré assigné
                    <div style={{
                      paddingX: '1rem',
                      paddingY: '1.5rem',
                      textAlign: 'center',
                      color: currentMode === 'light' ? '#999999' : '#737373'
                    }}>
                      {t('jury_assignment_no_jurors')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Jurés Assignés - TOUJOURS VISIBLE */}
                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => setCurrentPageJurorsAssigned(Math.max(0, currentPageJurorsAssigned - 1))}
                    disabled={currentPageJurorsAssigned === 0}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                      border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      cursor: currentPageJurorsAssigned === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentPageJurorsAssigned === 0 ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span style={{
                    color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                    fontSize: '0.875rem'
                  }}>
                    Page {currentPageJurorsAssigned + 1} / {getTotalPages(assignedJurors)}
                  </span>
                  <button
                    onClick={() => setCurrentPageJurorsAssigned(Math.min(getTotalPages(assignedJurors) - 1, currentPageJurorsAssigned + 1))}
                    disabled={currentPageJurorsAssigned >= getTotalPages(assignedJurors) - 1}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: currentMode === 'light' ? '#f5f5f5' : 'transparent',
                      border: currentMode === 'light' ? '1px solid #e5e5e5' : 'none',
                      color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                      cursor: currentPageJurorsAssigned >= getTotalPages(assignedJurors) - 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPageJurorsAssigned >= getTotalPages(assignedJurors) - 1 ? 0.5 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        </div>
      </main>
    </div>
  );
}