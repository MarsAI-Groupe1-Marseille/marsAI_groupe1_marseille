import React, { useState, useEffect, useMemo } from "react";
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
const playSound = (type) => {
  // NOTE: Assure-toi que /public/sounds/open.mp3 et /public/sounds/close.mp3 existent
  const audio = new Audio(type === "open" ? "/sounds/open.mp3" : "/sounds/close.mp3");
  audio.volume = 0.2;
  audio.play().catch(() => console.log("Audio play blocked"));
};

const JuryPage = () => {
  /* -------------------------------------------------------
     STATE
  -------------------------------------------------------- */
  const [juryList, setJuryList] = useState([]); // Liste des jurés
  const [loading, setLoading] = useState(true); // Loader
  const [error, setError] = useState(null); // Gestion erreur API
  const [selectedJury, setSelectedJury] = useState(null); // Modale ouverte si != null
  const [isVisible, setIsVisible] = useState(false); // Déclenche animation mars-reveal

  /* -------------------------------------------------------
     DATA PRESIDENT (statique)
  -------------------------------------------------------- */
  const ADMIN_DATA = {
    full_name: "Jean-Baptiste G.",
    role: "admin",
    specialite: "Visionnaire IA & Président du Jury",
    bio: "Pionnier des technologies génératives, il définit la direction artistique et éthique du Mars AI Festival.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    socials: {
      linkedin: "https://www.linkedin.com/bruno",
      x: "https://www.x.com/marsai_festival",
      facebook: "https://www.facebook.com/marsai.festival",
      instagram: "https://www.instagram.com/marsai.festival"
    },
  };

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
    const parseSpecialite = (spec) => {
    if (!spec) return "Expert Festival";

    // Tableau JSON
    if (Array.isArray(spec)) return spec.filter(Boolean).join(" • ");

    // Objet JSON
    if (typeof spec === "object") return Object.values(spec).filter(Boolean).join(" • ");

    // String JSON (sécurité si DB / API renvoie une string)
    if (typeof spec === "string") {
      try {
        const parsed = JSON.parse(spec);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).join(" • ");
        if (typeof parsed === "object") return Object.values(parsed).filter(Boolean).join(" • ");
        return String(parsed);
      } catch {
        return spec; // Déjà une string lisible
      }
    }

    return "Expert Festival";
  };

  /* -------------------------------------------------------
     SLOGAN (pas besoin d’une bio par jury)
     -> simple, premium, dynamique selon la spécialité
  -------------------------------------------------------- */
  // const getJuryTagline = (user) => {
  //   const specText = parseSpecialite(user?.specialite);
  //   const s = specText.toLowerCase();

  //   if (s.includes("ia") || s.includes("deep") || s.includes("learning") || s.includes("ml")) {
  //     return "Juge l’algorithme, mais surtout l’intention derrière le modèle.";
  //   }
  //   if (s.includes("vfx") || s.includes("ciné") || s.includes("film") || s.includes("réal")) {
  //     return "Traque l’émotion dans l’image — même quand le futur est simulé.";
  //   }
  //   if (s.includes("design") || s.includes("ui") || s.includes("ux") || s.includes("motion")) {
  //     return "Mesure le premium à sa clarté : élégant, fluide, inoubliable.";
  //   }

  //   return "Un regard rare. Une exigence juste. Une signature MarsAI.";
  // };

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
        setError("Échec de la connexion aux serveurs Mars");
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
     UX modale : ESC + lock scroll
  -------------------------------------------------------- */
  useEffect(() => {
    if (!selectedJury) return;

    // Lock scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // ESC to close
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJury]);

  /* -------------------------------------------------------
     LOADING SCREEN
  -------------------------------------------------------- */
  if (loading) {
    return (
      <div className="h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--color-primary)] font-black italic tracking-widest animate-pulse">
          SYNCHRONISATION INTERSTELLAIRE...
        </p>
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
            Le <span className="text-[var(--color-primary)] text-glow">Grand</span>&nbsp;Jury
          </h1>

          <div className="h-2 w-24 sm:w-32 bg-[var(--gradient-brand)] mx-auto rounded-full mt-6 shadow-[0_0_20px_var(--color-primary)]" />

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-10 mb-2 leading-none">
            <span className="text-[var(--color-primary)] text-glow">Le</span>&nbsp;Président
          </h2>

          <div className="h-2 w-56 sm:w-72 bg-[var(--gradient-brand)] mx-auto rounded-full mt-6 mb-10 shadow-[0_0_20px_var(--color-primary)]" />
        </div>
      </section>

      {/* ---------------------------------------------------
          ERROR BANNER (simple, propre)
      ---------------------------------------------------- */}
      {error && (
        <div className="container-mars px-4 -mt-10 mb-10 relative z-30">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm">
            <span className="font-black tracking-widest text-red-200">ALERTE</span>{" "}
            <span className="text-[var(--color-text)]/80">{error}</span>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------
          PRESIDENT CARD (responsive + simple)
      ---------------------------------------------------- */}
      <section className="container-mars -mt-16 sm:-mt-20 relative z-20 px-4 mb-24 sm:mb-28 md:mb-32">
        <div className="glass-panel rounded-[34px] sm:rounded-[40px] md:rounded-[80px] w-full max-w-6xl mx-auto p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 md:gap-12 border border-white/10 shadow-2xl backdrop-blur-md">
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
              <Star size={14} fill="currentColor" /> Présidence du Jury
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-7xl font-black uppercase italic leading-none mb-4">
              {ADMIN_DATA.full_name}
            </h2>

            <p className="text-[var(--color-primary)] font-bold tracking-[0.35em] text-[11px] sm:text-xs uppercase mb-6">
              {ADMIN_DATA.specialite}
            </p>

            <p className="text-[var(--color-text)]/60 italic text-lg sm:text-xl font-light mb-8 md:mb-10 max-w-2xl leading-relaxed">
              "{ADMIN_DATA.bio}"
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
            <span className="text-[var(--color-primary)] text-glow">Nos</span>&nbsp;Jury
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
              <div className="mars-btn card-jury relative overflow-hidden rounded-[36px] sm:rounded-[46px] md:rounded-[60px] border border-white/10 bg-[var(--card-bg)] h-full flex flex-col group transition-all duration-500 hover:border-[var(--color-primary)]/50">
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
                      {user.full_name}
                    </h3>

                    <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                      {parseSpecialite(user.specialite)}
                    </p>

                    {/* Mini slogan simple (UX agréable, sans surcharge) */}
                    {/* <p className="mt-4 text-[var(--color-text)]/65 text-sm italic leading-relaxed line-clamp-2">
                      “{getJuryTagline(user)}”
                    </p> */}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => openModal(user)}
                    className="mars-cta mt-auto flex items-center justify-center gap-3 w-full py-4 rounded-full border border-white/10 bg-white/5 text-[10px] font-black text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-black transition-all uppercase tracking-[0.2em] focus-ring-mars"
                  >
                    Détails Jury 
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
    className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-xl overflow-y-auto"
    onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
  >
    {/* La carte modale - Animation "modal-enter" à définir dans ton CSS */}
    <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[var(--color-primary)]/20 md:rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)] min-h-screen md:min-h-0 my-0 md:my-8 animate-in zoom-in duration-300">
      
      {/* Bouton fermer premium */}
      <button 
        onClick={closeModal}
        className="absolute top-6 right-6 z-50 p-4 bg-black/50 backdrop-blur-md hover:bg-red-500/20 text-white rounded-full transition-all border border-white/10"
        aria-label="Fermer"
      >
        <X size={24} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* PANEL IMAGE avec effet de couleur au hover */}
        <div className="relative group h-[55vh] md:h-[650px] overflow-hidden">
          <img 
            src={getAvatarUrl(selectedJury)} 
            className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
            alt={selectedJury.full_name} 
          />
          
          {/* Gradient adaptatif (Bas sur mobile, Droite sur Desktop) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0a0a0a]/40 md:to-[#0a0a0a] pointer-events-none" />

          {/* Badge Accrédité (Premium) */}
          <div className="absolute bottom-6 left-6 rounded-full border border-white/10 bg-black/40 px-5 py-2 backdrop-blur-md">
            <p className="text-white/80 text-[9px] font-black uppercase tracking-[0.4em]">
              ACCRÉDITÉ MARS / JURY
            </p>
          </div>
        </div>
        
        {/* PANEL TEXTE */}
        <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4 text-[var(--color-secondary)]">
            <Sparkles size={20} className="animate-spin-slow text-[var(--color-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
              Session d'Analyse Officielle
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-2 italic text-white leading-none uppercase tracking-tighter">
            {selectedJury.full_name}
          </h2>
          
          <p className="text-[var(--color-primary)] font-bold text-sm mb-6 uppercase tracking-[0.4em]">
            {parseSpecialite(selectedJury.specialite)}
          </p>

          {/* Dossier Dossier/Note (Premium) */}
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-[30px] bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <h4 className="text-[10px] font-black text-white/30 flex items-center gap-2 uppercase tracking-[0.2em] mb-4">
                <Cpu size={16} className="text-[var(--color-primary)]" /> Expertise & Vision
              </h4>
              
              <p className="text-base text-white/80 font-light leading-relaxed italic mb-6">
                "Expert(e) reconnu(e) pour sa capacité à identifier les ruptures technologiques et les impacts éthiques de l'IA générative."
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-sm text-white/70 font-light">
                  <Award size={18} className="text-[var(--color-primary)] shrink-0" /> 
                  <span>Évaluation des critères d'innovation pure.</span>
                </li>
                <li className="flex items-start gap-4 text-sm text-white/70 font-light">
                  <Award size={18} className="text-[var(--color-primary)] shrink-0" /> 
                  <span>Analyse de la viabilité systémique des projets.</span>
                </li>
              </ul>
            </div>
          </div>

          <button 
            onClick={closeModal}
            className="mars-cta mt-10 w-full py-5 text-[10px] font-black tracking-[0.4em] uppercase rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            Fermer la Fiche
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default JuryPage;