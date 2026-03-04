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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1628]">
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-12 pb-8 md:pb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left side - Title and description */}
              <div className="text-center md:text-left">
                <span className="text-xs text-violet-400 uppercase tracking-widest font-bold block mb-3">{t('admin_space')}</span>
                <h1 className="flex justify-center md:justify-start items-center gap-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  <Users size={32} />
                  {t('jury_assignment_title')}
                </h1>
                <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl">
                  {t('jury_assignment_desc')}
                </p>
              </div>

              {/* Right side - Admin Profile (outside card) */}
              <div className="flex flex-col items-center md:items-end gap-2">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-violet-400 shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {user?.full_name
                      ? user.full_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                      : 'A'}
                  </span>
                </div>
                {/* Admin Info */}
                <div className="text-center md:text-right">
                  <p className="text-base font-semibold text-white">{user?.full_name}</p>
                  <p className="text-xs text-neutral-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          {/* ============================================================
              SECTION 0: LISTE DES PLAYLISTS
              ============================================================ */}
          <section className="mb-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-violet-800 px-8 py-4">
                <h2 className="text-lg font-bold text-white">{t('jury_assignment_playlists')}</h2>
              </div>
              <div className="p-8">
                {isLoading ? (
                  <div className="text-neutral-400">{t('jury_assignment_loading')}</div>
                ) : playlists.length === 0 ? (
                  <div className="text-neutral-500">{t('jury_assignment_no_playlists')}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginate(playlists, currentPagePlaylists, playlistsPerPage).map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => setCurrentPlaylistId(playlist.id)}
                        className="text-left border rounded-lg p-4 transition"
                        style={{
                          borderColor: playlist.id === currentPlaylistId ? "rgba(139,92,246,0.8)" : "rgba(255,255,255,0.08)",
                          background: playlist.id === currentPlaylistId ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.03)"
                        }}
                      >
                        <div className="text-white font-semibold truncate">{playlist.name}</div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {playlist.films?.length || 0} films · {playlist.jury?.length || 0} jurys
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {playlists.length > playlistsPerPage && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPagePlaylists(Math.max(0, currentPagePlaylists - 1))}
                      disabled={currentPagePlaylists === 0}
                      className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                  <span className="text-neutral-400 text-sm">
                    Page {currentPagePlaylists + 1} / {getTotalPages(playlists, playlistsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPagePlaylists(Math.min(getTotalPages(playlists, playlistsPerPage) - 1, currentPagePlaylists + 1))}
                    disabled={currentPagePlaylists >= getTotalPages(playlists, playlistsPerPage) - 1}
                    className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            {/* Header avec fond dégradé violet (from-violet-600 to-violet-800) */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 px-8 py-4">
              {/* Titre blanc de la section */}
              <h2 className="text-lg font-bold text-white">{t('jury_assignment_section_films')}</h2>
            </div>
            {/* Grille 2 colonnes (1 colonne sur petit écran, 2 sur large) */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ============================================================
                  COLONNE GAUCHE: FILMS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec le nombre de films disponibles */}
                <h3 className="text-md font-semibold text-white mb-4">
                  {t('jury_assignment_films_available')} ({films.length})
                </h3>
                {/* Conteneur liste: bordure grise, fond semi-transparent, bord inférieur entre items */}
                <div className="border border-neutral-800 rounded-lg bg-neutral-800/50 divide-y divide-neutral-700 overflow-hidden">
                  {/* SI des films sont disponibles, afficher chacun */}
                  {films.length > 0 ? (
                    // .map() = boucle sur chaque film du tableau paginé
                    paginate(films, currentPageFilmsAvailable).map((film) => (
                      // Key = identifiant unique pour React (id du film)
                      <div
                        key={film.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-neutral-700 transition cursor-pointer group"
                      >
                        {/* Texte: titre + durée */}
                        <div className="flex-1">
                          {/* Titre du film en gras */}
                          <div className="font-medium text-neutral-100">{film.title}</div>
                          {/* Durée en petit texte gris */}
                          <div className="text-xs text-neutral-500 mt-1">{film.duration}</div>
                        </div>
                        {/* Bouton "+ " pour ajouter le film */}
                        <button
                          onClick={() => handleAddFilm(film)}
                          className="ml-4 p-2 hover:bg-violet-600 rounded text-neutral-400 hover:text-white transition"
                        >
                          {/* Icône "+" de lucide-react (18px) */}
                          <Plus size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // SI aucun film disponible, afficher message vide
                    <div className="px-4 py-6 text-center text-neutral-500">
                      {t('jury_assignment_all_films_selected')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Films Disponibles */}
                {films.length > itemsPerPage && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPageFilmsAvailable(Math.max(0, currentPageFilmsAvailable - 1))}
                      disabled={currentPageFilmsAvailable === 0}
                      className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-neutral-400 text-sm">
                      Page {currentPageFilmsAvailable + 1} / {getTotalPages(films)}
                    </span>
                    <button
                      onClick={() => setCurrentPageFilmsAvailable(Math.min(getTotalPages(films) - 1, currentPageFilmsAvailable + 1))}
                      disabled={currentPageFilmsAvailable >= getTotalPages(films) - 1}
                      className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                <h3 className="text-md font-semibold text-white mb-4">
                  {t('jury_assignment_films_selected')} ({selectedFilms.length})
                </h3>
                {/* Conteneur liste: même style que la colonne gauche */}
                <div className="border border-neutral-800 rounded-lg bg-neutral-800/50 divide-y divide-neutral-700 overflow-hidden">
                  {/* SI des films sont sélectionnés, afficher chacun */}
                  {selectedFilms.length > 0 ? (
                    // .map() = boucle sur chaque film sélectionné paginé
                    paginate(selectedFilms, currentPageFilmsSelected).map((film) => (
                      <div
                        key={film.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-neutral-700 transition group"
                      >
                        {/* Texte: titre + durée (même que colonne gauche) */}
                        <div className="flex-1">
                          <div className="font-medium text-neutral-100">{film.title}</div>
                          <div className="text-xs text-neutral-500 mt-1">{film.duration}</div>
                        </div>
                        {/* Bouton "X" (Trash icon) pour retirer le film */}
                        <button
                          onClick={() => handleRemoveFilm(film.id)}
                          className="ml-4 p-2 hover:bg-red-900/30 rounded text-neutral-400 hover:text-red-400 transition"
                        >
                          {/* Icône "Trash" de lucide-react (18px) = symbole suppression */}
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // SI aucun film sélectionné, afficher message vide
                    <div className="px-4 py-6 text-center text-neutral-500">
                      {t('jury_assignment_no_films')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Films Sélectionnés - TOUJOURS VISIBLE */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPageFilmsSelected(Math.max(0, currentPageFilmsSelected - 1))}
                    disabled={currentPageFilmsSelected === 0}
                    className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-neutral-400 text-sm">
                    Page {currentPageFilmsSelected + 1} / {getTotalPages(selectedFilms)}
                  </span>
                  <button
                    onClick={() => setCurrentPageFilmsSelected(Math.min(getTotalPages(selectedFilms) - 1, currentPageFilmsSelected + 1))}
                    disabled={currentPageFilmsSelected >= getTotalPages(selectedFilms) - 1}
                    className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            {/* Header dégradé violet */}
            <div className="bg-gradient-to-r from-violet-600 to-violet-800 px-8 py-4">
              <h2 className="text-lg font-bold text-white">{t('jury_assignment_section_jurors')}</h2>
            </div>
            {/* Grille 2 colonnes (responsive: 1 mobile, 2 desktop) */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ============================================================
                  COLONNE GAUCHE: JURÉS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec compteur */}
                <h3 className="text-md font-semibold text-white mb-4">
                  {t('jury_assignment_jurors_available')} ({jurors.length})
                </h3>
                {/* Conteneur liste */}
                <div className="border border-neutral-800 rounded-lg bg-neutral-800/50 divide-y divide-neutral-700 overflow-hidden">
                  {/* SI des jurés disponibles existent */}
                  {jurors.length > 0 ? (
                    // Boucle sur chaque juré non assigné paginé
                    paginate(jurors, currentPageJurorsAvailable).map((juror) => (
                      <div
                        key={juror.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-neutral-700 transition group"
                      >
                        {/* Flex container pour avatar + infos */}
                        <div className="flex items-center gap-3 flex-1">
                          {/* Avatar circulaire: dégradé violet avec initiale du nom */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white font-semibold text-sm">
                            {/* Prendre la 1ère lettre du nom (juror.name[0]) */}
                            {juror.name[0]}
                          </div>
                          {/* Infos texte: nom + rôle */}
                          <div>
                            {/* Nom du juré en blanc */}
                            <div className="font-medium text-neutral-100">{juror.name}</div>
                            {/* Rôle/fonction en gris clair */}
                            <div className="text-xs text-neutral-500">{juror.role}</div>
                          </div>
                        </div>
                        {/* Bouton "+" pour assigner le juré */}
                        <button
                          onClick={() => handleAddJuror(juror)}
                          className="ml-4 p-2 hover:bg-violet-600 rounded text-neutral-400 hover:text-white transition"
                        >
                          {/* Icône "+" */}
                          <Plus size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // Message si tous les jurés sont déjà assignés
                    <div className="px-4 py-6 text-center text-neutral-500">
                      {t('jury_assignment_all_jurors_assigned')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Jurés Disponibles */}
                {jurors.length > itemsPerPage && (
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPageJurorsAvailable(Math.max(0, currentPageJurorsAvailable - 1))}
                      disabled={currentPageJurorsAvailable === 0}
                      className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-neutral-400 text-sm">
                      Page {currentPageJurorsAvailable + 1} / {getTotalPages(jurors)}
                    </span>
                    <button
                      onClick={() => setCurrentPageJurorsAvailable(Math.min(getTotalPages(jurors) - 1, currentPageJurorsAvailable + 1))}
                      disabled={currentPageJurorsAvailable >= getTotalPages(jurors) - 1}
                      className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                <h3 className="text-md font-semibold text-white mb-4">
                  {t('jury_assignment_jurors_assigned')} ({assignedJurors.length})
                </h3>
                {/* Conteneur liste */}
                <div className="border border-neutral-800 rounded-lg bg-neutral-800/50 divide-y divide-neutral-700 overflow-hidden">
                  {/* SI des jurés assignés existent */}
                  {assignedJurors.length > 0 ? (
                    // Boucle sur chaque juré assigné paginé
                    paginate(assignedJurors, currentPageJurorsAssigned).map((juror) => (
                      <div
                        key={juror.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-neutral-700 transition group"
                      >
                        {/* Flex container pour avatar + infos (même que colonne gauche) */}
                        <div className="flex items-center gap-3 flex-1">
                          {/* Avatar circulaire: dégradé VERT (au lieu de violet) pour montrer qu'il est assigné */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                            {/* Initiale du nom */}
                            {juror.name[0]}
                          </div>
                          {/* Infos: nom + rôle assigné */}
                          <div>
                            <div className="font-medium text-neutral-100">{juror.name}</div>
                            <div className="text-xs text-neutral-500">{juror.role}</div>
                          </div>
                        </div>
                        {/* Bouton "X" pour désassigner le juré */}
                        <button
                          onClick={() => handleRemoveJuror(juror.id)}
                          className="ml-4 p-2 hover:bg-red-900/30 rounded text-neutral-400 hover:text-red-400 transition"
                        >
                          {/* Icône "Trash" = supprimer l'assignation */}
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    // Message si aucun juré assigné
                    <div className="px-4 py-6 text-center text-neutral-500">
                      {t('jury_assignment_no_jurors')}
                    </div>
                  )}
                </div>
                {/* PAGINATION pour Jurés Assignés - TOUJOURS VISIBLE */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPageJurorsAssigned(Math.max(0, currentPageJurorsAssigned - 1))}
                    disabled={currentPageJurorsAssigned === 0}
                    className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-neutral-400 text-sm">
                    Page {currentPageJurorsAssigned + 1} / {getTotalPages(assignedJurors)}
                  </span>
                  <button
                    onClick={() => setCurrentPageJurorsAssigned(Math.min(getTotalPages(assignedJurors) - 1, currentPageJurorsAssigned + 1))}
                    disabled={currentPageJurorsAssigned >= getTotalPages(assignedJurors) - 1}
                    className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
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