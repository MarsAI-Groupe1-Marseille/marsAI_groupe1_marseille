import React, { useState, useEffect, useMemo } from "react";

import { useLanguage } from "../context/LanguageContext.jsx";
import {
  Star,
  Award,
  Linkedin,
  Twitter,
  Info,
  X,
  Cpu,
  Sparkles,
  Facebook,
  Instagram
} from "lucide-react";
import axios from "../config/axiosConfig.js";
import "./JuryPage.css";
  

/* -------------------------------------------------------
   AUDIO : simple, discret, non bloquant
-------------------------------------------------------- */
//  Audios préchargés (non bloquant, stable)
const openSound = new Audio("/sounds/open.mp3");
const closeSound = new Audio("/sounds/close.mp3");

//  Optionnel : volume par défaut (évite de surprendre)
openSound.volume = 0.15;
closeSound.volume = 0.15;

const playSound = (type) => {
  const audio = type === "open" ? openSound : closeSound;
  audio.currentTime = 0;
  audio.play().catch(() => console.log("Audio play blocked"));
};

const JuryPage = () => {
  /* -------------------------------------------------------
  STATES : données, loader, erreur, modale, animation, filtre
  -------------------------------------------------------- */
  
  // Hook pour les traductions
const { t, lang } = useLanguage();
  
  // Constantes pour les filtres (pour éviter les problèmes de comparaison avec traductions)
  const FILTER_ALL = 'all';
  
  // État pour les données
  const [juryList, setJuryList] = useState([]); // Liste des jurés
  const [loading, setLoading] = useState(true); // Loader
  const [error, setError] = useState(null); // Gestion erreur API
  const [selectedJury, setSelectedJury] = useState(null); // Modale ouverte si != null
  const [isVisible, setIsVisible] = useState(false); // Déclenche animation mars-reveal
  const [filter, setFilter] = useState(FILTER_ALL);

  /* -------------------------------------------------------
     DATA PRESIDENT (statique)
  -------------------------------------------------------- */

  const ADMIN_DATA = {
  full_name: "GUILLAMO Stéphane.",
  role: "admin",

  // Champs bilingues
  specialite: {
    fr: "Visionnaire IA & Président du Jury",
    en: "AI Visionary & Jury President",
  },
  bio: {
    fr: "Pionnier des technologies génératives, il définit la direction artistique et éthique du Mars AI Festival.",
    en: "A pioneer in generative technologies, he shapes the artistic and ethical direction of the Mars AI Festival.",
  },

  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",

  socials: {
    linkedin: "https://www.linkedin.com/bruno",
    x: "https://www.x.com/marsai_festival",
    facebook: "https://www.facebook.com/marsai.festival",
    instagram: "https://www.instagram.com/marsai.festival",
  },
};

  //  Helper flag for rendering the presidency badge; can be driven by props or API later
  const president = true;

  /* -------------------------------------------------------
     AVATAR fallback (robuste, stable)
  -------------------------------------------------------- */
  const getAvatarUrl = (user) => {
    // Si avatar déjà fourni en DB
    if (user?.avatar_url) return user.avatar_url;

    // Sinon on génère un avatar
    const fullName = user?.full_name || "Mars AI";
    const initials =
      fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "M";

    // Hash simple et stable
    const raw = String(user?.id ?? fullName);
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;

    // Palette (reste compatible avec ton thème)
    const colors = ["3B82F6", "EF4444", "10B981", "F59E0B", "8B5CF6", "22d3ee"];
    const bgColor = colors[hash % colors.length];

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      initials
    )}&background=${bgColor}&color=fff&size=400&bold=true`;
  };

  /* -------------------------------------------------------
     SPECIALITE JSON (Sequelize DataTypes.JSON)
     => Retourne TOUJOURS une string affichable (pas [object Object])
  -------------------------------------------------------- */
  /* -------------------------------------------------------
   SPECIALITE : robuste (JSON / array / object / string)
   => retourne toujours une string affichable
-------------------------------------------------------- */
const parseSpecialite = (spec) => {
  //  Valeur par défaut traduite
  if (!spec) return t("jury_page_expert");

  //  Tableau
  if (Array.isArray(spec)) {
    const arr = spec.filter(Boolean);
    return arr.length ? arr.join(" • ") : t("jury_page_expert");
  }

  //  Objet
  if (typeof spec === "object") {
    const vals = Object.values(spec).filter(Boolean);
    return vals.length ? vals.join(" • ") : t("jury_page_expert");
  }

  //  String : peut être du JSON stringifié
  if (typeof spec === "string") {
    try {
      const parsed = JSON.parse(spec);

      if (Array.isArray(parsed)) {
        const arr = parsed.filter(Boolean);
        return arr.length ? arr.join(" • ") : t("jury_page_expert");
      }

      if (typeof parsed === "object" && parsed !== null) {
        const vals = Object.values(parsed).filter(Boolean);
        return vals.length ? vals.join(" • ") : t("jury_page_expert");
      }

      return String(parsed);
    } catch {
      //  déjà une string normale
      return spec;
    }
  }

  return t("jury_page_expert");
};

  /* -------------------------------------------------------
     DOSSIER (mini infos, clean, sans surcharger)
  -------------------------------------------------------- */
  const dossier = useMemo(() => {
    if (!selectedJury) return null;
    const focus = parseSpecialite(selectedJury.specialite);
    return {
      focus,
      note: `Spécialisation confirmée : ${focus}. Analyse fine, décision nette.`,
    };
  }, [selectedJury]);

  /* -------------------------------------------------------
     FETCH API
  -------------------------------------------------------- */
  useEffect(() => {
    setIsVisible(true);

    const fetchJury = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/jury/all");

        // Filtre: uniquement les "jury"
        const onlyJurys = (response?.data?.juryMembers || []).filter((u) => u?.role === "jury");
        setJuryList(onlyJurys);
      } catch (err) {
        console.error('Erreur récupération jurys:', err);
        setError(t('jury_page_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchJury();
  }, []);

  /* -------------------------------------------------------
     MODALE : open / close
  -------------------------------------------------------- */
  const openModal = (jury) => {
    playSound("open");
    setSelectedJury(jury);
  };

  const closeModal = () => {
    playSound("close");
    setSelectedJury(null);
  };

  /* -------------------------------------------------------
   FILTRAGE : liste affichée selon le filtre choisi
   -  récupéré depuis main (fonctionnalité de filtrage)
   -  adapté à ton code : juryList (au lieu de juryMembers)
   -  optimisé avec useMemo pour éviter de recalculer à chaque rendu
-------------------------------------------------------- */
const filteredJury = useMemo(() => {
  //  Si "all", on retourne toute la liste
  if (filter === FILTER_ALL) return juryList;

  //  Sinon, on filtre par spécialité
  // ⚠️ Ici on compare la valeur brute "specialite" (selon ta DB)
  return juryList.filter((j) => j?.specialite === filter);
}, [filter, juryList]);

/* -------------------------------------------------------
   UX MODALE : ESC + lock scroll
   -  ton current-change (HEAD) conservé
   - But : quand la modale est ouverte
        1) ESC la ferme
        2) on bloque le scroll du body
-------------------------------------------------------- */
useEffect(() => {
  //  Si aucune modale ouverte, on ne fait rien
  if (!selectedJury) return;

  //  1) Lock scroll : empêcher la page de bouger derrière la modale
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  //  2) Fermeture avec ESC
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal(); // ⚠️ utiliser la fonction closeModal existante
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  //  Cleanup : super important quand on ferme la modale
  return () => {
    document.body.style.overflow = originalOverflow; // remet le scroll normal
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [selectedJury]); // dépendance : se déclenche quand la modale s'ouvre/se ferme


  /* -------------------------------------------------------
     LOADING SCREEN
  -------------------------------------------------------- */
  if (loading) {
    return (
//  Afficher un loader pendant le chargement (on garde ton design)

    <div className="h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>

      {/*  On garde ton style, mais on traduit le texte */}
      <p className="text-[var(--color-primary)] font-black italic tracking-widest animate-pulse">
        {t("jury_page_loading")}
      </p>
    </div>
  );
}

//  Afficher une erreur s'il y a un problème (fonctionnalité utile récupérée de main)
if (error) {
    return (
    <div className="min-h-screen pb-20 bg-[var(--color-bg)] flex items-center justify-center">
      <div className="text-center">
        {/*  On affiche le message d'erreur déjà contenu dans `error` */}
        <p className="text-red-500 text-2xl font-bold">{error}</p>
      </div>
    </div>
  );
}
  

  /* -------------------------------------------------------
    PAGE
  -------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24 overflow-x-hidden text-[var(--color-text)]">
      {/* ---------------------------------------------------
          HERO SECTION (mobile-first)
      ---------------------------------------------------- */}
      <section className="relative h-[56vh] sm:h-[58vh] md:h-[62vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964"
            className="w-full h-full object-cover opacity-30 grayscale scale-105"
            alt="Mars Background"
          />
          {/* Overlay gradient lié à la palette */}
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Title */}
        <div className={`relative z-10 text-center px-4 mars-reveal ${isVisible ? "is-visible" : ""}`}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2 leading-none">
            {/* Le <span className="text-[var(--color-primary)] text-glow">Grand</span>&nbsp;Jury */}
            {/* <span className="text-[var(--color-primary)] text-glow">
              {lang === 'fr' ? 'Le Grand' : 'The Great'}
            </span>
            &nbsp;{t("jury_page_title_suffix")} */}
            {lang === 'fr' ? (
    <>
      Le <span className="text-[var(--color-primary)] text-glow">Grand</span> Jury
    </>
  ) : (
    <>
      The <span className="text-[var(--color-primary)] text-glow">Great</span> Jury
    </>
  )}
          </h1>
        </div>
      </section>

      
        {/* ---------------------------------------------------
            ERROR BANNER (simple, propre)
        ---------------------------------------------------- */}
        {error && (
          <div className="container-mars px-4 -mt-10 mb-10 relative z-30">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm">
              <span className="font-black tracking-widest text-red-200">ALERTE</span>{" "}
            </div>
          </div>
        )}     


      <section className="container-mars -mt-16 sm:-mt-20 relative z-20 px-4 mb-24 sm:mb-28 md:mb-32">
        <div className="glass-panel rounded-[34px] sm:rounded-[40px] md:rounded-[80px] w-full max-w-6xl mx-auto p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 md:gap-12 border border-white/10 shadow-2xl backdrop-blur-md shadow-lg hover:shadow-[0_0_40px_var(--color-primary)]/20 transition-shadow duration-500">
          {/* Image */}
          <div className="w-full max-w-[420px] lg:max-w-none lg:w-1/3 aspect-square overflow-hidden rounded-[26px] sm:rounded-[30px] md:rounded-[60px] border-4 border-[var(--color-primary)]/70 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
            <img
              src={ADMIN_DATA.image}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              alt="President"
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mars-cta w-full inline-flex items-center tracking-[0.3em] gap-3 px-6 py-4 sm:py-5 rounded-full bg-[var(--color-primary)] text-black text-[10px] font-black uppercase mb-6 animate-pulse">
              <Star size={14} fill="currentColor" />
              {/* Présidence du Jury */}
              {t('jury_presidency_label')}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase italic leading-none mb-4">
              {ADMIN_DATA.full_name}
            </h2>

            <p className="text-[var(--color-primary)] font-bold tracking-[0.35em] text-[11px] sm:text-xs uppercase mb-6">
              {/* {ADMIN_DATA.specialite[lang] || ADMIN_DATA.specialite.fr} */}
              {/* On s'assure de n'afficher qu'une chaîne de caractères */}
              {typeof ADMIN_DATA.specialite === 'object' 
              ? (ADMIN_DATA.specialite[lang] || ADMIN_DATA.specialite.fr) 
              : ADMIN_DATA.specialite}
            </p>

            <p className="text-[var(--color-text)]/60 italic text-lg sm:text-xl font-light mb-8 md:mb-10 max-w-2xl leading-relaxed">
              "{ADMIN_DATA.bio[lang] || ADMIN_DATA.bio.fr}"
            </p>

            {/* Socials */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              <a
                href={ADMIN_DATA.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="social-ico"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>

              <a
                href={ADMIN_DATA.socials.x}
                target="_blank"
                rel="noreferrer"
                className="social-ico"
                aria-label="X"
              >
                <X size={24} />
              </a>

              <a
                href={ADMIN_DATA.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="social-ico"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>

              <a
                href={ADMIN_DATA.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="social-ico"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------
          GRID TITLE
      ---------------------------------------------------- */}
      <section className="container-mars px-4">
        <div className={`relative z-10 text-center px-4 mars-reveal ${isVisible ? "is-visible" : ""}`}>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-2 leading-none">
            <span className="text-[var(--color-primary)] text-glow">
              {/* Nos */}
              {lang === 'fr' ? 'Nos' : 'Our'}
            </span>
            &nbsp;Jury
          </h2>

          <div className="h-2 w-56 sm:w-72 bg-[var(--gradient-brand)] mx-auto rounded-full mt-6 mb-10 shadow-[0_0_20px_var(--color-primary)]" />
        </div>

        {/* ---------------------------------------------------
            GRID (mobile-first : 1 col / tablet 2 / desktop 3)
        ---------------------------------------------------- */}
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-10 lg:gap-12">
          {juryList.map((user) => (
            <div key={user.id} className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
              {/* Card */}
              <div className="mars-btn card-jury relative overflow-hidden rounded-[36px] sm:rounded-[46px] md:rounded-[60px] border border-white/10 bg-[var(--card-bg)] h-full flex flex-col group transition-all duration-500 hover:border-[var(--color-primary)]/50 shadow-lg hover:shadow-[0_0_40px_var(--color-primary)]/20 transition-shadow duration-500">
                
                {/* Image */}
                <div className="relative h-72 sm:h-80 w-full p-4">
                  <div className="w-full h-full overflow-hidden rounded-[28px] sm:rounded-[40px] relative bg-black">
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.full_name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    {/* Glow overlay (palette) */}
                    <div className="absolute inset-0 card-image-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Text */}
                <div className="px-7 sm:px-10 pb-8 sm:pb-10 pt-1 flex flex-col flex-grow text-left">
                  <div className="mb-6">
                    <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-[var(--color-text)] uppercase italic">
                      {user.full_name || t("jury_page_anonymous")}
                    </h3>

                    <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                      {parseSpecialite(user.specialite)}
                    </p>

                    {/* Mini slogan simple (UX agréable, sans surcharge) */}
                    {/* <p className="mt-4 text-[var(--color-text)]/65 text-sm italic leading-relaxed line-clamp-2">
                      “{getJuryTagline(user)}”
                    </p> */}
                  </div>

                  {/* Button ( UN SEUL bouton, traduit) */}
                  <button
                    onClick={() => openModal(user)}
                    className="mars-cta mt-auto flex items-center justify-center gap-3 w-full py-4 rounded-full border border-white/10 bg-white/5 text-[10px] font-black text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-black transition-all uppercase tracking-[0.2em] focus-ring-mars"
                  >
                    {t("jury_page_details_button")}
                  
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </section>
      
      {/* ---------------------------------------------------
          MODAL (simple, premium, responsive)
      ---------------------------------------------------- */}
      {selectedJury && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-xl"
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          {/* La carte modale - Animation "modal-enter" à définir dans ton CSS */}
          <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[var(--color-primary)]/20 rounded-[24px] md:rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)] h-[92vh] sm:h-[90vh] md:h-[84vh] animate-in zoom-in duration-300 shadow-lg hover:shadow-[0_0_40px_var(--color-primary)]/20 transition-shadow duration-500">
            
            {/* Bouton fermer premium */}
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 z-50 p-4 bg-black/50 backdrop-blur-md hover:bg-red-500/20 text-white rounded-full transition-all border border-white/10"
              aria-label="Fermer"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
              
              {/* PANEL IMAGE avec effet de couleur au hover */}
              <div className="relative group h-40 sm:h-52 md:h-full overflow-hidden">
                <img 
                  src={getAvatarUrl(selectedJury)} 
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-105 opacity-100" 
                  alt={selectedJury.full_name} 
                />
                
                {/* Gradient adaptatif (Bas sur mobile, Droite sur Desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0a0a0a]/40 md:to-[#0a0a0a] pointer-events-none" />

                {/* Badge Accrédité (Premium) */}
                <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
                  <p className="text-white/80 text-[9px] font-black uppercase tracking-[0.4em]">
                    {/* ACCRÉDITÉ MARS / JURY */}
                    {t('jury_modal_accredited')}
                  </p>
                </div>
              </div>
              

              <div className="p-4 sm:p-5 md:p-8 flex flex-col h-full justify-between overflow-hidden">
                <div className="flex flex-col space-y-2 md:space-y-3">
                {/* official record info from main inserted */}
                <div className="space-y-0.5">               
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/70 font-light leading-tight">                   
                    {t('jury_page_registered')} {new Date(selectedJury.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-2 md:mb-3 text-[var(--color-secondary)]">
                  <Sparkles size={20} className="animate-spin-slow text-[var(--color-primary)]" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/60">
                    {/* Session d'Analyse Officielle */}
                    {t('jury_modal_session')}
                  </span>
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-4xl font-black italic text-white leading-none uppercase tracking-tighter pt-1">
                  {selectedJury.full_name}
                </h2>
                
                <p className="text-[var(--color-primary)] font-bold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] leading-relaxed">
                  {parseSpecialite(selectedJury.specialite)}
                </p>

                {/* Dossier Dossier/Note (Premium) */}
                <div className="space-y-3 md:space-y-6">
                  <div className="p-3 sm:p-4 md:p-6 rounded-[20px] md:rounded-[30px] bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                    <h4 className="text-[10px] font-black text-white/30 flex items-center gap-2 uppercase tracking-[0.2em] mb-4">
                      <Cpu size={16} className="text-[var(--color-primary)]" /> 
                      {/* Expertise & Vision */}
                      "{t('jury_modal_expertise')}"
                    </h4>
                    
                    <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-snug md:leading-relaxed italic mb-3 md:mb-5">
                      {/* "Expert(e) reconnu(e) pour sa capacité à identifier les ruptures technologiques et les impacts éthiques de l'IA générative." */}
                      "{t('jury_modal_bio_placeholder')}"
                    </p>

                    <ul className="space-y-2 md:space-y-4">
                      <li className="flex items-start gap-3 text-xs sm:text-sm text-white/70 font-light">
                        <Award size={18} className="text-[var(--color-primary)] shrink-0" /> 
                        <span>
                          {/* Évaluation des critères d'innovation pure. */}
                          {t('jury_modal_criteria_1')}
                        </span>
                      </li>
                      <li className="hidden sm:flex items-start gap-3 text-xs sm:text-sm text-white/70 font-light">
                        <Award size={18} className="text-[var(--color-primary)] shrink-0" /> 
                        <span>
                          {/* Analyse de la viabilité systémique des projets. */}
                          {t('jury_modal_criteria_2')}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                </div>

                <button 
                  onClick={closeModal}
                  className="mars-cta mt-3 md:mt-4 w-full py-2.5 md:py-3.5 text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                >
                  {/* Fermer la Fiche */}
                  {t('jury_modal_close')}
                </button>
              </div>
            </div>
          </div>
        </div>
        )};
    </div>
  );
} 

export default JuryPage;