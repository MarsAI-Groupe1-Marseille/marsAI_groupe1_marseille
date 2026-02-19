import { useEffect, useState } from 'react'
import { ArrowRight, Trophy, Users, Cpu, Globe } from 'lucide-react'
import axios from '../config/axiosConfig.js'

const DEFAULT_HOME_CONFIG = {
  hero: {
    enabled: true,
    title: 'MARS',
    titleHighlight: 'AI',
    subtitle: "L'intelligence artificielle au service de la création cinématographique. Découvrez une nouvelle ère de narration numérique.",
    ctaPrimary: 'Commencer',
    ctaSecondary: 'En savoir plus',
  },
  categories: {
    enabled: true,
    items: [
      { title: 'SCI-FI', desc: 'Exploration des futurs possibles.' },
      { title: 'HORREUR', desc: "Frissons garantis par l'IA." },
      { title: 'ACTION', desc: 'Adrénaline et cinématiques.' },
      { title: 'DRAME', desc: 'Émotions profondes et récits.' },
    ],
  },
  awards: {
    enabled: true,
    title: 'Reconnaissance & Awards',
    stats: [
      { label: 'Prix à gagner', sub: 'Dotations mensuelles' },
      { label: 'Global', sub: 'Ouvert au monde entier' },
      { label: 'AI Only', sub: '100% généré par IA' },
    ],
  },
  partners: {
    enabled: true,
    title: 'Nos Partenaires',
    subtitle: 'Ils font confiance à la plateforme',
  },
}

const AWARD_ICONS = [
  <Trophy size={32} />,
  <Globe size={32} />,
  <Cpu size={32} />,
]
const AWARD_COLORS = ['text-orange-500 bg-orange-500/10', 'text-blue-500 bg-blue-500/10', 'text-purple-500 bg-purple-500/10']

const Home = () => {
  const [config, setConfig] = useState(DEFAULT_HOME_CONFIG)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/admin/home-config')
        if (data?.config) {
          setConfig({ ...DEFAULT_HOME_CONFIG, ...data.config })
          return
        }
      } catch {}
      // Fallback localStorage (mis à jour par le panel admin)
      const local = localStorage.getItem('home_config')
      if (local) setConfig({ ...DEFAULT_HOME_CONFIG, ...JSON.parse(local) })
    }
    load()

    // Écoute les changements de config en temps réel (même onglet)
    const onStorage = () => {
      const local = localStorage.getItem('home_config')
      if (local) setConfig({ ...DEFAULT_HOME_CONFIG, ...JSON.parse(local) })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const { hero, categories, awards, partners } = config

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white">
      <main className="pt-20">

        {/* ── HERO ── */}
        {hero.enabled && (
          <section id="accueil" className="relative py-32 lg:py-48 flex flex-col items-center text-center px-4 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -z-10" />
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6">
              {hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
                {hero.titleHighlight}
              </span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {hero.ctaPrimary && (
                <button className="bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center gap-2">
                  {hero.ctaPrimary} <ArrowRight size={18} />
                </button>
              )}
              {hero.ctaSecondary && (
                <button className="border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition">
                  {hero.ctaSecondary}
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── CATÉGORIES ── */}
        {categories.enabled && categories.items.length > 0 && (
          <section id="categories" className="py-20 max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Catégories</h2>
              <div className="h-px bg-white/20 flex-grow" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.items.map((cat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/5 hover:border-orange-500/50 transition-all duration-300">
                  {cat.image
                    ? <img src={cat.image} alt={cat.title} className="w-full h-48 object-cover" />
                    : <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900" />
                  }
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                    <p className="text-slate-400 text-sm">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── AWARDS ── */}
        {awards.enabled && (
          <section id="awards" className="py-20 bg-slate-900/50 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-16">{awards.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {awards.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 overflow-hidden ${!stat.image ? AWARD_COLORS[i % AWARD_COLORS.length] : ''}`}>
                      {stat.image
                        ? <img src={stat.image} alt={stat.label} className="w-full h-full object-cover" />
                        : AWARD_ICONS[i % AWARD_ICONS.length]
                      }
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2">{stat.label}</h3>
                    <p className="text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PARTENAIRES ── */}
        {partners.enabled && (
          <section id="partenaires" className="py-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-4">{partners.title}</h2>
              <p className="text-slate-400">{partners.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 transition cursor-pointer">
                  <span className="font-bold text-xl tracking-widest text-slate-500 uppercase">Logo {i}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}

export default Home