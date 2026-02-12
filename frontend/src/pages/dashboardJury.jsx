"use client";

import { useState } from "react";
import { Eye, X, Start, Filter } from "lucide-react";

export default function DashboardJury() {
    //  on stocke : tous les films assignés au jury, leurs informations,leur statut, leur note, leur commentaire
    const [Films, setFilms] = useState([
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
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <Stats title="Films assignés" value={stats.total} />
                <Stats title="Films vus" value={stats.viewed} />
                <Stats title="Approuvés" value={stats.approved} />
                <Stats title="Rejetés" value={stats.rejected} />
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                {["Tous", "À évaluer", "Approuvé", "Rejeté"].map(
                    (filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 border transition ${activeFilter === filter
                                    ? "bg-gradient-to-r from-violet-500 to-pink-500 border-transparent"
                                    : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800"
                                }`}
                        >
                            <Filter size={14} /> {filter}
                        </button>
                    )
                )}
            </div>
            {/* BlocListe des Films */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {filteredFilms.map((film) => (
                    <FilmRow
                        key={film.id}
                        film={film}
                        onEvaluate={() => setSelectedFilm(film)}
                    />
                ))}
            </div>
            {/* Modal Evaluation */}
            {selectedFilm && (
                <section className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 relative">
                    <button onClick={() => setSelectedFilm(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-semibold mb-6">
                    Évaluation : {selectedFilm.title}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-sm text-neutral-400 mb-2">
                            Note (/10)
                        </label>
                        <input type="number" min="1" max="10" value={selectedFilm.rating || ""} onChange={(e) => setSelectedFilm({...selectedFilm,rating: Number(e.target.value),})}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setSelectedFilm({ ...selectedFilm, status: "Approuvé" })} className="px-4 py-2 bg-green-600 rounded-lg w-full sm:w-auto">
                            Approuver
                        </button>
                        <button onClick={() => setSelectedFilm({ ...selectedFilm, status: "Rejeté" })} className="px-4 py-2 bg-red-600 rounded-lg w-full sm:w-auto">
                            Rejeter
                        </button>
                        <button onClick={handleSaveEvaluation} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg w-full sm:w-auto">
                            Enregistrer
                        </button>
                    </div>
                </section>
            </div>
        )}
    </div>
);
}
            
function Stats({ title, value }) {
return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <p className="text-sm text-neutral-400">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
);
}

function FilmRow({ film, onEvaluate }) {
return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center p-4 border-b border-neutral-800 hover:bg-neutral-800 transition">
        <div className="lg:col-span-2">
            <p className="font-semibold">{film.title}</p>
            <p className="text-sm text-neutral-400">{film.director}</p>
        </div>  
        <div className="text-sm text-neutral-400">{film.category}</div>
            <StatusBadge status={film.status} />
            <div className="text-sm font-medium">
                {film.rating ? `${film.rating}/10` : "-"}
            </div>
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                <button className="px-3 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-sm flex items-center gap-2">
                <Eye size={16} /> Voir
            </button>
            <button onClick={onEvaluate} className="px-3 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm">
                Évaluer
            </button>
        </div>
    </div>
);
}
            
                        
 