import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ResultsTab() {
  const { t } = useLanguage();

  return (
    <div className="bg-white/5 border-2 border-[#ff0096] rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#ff0096]">🏆 {t('results_title')}</h2>
      <p className="text-white/70">{t('results_winners')}</p>
    </div>
  );
}
