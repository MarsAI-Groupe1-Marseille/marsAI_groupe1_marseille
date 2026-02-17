import React, { useState } from "react";
import { Plus, Trash2, Save, Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * ============================================================
 * COMPOSANT: CompetitionAnimation
 * ============================================================
 * Cette page permet aux admins/modos de gérer une compétition
 * animée : sélectionner les films à juger et assigner les jurés.
 * 
 * Structure:
 * - Header avec titre et boutons de sauvegarde
 * - Section 1: Gestion des films (disponibles ↔ sélectionnés)
 * - Section 2: Gestion des jurés (disponibles ↔ assignés)
 */

export default function CompetitionAnimation() {
  // ========================================================================
  // ÉTAT 1: Liste des FILMS DISPONIBLES (non encore sélectionnés)
  // ========================================================================
  // Chaque film a: id (unique), title (nom), duration (durée)
  const [films, setFilms] = useState([
    { id: 1, title: "Cyber Punk City", duration: "12 min" },
    { id: 2, title: "Mars 2050", duration: "15 min" },
    { id: 3, title: "Le Dernier Algorithme", duration: "25 min" },
    { id: 4, title: "L'Aube des IA", duration: "14 min" },
    { id: 5, title: "Deepfake History", duration: "22 min" },
    { id: 6, title: "Neural Dreams", duration: "18 min" },
    { id: 7, title: "Code Noir", duration: "20 min" },
    { id: 8, title: "Digital Soul", duration: "16 min" },
    { id: 9, title: "Quantum Leap", duration: "23 min" },
    { id: 10, title: "Synthétique", duration: "17 min" },
    { id: 11, title: "Virtual Reality", duration: "19 min" },
    { id: 12, title: "Binary Heart", duration: "21 min" },
    { id: 13, title: "Algorithm's End", duration: "24 min" },
    { id: 14, title: "Future Memories", duration: "13 min" },
    { id: 15, title: "Electric Dreams", duration: "26 min" },
    { id: 16, title: "Neon Genesis", duration: "15 min" },
    { id: 17, title: "Data Fortress", duration: "28 min" },
    { id: 18, title: "Cloud Nine", duration: "11 min" },
    { id: 19, title: "Silicon Valley", duration: "19 min" },
    { id: 20, title: "Pixel Paradise", duration: "22 min" },
    { id: 21, title: "Hologram Heart", duration: "17 min" },
    { id: 22, title: "Tech Noir", duration: "25 min" },
    { id: 23, title: "Cyber Ghost", duration: "20 min" },
    { id: 24, title: "Digital Sunrise", duration: "14 min" },
    { id: 25, title: "Machine Learning", duration: "23 min" },
    { id: 26, title: "Virtual Worlds", duration: "27 min" },
    { id: 27, title: "Synthetic Love", duration: "18 min" },
    { id: 28, title: "Code Genesis", duration: "21 min" },
    { id: 29, title: "Digital Evolution", duration: "16 min" },
    { id: 30, title: "The Last Server", duration: "29 min" },
  ]);

  // ========================================================================
  // ÉTAT 2: Liste des FILMS SÉLECTIONNÉS (choisis pour la compétition)
  // ========================================================================
  // Même structure que films[] (id, title, duration)
  const [selectedFilms, setSelectedFilms] = useState([
    { id: 1, title: "L'Aube des IA", duration: "14 min" },
    { id: 2, title: "Deepfake History", duration: "22 min" },
    { id: 3, title: "Mars 2050", duration: "15 min" },
  ]);

  // ========================================================================
  // ÉTAT 3: Liste des JURÉS DISPONIBLES (non assignés à cette compétition)
  // ========================================================================
  // Chaque juré a: id (unique), name (nom), role (fonction)
  const [jurors, setJurors] = useState([
    { id: 1, name: "Jean Dupont", role: "Producteur" },
    { id: 2, name: "Sophie Martin", role: "Réalisatrice" },
    { id: 3, name: "Alice Wonder", role: "Critique" },
    { id: 4, name: "Bob Sponge", role: "Monteur" },
    { id: 5, name: "Claire Dupré", role: "Directrice Photo" },
    { id: 6, name: "Marc Verdier", role: "Scénariste" },
    { id: 7, name: "Nathalie Blanc", role: "Sound Designer" },
    { id: 8, name: "Pierre Noir", role: "Colour Grader" },
    { id: 9, name: "Elisabeth Rouge", role: "Compositeur" },
    { id: 10, name: "Thomas Vert", role: "Directeur Artistique" },
    { id: 11, name: "Isabelle Gris", role: "Productrice Exécutive" },
    { id: 12, name: "Laurent Bleu", role: "Chef Opérateur" },
    { id: 13, name: "Véronique Orange", role: "Montreuse" },
    { id: 14, name: "Nicolas Jaune", role: "Directeur Animation" },
    { id: 15, name: "Marie Violet", role: "Superviseuse VFX" },
    { id: 16, name: "Antoine Rose", role: "Producteur Délégué" },
    { id: 17, name: "Charlotte Turquoise", role: "Réalisatrice VFX" },
    { id: 18, name: "David Indigo", role: "Directeur Technique" },
    { id: 19, name: "Sandrine Marron", role: "Modératrice" },
    { id: 20, name: "Fabrice Beige", role: "Consultant Créatif" },
    { id: 21, name: "Coralie Magenta", role: "Responsable Post-Production" },
    { id: 22, name: "Olivier Crimson", role: "Directeur de Production" },
    { id: 23, name: "Amélie Khaki", role: "Responsable Casting" },
    { id: 24, name: "Raphaël Cyan", role: "Expert Animation" },
    { id: 25, name: "Sylvie Pourpre", role: "Consultante Qualité" },
    { id: 26, name: "Benoît Gris Bleu", role: "Directeur Musical" },
    { id: 27, name: "Emmanuelle Corail", role: "Responsable Édition" },
    { id: 28, name: "Frédéric Or", role: "Chef de Plateau" },
    { id: 29, name: "Valérie Argent", role: "Directrice Exécutive" },
    { id: 30, name: "Xavier Bronze", role: "Expert Certification" },
  ]);

  
  // ========================================================================
  // ÉTAT 4: Liste des JURÉS ASSIGNÉS (assignés à cette compétition)
  // ========================================================================
  // Même structure que jurors[] (id, name, role)
  const [assignedJurors, setAssignedJurors] = useState([
    { id: 1, name: "Alice Wonder", role: "Expert Animation" },
    { id: 2, name: "Bob Sponge", role: "Critique Cinéma" },
  ]);

  // ========================================================================
  // ÉTAT 5: PAGINATION
  // ========================================================================
  // Gestion de la pagination pour films et jurés
  const itemsPerPage = 6;
  const [currentPageFilmsAvailable, setCurrentPageFilmsAvailable] = useState(0);
  const [currentPageFilmsSelected, setCurrentPageFilmsSelected] = useState(0);
  const [currentPageJurorsAvailable, setCurrentPageJurorsAvailable] = useState(0);
  const [currentPageJurorsAssigned, setCurrentPageJurorsAssigned] = useState(0);

  // ========================================================================
  // FONCTION: paginate() - Utilitaire pour calculer les items paginés
  // ========================================================================
  // Retourne une slice des items selon la page actuelle et le nombre par page
  const paginate = (dataArray, pageNumber) => {
    const startIdx = pageNumber * itemsPerPage;
    return dataArray.slice(startIdx, startIdx + itemsPerPage);
  };

  // ========================================================================
  // FONCTION: getTotalPages() - Calcule le nombre total de pages
  // ========================================================================
  const getTotalPages = (dataArray) => {
    return Math.ceil(dataArray.length / itemsPerPage);
  };

  // ========================================================================
  // FONCTION: handleAddFilm()
  // ========================================================================
  // Ajoute un film de la liste "Disponibles" vers "Sélectionnés"
  // Paramètre: film = l'objet film à ajouter
  const handleAddFilm = (film) => {
    // Vérifier que le film n'est pas déjà dans selectedFilms (éviter les doublons)
    if (!selectedFilms.find(f => f.id === film.id)) {
      // Ajouter le film à selectedFilms (utiliser spread operator [...])
      setSelectedFilms([...selectedFilms, film]);
      // Retirer le film de la liste des films disponibles
      setFilms(films.filter(f => f.id !== film.id));
    }
  };


  // ========================================================================
  // FONCTION: handleRemoveFilm()
  // ========================================================================
  // Retire un film de "Sélectionnés" et le remet dans "Disponibles"
  // Paramètre: filmId = l'ID du film à retirer
  const handleRemoveFilm = (filmId) => {
    // Chercher le film dans selectedFilms par son ID
    const film = selectedFilms.find(f => f.id === filmId);
    // Si le film existe
    if (film) {
      // Retirer le film de selectedFilms
      setSelectedFilms(selectedFilms.filter(f => f.id !== filmId));
      // Le remettre dans la liste des films disponibles
      setFilms([...films, film]);
    }
  };

  // ========================================================================
  // FONCTION: handleAddJuror()
  // ========================================================================
  // Ajoute un juré de "Disponibles" vers "Assignés"
  // Paramètre: juror = l'objet juré à assigner
  const handleAddJuror = (juror) => {
    // Vérifier que le juré n'est pas déjà assigné (éviter les doublons)
    if (!assignedJurors.find(j => j.id === juror.id)) {
      // Ajouter le juré à assignedJurors
      setAssignedJurors([...assignedJurors, juror]);
      // Retirer le juré de la liste des jurés disponibles
      setJurors(jurors.filter(j => j.id !== juror.id));
    }
  };

  // ========================================================================
  // FONCTION: handleRemoveJuror()
  // ========================================================================
  // Retire un juré de "Assignés" et le remet dans "Disponibles"
  // Paramètre: jurorId = l'ID du juré à retirer
  const handleRemoveJuror = (jurorId) => {
    // Chercher le juré dans assignedJurors par son ID
    const juror = assignedJurors.find(j => j.id === jurorId);
    // Si le juré existe
    if (juror) {
      // Retirer le juré de assignedJurors
      setAssignedJurors(assignedJurors.filter(j => j.id !== jurorId));
      // Le remettre dans la liste des jurés disponibles
      setJurors([...jurors, juror]);
    }
  };

  // ========================================================================
  // RENDU JSX: Retourner la structure HTML/React de la page
  // ========================================================================
  return (
    <div className="min-h-screen bg-neutral-950 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <header className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
          {/* Titre avec émoji */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">🎬</span>
            <h1 className="text-4xl font-bold text-white">Compétition Animation</h1>
          </div>
          
          {/* Sous-titre */}
          <p className="text-neutral-400 mb-6 ml-16">
            Gérez les films sélectionnés et les jurés assignés pour cette catégorie
          </p>
          
          {/* Boutons d'action */}
          <div className="flex gap-4 ml-16">
            <button className="flex items-center gap-2 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium transition">
              <X size={18} />
              Annuler
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition">
              <Save size={18} />
              Sauvegarder
            </button>
          </div>
        </header>

        
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
              <h2 className="text-lg font-bold text-white">1. Sélection des Films</h2>
            </div>
            {/* Grille 2 colonnes (1 colonne sur petit écran, 2 sur large) */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ============================================================
                  COLONNE GAUCHE: FILMS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec le nombre de films disponibles */}
                <h3 className="text-md font-semibold text-white mb-4">
                  Films Disponibles ({films.length})
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
                      Tous les films sont sélectionnés
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
                  Films Sélectionnés ({selectedFilms.length})
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
                      Aucun film sélectionné
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
              <h2 className="text-lg font-bold text-white">2. Assignation des Jurés</h2>
            </div>
            {/* Grille 2 colonnes (responsive: 1 mobile, 2 desktop) */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ============================================================
                  COLONNE GAUCHE: JURÉS DISPONIBLES
                  ============================================================ */}
              <div>
                {/* Titre avec compteur */}
                <h3 className="text-md font-semibold text-white mb-4">
                  Membres Disponibles ({jurors.length})
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
                      Tous les jurés sont assignés
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
                  Jurés Assignés ({assignedJurors.length})
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
                      Aucun juré assigné
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

        {/* ============================================================
            PAGINATION GLOBALE EN BAS
            ============================================================ */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition">
            <ChevronLeft size={24} />
          </button>
          <span className="text-neutral-400 text-sm px-4">
            Page 1 / 4
          </span>
          <button className="p-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}