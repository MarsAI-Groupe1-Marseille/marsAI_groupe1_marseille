import { useState, useEffect } from 'react';
import axios from 'axios';

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950 border-b border-neutral-800 py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h1 className="text-3xl font-bold text-violet-400">👥 Gestion des jurys</h1>         
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-8">
        <JuryTab />
      </main>
    </div>
  );
}
