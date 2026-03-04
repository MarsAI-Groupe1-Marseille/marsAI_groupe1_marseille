import { useState, useEffect } from 'react';
import { Users, ThumbsUp, MessageCircle, ThumbsDown, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Import du composant Jury
import JuryTab from '../components/admin/JuryTab';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [adminUser, setAdminUser] = useState({
    full_name: "Admin Test",
    email: "email@exemple.com",
    job_title: "Directeur"
  });
  const [juryStats, setJuryStats] = useState({
    jury_count: 0,
    films_liked: 0,
    films_discuss: 0,
    films_disliked: 0,
    total_progress: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const userStr = localStorage.getItem('user');
        
        console.log('User:', userStr);
        
        // Si pas de user, on considère qu'il y a un user test/hardcodé
        if (!userStr) {
          console.log('ℹ️ Pas de user, utilisation des données par défaut');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        console.log('User parsed:', user);
        
        // Vérifier que c'est un admin
        if (user.role !== 'admin') {
          console.log('❌ Pas un admin, redirection vers home. Role:', user.role);
          setLoading(false);
          // window.location.href = '/';
          return;
        }

        console.log('✅ Admin vérifié:', user.full_name);
        setAdminUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Erreur vérification admin:', error);
        setLoading(false);
        // window.location.href = '/login';
      }
    };

    verifyAdmin();
    
    // Récupérer les stats du jury
    const fetchJuryStats = async () => {
      try {
        const response = await axios.get('/jury/with-stats');
        if (response.data.globalStats) {
          setJuryStats(response.data.globalStats);
        }
      } catch (error) {
        console.error('Erreur récupération stats jury:', error);
      }
    };
    
    fetchJuryStats();
  }, []);

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
            {/* Title and description at top + Admin Profile */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left side - Title and description */}
              <div>
                <span className="text-xs text-violet-400 uppercase tracking-widest font-bold block mb-3">{t('jury_dist_admin_management')}</span>
                <h1 className="flex justify-start items-center gap-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  <Users size={32} />
                  {t('jury_dist_title')}
                </h1>
                <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-2xl">{t('jury_dist_description')}</p>
              </div>

              {/* Right side - Admin Profile (no card) */}
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-violet-400 shadow-lg mb-4">
                  <span className="text-white font-bold text-2xl">
                    {adminUser?.full_name
                      ? adminUser.full_name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                      : 'A'}
                  </span>
                </div>
                
                {/* Name and Email */}
                <p className="text-sm font-semibold text-white break-words mb-1">{adminUser?.full_name}</p>
                <p className="text-xs text-neutral-400 break-all">{adminUser?.email}</p>
              </div>
            </div>

            {/* Charts only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Votes Distribution - Bar Chart */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-neutral-700 transition flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-violet-400" />
                  {t('jury_dist_vote_distribution')}
                </h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={[
                          {
                            category: t('jury_dist_votes_category'),
                            'Like': juryStats.films_liked,
                            'Discuss': juryStats.films_discuss,
                            'Dislike': juryStats.films_disliked
                          }
                        ]}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="category" stroke="#999" fontSize={12} />
                        <YAxis stroke="#999" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #555' }}
                          cursor={{ fill: 'rgba(123, 47, 255, 0.1)' }}
                          labelFormatter={() => t('jury_dist_votes_category')}
                          formatter={(value, name) => [
                            value,
                            name === 'Like' ? t('jury_dist_like') : name === 'Discuss' ? t('jury_dist_discuss') : t('jury_dist_dislike')
                          ]}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => 
                          value === 'Like' ? t('jury_dist_like') : value === 'Discuss' ? t('jury_dist_discuss') : value === 'Dislike' ? t('jury_dist_dislike') : value
                        } />
                        <Bar dataKey="Like" fill="#00ff00" />
                        <Bar dataKey="Discuss" fill="#ffa500" />
                        <Bar dataKey="Dislike" fill="#ff6b6b" />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Stats below chart */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-700">
                  <div className="text-center">
                    <p className="text-xs text-white/60">{t('jury_dist_like')}</p>
                    <p className="text-xl font-bold text-[#00ff00]">{juryStats.films_liked}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/60">{t('jury_dist_discuss')}</p>
                    <p className="text-xl font-bold text-[#ffa500]">{juryStats.films_discuss}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/60">{t('jury_dist_dislike')}</p>
                    <p className="text-xl font-bold text-[#ff6b6b]">{juryStats.films_disliked}</p>
                  </div>
                </div>
              </div>

              {/* Progress & Members - Pie Chart */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-neutral-700 transition flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp size={20} className="text-violet-400" />
                  {t('jury_dist_global_progress')}
                </h3>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: t('jury_dist_completed'), value: juryStats.total_progress, fill: '#a78bfa' },
                          { name: t('jury_dist_remaining'), value: 100 - juryStats.total_progress, fill: '#6366f1' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}\n${value}%`}
                        labelLine={true}
                      >
                        <Cell fill="#a78bfa" />
                        <Cell fill="#6366f1" />
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            const color = data.payload.fill || '#a78bfa';
                            return (
                              <div 
                                style={{ 
                                  backgroundColor: color, 
                                  border: `2px solid ${color}`,
                                  borderRadius: '6px',
                                  padding: '8px 12px'
                                }}
                                className="text-white font-semibold"
                              >
                                {data.name}: {data.value}%
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={30}
                        formatter={(value) => value}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Stats below chart */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-700">
                  <div className="text-center">
                    <p className="text-xs text-white/60">{t('jury_dist_progress')}</p>
                    <p className="text-xl font-bold text-[#a78bfa]">{juryStats.total_progress}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white/60">{t('jury_dist_active_jurors')}</p>
                    <p className="text-xl font-bold text-[#00d4ff]">{juryStats.jury_count}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <JuryTab />
        </div>
      </main>
    </div>
  );
}
