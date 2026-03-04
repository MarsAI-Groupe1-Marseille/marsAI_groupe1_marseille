import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-neutral-900 border border-red-500/30 rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/50">
              <ShieldX size={40} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('unauthorized_title') || 'Accès Refusé'}
          </h1>

          {/* Message */}
          <p className="text-neutral-400 mb-8 leading-relaxed">
            {t('unauthorized_message') || 
              "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur."}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoBack}
              className="w-full bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              {t('unauthorized_go_back') || 'Retour'}
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('unauthorized_go_dashboard') || 'Aller au tableau de bord'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
