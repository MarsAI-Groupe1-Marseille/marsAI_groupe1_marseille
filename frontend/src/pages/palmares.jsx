import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Award, Star, Sparkles, Film } from 'lucide-react';

export default function Palmares() {
  const { t } = useLanguage();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données mockées pour le frontend (sera remplacé par l'API)
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setWinners([
        {
          id: 1,
          award_name: 'Grand Prix du Festival',
          award_type: 'grand_prix',
          film: {
            title: 'SYNTHETICA : L\'AUBE',
            director: 'Julien Dupond',
            poster_url: '/film_poster_1.jpg',
            duration: 87
          }
        },
        {
          id: 2,
          award_name: 'Prix du Jury',
          award_type: 'jury',
          film: {
            title: 'NOVA DIMENSION',
            director: 'Sophie Martin',
            poster_url: '/film_poster_2.jpg',
            duration: 95
          }
        },
        {
          id: 3,
          award_name: 'Prix du Public',
          award_type: 'public',
          film: {
            title: 'L\'OMBRE DU FUTUR',
            director: 'Marc Leblanc',
            poster_url: '/film_poster_3.jpg',
            duration: 102
          }
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Configuration des couleurs par type de prix
  const awardStyles = {
    grand_prix: {
      gradient: 'from-yellow-500/20 to-amber-600/20',
      border: 'border-yellow-500/40',
      iconBg: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-400',
      icon: Trophy
    },
    jury: {
      gradient: 'from-purple-500/20 to-violet-600/20',
      border: 'border-purple-500/40',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      textColor: 'text-purple-400',
      icon: Award
    },
    public: {
      gradient: 'from-blue-500/20 to-cyan-600/20',
      border: 'border-blue-500/40',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
      icon: Star
    },
    special: {
      gradient: 'from-violet-500/20 to-indigo-600/20',
      border: 'border-violet-500/40',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      textColor: 'text-violet-400',
      icon: Sparkles
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Film size={48} className="text-violet-400 mx-auto mb-4 animate-pulse" />
          <p className="text-neutral-400 text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full mb-6 border border-violet-500/30">
            <Trophy size={40} className="text-violet-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('palmares_title')}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            {t('palmares_subtitle')}
          </p>
        </header>

        {/* Winners Grid */}
        {winners.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={64} className="text-neutral-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-600 mb-2">
              {t('palmares_no_winners')}
            </h2>
            <p className="text-neutral-500">
              {t('palmares_no_winners_desc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.map((winner) => {
              const style = awardStyles[winner.award_type] || awardStyles.special;
              const AwardIcon = style.icon;

              return (
                <div
                  key={winner.id}
                  className={`group relative bg-gradient-to-br ${style.gradient} border ${style.border} rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20`}
                >
                  {/* Film Poster */}
                  <div className="relative h-96 overflow-hidden bg-neutral-900">
                    {winner.film.poster_url ? (
                      <img
                        src={winner.film.poster_url}
                        alt={winner.film.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center"
                      style={{ display: winner.film.poster_url ? 'none' : 'flex' }}
                    >
                      <Film size={64} className="text-neutral-700" />
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent opacity-80"></div>
                    
                    {/* Award Badge */}
                    <div className={`absolute top-4 right-4 ${style.iconBg} backdrop-blur-sm px-4 py-2 rounded-full border ${style.border} flex items-center gap-2`}>
                      <AwardIcon size={20} className={style.iconColor} />
                      <span className={`text-sm font-bold ${style.textColor}`}>
                        {winner.award_name}
                      </span>
                    </div>
                  </div>

                  {/* Film Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-violet-300 transition-colors">
                      {winner.film.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-1">
                      <span className="text-neutral-500">Réalisateur:</span> {winner.film.director}
                    </p>
                    {winner.film.duration && (
                      <p className="text-neutral-500 text-xs">
                        {winner.film.duration} minutes
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer CTA */}
        {winners.length > 0 && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/30 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {t('palmares_congratulations')}
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                {t('palmares_congratulations_desc')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
