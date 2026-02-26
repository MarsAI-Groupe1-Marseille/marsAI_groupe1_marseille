import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Users, Cpu, Globe, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';

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

// Couleurs par défaut (identiques à DEFAULT_COLORS dans Configuration.jsx)
const DEFAULT_COLORS = {
    primary:             '#7c3aed',
    primaryLight:        '#a855f7',
    accent:              '#4ade80',
    accentSecondary:     '#818cf8',
    bgMain:              '#0f0f1a',
    bgCard:              '#1a1a2e',
    bgCardSecondary:     '#16213e',
    textPrimary:         '#ffffff',
    titleColor:          '#ffffff',
    subtitleColor:       '#cccccc',
    textMuted:           '#666688',
    heroGradientFrom:    '#7c3aed',
    heroGradientTo:      '#a855f7',
    buttonPrimary:       '#7c3aed',
    buttonPrimaryLight:  '#a855f7',
    buttonTextColor:     '#ffffff',
};

// Helper : ajoute de la transparence à une couleur hex (#rrggbb → rgba)
// Accepte aussi les rgba() déjà formés et les retourne tels quels
const hexToRgba = (hex, alpha) => {
    if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const h = hex.replace('#', '');
    if (h.length === 3) {
        const r = parseInt(h[0]+h[0], 16);
        const g = parseInt(h[1]+h[1], 16);
        const b = parseInt(h[2]+h[2], 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    if (h.length !== 6) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

const Home = () => {
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideoTab, setSelectedVideoTab] = useState(1);
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

    // Écoute les changements de config — même onglet (custom event) ET autres onglets (storage event)
    useEffect(() => {
        const reloadConfig = () => {
            try {
                const saved = localStorage.getItem('home_config');
                setHomeConfig(saved ? JSON.parse(saved) : null);
            } catch {}
        };
        // Autre onglet
        const onStorage = (e) => { if (e.key === 'home_config') reloadConfig(); };
        // Même onglet : Configuration.jsx dispatch cet event après chaque sauvegarde
        window.addEventListener('storage', onStorage);
        window.addEventListener('home_config_saved', reloadConfig);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('home_config_saved', reloadConfig);
        };
    }, []);

    // ── Couleurs dynamiques ──
    const colors = { ...DEFAULT_COLORS, ...(homeConfig?.colors || {}) };

    // ── Textes du Hero (depuis config ou valeurs hardcodées) ──
    const heroConfig = homeConfig?.hero;
    const heroTitle          = heroConfig?.title          || 'MARS';
    const heroTitleHighlight = heroConfig?.titleHighlight || 'AI';
    const heroSubtitle       = lang === 'fr'
        ? (heroConfig?.subtitle    || "L'intelligence artificielle au service de la création cinématographique. Découvrez une nouvelle ère de narration numérique.")
        : (heroConfig?.subtitle_en || "Artificial intelligence at the service of filmmaking. Discover a new era of digital storytelling.");
<<<<<<< HEAD
    const ctaPrimary   = lang === 'fr' ? (heroConfig?.ctaPrimary   || 'Commencer')      : (heroConfig?.ctaPrimary_en   || 'Get Started');
    const ctaSecondary = lang === 'fr' ? (heroConfig?.ctaSecondary || 'En savoir plus') : (heroConfig?.ctaSecondary_en || 'Learn More');
=======
>>>>>>> origin

    // Awards config
    const awardsConfig = homeConfig?.awards;
    const awardsTitle = lang === 'fr'
        ? (awardsConfig?.title    || 'Reconnaissance & Awards')
        : (awardsConfig?.title_en || 'Recognition & Awards');
    const awardsStats = awardsConfig?.stats || [
        { label: 'Prix à gagner', sub: 'Dotations mensuelles',   sub_en: 'Monthly grants' },
        { label: 'Global',        sub: 'Ouvert au monde entier',  sub_en: 'Open worldwide' },
        { label: 'AI Only',       sub: '100% généré par IA',      sub_en: '100% AI-generated' },
    ];

    // Partners config
    const partnersConfig = homeConfig?.partners;
    const partnersTitle    = partnersConfig?.title    || 'Nos Partenaires';
    const partnersSubtitle = lang === 'fr'
        ? (partnersConfig?.subtitle    || 'Ils font confiance à la plateforme')
        : (partnersConfig?.subtitle_en || 'They trust our platform');

    // ── Catégories (depuis config ou valeurs par défaut) ──
    const configItems = homeConfig?.categories?.items;
    const categories = configItems && configItems.length > 0
        ? configItems.map((item, i) => {
            const key = item.key || item.title?.toLowerCase().replace(/\s+/g, '_') || `cat_${i}`;
            return {
                key,
                desc_fr:  item.desc    || DEFAULT_CATEGORIES[i]?.desc_fr || '',
                desc_en:  item.desc_en || DEFAULT_CATEGORIES[i]?.desc_en || '',
                image:    item.image   || DEFAULT_CATEGORY_IMAGES[key]   || DEFAULT_CATEGORIES[i]?.image || '',
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

    const getItemsPerPage = () => {
        if (windowWidth < 640) return 1;
        if (windowWidth < 1024) return 2;
        return 4;
    };
    const itemsPerPage = getItemsPerPage();
    const nextCategory = () => {
        if (carouselIndex + itemsPerPage < categories.length) setCarouselIndex(carouselIndex + 1);
        else setCarouselIndex(0);
    };
    const prevCategory = () => {
        if (carouselIndex > 0) setCarouselIndex(carouselIndex - 1);
        else setCarouselIndex(Math.max(0, categories.length - itemsPerPage));
    };
    const visibleCategories = categories.slice(carouselIndex, carouselIndex + itemsPerPage);
    const totalPages = Math.max(0, categories.length - itemsPerPage + 1);

    // Icônes des awards
    const AWARD_ICONS = [
        <Trophy size={28} className="sm:w-8 sm:h-8" />,
        <Globe  size={28} className="sm:w-8 sm:h-8" />,
        <Cpu    size={28} className="sm:w-8 sm:h-8" />,
    ];

    return (
        <div
            className="min-h-screen text-slate-200 font-sans selection:text-white selection:bg-violet-600"
            style={{
                background: colors.bgMain,
                '--color-primary':      colors.primary,
                '--color-primary-light': colors.primaryLight,
            }}
        >
            <main className="pt-20">

                {/* ── HERO ── */}
                {(homeConfig?.hero?.enabled !== false) && (
                <section
                    id="accueil"
                    className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
                    style={{ background: '#000', position: 'relative', zIndex: 1 }}
                >
                    {/* Video background */}
                    <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
                        <source src="/hero-video.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient overlay */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: `radial-gradient(ellipse at center, ${hexToRgba(colors.primary, 0.15)} 0%, transparent 70%)`,
                        zIndex: 2,
                    }} />

                    {/* Dark overlay */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3 }} />

                    {/* Gradient blob */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px', height: '500px',
                        background: `radial-gradient(circle, ${hexToRgba(colors.primary, 0.2)} 0%, transparent 70%)`,
                        borderRadius: '50%', filter: 'blur(100px)', zIndex: 3, pointerEvents: 'none',
                    }} />

                    {/* Content */}
                    <h1
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 sm:mb-6"
                        style={{ position: 'relative', zIndex: 10, color: colors.titleColor || colors.textPrimary }}
                    >
                        {heroTitle}{' '}
                        <span style={{
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            backgroundImage: `linear-gradient(to right, ${colors.heroGradientFrom}, ${colors.heroGradientTo})`,
                        }}>
                            {heroTitleHighlight}
                        </span>
                    </h1>

                    <p
                        className="max-w-2xl text-sm sm:text-base md:text-lg font-medium mb-6 sm:mb-10 leading-relaxed px-2 drop-shadow-md"
                        style={{ position: 'relative', zIndex: 10, color: colors.subtitleColor || colors.textPrimary }}
                    >
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0" style={{ position: 'relative', zIndex: 10 }}>
<<<<<<< HEAD
                        <button
                            className="px-6 sm:px-8 py-3 rounded-full font-bold transition flex items-center justify-center gap-2 text-sm sm:text-base"
                            style={{
                                background: `linear-gradient(135deg, ${colors.buttonPrimary}, ${colors.buttonPrimaryLight})`,
                                color: colors.buttonTextColor || '#ffffff',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {ctaPrimary} <ArrowRight size={18} />
                        </button>
                        <button
                            className="px-6 sm:px-8 py-3 rounded-full font-bold transition-all duration-300 text-sm sm:text-base relative overflow-hidden group shadow-sm"
                            style={{
                                background: `linear-gradient(135deg, ${hexToRgba(colors.primary, 0.15)}, ${hexToRgba(colors.primaryLight, 0.15)})`,
                                color: colors.buttonTextColor || '#ffffff',
                                border: `1px solid ${hexToRgba(colors.primary, 0.3)}`,
                                boxShadow: `0 0 15px ${hexToRgba(colors.primary, 0.15)}`,
                            }}
                            onClick={() => setShowAboutModal(true)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                                e.currentTarget.style.boxShadow = `0 10px 25px ${hexToRgba(colors.primary, 0.35)}`;
                                e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.6);
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = `0 0 15px ${hexToRgba(colors.primary, 0.15)}`;
                                e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.3);
                            }}
                        >
                            {ctaSecondary}
=======
                        <button 
                            onClick={() => setShowVideoModal(true)}
                            className="bg-white text-slate-950 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                            {t('home_cta_get_started')} <ArrowRight size={18} />
                        </button>
                        <button className="border border-white/20 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white/10 transition text-sm sm:text-base" onClick={() => setShowAboutModal(true)}>
                            {t('home_cta_learn_more')}
>>>>>>> origin
                        </button>
                    </div>
                </section>
                )}

                {/* ── CATEGORIES ── */}
                {(homeConfig?.categories?.enabled !== false) && (
                <section id="categories" className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <h2
                            className="text-2xl sm:text-3xl font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{ color: colors.textPrimary }}
                        >
                            {t('categories')}
                        </h2>
                        <div className="h-px flex-grow" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={prevCategory}
                            className="flex-shrink-0 p-2 sm:p-3 rounded-full border transition-all duration-300"
                            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.6); e.currentTarget.style.background = hexToRgba(colors.primary, 0.1) }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent' }}
                        >
                            <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-white" />
                        </button>

                        <div className="flex-1 overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 transition-transform duration-500">
                                {visibleCategories.map((cat, index) => (
                                    <div
                                        key={carouselIndex + index}
                                        onClick={() => setSelectedCategory(categories.indexOf(cat))}
                                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer flex flex-col h-[260px] sm:h-[280px] lg:h-[280px]"
                                        style={{ background: colors.bgCard, border: `1px solid rgba(255,255,255,0.05)` }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.5); e.currentTarget.style.boxShadow = `0 10px 30px ${hexToRgba(colors.primary, 0.2)}` }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none' }}
                                    >
                                        <div className="h-40 sm:h-48 lg:h-48 bg-cover bg-center overflow-hidden flex-shrink-0"
                                            style={{ backgroundImage: `url(${cat.image})` }}>
                                            <div className="w-full h-full bg-black/40" />
                                        </div>
                                        <div className="p-3 sm:p-4 lg:p-4 flex-grow flex flex-col justify-between overflow-hidden">
                                            <div className="flex-shrink-0">
                                                <h3 className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1 truncate" style={{ color: colors.textPrimary }}>
                                                    {lang === 'fr' ? (cat.title_fr || t(cat.key)) : (cat.title_en || t(cat.key))}
                                                </h3>
                                                <p className="text-xs line-clamp-1" style={{ color: colors.textMuted }}>
                                                    {lang === 'fr' ? cat.desc_fr : cat.desc_en}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={nextCategory}
                            className="flex-shrink-0 p-2 sm:p-3 rounded-full border transition-all duration-300"
                            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.6); e.currentTarget.style.background = hexToRgba(colors.primary, 0.1) }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent' }}
                        >
                            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>

                    {/* Carousel indicators */}
                    <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCarouselIndex(index)}
                                className="h-2 sm:h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: index === carouselIndex ? '2rem' : '0.5rem',
                                    background: index === carouselIndex ? colors.primary : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>
                </section>
                )}

                {/* ── AWARDS ── */}
                {(homeConfig?.awards?.enabled !== false) && (
                <section
                    id="awards"
                    className="py-12 sm:py-16 md:py-20"
                    style={{ background: hexToRgba(colors.bgCard, 0.5), borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                        <h2
                            className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-10 sm:mb-16"
                            style={{ color: colors.textPrimary }}
                        >
                            {awardsTitle}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
                            {awardsStats.map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div
                                        className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                                        style={{
                                            background: hexToRgba(colors.primary, 0.1),
                                            color: colors.primaryLight,
                                        }}
                                    >
                                        {AWARD_ICONS[i] || AWARD_ICONS[0]}
                                    </div>
                                    <h3 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{ color: colors.textPrimary }}>
                                        {stat.label}
                                    </h3>
                                    <p className="text-sm sm:text-base" style={{ color: colors.textMuted }}>
                                        {lang === 'fr' ? stat.sub : (stat.sub_en || stat.sub)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                )}

                {/* ── PARTENAIRES ── */}
                {(homeConfig?.partners?.enabled !== false) && (
                <section id="partenaires" className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2
                            className="text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-2 sm:mb-4"
                            style={{ color: colors.textPrimary }}
                        >
                            {partnersTitle}
                        </h2>
                        <p className="text-sm sm:text-base" style={{ color: colors.textMuted }}>{partnersSubtitle}</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 opacity-70 hover:opacity-100 transition-all duration-500">
                        {[
                            { src: '/Generated_Image_logoGemini01.png',  alt: 'Gemini',      glow: '#3b82f6' },
                            { src: '/Generated_Image_logoBanana01.png',  alt: 'Nano Banana', glow: '#eab308' },
                            { src: '/Generated_Image_logoClaude01.png',  alt: 'Claude',      glow: '#a855f7' },
                            { src: '/Generated_Image_logoCapcut01.png',  alt: 'CapCut',      glow: '#ef4444' },
                        ].map(({ src, alt, glow }) => (
                            <div
                                key={alt}
                                className="h-20 sm:h-24 rounded-lg flex items-center justify-center border transition cursor-pointer relative overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.05)' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = hexToRgba(colors.primary, 0.5); e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                            >
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '120%', height: '120%',
                                    background: `radial-gradient(circle, ${hexToRgba(glow, 0.4)} 0%, transparent 70%)`,
                                    borderRadius: '50%', filter: 'blur(20px)', zIndex: 0, pointerEvents: 'none',
                                }} />
                                <img src={src} alt={`Logo ${alt}`} className="h-16 sm:h-20 object-contain relative z-10" />
                            </div>
                        ))}
                    </div>
                </section>
                )}
            </main>

            {/* ── ABOUT MODAL ── */}
            {showAboutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowAboutModal(false)}>
                    <div
                        className="border rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ background: colors.bgCard, borderColor: 'rgba(255,255,255,0.1)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="sticky top-0 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center gap-4"
                            style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})` }}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('about_title')}</h2>
                            <button onClick={() => setShowAboutModal(false)} className="text-white hover:bg-white/20 p-2 rounded transition flex-shrink-0">
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 text-slate-300">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Trophy size={20} className="sm:w-6 sm:h-6" style={{ color: colors.primaryLight }} />
                                    {lang === 'fr' ? "Le Festival MarsAI" : "The MarsAI Festival"}
                                </h3>
                                <p className="leading-relaxed text-sm sm:text-base">
                                    {lang === 'fr'
                                        ? "MarsAI est un festival international de films générés par intelligence artificielle. Fondé en 2026, notre plateforme célèbre la convergence entre technologie et créativité cinématographique."
                                        : "MarsAI is an international festival of AI-generated films. Founded in 2026, our platform celebrates the convergence between technology and filmmaking creativity."}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Cpu size={20} className="sm:w-6 sm:h-6" style={{ color: colors.accentSecondary }} />
                                    {lang === 'fr' ? "Le Concours" : "The Competition"}
                                </h3>
                                <p className="leading-relaxed mb-3 text-sm sm:text-base">
                                    {lang === 'fr'
                                        ? "Notre concours annuel invite les cinéastes, artistes et technologues à soumettre leurs créations les plus audacieuses."
                                        : "Our annual competition invites filmmakers, artists, and technologists to submit their boldest creations."}
                                </p>
                                <ul className="space-y-2 ml-4 text-sm sm:text-base">
                                    {[
                                        lang === 'fr' ? "Originalité et créativité de la narration" : "Originality and narrative creativity",
                                        lang === 'fr' ? "Qualité technique et production"           : "Technical quality and production",
                                        lang === 'fr' ? "Innovation dans l'utilisation de l'IA"    : "Innovation in AI usage",
                                        lang === 'fr' ? "Impact émotionnel et culturel"             : "Emotional and cultural impact",
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span style={{ color: colors.primaryLight }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Globe size={20} className="sm:w-6 sm:h-6" style={{ color: colors.accentSecondary }} />
                                    {lang === 'fr' ? 'Les Événements' : 'The Events'}
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                    {[
                                        { color: colors.primary,         fr: "Cérémonie d'ouverture",   en: "Opening Ceremony",    subfr: "Lancement officiel du festival avec keynote et showcase", suben: "Official festival launch with keynote and showcase" },
                                        { color: colors.primaryLight,    fr: "Dates limite de soumission", en: "Submission Deadlines", subfr: "Périodes d'acceptation par catégorie", suben: "Acceptance periods by category" },
                                        { color: colors.accentSecondary, fr: "Sélection et jugement",   en: "Selection & Judging", subfr: "Évaluation par jury international d'experts", suben: "Evaluation by international expert jury" },
                                        { color: colors.accent,          fr: "Cérémonie de clôture",    en: "Closing Ceremony",    subfr: "Annonce des gagnants et remise des prix", suben: "Winner announcement and prize ceremony" },
                                    ].map((ev, i) => (
                                        <li key={i} className="border-l-2 pl-3 sm:pl-4" style={{ borderColor: ev.color }}>
                                            <span className="font-semibold text-white">{lang === 'fr' ? ev.fr : ev.en}</span>
                                            <p className="text-xs sm:text-sm">{lang === 'fr' ? ev.subfr : ev.suben}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div
                                className="rounded-lg p-4 mt-4 sm:mt-6"
                                style={{ background: hexToRgba(colors.primary, 0.15), border: `1px solid ${hexToRgba(colors.primary, 0.4)}` }}
                            >
                                <p className="text-xs sm:text-sm">
                                    {lang === 'fr'
                                        ? "Rejoignez notre communauté de créateurs et montrez au monde ce que l'IA peut créer. 🚀"
                                        : "Join our community of creators and show the world what AI can create. 🚀"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CATEGORY MODAL ── */}
            {selectedCategory !== null && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
                    onClick={() => setSelectedCategory(null)}
                >
                    <div
                        className="rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ background: colors.bgCard }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="sticky top-0 p-4 sm:p-6 flex items-center justify-between z-10"
                            style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})` }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                {lang === 'fr'
                                    ? (categories[selectedCategory].title_fr || t(categories[selectedCategory].key))
                                    : (categories[selectedCategory].title_en || t(categories[selectedCategory].key))}
                            </h2>
                            <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-8">
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <img
                                    src={categories[selectedCategory].image}
                                    alt={t(categories[selectedCategory].key)}
                                    className="w-full max-w-2xl h-auto rounded-xl sm:rounded-2xl shadow-2xl"
                                />
                            </div>
                            <div
                                className="rounded-xl p-4 sm:p-6"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
                                    {lang === 'fr' ? categories[selectedCategory].desc_fr : categories[selectedCategory].desc_en}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    {lang === 'fr'
                                        ? `Explorez des films fascinants dans la catégorie ${t(categories[selectedCategory].key)}.`
                                        : `Explore fascinating films in the ${t(categories[selectedCategory].key)} category.`}
                                </p>
                            </div>
                            <div className="mt-6 sm:mt-8">
                                <button
                                    className="w-full font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                                    style={{ background: `linear-gradient(to right, ${colors.buttonPrimary}, ${colors.buttonPrimaryLight})`, color: colors.buttonTextColor || '#ffffff' }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {lang === 'fr' ? 'Voir les films' : 'View Films'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO MODAL */}
            {showVideoModal && (
                <div 
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
                    onClick={() => setShowVideoModal(false)}
                >
                    <div 
                        className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 p-4 sm:p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('home_video_modal_title')}</h2>
                            <button 
                                onClick={() => setShowVideoModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* AI Presentation Section */}
                        <div className="p-4 sm:p-8 bg-gradient-to-b from-violet-900/20 to-neutral-900 border-b border-neutral-800">
                            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                                {/* AI Intro */}
                                <div className="text-center">
                                    <div className="inline-block px-4 py-2 rounded-full bg-violet-600/30 border border-violet-600/50 mb-4">
                                        <span className="text-xs sm:text-sm font-bold text-violet-300">🤖 {lang === 'fr' ? 'Présentation IA' : 'AI Presentation'}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                                        {t('home_video_intro')}
                                    </h3>
                                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
                                        {t('home_video_description')}
                                    </p>
                                </div>

                                {/* Video Descriptions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSelectedVideoTab(1)}
                                        className={`p-4 rounded-xl border transition-all duration-300 text-left group ${
                                            selectedVideoTab === 1
                                                ? 'bg-violet-600/30 border-violet-600/50'
                                                : 'bg-neutral-800/30 border-neutral-700/50 hover:bg-neutral-800/60 hover:border-violet-600/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">🎬</div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                                                    {t('home_video_part1')}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-neutral-400">
                                                    {t('home_video_part1_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setSelectedVideoTab(2)}
                                        className={`p-4 rounded-xl border transition-all duration-300 text-left group ${
                                            selectedVideoTab === 2
                                                ? 'bg-violet-600/30 border-violet-600/50'
                                                : 'bg-neutral-800/30 border-neutral-700/50 hover:bg-neutral-800/60 hover:border-violet-600/30'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl">📋</div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                                                    {t('home_video_part2')}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-neutral-400">
                                                    {t('home_video_part2_desc')}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {/* CTA Description */}
                                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 text-center">
                                    <p className="text-sm sm:text-base text-neutral-300">
                                        {t('home_video_cta_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tab Buttons */}
                        <div className="flex gap-4 p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950">
                            <button
                                onClick={() => setSelectedVideoTab(1)}
                                className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-all ${
                                    selectedVideoTab === 1
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                }`}
                            >
                                {t('home_video_part1')}
                            </button>
                            <button
                                onClick={() => setSelectedVideoTab(2)}
                                className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-all ${
                                    selectedVideoTab === 2
                                        ? 'bg-violet-600 text-white'
                                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                }`}
                            >
                                {t('home_video_part2')}
                            </button>
                        </div>

                        {/* Video Content */}
                        <div className="p-4 sm:p-8">
                            {selectedVideoTab === 1 ? (
                                <video 
                                    key="video-1"
                                    width="100%" 
                                    height="auto" 
                                    controls
                                    className="rounded-xl sm:rounded-2xl w-full"
                                >
                                    <source src="/presentation_site.mp4" type="video/mp4" />
                                    {lang === 'fr' ? 'Votre navigateur ne supporte pas la vidéo.' : 'Your browser does not support the video tag.'}
                                </video>
                            ) : (
                                <video 
                                    key="video-2"
                                    width="100%" 
                                    height="auto" 
                                    controls
                                    className="rounded-xl sm:rounded-2xl w-full"
                                >
                                    <source src="/presentation_formulaire.mp4" type="video/mp4" />
                                    {lang === 'fr' ? 'Votre navigateur ne supporte pas la vidéo.' : 'Your browser does not support the video tag.'}
                                </video>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-8 border-t border-neutral-800 bg-neutral-950">
                            <button 
                                onClick={() => navigate('/submission')}
                                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {t('home_btn_submit')}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => navigate('/login?role=admin')}
                                className="bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {t('home_btn_login_admin')}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => navigate('/login?role=jury')}
                                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {t('home_btn_login_jury')}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;