import React from "react";
import {Link } from "react-router-dom";
import {BarChart3, Layers, TrendingUp, LayoutDashboard, Users, Film} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Données pour le graphique d'évolution des soumissions
const stats = [
    { mois: "Jan", soumissions: 45, approuvés: 30 },
    { mois: "Fév", soumissions: 78, approuvés: 52 },
    { mois: "Mar", soumissions: 105, approuvés: 68 },
    { mois: "Avr", soumissions: 65, approuvés: 42 },
    { mois: "Mai", soumissions: 89, approuvés: 58 },
    { mois: "Juin", soumissions: 120, approuvés: 85 },
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
function ActionCard({ title, buttonText, onClick, icon }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:bg-neutral-800 transition">
            <div className="flex items-center gap-4 mb-6">
                <div className="text-violet-500">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-violet-400">
                    {title}
                </h3>
            </div>
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
                <h1 className= "flex justify-center items-center gap-3 text-4xl font-bold text-violet-500">
                    <LayoutDashboard size={32} />
                    Tableau Administrateur :
                    </h1>
                <p className="flex justify-center items-center text-neutral-400 mt-2">Vue générale de l'activité de la plateforme</p>
            </section>
            {/* Affiche 4 cartes KPI avec le composant Card */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card label="Soumissions" value="435" />
                <Card label="Approuvés" value="5" />
                <Card label="Rejetés" value="15" />
                <Card label="En attente" value="80" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique moderne -> Évolution des soumissions des films*/}
                <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="flex justify-center items-center gap-2 text-lg font-semibold text-violet-400 mb-1">
                        <TrendingUp size={20} />
                        Évolution des soumissions
                    </h2>
                    <p className="text-sm text-neutral-400 mb-6">Données simulées par mois</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSoumissions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorApprouves" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                            <XAxis 
                                dataKey="mois" 
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                                stroke="#9ca3af"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                labelStyle={{ color: '#a78bfa' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="soumissions" 
                                stroke="#8b5cf6" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorSoumissions)"
                                name="Soumissions"
                            />
                            <Area 
                                type="monotone" 
                                dataKey="approuvés" 
                                stroke="#06b6d4" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorApprouves)"
                                name="Approuvés"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Répartition des catégories */}
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="flex justify-center items-center gap-2 text-lg font-semibold text-violet-400 mb-4">
                        <Layers size={20} />
                        Répartition des catégories
                    </h2>                   
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
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <Link to="/dashboardUser" className="block">
                <ActionCard
                    title="Gestion des utilisateurs"
                    buttonText="Voir les utilisateurs"
                    icon={<Users size={28} />}
                />
             </Link>
               <Link to="/gestion-films" className="block">
                <ActionCard
                    title="Gestion des films"
                    buttonText="Voir les films"
                    icon={<Film size={28} />}
                />
               </Link>
            </section>

        </div>
    );
};

export default Dashboard;
