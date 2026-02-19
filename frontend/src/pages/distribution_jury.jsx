import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

// Import du composant Jury
import JuryTab from '../components/admin/JuryTab';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [adminUser, setAdminUser] = useState({
    full_name: "Admin Test",
    email: "email@exemple.com",
    job_title: "Directeur"
  });
  const [loading, setLoading] = useState(false);

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
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-950 text-violet-400 text-2xl font-bold">
        {t('jury_dist_loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* MAIN */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px' }}>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-4">
            {/* Left side - Title and description */}
            <div className="flex-1">
              <span className="text-xs text-violet-400 uppercase tracking-widest font-bold">{t('jury_dist_admin_management')}</span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2">{t('jury_dist_title')}</h1>
              <p className="text-xs sm:text-sm text-neutral-400">{t('jury_dist_description')}</p>
            </div>

            {/* Right side - Admin Profile Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:min-w-[240px]">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border border-violet-400 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {adminUser?.full_name
                      ? adminUser.full_name
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
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t('jury_dist_admin_label')}</p>
                  <p className="text-sm font-semibold text-white">{adminUser?.full_name}</p>
                </div>
                <div className="border-t border-neutral-700 pt-2">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t('jury_dist_email_label')}</p>
                  <p className="text-xs text-neutral-300 break-words">{adminUser?.email}</p>
                  <p className="text-xs text-neutral-300 break-words">admin@email.com</p>
                </div>
                <div className="border-t border-neutral-700 pt-2">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t('jury_dist_role_label')}</p>
                  <p className="text-xs text-neutral-300">{adminUser?.job_title}</p>
                  <p className="text-xs text-neutral-300">Directeur</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <JuryTab />
      </main>
    </div>
  );
}
