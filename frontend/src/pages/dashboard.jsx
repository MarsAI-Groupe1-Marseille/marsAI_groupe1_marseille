import React from "react";
import {Link } from "react-router-dom";
import {BarChart3, Layers, TrendingUp, LayoutDashboard, Users, Film} from "lucide-react";
import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useLanguage } from '../context/LanguageContext';

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
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 hover:bg-neutral-800 transition">
            <p className="text-xs sm:text-sm text-neutral-400">{label}</p>
            <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2 text-white">{value}</p>
        </div>
    );
}
// Le composant React ActionCard reçoit des "props" : title, buttonText, onClick :
function ActionCard({ title, buttonText, onClick, icon }) {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between hover:bg-neutral-800 transition">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-violet-500 flex-shrink-0">
                    {icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-violet-400">
                    {title}
                </h3>
            </div>
            <button
            // onClick={onClick} → quand on cliques sur le bouton, la fonction passée en prop est exécutée :
                onClick={onClick}
                className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-3 sm:px-4 rounded text-sm sm:text-base"
            >
                {buttonText}
            </button>
        </div>
    );
}

const Dashboard = () => {
    const { t } = useLanguage();
    const [adminData, setAdminData] = useState({
        full_name: "Admin Test",
        email: "email@exemple.com",
        job_title: "Directeur",
        avatar: ""
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userData = JSON.parse(user);
                setAdminData({
                    full_name: userData.full_name || "Admin",
                    email: userData.email || "email@example.com",
                    job_title: userData.job_title || "Directeur",
                    avatar: userData.avatar || ""
                });
            } catch (err) {
                console.error("Error parsing user data:", err);
            }
        }
    }, []);
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            {/* Page Title */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px 0' }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-4">
                    {/* Left side - Title and description */}
                    <div className="flex-1">
                        <span className="text-xs text-violet-400 uppercase tracking-widest font-bold">Admin Management</span>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 mt-2">{t('dashboard_title')}</h1>
                        <p className="text-xs sm:text-sm text-neutral-400 mb-8">{t('dashboard_subtitle')}</p>
                    </div>

                    {/* Right side - Admin Profile Card */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:min-w-[240px]">
                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border border-violet-400 shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    {adminData.full_name
                                        ? adminData.full_name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()
                                        : 'A'}
                                </span>
                            </div>
                        </div>

                        {/* Admin Info */}
                        <div className="text-center space-y-3">
                            <div>
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t('dashboard_admin')}</p>
                                <p className="text-sm font-semibold text-white">{adminData.full_name}</p>
                            </div>
                            <div className="border-t border-neutral-700 pt-2">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                                <p className="text-xs text-neutral-300 break-words">{adminData.email}</p>
                            </div>
                            <div className="border-t border-neutral-700 pt-2">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t('dashboard_job_title')}</p>
                                <p className="text-xs text-neutral-300">{adminData.job_title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }} className="space-y-6 sm:space-y-10">
            {/* Affiche 4 cartes KPI avec le composant Card */}
            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                <Card label={t('dashboard_submissions')} value="435" />
                <Card label={t('dashboard_approved')} value="5" />
                <Card label={t('dashboard_rejected')} value="15" />
                <Card label={t('dashboard_pending')} value="80" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique moderne -> Évolution des soumissions des films*/}
                <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="flex justify-center items-center gap-2 text-lg font-semibold text-violet-400 mb-1">
                        <TrendingUp size={20} />
                        {t('dashboard_evolution')}
                    </h2>
                    <p className="text-sm text-neutral-400 mb-6">{t('dashboard_data_simulated')}</p>
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
                        {t('dashboard_categories')}
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
                    title={t('dashboard_users_management')}
                    buttonText={t('dashboard_view_users')}
                    icon={<Users size={28} />}
                />
             </Link>
               <Link to="/gestion-films" className="block">
                <ActionCard
                    title={t('dashboard_films_management')}
                    buttonText={t('dashboard_view_films')}
                    icon={<Film size={28} />}
                />
               </Link>
            </section>
            </div>

        </div>
    );
};

export default Dashboard;
