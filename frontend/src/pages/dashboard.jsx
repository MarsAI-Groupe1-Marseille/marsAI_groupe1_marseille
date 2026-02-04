import React from "react";

// Simulation des données comme si elles venais du backend.
const kpis = [
  { label: "Soumissions", value: "624" },
  { label: "Score moyen", value: "4.8" },
  { label: "Votes total", value: "12.4k" },
  { label: "En attente", value: "142" },
];
// Tableau permettant de construire un graphique en barres. 
// label → nom du mois
// value → hauteur de la barre (en %)

const stats = [
  { label: "Jan", value: 40 },
  { label: "Fév", value: 65 },
  { label: "Mar", value: 90 },
  { label: "Avr", value: 55 },
  { label: "Mai", value: 75 },
];
