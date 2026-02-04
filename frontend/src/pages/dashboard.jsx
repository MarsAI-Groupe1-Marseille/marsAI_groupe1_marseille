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

// Récuperation de données depuis le tableau : 

function KpiCard({ label, value }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <p className="text-sm text-neutral-400">{label}</p>
            <p className="text-2xl font-bold mt-2 text-white">{value}</p>
        </div>
    );
}

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-10">
      <header>
        <span className="text-xs uppercase tracking-widest text-neutral-400">
          Administrateur
        </span>
      </header>
