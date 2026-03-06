import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Trophy, Users, Cpu, Globe, Menu, X, ChevronLeft, ChevronRight, LayoutDashboard, Film, MessageCircle, FileText, Settings, Lock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground.jsx';
import 'flag-icons/css/flag-icons.min.css';

gsap.registerPlugin(ScrollTrigger);

// Mapping clé → image par défaut
const DEFAULT_CATEGORY_IMAGES = {
    sci_fi:      "/Gemini_Generated_Image_ScFIction.png",
    horror:      "/Gemini_Generated_Image_Horreur.png",
    action:      "/Gemini_Generated_Image_Action.png",
    drama:       "/Gemini_Generated_Image_Drame.png",
    thriller:    "/Gemini_Generated_Image_Thriller.png",
    documentary: "/Gemini_Generated_Image_Documentaire.png",
    animation:   "/Gemini_Generated_Image_Animation.png",
    history:     "/Gemini_Generated_Image_Histoire.png",
    // comedy:      "/generated-image-1-Comedy.png",
    // romance:     "/generated-image-Romance.png",
    // mystery:     "/generated-image-Mystery.png",
    // adventure:   "/generated-image-Aventure.png",
    // fantasy:     "/generated-image-Fantasy.png",
    // crime:       "/generated-image-Crime.png",
    // western:     "/generated-image-Western.png",
    // scifi_action: "/generated-image-Scifi_action.png",
    // supernatural: "/generated-image-Supernatural.png",
    // sports:      "/generated-image-Sports.png",
    // music:       "/generated-image-Music.png",
    // family:      "/generated-image-Family.png",
    // bio:         "/generated-image-Bio.png",
    // noir:        "/generated-image-Noir.png",
    // experimental: "/generated-image-Experimental.png",
    // hybrid:      "/generated-image-Hybrid.png",
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
    // { key: 'comedy',      desc_fr: "Rires et humour générés par IA.",                desc_en: "Laughter and AI-generated humor.",            image: "/generated-image-1-Comedy.png" },
    // { key: 'romance',     desc_fr: "Histoires d'amour captivantes.",                 desc_en: "Captivating love stories.",                   image: "/generated-image-Romance.png" },
    // { key: 'mystery',     desc_fr: "Énigmes et secrets à découvrir.",                desc_en: "Mysteries and secrets to uncover.",           image: "/generated-image-Mystery.png" },
    // { key: 'adventure',   desc_fr: "Quêtes épiques et voyages.",                     desc_en: "Epic quests and journeys.",                   image: "/generated-image-Aventure.png" },
    // { key: 'fantasy',     desc_fr: "Mondes magiques et créatures.",                  desc_en: "Magical worlds and creatures.",               image: "/generated-image-Fantasy.png" },
    // { key: 'crime',       desc_fr: "Crimes et enquêtes captivantes.",                desc_en: "Crimes and captivating investigations.",      image: "/generated-image-Crime.png" },
    // { key: 'western',     desc_fr: "L'Ouest sauvage réimaginé.",                     desc_en: "The wild West reimagined.",                   image: "/generated-image-Western.png" },
    // { key: 'scifi_action', desc_fr: "SciFi avec action pure.",                       desc_en: "Sci-Fi with pure action.",                    image: "/generated-image-Scifi_action.png" },
    // { key: 'supernatural', desc_fr: "Au-délà du naturel et du réel.",                desc_en: "Beyond the natural and real.",                image: "/generated-image-Supernatural.png" },
    // { key: 'sports',      desc_fr: "Compétitions et triomphes épiques.",             desc_en: "Epic competitions and triumphs.",             image: "/generated-image-Sports.png" },
    // { key: 'music',       desc_fr: "Musique, concert et passion.",                   desc_en: "Music, concerts and passion.",                image: "/generated-image-Music.png" },
    // { key: 'family',      desc_fr: "Films pour toute la famille.",                   desc_en: "Movies for the whole family.",                image: "/generated-image-Family.png" },
    // { key: 'bio',         desc_fr: "Histoires vraies et inspirantes.",               desc_en: "True and inspiring stories.",                 image: "/generated-image-Bio.png" },
    // { key: 'noir',        desc_fr: "Noir et ambiance sombre.",                       desc_en: "Dark and noir atmosphere.",                   image: "/generated-image-Noir.png" },
    // { key: 'experimental', desc_fr: "Films expérimentaux d'IA.",                    desc_en: "Experimental AI films.",                     image: "/generated-image-Experimental.png" },
    // { key: 'hybrid',      desc_fr: "Fusion de genres et styles.",                    desc_en: "Fusion of genres and styles.",                image: "/generated-image-Hybrid.png" },
];

// Icônes awards par défaut
const AWARD_ICONS_DEFAULT = [
    <Trophy size={28} />,
    <Globe  size={28} />,
    <Cpu    size={28} />,
];
const AWARD_COLORS_DEFAULT = ['text-orange-500', 'text-blue-500', 'text-purple-500'];
const AWARD_BG_DEFAULT     = ['bg-orange-500/10', 'bg-blue-500/10', 'bg-purple-500/10'];

// Pages du site pour le carrousel
const SITE_PAGES = [
    // Public pages
    { title_fr: 'Accueil', title_en: 'Home', path: '/', icon: '🏠', category: 'public', color: 'from-blue-500 to-cyan-500' },
    { title_fr: 'Galerie', title_en: 'Gallery', path: '/galerie', icon: '🎬', category: 'public', color: 'from-purple-500 to-pink-500' },
    { title_fr: 'FAQ', title_en: 'FAQ', path: '/faq', icon: '❓', category: 'public', color: 'from-green-500 to-emerald-500' },
    { title_fr: 'Contact', title_en: 'Contact', path: '/contact', icon: '💬', category: 'public', color: 'from-orange-500 to-amber-500' },
    { title_fr: 'Mentions Légales', title_en: 'Legal', path: '/legal', icon: '📋', category: 'public', color: 'from-slate-500 to-gray-500' },
    
    // Admin pages
    { title_fr: 'Dashboard Admin', title_en: 'Admin Dashboard', path: '/dashboard-admin', icon: '📊', category: 'admin', color: 'from-red-500 to-rose-500' },
    { title_fr: 'Gestion Films', title_en: 'Film Management', path: '/gestion-film', icon: '🎥', category: 'admin', color: 'from-red-500 to-orange-500' },
    { title_fr: 'Distribution Jury', title_en: 'Jury Distribution', path: '/distribution-jury', icon: '👥', category: 'admin', color: 'from-red-500 to-pink-500' },
    { title_fr: 'Configuration', title_en: 'Settings', path: '/config', icon: '⚙️', category: 'admin', color: 'from-red-500 to-red-600' },
    
    // Jury pages
    { title_fr: 'Dashboard Jury', title_en: 'Jury Dashboard', path: '/dashboardjury', icon: '⭐', category: 'jury', color: 'from-yellow-500 to-orange-500' },
    { title_fr: 'Notation', title_en: 'Scoring', path: '/notationJury', icon: '✏️', category: 'jury', color: 'from-amber-500 to-yellow-500' },
    { title_fr: 'Jury', title_en: 'Jury Members', path: '/jury', icon: '🎭', category: 'jury', color: 'from-yellow-500 to-lime-500' },
];

// 30 drapeaux du monde - codes pays pour flag-icons
const FLAGS = [
    'fr', 'us', 'gb', 'de', 'it', 'es', 'jp', 'cn', 'in', 'br',
    'mx', 'kr', 'ca', 'au', 'ru', 'nz', 'sg', 'za', 'gr', 'nl',
    'pt', 'la', 'se', 'ch', 'pl', 'tr', 'vn', 'th', 'ma', 'ao'
];

const Home = () => {
    const { t, lang } = useLanguage();
    const navigate = useNavigate();
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideoTab, setSelectedVideoTab] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [pagesCarouselIndex, setPagesCarouselIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectedTrophy, setSelectedTrophy] = useState(null);

    const heroRef = useRef(null);
    const categoriesRef = useRef(null);
    const categoriesGridRef = useRef(null);
    const categoriesScrollRef = useRef(null);
    const pagesGridRef = useRef(null);
    const awardsRef = useRef(null);
    const awardsBackgroundRef = useRef(null);
    const flagsContainerRef = useRef(null);
    const partnersRef = useRef(null);
    const autoScrollTimeoutRef = useRef(null);
    const pagesAutoScrollTimeoutRef = useRef(null);
    const videoRef = useRef(null);

    // ── Lecture de la config sauvegardée ──
    const [homeConfig, setHomeConfig] = useState(() => {
        try {
            const saved = localStorage.getItem('home_config');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // Écoute les mises à jour — autre onglet ET même onglet (event home_config_saved)
    useEffect(() => {
        const reload = () => {
            try {
                const saved = localStorage.getItem('home_config');
                setHomeConfig(saved ? JSON.parse(saved) : null);
            } catch {}
        };
        const onStorage = (e) => { if (e.key === 'home_config') reload(); };
        window.addEventListener('storage', onStorage);
        window.addEventListener('home_config_saved', reload);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('home_config_saved', reload);
        };
    }, []);

    // Gestion optimale de la vidéo héro
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Assure que la boucle est bien configurée
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        });

        return () => {};
    }, []);

        // Animation du Hero - DÉSACTIVÉE pour éviter le lag
    useEffect(() => {
        // Aucune animation - la vidéo et le contenu s'affichent instantanément
        return () => {};
    }, []);

    // Animation des catégories au scroll
    useEffect(() => {
        if (!categoriesRef.current) return;

        const categoryCards = categoriesRef.current.querySelectorAll('.category-card');
        
        // Optimiser le rendu des cartes
        categoryCards.forEach(card => card.style.willChange = 'opacity, transform');
        
        gsap.fromTo(
            categoryCards,
            { opacity: 0, y: 40, rotation: 5 },
            {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'back.out',
                force3D: true,
                scrollTrigger: {
                    trigger: categoriesRef.current,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: false,
                    markers: false,
                    once: false
                }
            }
        );

        return () => {
            categoryCards.forEach(card => card.style.willChange = 'auto');
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);
    // Animation du Hero avec ScrollTrigger
    useEffect(() => {
        if (!heroRef.current) return;

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top center',
                once: false
            }
        });

        // Animation lettre par lettre du titre
        const titleChars = heroRef.current.querySelectorAll('.hero-title-char');
        if (titleChars.length > 0) {
            titleChars.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(
                titleChars,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.18, ease: 'power1.out', force3D: true },
                0
            );
        }

        // Subtitle fade in
        const subtitle = heroRef.current.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.style.willChange = 'opacity, transform';
            timeline.fromTo(
                subtitle,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out', force3D: true },
                1.2
            );
        }

        // Boutons fade et scale
        const buttons = heroRef.current.querySelectorAll('.hero-btn-primary, .hero-btn-secondary');
        if (buttons.length > 0) {
            buttons.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(
                buttons,
                { opacity: 0, scale: 0.8, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out', stagger: 0.25, force3D: true },
                2
            );
        }

        return () => {
            if (heroRef.current) {
                heroRef.current.querySelectorAll('.hero-title-char, .hero-subtitle, .hero-btn-primary, .hero-btn-secondary').forEach(el => {
                    el.style.willChange = 'auto';
                });
            }
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // Animation des awards (background flottant + textes au centre en gros plan cinématographique)
    useEffect(() => {
        if (!awardsRef.current) return;

        // Animation du background du drapeau flottant (optimisée)
        if (awardsBackgroundRef.current) {
            awardsBackgroundRef.current.style.willChange = 'transform';
            gsap.to(awardsBackgroundRef.current, {
                y: -20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                force3D: true,
                scrollTrigger: {
                    trigger: awardsRef.current,
                    start: 'top 80%',
                    end: 'top 20%',
                    scrub: 0.5,
                    once: false
                }
            });
        }

        // Animation de la timeline des textes au centre (comme un gros plan cinématique)
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: awardsRef.current,
                start: 'top 70%',
                end: 'center center',
                once: false
            }
        });

        // Animation lettre par lettre du titre principal
        const titleLetters = awardsRef.current.querySelectorAll('.awards-title span');
        if (titleLetters.length > 0) {
            titleLetters.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(
                titleLetters,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.15, stagger: 0.08, ease: 'power1.out', force3D: true },
                0
            );
        }

        // Sous-titre "Ouvert au monde entier" - Zoom
        const worldElement = awardsRef.current.querySelector('.awards-world');
        if (worldElement) {
            worldElement.style.willChange = 'opacity, transform';
            timeline.fromTo(
                worldElement,
                { opacity: 0, scale: 0.2 },
                { opacity: 1, scale: 1, duration: 1, ease: 'back.out', force3D: true },
                1.2
            );
        }

        // "Hybrid" et "100% IA"
        const hybridElements = awardsRef.current.querySelectorAll('.awards-hybrid');
        if (hybridElements.length > 0) {
            hybridElements.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(
                hybridElements,
                { opacity: 0, scale: 0.4, y: 50 },
                { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out', stagger: 0.18, force3D: true },
                1.8
            );
        }

        // Titre "PRIX À GAGNER" - Zoom
        const prizeTitle = awardsRef.current.querySelector('.award-prize-title');
        if (prizeTitle) {
            prizeTitle.style.willChange = 'opacity, transform';
            timeline.fromTo(
                prizeTitle,
                { opacity: 0, scale: 0.2 },
                { opacity: 1, scale: 1, duration: 1, ease: 'back.out', force3D: true },
                2.4
            );
        }

        // Prix images - apparition avec stagger
        const prizeImages = awardsRef.current.querySelectorAll('.award-prize-item');
        if (prizeImages.length > 0) {
            prizeImages.forEach(el => el.style.willChange = 'opacity, transform');
            timeline.fromTo(
                prizeImages,
                { opacity: 0, scale: 0.3, y: 80 },
                { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out', stagger: 0.25, force3D: true },
                3
            );
        }

        return () => {
            // Nettoyer les will-change
            if (awardsBackgroundRef.current) awardsBackgroundRef.current.style.willChange = 'auto';
            if (awardsRef.current) {
                awardsRef.current.querySelectorAll('.awards-title span, .awards-world, .awards-hybrid, .award-prize-title, .award-prize-item').forEach(el => {
                    el.style.willChange = 'auto';
                });
            }
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);


    // Animation des drapeaux - défilé horizontal simple
    useEffect(() => {
        if (!flagsContainerRef.current) return;

        const flagsContent = flagsContainerRef.current.querySelector('.flags-content');
        if (!flagsContent) return;

        // Optimiser le rendu avec will-change
        flagsContent.style.willChange = 'transform';

        // Animation de défilement horizontal continu optimisée
        const anim = gsap.fromTo(
            flagsContent,
            { x: 0 },
            {
                x: -flagsContent.offsetWidth / 2,
                duration: 20,
                ease: 'none',
                repeat: -1,
                force3D: true  // Force l'accéleration GPU
            }
        );

        return () => {
            flagsContent.style.willChange = 'auto';
            gsap.killTweensOf(flagsContent);
        };
    }, []);

    // Animation des partenaires
    useEffect(() => {
        if (!partnersRef.current) return;

        const partnerCards = partnersRef.current.querySelectorAll('.partner-card');
        
        partnerCards.forEach((card) => {
            card.style.willChange = 'opacity, transform';
            gsap.fromTo(
                card,
                { opacity: 0, scale: 0.8, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        scrub: false
                    }
                }
            );

            // Hover animation
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out',
                    force3D: true
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    force3D: true
                });
            });
        });

        return () => {
            partnerCards.forEach((card) => {
                card.style.willChange = 'auto';
                card.removeEventListener('mouseenter', null);
                card.removeEventListener('mouseleave', null);
            });
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // ── Hero ──
    const heroConfig = homeConfig?.hero;
    const heroTitle          = heroConfig?.title          || 'MARS';
    const heroTitleHighlight = heroConfig?.titleHighlight || 'AI';
    const heroSubtitle = lang === 'fr'
        ? (heroConfig?.subtitle    || "L'intelligence artificielle au service de la création cinématographique. Découvrez une nouvelle ère de narration numérique.")
        : (heroConfig?.subtitle_en || "Artificial intelligence at the service of filmmaking. Discover a new era of digital storytelling.");
    const ctaPrimary   = lang === 'fr' ? (heroConfig?.ctaPrimary   || t('home_cta_get_started')) : (heroConfig?.ctaPrimary_en   || t('home_cta_get_started'));
    const ctaSecondary = lang === 'fr' ? (heroConfig?.ctaSecondary || t('home_cta_learn_more'))  : (heroConfig?.ctaSecondary_en || t('home_cta_learn_more'));

    // ── Awards ──
    const awardsConfig = homeConfig?.awards;
    const awardsTitle = lang === 'fr'
        ? (awardsConfig?.title    || 'Reconnaissance & Awards')
        : (awardsConfig?.title_en || 'Recognition & Awards');
    // Supporte awards.items (nouveau) et awards.stats (ancien format)
    const awardsItems = awardsConfig?.items || awardsConfig?.stats || [
        { label: 'Prix à gagner', label_en: 'Prizes to Win',         sub: 'Dotations mensuelles',   sub_en: 'Monthly Prizes',              image: '' },
        { label: 'Global',        label_en: 'Global',                 sub: 'Ouvert au monde entier', sub_en: 'Open to the Whole World',      image: '' },
        { label: 'AI Only',       label_en: 'AI Only',                sub: '100% généré par IA',     sub_en: '100% AI Generated',           image: '' },
    ];

    // ── Partenaires ──
    const defaultPartners = [
        { name: 'Gemini',      name_en: 'Gemini',      image: '/Generated_Image_logoGemini01.png',  url: 'https://gemini.google.com/', path: '' },
        { name: 'Nano Banana', name_en: 'Nano Banana', image: '/Generated_Image_logoBanana01.png',  url: 'https://elevenlabs.io/', path: '' },
        { name: 'Claude',      name_en: 'Claude',      image: '/Generated_Image_logoClaude01.png',  url: 'https://use.ai/', path: '' },
        { name: 'CapCut',      name_en: 'CapCut',      image: '/Generated_Image_logoCapcut01.png',  url: 'https://www.movavi.com/', path: '' },
        { name: 'Perplexity',  name_en: 'Perplexity',  image: '/Gemini_Generated_Image_Perplexity.png',  url: 'https://www.perplexity.ai/', path: '' },
        { name: 'ChatGPT',     name_en: 'ChatGPT',     image: '/Gemini_Generated_Image_ChatGPT.png',     url: 'https://openai.com/chatgpt/', path: '' },
        { name: 'Haiku',       name_en: 'Haiku',       image: '/Gemini_Generated_Image_Haiku.png',       url: 'https://haiku.ai/', path: '' },
        { name: 'Mistral',     name_en: 'Mistral',     image: '/Gemini_Generated_Image_Mistral_Medium.png', url: 'https://mistral.ai/', path: '' },
    ];

    const partnersConfig = homeConfig?.partners;
    const partnersTitle = lang === 'fr'
        ? (partnersConfig?.title    || 'Nos Partenaires')
        : (partnersConfig?.title    || 'Our Partners');
    const partnersSubtitle = lang === 'fr'
        ? (partnersConfig?.subtitle    || 'Ils font confiance à la plateforme')
        : (partnersConfig?.subtitle_en || 'They Trust Our Platform');
    
    // Merger les partenaires: d'abord la config API, puis les defaults pour combler
    const partnerItems = partnersConfig?.items && partnersConfig.items.length > 0
        ? [
            ...partnersConfig.items.map((configPartner, i) => ({
              ...configPartner,
              url: configPartner.url || defaultPartners[i]?.url || '',
              path: configPartner.path || defaultPartners[i]?.path || ''
            })),
            ...defaultPartners.slice(partnersConfig.items.length) // Ajouter les partenaires par défaut restants
          ]
        : defaultPartners;

    // ── Catégories ──
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

    // ── Resize ──
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
        // Clear auto-scroll timeout when user interacts
        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
        }
        
        if (carouselIndex + itemsPerPage < categories.length) setCarouselIndex(carouselIndex + 1);
        else setCarouselIndex(0);
    };
    const prevCategory = () => {
        // Clear auto-scroll timeout when user interacts
        if (autoScrollTimeoutRef.current) {
            clearTimeout(autoScrollTimeoutRef.current);
        }
        
        if (carouselIndex > 0) setCarouselIndex(carouselIndex - 1);
        else setCarouselIndex(Math.max(0, categories.length - itemsPerPage));
    };

    const getItemsPerPagePages = () => {
        if (windowWidth < 640) return 2;
        if (windowWidth < 1024) return 3;
        return 5;
    };
    const itemsPerPagePages = getItemsPerPagePages();
    const nextPage = () => {
        if (pagesAutoScrollTimeoutRef.current) clearInterval(pagesAutoScrollTimeoutRef.current);
        if (pagesCarouselIndex + itemsPerPagePages < SITE_PAGES.length) setPagesCarouselIndex(pagesCarouselIndex + 1);
        else setPagesCarouselIndex(0);
    };
    const prevPage = () => {
        if (pagesAutoScrollTimeoutRef.current) clearInterval(pagesAutoScrollTimeoutRef.current);
        if (pagesCarouselIndex > 0) setPagesCarouselIndex(pagesCarouselIndex - 1);
        else setPagesCarouselIndex(Math.max(0, SITE_PAGES.length - itemsPerPagePages));
    };

    // ── Auto-scroll pages carrousel avec GSAP ──
    useEffect(() => {
        const itemsPerPagePagesCurrent = getItemsPerPagePages();
        
        if (SITE_PAGES.length <= itemsPerPagePagesCurrent) return;

        const startAutoScrollPages = () => {
            pagesAutoScrollTimeoutRef.current = setInterval(() => {
                setPagesCarouselIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % (SITE_PAGES.length - itemsPerPagePagesCurrent + 1);
                    
                    if (pagesGridRef.current) {
                        gsap.to(pagesGridRef.current, {
                            opacity: 0.8,
                            duration: 0.3,
                            ease: 'power2.out',
                            onComplete: () => {
                                gsap.to(pagesGridRef.current, {
                                    opacity: 1,
                                    duration: 0.3,
                                    ease: 'power2.out'
                                });
                            }
                        });
                    }
                    
                    return nextIndex;
                });
            }, 2000);
        };

        startAutoScrollPages();

        return () => {
            if (pagesAutoScrollTimeoutRef.current) {
                clearInterval(pagesAutoScrollTimeoutRef.current);
            }
        };
    }, [windowWidth]);

    const visibleCategories = categories.slice(carouselIndex, carouselIndex + itemsPerPage);
    const totalPages = Math.max(0, categories.length - itemsPerPage + 1);
    
    const visiblePages = SITE_PAGES.slice(pagesCarouselIndex, pagesCarouselIndex + itemsPerPagePages);
    const totalPagesIndex = Math.max(0, SITE_PAGES.length - itemsPerPagePages + 1);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-violet-950 selection:text-white">
            
            {/* Fond étoilé animé en Canvas */}
            <StarryBackground />

            <main style={{ position: 'relative', zIndex: 2 }}>

                {/* ── HERO ── */}
                {(homeConfig?.hero?.enabled !== false) && (
                <section
                    ref={heroRef}
                    id="accueil"
                    className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden bg-black"
                    style={{ position: 'relative', zIndex: 1, contain: 'layout style paint' }}
                >
                    <video 
                        ref={videoRef}
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        preload="metadata" 
                        poster="/hero-video-poster.jpg" 
                        disablePictureInPicture 
                        decoding="async"
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            zIndex: 1,
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden'
                        }}
                    >
                        <source src="/hero-video.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay dégradé simple et performant */}
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)', 
                        zIndex: 2, 
                        pointerEvents: 'none'
                    }} />

                    <h1 className="hero-title text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3 sm:mb-6" style={{ position: 'relative', zIndex: 10 }}>
                        <span className="text-white">
                            {heroTitle.split('').map((char, i) => (
                                <span key={i} className="hero-title-char">{char}</span>
                            ))}
                        </span>
                        {' '}
                        <span>
                            {heroTitleHighlight.split('').map((char, i) => (
                                <span 
                                    key={`highlight-${i}`} 
                                    className="hero-title-char text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600"
                                    style={{ display: 'inline-block' }}
                                >
                                    {char}
                                </span>
                            ))}
                        </span>
                    </h1>
                    <p className="hero-subtitle max-w-2xl text-xs sm:text-base md:text-lg font-medium text-white/90 mb-4 sm:mb-10 leading-relaxed px-2 drop-shadow-md" style={{ position: 'relative', zIndex: 10 }}>
                        {heroSubtitle}
                    </p>
                    <div className="hero-buttons flex flex-col sm:flex-row gap-2.5 sm:gap-4 w-full sm:w-auto px-4 sm:px-0" style={{ position: 'relative', zIndex: 10 }}>
                        <button onClick={() => setShowVideoModal(true)} className="hero-btn-primary bg-white text-slate-950 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2 text-xs sm:text-base transform hover:scale-105 duration-300">
                            {ctaPrimary} <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button className="hero-btn-secondary border border-white/20 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-white/10 transition text-xs sm:text-base transform hover:scale-105 duration-300" onClick={() => setShowAboutModal(true)}>
                            {ctaSecondary}
                        </button>
                    </div>
                </section>
                )}

                {/* ── CATEGORIES ── */}
                {(homeConfig?.categories?.enabled !== false) && (
                <section ref={categoriesRef} id="categories" className="py-16 sm:py-20 md:py-24 max-w-full px-4 sm:px-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider whitespace-nowrap">{t('categories')}</h2>
                            <div className="h-px bg-white/20 flex-grow"></div>
                        </div>
                    </div>
                    
                    {/* Carousel des catégories avec flèches left/right */}
                    <div className="w-full overflow-hidden">
                        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 px-4 sm:px-6">
                            {/* Left Arrow */}
                            <button 
                                onClick={prevCategory}
                                className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition text-orange-500 hover:text-orange-400"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            {/* Carousel Grid */}
                            <div 
                                ref={categoriesGridRef}
                                className="flex-grow grid gap-4 sm:gap-6 transition-opacity duration-300"
                                style={{
                                    gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
                                }}
                            >
                            {visibleCategories.map((cat, index) => (
                                <div 
                                    key={`${carouselIndex}-${index}`}
                                    onClick={() => setSelectedCategory(categories.indexOf(cat))}
                                    className="category-card group relative overflow-hidden rounded-xl sm:rounded-2xl bg-transparent border border-white/5 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-orange-500/30 w-full h-[360px] sm:h-[410px]"
                                >
                                    <div className="h-52 sm:h-64 lg:h-80 bg-cover bg-center overflow-hidden flex-shrink-0" style={{ backgroundImage: `url(${cat.image})` }}>
                                        <div className="w-full h-full bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                                    </div>
                                    <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between gap-2">
                                        <div className="flex-shrink-0">
                                            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                                                {(lang === 'fr' ? (cat.title_fr || t(cat.key)) : (cat.title_en || t(cat.key))).toUpperCase()}
                                            </h3>
                                            <p className="text-slate-400 text-[11px] sm:text-xs line-clamp-1 leading-tight">{lang === 'fr' ? cat.desc_fr : cat.desc_en}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                            
                            {/* Right Arrow */}
                            <button 
                                onClick={nextCategory}
                                className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition text-orange-500 hover:text-orange-400"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>
                )}

                {/* ── AWARDS ── */}
                {(homeConfig?.awards?.enabled !== false) && (
                <section ref={awardsRef} id="awards" className="mt-16 sm:mt-24 md:mt-32 py-12 sm:py-16 md:py-20 bg-slate-900/50 border-y border-white/5 relative overflow-hidden" style={{ perspective: '1200px' }}>
                    
                    {/* Contenu centralisé avec animation cinématique */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
                        
                        {/* Titre principal - Animation lettre par lettre */}
                        <h2 className="awards-title text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider text-center mb-10 sm:mb-14" style={{ transformStyle: 'preserve-3d' }}>
                            {awardsTitle.split('').map((char, i) => (
                                <span key={i}>{char}</span>
                            ))}
                        </h2>

                        {/* Défilé de drapeaux - en dessous du titre */}
                        <div ref={flagsContainerRef} className="flags-wrapper mb-12 sm:mb-16 w-full overflow-hidden relative">
                            <div className="flags-content flex gap-4 sm:gap-6" style={{ width: 'fit-content', transformStyle: 'preserve-3d' }}>
                                {/* Double les drapeaux pour créer l'effet de boucle infinie */}
                                {[...FLAGS, ...FLAGS].map((flag, i) => (
                                    <span 
                                        key={i}
                                        className={`fi fi-${flag} flag-item flex-shrink-0 text-4xl sm:text-5xl md:text-6xl hover:scale-110 transition-transform duration-200 inline-block`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        title={flag}
                                    />
                                ))}
                            </div>
                            {/* Gradient overlay pour l'effet de fade */}
                            <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none" />
                            <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none" />
                        </div>

                        {/* Contenu centralisé au style cinématique */}
                        <div className="flex flex-col items-center gap-8 sm:gap-12 md:gap-16 text-center" style={{ transformStyle: 'preserve-3d' }}>
                            
                            {/* "Ouvert au monde entier" / "Open to the Whole World" */}
                            <div className="awards-world" style={{ transformStyle: 'preserve-3d' }}>
                                <p className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400">
                                    {lang === 'fr' ? 'Ouvert au monde entier' : 'Open to the Whole World'}
                                </p>
                            </div>

                            {/* "Hybrid" et "100% IA" */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-16 items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="awards-hybrid flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                                        <Users size={40} className="sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-400">
                                        Hybrid
                                    </p>
                                </div>

                                <div className="awards-hybrid flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg">
                                        <Cpu size={40} className="sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <p className="text-xl sm:text-2xl font-bold text-violet-400">
                                        {lang === 'fr' ? '100% IA' : '100% AI'}
                                    </p>
                                </div>
                            </div>

                            {/* Titre "PRIX À GAGNER" / "PRIZES TO WIN" */}
                            <div className="award-prize-title mt-8 sm:mt-12" style={{ transformStyle: 'preserve-3d' }}>
                                <p className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
                                    {lang === 'fr' ? 'Prix à Gagner' : 'Prizes to Win'}
                                </p>
                            </div>

                            {/* Les images de trophées */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-center justify-center mt-6 sm:mt-10" style={{ transformStyle: 'preserve-3d' }}>
                                <div className="award-prize-item flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" style={{ transformStyle: 'preserve-3d' }} onClick={() => setSelectedTrophy({ image: '/image_trophée_bronze.png', title: lang === 'fr' ? '3e Place' : '3rd Place', color: 'orange' })}>
                                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden mb-4 border-2 border-orange-700/50 shadow-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                        <img src="/image_trophée_bronze.png" alt="Trophée Bronze" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm sm:text-base font-semibold text-orange-600">{lang === 'fr' ? '3e Place' : '3rd Place'}</p>
                                </div>

                                <div className="award-prize-item flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" style={{ transformStyle: 'preserve-3d' }} onClick={() => setSelectedTrophy({ image: '/image_trophée_argent.png', title: lang === 'fr' ? '2e Place' : '2nd Place', color: 'yellow' })}>
                                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden mb-4 border-2 border-yellow-500/50 shadow-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                        <img src="/image_trophée_argent.png" alt="Trophée Argent" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm sm:text-base font-semibold text-yellow-400">{lang === 'fr' ? '2e Place' : '2nd Place'}</p>
                                </div>

                                <div className="award-prize-item flex flex-col items-center cursor-pointer hover:scale-105 transition-transform" style={{ transformStyle: 'preserve-3d' }} onClick={() => setSelectedTrophy({ image: '/image_trophée_or.png', title: lang === 'fr' ? '1er Place' : '1st Place', color: 'gold' })}>
                                    <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden mb-4 border-2 border-yellow-400/70 shadow-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                        <img src="/image_trophée_or.png" alt="Trophée Or" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-sm sm:text-base font-semibold text-yellow-300">{lang === 'fr' ? '1er Place' : '1st Place'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {/* ── PARTENAIRES ── */}
                {(homeConfig?.partners?.enabled !== false) && (
                <section ref={partnersRef} id="partenaires" className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider mb-2 sm:mb-4">{partnersTitle}</h2>
                        <p className="text-sm sm:text-base text-slate-400">{partnersSubtitle}</p>
                    </div>
                    <div className={`grid gap-4 sm:gap-8 opacity-70 hover:opacity-100 transition-all duration-500 ${partnerItems.length <= 2 ? 'grid-cols-2' : partnerItems.length === 3 ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'}`}>
                        {partnerItems.map((partner, i) => {
                            const handleClick = (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Clicked partner:', partner.name, 'URL:', partner.url);
                                if (partner.url) {
                                    window.open(partner.url, '_blank');
                                } else if (partner.path) {
                                    navigate(partner.path);
                                }
                            };
                            
                            return (
                            <div key={i}
                                className="partner-card h-20 sm:h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 hover:bg-white/10 hover:border-orange-500/50 transition cursor-pointer relative overflow-hidden"
                                onClick={handleClick}
                            >
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)', zIndex: 0, pointerEvents: 'none' }} />
                                {partner.image ? (
                                    <img src={partner.image} alt={`Logo ${lang === 'fr' ? partner.name : (partner.name_en || partner.name)}`} className="h-16 sm:h-20 object-contain relative z-10" />
                                ) : (
                                    <span className="text-sm font-bold text-white/60 relative z-10">{lang === 'fr' ? partner.name : (partner.name_en || partner.name)}</span>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </section>
                )}

            </main>

            {/* ── ABOUT MODAL ── */}
            {showAboutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowAboutModal(false)}>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('about_title')}</h2>
                            <button onClick={() => setShowAboutModal(false)} className="text-white hover:bg-white/20 p-2 rounded transition flex-shrink-0">
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 text-slate-300">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Trophy size={20} className="sm:w-6 sm:h-6 text-orange-500" />
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
                                    <Cpu size={20} className="sm:w-6 sm:h-6 text-violet-400" />
                                    {lang === 'fr' ? "Le Concours" : "The Competition"}
                                </h3>
                                <p className="leading-relaxed mb-3 text-sm sm:text-base">
                                    {lang === 'fr'
                                        ? "Notre concours annuel invite les cinéastes, artistes et technologues à soumettre leurs créations les plus audacieuses. Les critères d'évaluation incluent:"
                                        : "Our annual competition invites filmmakers, artists, and technologists to submit their boldest creations. Evaluation criteria include:"}
                                </p>
                                <ul className="space-y-2 ml-4 text-sm sm:text-base">
                                    {[
                                        [lang === 'fr' ? "Originalité et créativité de la narration" : "Originality and narrative creativity"],
                                        [lang === 'fr' ? "Qualité technique et production"           : "Technical quality and production"],
                                        [lang === 'fr' ? "Innovation dans l'utilisation de l'IA"    : "Innovation in AI usage"],
                                        [lang === 'fr' ? "Impact émotionnel et culturel"             : "Emotional and cultural impact"],
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-2"><span className="text-violet-400">•</span><span>{item}</span></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
                                    <Globe size={20} className="sm:w-6 sm:h-6 text-blue-400" />
                                    {lang === 'fr' ? 'Les Événements' : 'The Events'}
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                                    {[
                                        { color: 'border-orange-500', fr: "Cérémonie d'ouverture",      en: "Opening Ceremony",    subfr: "Lancement officiel du festival avec keynote et showcase", suben: "Official festival launch with keynote and showcase" },
                                        { color: 'border-violet-400', fr: "Dates limite de soumission", en: "Submission Deadlines", subfr: "Périodes d'acceptation par catégorie", suben: "Acceptance periods by category" },
                                        { color: 'border-blue-400',   fr: "Sélection et jugement",      en: "Selection & Judging",  subfr: "Évaluation par jury international d'experts", suben: "Evaluation by international expert jury" },
                                        { color: 'border-green-400',  fr: "Cérémonie de clôture",       en: "Closing Ceremony",     subfr: "Annonce des gagnants et remise des prix", suben: "Winner announcement and prize ceremony" },
                                    ].map((ev, i) => (
                                        <li key={i} className={`border-l-2 ${ev.color} pl-3 sm:pl-4`}>
                                            <span className="font-semibold text-white">{lang === 'fr' ? ev.fr : ev.en}</span>
                                            <p className="text-xs sm:text-sm">{lang === 'fr' ? ev.subfr : ev.suben}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-violet-600/20 border border-violet-600/50 rounded-lg p-4 mt-4 sm:mt-6">
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
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4" onClick={() => setSelectedCategory(null)}>
                    <div className="bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 p-4 sm:p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                {lang === 'fr' ? (categories[selectedCategory].title_fr || t(categories[selectedCategory].key)) : (categories[selectedCategory].title_en || t(categories[selectedCategory].key))}
                            </h2>
                            <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-8">
                            <div className="flex justify-center mb-6 sm:mb-8">
                                <img src={categories[selectedCategory].image} alt={t(categories[selectedCategory].key)} className="w-full max-w-2xl h-auto rounded-xl sm:rounded-2xl shadow-2xl" />
                            </div>
                            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4 sm:p-6">
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
                                <button onClick={() => navigate('/galerie')} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                                    {lang === 'fr' ? 'Voir les films' : 'View Films'}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── VIDEO MODAL ── */}
            {showVideoModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4" onClick={() => setShowVideoModal(false)}>
                    <div className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-800 p-4 sm:p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('home_video_modal_title')}</h2>
                            <button onClick={() => setShowVideoModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-8 bg-gradient-to-b from-violet-900/20 to-neutral-900 border-b border-neutral-800">
                            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                                <div className="text-center">
                                    <div className="inline-block px-4 py-2 rounded-full bg-violet-600/30 border border-violet-600/50 mb-4">
                                        <span className="text-xs sm:text-sm font-bold text-violet-300">🤖 {lang === 'fr' ? 'Présentation IA' : 'AI Presentation'}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t('home_video_intro')}</h3>
                                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">{t('home_video_description')}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2].map(tab => (
                                        <button key={tab} onClick={() => setSelectedVideoTab(tab)}
                                            className={`p-4 rounded-xl border transition-all duration-300 text-left group ${selectedVideoTab === tab ? 'bg-violet-600/30 border-violet-600/50' : 'bg-neutral-800/30 border-neutral-700/50 hover:bg-neutral-800/60 hover:border-violet-600/30'}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="text-2xl">{tab === 1 ? '🎬' : '📋'}</div>
                                                <div>
                                                    <h4 className="font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{t(`home_video_part${tab}`)}</h4>
                                                    <p className="text-xs sm:text-sm text-neutral-400">{t(`home_video_part${tab}_desc`)}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl p-4 text-center">
                                    <p className="text-sm sm:text-base text-neutral-300">{t('home_video_cta_desc')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950">
                            {[1, 2].map(tab => (
                                <button key={tab} onClick={() => setSelectedVideoTab(tab)}
                                    className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-all ${selectedVideoTab === tab ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>
                                    {t(`home_video_part${tab}`)}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 sm:p-8">
                            <video key={`video-${selectedVideoTab}`} width="100%" height="auto" controls className="rounded-xl sm:rounded-2xl w-full">
                                <source src={selectedVideoTab === 1 ? '/presentation_site.mp4' : '/presentation_formulaire.mp4'} type="video/mp4" />
                            </video>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-8 border-t border-neutral-800 bg-neutral-950">
                            <button onClick={() => navigate('/submission')} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                                {t('home_btn_submit')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login?role=admin')} className="bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                                {t('home_btn_login_admin')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login?role=jury')} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group">
                                {t('home_btn_login_jury')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DES TROPHÉES */}
            {selectedTrophy && (
                <div 
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedTrophy(null)}
                >
                    <div 
                        className="relative max-w-2xl w-full bg-slate-900/95 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Contenu de la modal */}
                        <div className="p-8 sm:p-12 flex flex-col items-center">
                            {/* Image du trophée en grand */}
                            <div className="w-full max-w-sm aspect-square mb-8 rounded-2xl overflow-hidden border-4 border-yellow-500/30 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-2xl">
                                <img 
                                    src={selectedTrophy.image} 
                                    alt={selectedTrophy.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Titre du trophée */}
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 uppercase tracking-wider">
                                <span className={selectedTrophy.color === 'orange' ? 'text-orange-500' : selectedTrophy.color === 'yellow' ? 'text-yellow-400' : 'text-yellow-300'}>
                                    {selectedTrophy.title}
                                </span>
                            </h2>

                            {/* Description du trophée */}
                            <p className="text-slate-300 text-center mb-8 max-w-md text-sm sm:text-base">
                                {lang === 'fr' ? (
                                    selectedTrophy.color === 'orange' ? 'Félicitations à la 3e place ! Vous avez créé une œuvre remarquable.' :
                                     selectedTrophy.color === 'yellow' && selectedTrophy.title.includes('2e') ? 'Bravo pour cette superbe 2e place ! Une création d\'excellence.' :
                                     'Grand champion ! La 1ère place est votre prix pour cette création extraordinaire.'
                                ) : (
                                    selectedTrophy.color === 'orange' ? 'Congratulations on 3rd place! You created a remarkable work.' :
                                     selectedTrophy.color === 'yellow' && selectedTrophy.title.includes('2nd') ? 'Well done on this excellent 2nd place! A creation of excellence.' :
                                     'Grand champion! 1st place is your prize for this extraordinary creation.'
                                )}
                            </p>

                            {/* Bouton de fermeture */}
                            <button 
                                onClick={() => setSelectedTrophy(null)}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold rounded-full transition-all transform hover:scale-105"
                            >
                                <X size={20} />
                                {lang === 'fr' ? 'Fermer' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;