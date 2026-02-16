import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Mail } from 'lucide-react';

// Import du composant Jury
import JuryTab from '../components/admin/JuryTab';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        console.log('Token:', token);
        console.log('User:', userStr);
        
        // ✅ VÉRIFICATION LOCALE (Hardcodée)
        if (!token || !userStr) {
          console.log('❌ Pas de token, redirection vers login');
          setLoading(false);
          // window.location.href = '/login';
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
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Content */}
      <main className="p-9 min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
              Back-Office Officiel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-neutral-200 uppercase tracking-wide">{adminUser?.full_name || 'Administrateur'}</div>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Mail size={12} />
                {adminUser?.email || 'admin@email.com'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center font-bold text-sm shadow-lg border border-violet-500/50">
              {adminUser?.full_name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <span className="text-xs text-violet-400 uppercase tracking-widest font-bold">Admin Management</span>
          <h1 className="text-5xl font-bold text-white mb-2">GESTION DES JURYS</h1>
          <p className="text-neutral-400 text-sm">Gérez les lots de visionnage pour chaque membre du comité.</p>
        </div>

        {/* Content */}
        <JuryTab />
      </main>
    </div>
  );
}
