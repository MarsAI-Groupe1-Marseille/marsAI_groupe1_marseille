import { useLanguage } from '../../context/LanguageContext.jsx';
import { Film, Users, CheckCircle2, Clock, TrendingUp, Activity } from 'lucide-react';

export default function DashboardTab() {
  const { t } = useLanguage();

  return (
    <div className="bg-white/5 border-2 border-[#ff0096] rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#ff0096]">📊 {t('dashboard_title')}</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#ff0096]/20 to-[#ff0096]/5 border border-[#ff0096]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ff0096]/30 rounded-lg">
            <Film className="w-6 h-6 text-[#ff0096]" />
          </div>
          <div>
            <p className="text-sm text-white/60">{t('dashboard_total_films')}</p>
            <p className="text-2xl font-bold text-[#ff0096]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00d4ff]/30 rounded-lg">
            <Users className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-sm text-white/60">{t('dashboard_total_jury')}</p>
            <p className="text-2xl font-bold text-[#00d4ff]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/5 border border-[#00ff00]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00ff00]/30 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-[#00ff00]" />
          </div>
          <div>
            <p className="text-sm text-white/60">{t('dashboard_approved_label')}</p>
            <p className="text-2xl font-bold text-[#00ff00]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#ffa500]/20 to-[#ffa500]/5 border border-[#ffa500]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ffa500]/30 rounded-lg">
            <Clock className="w-6 h-6 text-[#ffa500]" />
          </div>
          <div>
            <p className="text-sm text-white/60">En attente</p>
            <p className="text-2xl font-bold text-[#ffa500]">0</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#ff0096] to-[#c90070] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard_total_films')}</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-[#00d4ff] to-[#0088aa] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard_total_jury')}</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-[#00ff00] to-[#00aa00] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard_approved_label')}</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
