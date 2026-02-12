"use client";

import { useState } from "react";
import {Eye, X, Start, Filter} from "lucide-react";

export default function DashboardJury(){
    //  on stocke : tous les films assignés au jury, leurs informations,leur statut, leur note, leur commentaire
    const [Films,setFilms] = useState([
    // Chaque film est un objet : sinon les vrai données peuvent provenir d'une API.
    {
    id: 1,
    title: "Gourou",
    director: "Yann Gozlan",
    category: "Court métrage",
    status: "À évaluer",
    rating: null,
    comment: "",
    },
    {
    id: 2,
    title: "Le Mage Du Kremlin",
    director: "Olivier Assayas",
    category: "Documentaire",
    status: "Approuvé",
    rating: 6,
    comment: "Très belle réalisation.",
    },
    {
    id: 3,
    title: "L'affaire Bojarski",
    director: "Jean-Paul Salomé",
    category: "Long métrage",
    status: "Rejeté",
    rating: 4,
    comment: "Manque de rythme.",
    },
]);
// Ce state sert à : Stocker le film en cours d’évaluation, Ouvrir la modal
// Quand il est null → modal fermée
// Quand il contient un film → modal ouverte
const [selectedFilm, setSelectedFilm] = useState(null);
// NB: Une modal est une fenêtre pop-up qui s’affiche au-dessus du contenu principal pour montrer des informations
// ou demander une action, comme évaluer un film, sans quitter la page.

// Permet de filtrer les films
const [activeFilter, setActiveFilter] = useState("Tous");

// Permet de filtrer les films par statut : "Tous", "À évaluer", "Approuvé", "Rejeté"
// Si un statut change → les stats se mettent à jour automatiquement.

const stats = {
    total: films.length,
    viewed: films.filter((f) => f.status !== "À évaluer").length,
    approved: films.filter((f) => f.status === "Approuvé").length,
    rejected: films.filter((f) => f.status === "Rejeté").length,
};

// Si filtre = "Tous" → on affiche tout
// Sinon → on affiche seulement les films correspondant au statut
const filteredFilms =
    activeFilter === "Tous"
    ? films
    : films.filter((f) => f.status === activeFilter);

// On parcourt tous les films
// On remplace uniquement celui modifié
// On ferme la modal
const handleSaveEvaluation = () => {
    setFilms((prev) =>
    prev.map((f) => (f.id === selectedFilm.id ? selectedFilm : f))
    );
    setSelectedFilm(null);
};


return (
    <div className="min-h-screen bg-black text-white p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Jury</h1>
                <p className="text-neutral-400 mt-1">
                    Gestion et évaluation des films assignés
                </p>
            </div>
            <section className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center font-bold">
                    J
                </div>
                <div>
                    <p className="text-sm font-semibold">Jury Member</p>
                    <p className="text-xs text-neutral-400">jury@festival.com</p>
                </div>
            </section>
        </header>
    );
}