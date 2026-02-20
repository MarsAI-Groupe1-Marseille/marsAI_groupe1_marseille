import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Users, Cpu, Globe, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

// Mapping clé → image par défaut (pour les catégories qui n'ont pas d'image custom)
const DEFAULT_CATEGORY_IMAGES = {
    sci_fi:      "/Gemini_Generated_Image_ScFIction.png",
    horror:      "/Gemini_Generated_Image_Horreur.png",
    action:      "/Gemini_Generated_Image_Action.png",
    drama:       "/Gemini_Generated_Image_Drame.png",
    thriller:    "/Gemini_Generated_Image_Thriller.png",
    documentary: "/Gemini_Generated_Image_Documentaire.png",
    animation:   "/Gemini_Generated_Image_Animation.png",
    history:     "/Gemini_Generated_Image_Histoire.png",
};

// Catégories par défaut si aucune config en localStorage
const DEFAULT_CATEGORIES = [
    { key: 'sci_fi',      desc_fr: "Exploration des futurs possibles.",              desc_en: "Exploration of possible futures.",            image: "/Gemini_Generated_Image_ScFIction.png" },
    { key: 'horror',      desc_fr: "Frissons garantis par l'IA.",                    desc_en: "Guaranteed thrills by AI.",                   image: "/Gemini_Generated_Image_Horreur.png" },
    { key: 'action',      desc_fr: "Adrénaline et cinématiques.",                    desc_en: "Adrenaline and cinematics.",                  image: "/Gemini_Generated_Image_Action.png" },
    { key: 'drama',       desc_fr: "Émotions profondes et récits.",                  desc_en: "Deep emotions and stories.",                  image: "/Gemini_Generated_Image_Drame.png" },
    { key: 'thriller',    desc_fr: "Enquête approfonfis et suspense.",               desc_en: "In-depth investigation and suspense.",        image: "/Gemini_Generated_Image_Thriller.png" },
    { key: 'documentary', desc_fr: "Reportage et investigation de haut vol.",        desc_en: "High-level reporting and investigation.",     image: "/Gemini_Generated_Image_Documentaire.png" },
    { key: 'animation',   desc_fr: "Technologie et fantaisie.",                      desc_en: "Technology and fantasy.",                    image: "/Gemini_Generated_Image_Animation.png" },
    { key: 'history',     desc_fr: "Revisite les meilleurs moments de l'histoire.",  desc_en: "Revisit the best moments that marked history.", image: "/Gemini_Generated_Image_Histoire.png" },
];

const Home = () => {
    const { t, lang } = useLanguage();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // ── Lecture de la config sauvegardée par la page Configuration ──
    const [homeConfig, setHomeConfig] = useState(() => {
        try {
            const saved = localStorage.getItem('home_config');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Écoute les changements de localStorage (si la config change dans un autre onglet)
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'home_config') {
                try { setHomeConfig(e.newValue ? JSON.parse(e.newValue) : null); } catch {}
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // ── Textes du Hero (depuis config ou valeurs hardcodées) ──
    const heroConfig = homeConfig?.hero;
    const heroTitle          = heroConfig?.title          || 'MARS';
    const heroTitleHighlight = heroConfig?.titleHighlight || 'AI';
    const heroSubtitle       = lang === 'fr'
        ? (heroConfig?.subtitle    || "L'intelligence artificielle au service de la création cinématographique. Découvrez une nouvelle ère de narration numérique.")
        : (heroConfig?.subtitle_en || "Artificial intelligence at the service of filmmaking. Discover a new era of digital storytelling.");
    const ctaPrimary   = lang === 'fr' ? (heroConfig?.ctaPrimary   || 'Commencer')    : (heroConfig?.ctaPrimary_en   || 'Get Started');
    const ctaSecondary = lang === 'fr' ? (heroConfig?.ctaSecondary || 'En savoir plus') : (heroConfig?.ctaSecondary_en || 'Learn More');

    // ── Catégories (depuis config ou valeurs par défaut) ──
    const configItems = homeConfig?.categories?.items;
    const categories = configItems && configItems.length > 0
        ? configItems.map((item, i) => {
            // On génère une clé stable à partir du titre ou de l'index
            const key = item.key || item.title?.toLowerCase().replace(/\s+/g, '_') || `cat_${i}`;
            return {
                key,
                desc_fr: item.desc  || DEFAULT_CATEGORIES[i]?.desc_fr || '',
                desc_en: item.desc_en || DEFAULT_CATEGORIES[i]?.desc_en || '',
                image:   item.image || DEFAULT_CATEGORY_IMAGES[key] || DEFAULT_CATEGORIES[i]?.image || '',
                // On garde aussi le titre custom pour l'affichage si la clé de traduction n'existe pas
                title_fr: item.title    || undefined,
                title_en: item.title_en || undefined,
            };
          })
        : DEFAULT_CATEGORIES;

    // Hook pour suivre la taille de la fenêtre
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculer le nombre d'items à afficher selon la taille d'écran
    const getItemsPerPage = () => {
        if (windowWidth < 640) return 1;      // mobile
        if (windowWidth < 1024) return 2;     // tablet
        return 4;                              // desktop
    };

    const itemsPerPage = getItemsPerPage();
    const nextCategory = () => {
        if (carouselIndex + itemsPerPage < categories.length) {
            setCarouselIndex(carouselIndex + 1);
        } else {
            setCarouselIndex(0);
        }
    };
    const prevCategory = () => {
        if (carouselIndex > 0) {
            setCarouselIndex(carouselIndex - 1);
        } else {
            setCarouselIndex(Math.max(0, categories.length - itemsPerPage));
        }
    };
    const visibleCategories = categories.slice(carouselIndex, carouselIndex + itemsPerPage);
    const totalPages = Math.max(0, categories.length - itemsPerPage + 1);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white">

              <main className="pt-20">
                {/* HERO SECTION */}
                <section 
                  id="accueil" 
                  className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black"
                  style={{
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                    {/* HERO BACKGROUND - Video */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 1
                        }}
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient overlay for video */}
                    <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                          zIndex: 2
                        }}
                    />

                    {/* DARK OVERLAY */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 3
                      }}
                    ></div>

                    {/* GRADIENT BLOB */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(234, 88, 12, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                        zIndex: 3,
                        pointerEvents: 'none'
                      }}
                    ></div>

                    {/* CONTENT - HIGHEST Z-INDEX */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-4 sm:mb-6" style={{ position: 'relative', zIndex: 10 }}>
                        {heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">{heroTitleHighlight}</span>
                    </h1>
                    <p className="max-w-2xl text-sm sm:text-base md:text-lg font-medium text-white/90 mb-6 sm:mb-10 leading-relaxed px-2 drop-shadow-md" style={{ position: 'relative', zIndex: 10 }}>
                        {heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0" style={{ position: 'relative', zIndex: 10 }}>
                        <button className="bg-white text-slate-950 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                            {ctaPrimary} <ArrowRight size={18} />
                        </button>
                        <button className="border border-white/20 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white/10 transition text-sm sm:text-base" onClick={() => setShowAboutModal(true)}>
                            {ctaSecondary}
                        </button>
                    </div>
                </section>

                {/* CATEGORIES */}
                <section id="categories" className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap">{t('categories')}</h2>
                        <div className="h-px bg-white/20 flex-grow"></div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Previous Button */}
                        <button 
                            onClick={prevCategory}
                            className="flex-shrink-0 p-2 sm:p-3 rounded-full border border-white/20 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
                        >
                            <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-white" />
                        </button>

                        {/* Carousel Grid */}
                        <div className="flex-1 overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 transition-transform duration-500">
                                {visibleCategories.map((cat, index) => (
                                    <div 
                                        key={carouselIndex + index} 
                                        onClick={() => setSelectedCategory(categories.indexOf(cat))}
                                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 border border-white/5 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 flex flex-col h-[260px] sm:h-[280px] lg:h-[280px]">
                                        <div 
                                            className="h-40 sm:h-48 lg:h-48 bg-cover bg-center overflow-hidden flex-shrink-0"
                                            style={{ backgroundImage: `url(${cat.image})` }}
                                        >
                                            <div className="w-full h-full bg-black/40"></div>
                                        </div>
                                        <div className="p-3 sm:p-4 lg:p-4 flex-grow flex flex-col justify-between overflow-hidden">
                                            <div className="flex-shrink-0">
                                                <h3 className="text-sm sm:text-base lg:text-base font-bold text-white mb-0.5 sm:mb-1 truncate">
                                                    {lang === 'fr'
                                                        ? (cat.title_fr || t(cat.key))
                                                        : (cat.title_en || t(cat.key))}
                                                </h3>
                                                <p className="text-slate-400 text-xs line-clamp-1">{lang === 'fr' ? cat.desc_fr : cat.desc_en}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next Button */}
                        <button 
                            onClick={nextCategory}
                            className="flex-shrink-0 p-2 sm:p-3 rounded-full border border-white/20 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
                        >
                            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCarouselIndex(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                    index === carouselIndex
                                        ? 'bg-orange-500 w-8 sm:w-12'
                                        : 'bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                </section>

                {/* AWARDS */}
                <section id="awards" className="py-12 sm:py-16 md:py-20 bg-slate-900/50 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-10 sm:mb-16">{lang === 'fr' ? 'Reconnaissance & Awards' : 'Recognition & Awards'}</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
                            <div className="flex flex-col items-center">
                                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-4 sm:mb-6">
                                    <Trophy size={28} className="sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{lang === 'fr' ? 'Prix à gagner' : 'Prizes to Win'}</h3>
                                <p className="text-sm sm:text-base text-slate-400">{lang === 'fr' ? 'Dotations mensuelles' : 'Monthly Prizes'}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-4 sm:mb-6">
                                    <Globe size={28} className="sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{lang === 'fr' ? 'Global' : 'Global'}</h3>
                                <p className="text-sm sm:text-base text-slate-400">{lang === 'fr' ? 'Ouvert au monde entier' : 'Open to the Whole World'}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-14 sm:w-16 h-14 sm:h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-4 sm:mb-6">
                                    <Cpu size={28} className="sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">{lang === 'fr' ? 'AI Only' : 'AI Only'}</h3>
                                <p className="text-sm sm:text-base text-slate-400">{lang === 'fr' ? '100% généré par IA' : '100% AI Generated'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PARTENAIRES */}
                <section id="partenaires" className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-2 sm:mb-4">{lang === 'fr' ? 'Nos Partenaires' : 'Our Partners'}</h2>
                        <p className="text-sm sm:text-base text-slate-400">{lang === 'fr' ? 'Ils font confiance à la plateforme' : 'They Trust Our Platform'}</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 opacity-70 hover:opacity-100 transition-all duration-500">
                        {/* Logo 1 - Gemini */}
                        <div className="h-20 sm:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition cursor-pointer relative overflow-hidden">
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '120%',
                              height: '120%',
                              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                              borderRadius: '50%',
                              filter: 'blur(20px)',
                              zIndex: 0,
                              pointerEvents: 'none'
                            }}></div>
                            <img src="/Generated_Image_logoGemini01.png" alt="Logo Gemini" className="h-16 sm:h-20 object-contain relative z-10" />
                        </div>
                        {/* Logo 2 - Nano Banana */}
                        <div className="h-20 sm:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition cursor-pointer relative overflow-hidden">
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '120%',
                              height: '120%',
                              background: 'radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, transparent 70%)',
                              borderRadius: '50%',
                              filter: 'blur(20px)',
                              zIndex: 0,
                              pointerEvents: 'none'
                            }}></div>
                            <img src="/Generated_Image_logoBanana01.png" alt="Logo Nano Banana" className="h-16 sm:h-20 object-contain relative z-10" />
                        </div>
                        {/* Logo 3 - Claude */}
                        <div className="h-20 sm:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition cursor-pointer relative overflow-hidden">
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '120%',
                              height: '120%',
                              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                              borderRadius: '50%',
                              filter: 'blur(20px)',
                              zIndex: 0,
                              pointerEvents: 'none'
                            }}></div>
                            <img src="/Generated_Image_logoClaude01.png" alt="Logo Claude" className="h-16 sm:h-20 object-contain relative z-10" />
                        </div>
                        {/* Logo 4 - CapCut */}
                        <div className="h-20 sm:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition cursor-pointer relative overflow-hidden">
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '120%',
                              height: '120%',
                              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
                              borderRadius: '50%',
                              filter: 'blur(20px)',
                              zIndex: 0,
                              pointerEvents: 'none'
                            }}></div>
                            <img src="/Generated_Image_logoCapcut01.png" alt="Logo CapCut" className="h-16 sm:h-20 object-contain relative z-10" />
                        </div>
                    </div>
                </section>
            </main>

            {/* ABOUT MODAL */}
            {showAboutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowAboutModal(false)}>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('about_title')}</h2>
                            <button onClick={() => setShowAboutModal(false)} className="text-white hover:bg-white/20 p-2 rounded transition flex-shrink-0">
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 text-slate-300">
                            {/* Festival Section */}
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Trophy size={20} className="sm:w-6 sm:h-6 text-orange-500" />
                                    {lang === 'fr' ? "Le Festival MarsAI" : "The MarsAI Festival"}
                                </h3>
                                <p className="leading-relaxed text-sm sm:text-base">
                                    {lang === 'fr' 
                                        ? "MarsAI est un festival international de films générés par intelligence artificielle. Fondé en 2026, notre plateforme célèbre la convergence entre technologie et créativité cinématographique. Nous rassemblons des créateurs du monde entier pour explorer les possibilités infinies de la narration numérique."
                                        : "MarsAI is an international festival of AI-generated films. Founded in 2026, our platform celebrates the convergence between technology and filmmaking creativity. We bring together creators from around the world to explore the infinite possibilities of digital storytelling."}
                                </p>
                            </div>

                            {/* Competition Section */}
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Cpu size={20} className="sm:w-6 sm:h-6 text-violet-400" />
                                    {lang === 'fr' ? "Le Concours" : "The Competition"}
                                </h3>
                                <p className="leading-relaxed mb-3 text-sm sm:text-base">
                                    {lang === 'fr' 
                                        ? "Notre concours annuel invite les cinéastes, artistes et technologues à soumettre leurs créations les plus audacieuses. Les critères d'évaluation incluent:"
                                        : "Our annual competition invites filmmakers, artists, and technologists to submit their boldest creations. Evaluation criteria include:"}
                                </p>
                                <ul className="space-y-2 ml-4 text-sm sm:text-base">
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">•</span>
                                        <span>{lang === 'fr' ? "Originalité et créativité de la narration" : "Originality and narrative creativity"}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">•</span>
                                        <span>{lang === 'fr' ? "Qualité technique et production" : "Technical quality and production"}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">•</span>
                                        <span>{lang === 'fr' ? "Innovation dans l'utilisation de l'IA" : "Innovation in AI usage"}</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-violet-400">•</span>
                                        <span>{lang === 'fr' ? "Impact émotionnel et culturel" : "Emotional and cultural impact"}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Events Section */}
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Globe size={20} className="sm:w-6 sm:h-6 text-blue-400" />
                                    {lang === 'fr' ? 'Les Événements' : 'The Events'}
                                </h3>
                                <p className="leading-relaxed mb-3 text-sm sm:text-base">
                                    {lang === 'fr' ? "Tout au long de l'année, nous organisons:" : "Throughout the year, we organize:"}
                                </p>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                    <li className="border-l-2 border-orange-500 pl-3 sm:pl-4">
                                        <span className="font-semibold text-white">{lang === 'fr' ? "Cérémonie d'ouverture" : "Opening Ceremony"}</span>
                                        <p className="text-xs sm:text-sm">{lang === 'fr' ? "Lancement officiel du festival avec keynote et showcase" : "Official festival launch with keynote and showcase"}</p>
                                    </li>
                                    <li className="border-l-2 border-violet-400 pl-3 sm:pl-4">
                                        <span className="font-semibold text-white">{lang === 'fr' ? "Dates limite de soumission" : "Submission Deadlines"}</span>
                                        <p className="text-xs sm:text-sm">{lang === 'fr' ? "Périodes d'acceptation par catégorie" : "Acceptance periods by category"}</p>
                                    </li>
                                    <li className="border-l-2 border-blue-400 pl-3 sm:pl-4">
                                        <span className="font-semibold text-white">{lang === 'fr' ? "Sélection et jugement" : "Selection & Judging"}</span>
                                        <p className="text-xs sm:text-sm">{lang === 'fr' ? "Évaluation par jury international d'experts" : "Evaluation by international expert jury"}</p>
                                    </li>
                                    <li className="border-l-2 border-green-400 pl-3 sm:pl-4">
                                        <span className="font-semibold text-white">{lang === 'fr' ? "Cérémonie de clôture" : "Closing Ceremony"}</span>
                                        <p className="text-xs sm:text-sm">{lang === 'fr' ? "Annonce des gagnants et remise des prix" : "Winner announcement and prize ceremony"}</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Call to Action */}
                            <div className="bg-violet-600/20 border border-violet-600/50 rounded-lg p-4 mt-4 sm:mt-6">
                                <p className="text-xs sm:text-sm">
                                    {lang === 'fr' 
                                        ? "Rejoignez notre communauté de créateurs et montrez au monde ce que l'IA peut créer. Soumettez votre film dès maintenant et soyez part de la révolution cinématographique! 🚀"
                                        : "Join our community of creators and show the world what AI can create. Submit your film now and be part of the cinematic revolution! 🚀"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CATEGORY MODAL */}
            {selectedCategory !== null && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
                    onClick={() => setSelectedCategory(null)}
                >
                    <div 
                        className="bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Close Button */}
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 p-4 sm:p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                {lang === 'fr'
                                    ? (categories[selectedCategory].title_fr || t(categories[selectedCategory].key))
                                    : (categories[selectedCategory].title_en || t(categories[selectedCategory].key))}
                            </h2>
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Image Display */}
                        <div className="p-4 sm:p-8">
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <img 
                                    src={categories[selectedCategory].image}
                                    alt={t(categories[selectedCategory].key)}
                                    className="w-full max-w-2xl h-auto rounded-xl sm:rounded-2xl shadow-2xl"
                                />
                            </div>

                            {/* Description */}
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 sm:p-6">
                                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
                                    {lang === 'fr' ? categories[selectedCategory].desc_fr : categories[selectedCategory].desc_en}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    {lang === 'fr' 
                                        ? `Explorez des films fascinants dans la catégorie ${t(categories[selectedCategory].key)}. Découvrez comment les créateurs utilisent l'IA pour repousser les limites du cinéma dans ce genre unique.`
                                        : `Explore fascinating films in the ${t(categories[selectedCategory].key)} category. Discover how creators use AI to push the boundaries of cinema in this unique genre.`}
                                </p>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-6 sm:mt-8">
                                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                                    {lang === 'fr' ? 'Voir les films' : 'View Films'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Home;