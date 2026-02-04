import React from "react";
import { Users, Film } from "lucide-react";

// Permet à construire le graphique en barres pour chaque mois.
// label = nom du mois
// value = hauteur de la barre en %
const stats = [
    { label: "Jan", value: 40 },
    { label: "Fév", value: 65 },
    { label: "Mar", value: 90 },
    { label: "Avr", value: 55 },
    { label: "Mai", value: 75 },
];
// Permet à créer un graphique de répartition "style barre horizontale"
// name = nom de la catégorie
// percent = largeur de la barre en %
const categories = [
    { name: "Documentaire", percent: 35 },
    { name: "Court-métrage", percent: 25 },
    { name: "Animation", percent: 20 },
    { name: "Fiction", percent: 20 },
];
// Composant réutilisable pour afficher un KPI.
// Props : { label, value } données dynamiques envoyées depuis le parent.
function Card({ label, value }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">{label}</p>
            <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        </div>
    );
}
// Le composant React ActionCard reçoit des "props" : title, buttonText, onClick :
function ActionCard({ title, buttonText, onClick }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:bg-neutral-800 transition">
            <h3 className="text-lg font-semibold text-violet-400 mb-4">{title}</h3>
            <button
            // onClick={onClick} → quand on cliques sur le bouton, la fonction passée en prop est exécutée :
                onClick={onClick}
                className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded"
            >
                {buttonText}
            </button>
        </div>
    );
}

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-10">
            <header>
                <span className="text-xs text-neutral-400 uppercase tracking-widest">
                    Espace Administrateur
                </span>
            </header>

            <section>
                <h1 className="text-4xl font-bold text-violet-500">Tableau Administrateur :</h1>
                <p className="text-neutral-400 mt-2">Vue générale de l'activité de la plateforme</p>
            </section>
            {/* Affiche 4 cartes KPI avec le composant Card */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card label="Soumissions" value="435" />
                <Card label="Score moyen" value="3.5 / 5" />
                <Card label="Votes totaux" value="10.6k" />
                <Card label="En attente" value="80" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique barres -> Évolution des soumissions des films*/}
                <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold text-violet-400 mb-1">Évolution des soumissions</h2>
                    <p className="text-sm text-neutral-400 mb-6">Données simulées par mois</p>
                    <div className="flex items-end gap-6 h-56">
                        {stats.map((item) => (
                            // identifiant unique pour React avec l'attribut key
                            <div key={item.label} className="flex flex-col items-center gap-2">
                                <div
                                    className="w-10 bg-violet-500 rounded-t-lg"
                                    style={{ height: `${item.value}%` }}
                                />
                                <span className="text-xs text-neutral-400">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Répartition des catégories */}
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold text-violet-400 mb-4">Répartition des catégories</h2>                   
                    <div className="space-y-4">
                        {/* Boucle sur categories avec map : Affiche pour chaque catégorie :
                            Nom + pourcentage
                            Barre horizontale proportionnelle au pourcentage avec width: percent% */}
                        {categories.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm text-neutral-400 mb-1">
                                    <span>{cat.name}</span>
                                    <span>{cat.percent}%</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500"style={{ width: `${cat.percent}%` }}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ACTION CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ActionCard
                    title="Gestion des utilisateurs"
                    buttonText="Voir les utilisateurs"
                    onClick={() => window.location.href = "/users"}
                />
                <ActionCard
                    title="Gestion des films"
                    buttonText="Voir les films"
                    onClick={() => window.location.href = "/movies"}
                />
            </section>

        </div>
    );
};

export default Dashboard;
