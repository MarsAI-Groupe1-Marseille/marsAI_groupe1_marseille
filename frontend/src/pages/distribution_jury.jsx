import { useState, useEffect } from 'react';
import axios from 'axios';

// Import des onglets
import DashboardTab from '../components/admin/DashboardTab';
import FilmsTab from '../components/admin/FilmsTab';
import JuryTab from '../components/admin/JuryTab';
import ResultsTab from '../components/admin/ResultsTab';
import EventsTab from '../components/admin/EventsTab';
import ConfigTab from '../components/admin/ConfigTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] text-[#ff0096] text-2xl font-bold">
        Chargement du tableau de bord...
      </div>
    );
  }

  const tabs = [
    { id: 0, label: 'Jury', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] py-8 px-8 shadow-2xl" style={{boxShadow: '0 0 20px rgba(255, 0, 150, 0.4)'}}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-widest" style={{textShadow: '0 4px 20px rgba(255, 0, 150, 0.3)'}}>👥 Gestion des jurys</h1>
          <div className="flex gap-6 items-center">
            <span className="font-semibold bg-white/20 px-4 py-2 rounded-full text-base">{adminUser?.full_name || 'Admin'}</span>
            <button 
              className="bg-black/20 border-2 border-white/50 text-white px-5 py-2 rounded-full font-semibold transition-all hover:bg-black/40 hover:border-white"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="max-w-7xl mx-auto flex gap-4 px-8 py-6 overflow-x-auto bg-black/10 border-b-2 border-[#ff0096]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-[#ff0096] border-2 border-[#ff0096] text-white shadow-lg' 
                : 'bg-white/5 border-2 border-transparent text-white/70 hover:bg-white/10 hover:border-[#ff0096] hover:text-[#ff0096]'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-8">
        {activeTab === 0 && <JuryTab />}
      </main>
    </div>
  );
}
