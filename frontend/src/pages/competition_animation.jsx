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