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