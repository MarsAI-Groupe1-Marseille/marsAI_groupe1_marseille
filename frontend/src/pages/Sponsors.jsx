import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Handshake, Mail, MapPin } from 'lucide-react';

export default function Sponsors() {
  const { t } = useLanguage();

  const goldSponsors = [
    {
      id: 'gold_1',
      name: t('sponsor_gold_1'),
      description: t('sponsor_gold_1_desc'),
      image: '/sponsor_gold_1.png',
      link: '#'
    },
    {
      id: 'gold_2',
      name: t('sponsor_gold_2'),
      description: t('sponsor_gold_2_desc'),
      image: '/sponsor_gold_2.png',
      link: '#'
    }
  ];

  const silverSponsors = [
    {
      id: 'silver_1',
      name: t('sponsor_silver_1'),
      image: '/sponsor_silver_1.png',
      link: '#'
    },
    {
      id: 'silver_2',
      name: t('sponsor_silver_2'),
      image: '/sponsor_silver_2.png',
      link: '#'
    },
    {
      id: 'silver_3',
      name: t('sponsor_silver_3'),
      image: '/sponsor_silver_3.png',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-6">
            <Handshake size={32} className="text-violet-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('sponsors_title')}
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t('sponsors_intro')}
          </p>
        </header>

        {/* Gold Sponsors Section */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            {t('sponsors_gold')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goldSponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.link}
                className="group bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-8 hover:from-yellow-500/20 hover:to-yellow-600/20 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {sponsor.image && (
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {sponsor.name}
                    </h3>
                    <p className="text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors">
                      {sponsor.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Silver Sponsors Section */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            {t('sponsors_silver')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {silverSponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.link}
                className="group bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/30 rounded-xl p-6 hover:from-slate-500/20 hover:to-slate-600/20 hover:border-slate-400/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden mb-4">
                    {sponsor.image && (
                      <img
                        src={sponsor.image}
                        alt={sponsor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-slate-300 transition-colors">
                    {sponsor.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-xl p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('become_sponsor')}
          </h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            {t('become_sponsor_desc')}
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all duration-300">
            <Mail size={20} />
            {t('contact_us')}
          </button>
        </section>

        {/* Contact Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
            <Mail className="text-violet-400 mx-auto mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <p className="text-neutral-400">partners@marsaifestival.com</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
            <MapPin className="text-violet-400 mx-auto mb-3" size={24} />
            <h3 className="text-lg font-bold text-white mb-2">{t('footer_location')}</h3>
            <p className="text-neutral-400">Paris / Mars (virtual)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
