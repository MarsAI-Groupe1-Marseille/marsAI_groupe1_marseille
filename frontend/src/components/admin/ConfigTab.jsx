import { useLanguage } from '../../context/LanguageContext.jsx';
import { Settings, Database, Shield, Clock } from 'lucide-react';

export default function ConfigTab() {
  const { t } = useLanguage();

  return (
    <div className="bg-white/5 border-2 border-[#ff0096] rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#ff0096]">⚙️ {t('config_title')}</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#ff0096]/20 to-[#ff0096]/5 border border-[#ff0096]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ff0096]/30 rounded-lg">
            <Settings className="w-6 h-6 text-[#ff0096]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Paramètres actifs</p>
            <p className="text-2xl font-bold text-[#ff0096]">✓</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00d4ff]/30 rounded-lg">
            <Database className="w-6 h-6 text-[#00d4ff]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Données sauvegardées</p>
            <p className="text-2xl font-bold text-[#00d4ff]">✓</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#00ff00]/20 to-[#00ff00]/5 border border-[#00ff00]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#00ff00]/30 rounded-lg">
            <Shield className="w-6 h-6 text-[#00ff00]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Sécurité</p>
            <p className="text-2xl font-bold text-[#00ff00]">✓</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#ffa500]/20 to-[#ffa500]/5 border border-[#ffa500]/50 rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 bg-[#ffa500]/30 rounded-lg">
            <Clock className="w-6 h-6 text-[#ffa500]" />
          </div>
          <div>
            <p className="text-sm text-white/60">Dernière maj</p>
            <p className="text-2xl font-bold text-[#ffa500]">Auj.</p>
          </div>
        </div>
      </div>
      
      <p className="text-white/70">{t('config_settings')}</p>
    </div>
  );
}
