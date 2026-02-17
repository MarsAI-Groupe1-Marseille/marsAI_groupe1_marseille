import React, { useState } from "react";
import { Plus, Trash2, Save, Sparkles } from "lucide-react";

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
        <header>
          <span className="text-xs text-neutral-400 uppercase tracking-widest">
            Espace Administrateur
          </span>
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
                    // .map() = boucle sur chaque film du tableau
                    films.map((film) => (
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
              </div>
