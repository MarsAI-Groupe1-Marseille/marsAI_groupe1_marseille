import React, { useState, useEffect } from "react";
import {Link } from "react-router-dom";
import {BarChart3, Layers, TrendingUp, LayoutDashboard, Users, Film} from "lucide-react";
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import axios from '../config/axiosConfig';
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
// Données par défaut pour le graphique d'évolution des soumissions
const defaultChartData = [
    { mois: "Sem 1", soumissions: 12, approuvés: 8 },
    { mois: "Sem 2", soumissions: 18, approuvés: 13 },
    { mois: "Sem 3", soumissions: 25, approuvés: 17 },
    { mois: "Sem 4", soumissions: 22, approuvés: 15 },
    { mois: "Sem 5", soumissions: 31, approuvés: 21 },
    { mois: "Sem 6", soumissions: 28, approuvés: 19 },
    { mois: "Sem 7", soumissions: 35, approuvés: 24 },
    { mois: "Sem 8", soumissions: 38, approuvés: 26 },
];
// Permet à créer un graphique de répartition "style barre horizontale"
// name = nom de la catégorie
// percent = largeur de la barre en %
const defaultCategories = [
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
// Le composant React ActionCard reçoit des "props" : title, buttonText, onClick, icon, disabled :
function ActionCard({ title, buttonText, onClick, icon, disabled = false }) {
    return (
        <div className={`bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between transition ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'
        }`}>
            <div className="flex items-center gap-4 mb-6">
                <div className={disabled ? "text-neutral-500" : "text-violet-500"}>
                    {icon}
                </div>
                <h3 className={`text-lg font-semibold ${
                    disabled ? 'text-neutral-500' : 'text-violet-400'
                }`}>
                    {title}
                </h3>
            </div>
            <button
            // onClick={onClick} → quand on cliques sur le bouton, la fonction passée en prop est exécutée :
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-500"
                title={disabled ? "Action non autorisée pour les modérateurs" : ""}
            >
                {buttonText}
            </button>
        </div>
    );
}

const Dashboard = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const isModerator = user?.role === "moderator";
    const adminUser = user; // Utiliser directement user du contexte
    const [loading, setLoading] = useState(false);
    const [dashboardStats, setDashboardStats] = useState({
        totalSubmissions: 0,
        approved: 0,
        rejected: 0,
        pending: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);
    const [categories, setCategories] = useState(defaultCategories);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [chartData, setChartData] = useState(defaultChartData);
    const [chartDataLoading, setChartDataLoading] = useState(true);

    // Récupérer les statistiques du dashboard
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setStatsLoading(true);
                const response = await axios.get('/admin/dashboard/stats');
                setDashboardStats({
                    totalSubmissions: response.data.totalSubmissions,
                    approved: response.data.approved,
                    rejected: response.data.rejected,
                    pending: response.data.pending
                });
                setStatsLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                setStatsLoading(false);
                // Les données par défaut restent affichées en cas d'erreur
            }
        };

        fetchDashboardStats();
    }, []);

    // Récupérer la répartition des catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await axios.get('/admin/dashboard/categories');
                // Formater les catégories reçues de l'API
                const formattedCategories = response.data.categories.map(cat => ({
                    name: cat.name,
                    percent: cat.percent
                }));
                setCategories(formattedCategories);
                setCategoriesLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
                setCategoriesLoading(false);
                // Les catégories par défaut restent affichées en cas d'erreur
            }
        };

        fetchCategories();
    }, []);

    // Récupérer les données du graphique (soumissions et approuvés par semaine)
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setChartDataLoading(true);
                const response = await axios.get('/admin/dashboard/chart-data');
                setChartData(response.data.chartData);
                setChartDataLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données du graphique:', error);
                setChartDataLoading(false);
                // Les données par défaut restent affichées en cas d'erreur
            }
        };

        fetchChartData();
    }, []);

    useEffect(() => {
        // adminUser vient maintenant directement du contexte AuthContext
        setLoading(false);
    }, [adminUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-neutral-950 text-violet-400 text-2xl font-bold">
                {t('jury_dist_loading')}
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
            {/* MAIN */}
            <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">

                    {/* Page Header */}
                    <div className="mb-12 pb-8 md:pb-12">
                        {/* Title and Admin Profile - Flex Layout */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8">
                            {/* Left side - Title and description */}
                            <div className="text-center md:text-left">
                                <span className="text-xs text-violet-400 uppercase tracking-widest font-bold block mb-3">{t('admin_space')}</span>
                                <h1 className="flex justify-center md:justify-start items-center gap-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    <LayoutDashboard size={32} />
                                    {t('admin_dashboard_title')}
                                </h1>
                                <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl">
                                    {t('admin_dashboard_subtitle')}
                                </p>
                            </div>

                            {/* Right side - Admin Profile (outside card) */}
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-violet-400 shadow-lg mb-4">
                                    {adminUser?.avatar_url ? (
                                        <img
                                            src={adminUser.avatar_url}
                                            alt={adminUser?.full_name || 'Admin'}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-2xl">
                                            {adminUser?.full_name
                                                ? adminUser.full_name
                                                    .split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                : 'A'}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Name and Email */}
                                <p className="text-sm font-semibold text-white break-words mb-1">{adminUser?.full_name}</p>
                                <p className="text-xs text-neutral-400 break-all">{adminUser?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {/* Affiche 4 cartes KPI avec le composant Card */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <Card label={t('dashboard_submissions')} value={statsLoading ? '-' : dashboardStats.totalSubmissions} />
                        <Card label={t('dashboard_statistics_approved')} value={statsLoading ? '-' : dashboardStats.approved} />
                        <Card label={t('dashboard_statistics_rejected')} value={statsLoading ? '-' : dashboardStats.rejected} />
                        <Card label={t('dashboard_statistics_pending')} value={statsLoading ? '-' : dashboardStats.pending} />
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {/* Graphique moderne -> Évolution des soumissions des films*/}
                        <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                            <h2 className="flex justify-center items-center gap-2 text-lg font-semibold text-violet-400 mb-1">
                                <TrendingUp size={20} />
                                {t('dashboard_evolution_title')}
                            </h2>
                            <p className="text-sm text-neutral-400 mb-6">{t('dashboard_evolution_subtitle')}</p>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                {t('dashboard_categories_title')}
                            </h2>                   
                            <div className="space-y-4">
                                {categories.map((cat) => (
                                    <div key={cat.name}>
                                        <div className="flex justify-between text-sm text-neutral-400 mb-1">
                                            <span>{cat.name}</span>
                                            <span>{cat.percent}%</span>
                                        </div>
                                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500" style={{ width: `${cat.percent}%` }}/>
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
                                buttonText={t('dashboard_users_button')}
                                icon={<Users size={28} />}
                            />
                        </Link>
                        {isModerator ? (
                            <div className="block">
                                <ActionCard
                                    title={t('dashboard_finalists_selection')}
                                    buttonText={t('dashboard_finalists_button')}
                                    icon={<Film size={28} />}
                                    disabled={true}
                                />
                            </div>
                        ) : (
                            <Link to="/selectfinaliste" className="block">
                                <ActionCard
                                    title={t('dashboard_finalists_selection')}
                                    buttonText={t('dashboard_finalists_button')}
                                    icon={<Film size={28} />}
                                />
                            </Link>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
