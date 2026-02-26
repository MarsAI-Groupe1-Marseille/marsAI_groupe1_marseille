import { useLanguage } from '../../context/LanguageContext.jsx';
import { Film, CheckCircle2, Clock, XCircle, BarChart3 } from 'lucide-react';

export default function FilmsTab() {
  const { t } = useLanguage();

  return (
    <div className="bg-white/5 border-2 border-[#ff0096] rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#ff0096]">🎬 {t('films_management')}</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#ff0096]/20 to-[#ff0096]/5 border border-[#ff0096]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ff0096]/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-[#ff0096]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Total</p>
            <p className="text-2xl font-bold text-[#ff0096]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00d4ff]/30 rounded-lg">
            <Clock className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-sm text-white/60">En attente</p>
            <p className="text-2xl font-bold text-[#00d4ff]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/5 border border-[#00ff00]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00ff00]/30 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-[#00ff00]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Approuvés</p>
            <p className="text-2xl font-bold text-[#00ff00]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#ff6b6b]/20 to-[#ff6b6b]/5 border border-[#ff6b6b]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ff6b6b]/30 rounded-lg">
            <XCircle className="w-6 h-6 text-[#ff6b6b]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Rejetés</p>
            <p className="text-2xl font-bold text-[#ff6b6b]">0</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#ffa500]/20 to-[#ffa500]/5 border border-[#ffa500]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ffa500]/30 rounded-lg">
            <Film className="w-6 h-6 text-[#ffa500]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Taux approuv.</p>
            <p className="text-2xl font-bold text-[#ffa500]">0%</p>
          </div>
        </div>
      </div>
      
      <p className="text-white/70">{t('films_no_films')}</p>
    </div>
  );
}
