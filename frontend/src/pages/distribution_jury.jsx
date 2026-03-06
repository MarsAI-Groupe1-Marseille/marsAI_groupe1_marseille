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
  const [currentMode, setCurrentMode] = useState('dark');

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('Token:', token);
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

    // Listener pour l'événement personnalisé userAvatarUpdated
    const handleAvatarUpdated = (e) => {
      setAdminUser(prev => ({ ...prev, avatar_url: e.detail.avatar_url }));
    };
    window.addEventListener('userAvatarUpdated', handleAvatarUpdated);
    return () => window.removeEventListener('userAvatarUpdated', handleAvatarUpdated);
  }, []);

  // Mode detection
  useEffect(() => {
    const updateMode = () => {
      const mode = document.documentElement.getAttribute('data-mode') || 'dark';
      setCurrentMode(mode);
    };

    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Loading state colors
  const loadingBg = currentMode === 'light' ? '#ffffff' : '#0a0a0a';
  const loadingColor = currentMode === 'light' ? '#7c3aed' : '#a78bfa';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: loadingBg,
        color: loadingColor,
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        {t('jury_dist_loading')}
      </div>
    );
  }

  // Main container colors
  const mainBg = currentMode === 'light' ? '#ffffff' : 'linear-gradient(to bottom right, rgb(5, 5, 5), rgb(23, 23, 23), rgb(5, 5, 5))';
  const mainColor = currentMode === 'light' ? '#000000' : '#ffffff';

  return (
    <div style={{
      minHeight: '100vh',
      background: mainBg,
      color: mainColor
    }}>
      {/* MAIN */}
      <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-12 pb-8 md:pb-12">
            {/* Title and description at top + Admin Profile */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Left side - Title and description */}
              <div>
                <span style={{
                  fontSize: '12px',
                  color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {t('jury_dist_admin_management')}
                </span>
                <h1 style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  fontWeight: 'bold',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '16px',
                  lineHeight: '1.2'
                }}>
                  <Users size={32} />
                  {t('jury_dist_title')}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: currentMode === 'light' ? '#666666' : '#a3a3a3',
                  lineHeight: '1.6',
                  maxWidth: '500px'
                }}>
                  {t('jury_dist_description')}
                </p>
              </div>
            </div>

            {/* Charts only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Votes Distribution - Bar Chart */}
              <div style={{
                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#171717',
                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                borderRadius: '12px',
                padding: '32px',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <BarChart3 size={20} style={{color: currentMode === 'light' ? '#7c3aed' : '#a78bfa'}} />
                  {t('jury_dist_vote_distribution')}
                </h3>
                <div style={{flex: 1}}>
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
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={currentMode === 'light' ? '#e5e5e5' : '#333'} 
                        />
                        <XAxis 
                          dataKey="category" 
                          stroke={currentMode === 'light' ? '#666666' : '#999'} 
                          fontSize={12} 
                        />
                        <YAxis 
                          stroke={currentMode === 'light' ? '#666666' : '#999'} 
                          fontSize={12} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: currentMode === 'light' ? '#ffffff' : '#1f2937',
                            border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#555'}`,
                            color: currentMode === 'light' ? '#000000' : '#ffffff'
                          }}
                          cursor={{ fill: 'rgba(123, 47, 255, 0.1)' }}
                          labelFormatter={() => t('jury_dist_votes_category')}
                          formatter={(value, name) => [
                            value,
                            name === 'Like' ? t('jury_dist_like') : name === 'Discuss' ? t('jury_dist_discuss') : t('jury_dist_dislike')
                          ]}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', color: currentMode === 'light' ? '#000000' : '#ffffff' }} 
                          formatter={(value) => 
                            value === 'Like' ? t('jury_dist_like') : value === 'Discuss' ? t('jury_dist_discuss') : value === 'Dislike' ? t('jury_dist_dislike') : value
                          } 
                        />
                        <Bar dataKey="Like" fill="#00ff00" />
                        <Bar dataKey="Discuss" fill="#ffa500" />
                        <Bar dataKey="Dislike" fill="#ff6b6b" />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Stats below chart */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6" style={{
                  borderTop: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`
                }}>
                  <div style={{textAlign: 'center'}}>
                    <p style={{
                      fontSize: '12px',
                      color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.6)'
                    }}>
                      {t('jury_dist_like')}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#00ff00'
                    }}>
                      {juryStats.films_liked}
                    </p>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <p style={{
                      fontSize: '12px',
                      color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.6)'
                    }}>
                      {t('jury_dist_discuss')}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ffa500'
                    }}>
                      {juryStats.films_discuss}
                    </p>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <p style={{
                      fontSize: '12px',
                      color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.6)'
                    }}>
                      {t('jury_dist_dislike')}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ff6b6b'
                    }}>
                      {juryStats.films_disliked}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress & Members - Pie Chart */}
              <div style={{
                backgroundColor: currentMode === 'light' ? '#f5f5f5' : '#171717',
                border: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`,
                borderRadius: '12px',
                padding: '32px',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp size={20} style={{color: currentMode === 'light' ? '#7c3aed' : '#a78bfa'}} />
                  {t('jury_dist_global_progress')}
                </h3>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
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
                                  backgroundColor: currentMode === 'light' ? '#ffffff' : color, 
                                  border: `2px solid ${color}`,
                                  borderRadius: '6px',
                                  padding: '8px 12px',
                                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                                  fontWeight: 'bold'
                                }}
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
                        wrapperStyle={{color: currentMode === 'light' ? '#000000' : '#ffffff'}}
                        formatter={(value) => value}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Stats below chart */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6" style={{
                  borderTop: `1px solid ${currentMode === 'light' ? '#e5e5e5' : '#262626'}`
                }}>
                  <div style={{textAlign: 'center'}}>
                    <p style={{
                      fontSize: '12px',
                      color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.6)'
                    }}>
                      {t('jury_dist_progress')}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#a78bfa'
                    }}>
                      {juryStats.total_progress}%
                    </p>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <p style={{
                      fontSize: '12px',
                      color: currentMode === 'light' ? '#666666' : 'rgba(255,255,255,0.6)'
                    }}>
                      {t('jury_dist_active_jurors')}
                    </p>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#00d4ff'
                    }}>
                      {juryStats.jury_count}
                    </p>
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
