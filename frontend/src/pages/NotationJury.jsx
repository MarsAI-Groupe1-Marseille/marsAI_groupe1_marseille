import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
import { useLanguage } from "../context/LanguageContext.jsx";
import StarryBackground from "../components/StarryBackground.jsx";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  User,
  Film as FilmIcon,
  X,
  Play,
  Tag,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Check,
  Pencil,
  Loader2,
  Globe,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.js — ajouter ceci :
//
// theme: {
//   extend: {
//     fontFamily: {
//       orbitron: ['Orbitron', 'sans-serif'],
//       rajdhani: ['Rajdhani', 'sans-serif'],
//     },
//   },
// }
//
// index.html — ajouter :
// <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
// ─────────────────────────────────────────────────────────────────────────────

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_FILMS = {
  "1": {
    id: "1",
    title_original: "Les Ombres du Crépuscule",
    title_french: "Shadows at Dusk",
    // synopsis_original = version française (langue originale du film)
    synopsis_original: "Dans un petit village français isolé, une jeune photographe découvre d'étranges phénomènes lumineux qui semblent liés aux souvenirs enfouis des habitants. Entre réalité et fantastique, elle plonge dans une quête fascinante qui bouleversera sa perception du temps et de l'espace.",
    // synopsis_french = traduction anglaise pour les jurés anglophones
    synopsis_french: "In a small, isolated French village, a young photographer discovers strange luminous phenomena that seem linked to the buried memories of the inhabitants. Between reality and fantasy, she embarks on a fascinating quest that will transform her perception of time and space.",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    director_name: "Marie Dubois",
    director_email: "marie.dubois@cinema.fr",
    location: "Provence-Alpes-Côte d'Azur, France",
    duration_seconds: 5400,
    production_year: 2024,
    themes: ["Fantastique", "Drame", "Mystère", "Art visuel"],
  },
  "2": {
    id: "2",
    title_original: "Le Dernier Métro",
    title_french: "The Last Metro",
    synopsis_original: "Un film bouleversant sur trois inconnus qui se rencontrent dans le dernier métro de la nuit à Paris. Leurs destins s'entremêlent dans une conversation profonde sur l'amour, la perte et l'espoir.",
    synopsis_french: "A moving film about three strangers who meet on the last metro of the night in Paris. Their destinies intertwine in a profound conversation about love, loss, and hope.",
    poster_url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=600&h=900&fit=crop",
    video_url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    director_name: "Jean-Paul Renard",
    director_email: "jp.renard@filmmakers.com",
    location: "Paris, Île-de-France, France",
    duration_seconds: 4800,
    production_year: 2024,
    themes: ["Drame", "Romance", "Urbain", "Huis clos"],
  },
  "3": {
    id: "3",
    title_original: "Horizons Infinis",
    title_french: "Endless Horizons",
    synopsis_original: "A breathtaking documentary following a young filmmaker across the most remote landscapes of France, capturing the raw beauty of nature and the forgotten stories of the last guardians of these wild lands.",
    synopsis_french: "Un documentaire époustouflant qui suit le voyage d'un jeune réalisateur à travers les paysages les plus reculés de France, capturant la beauté brute de la nature et les histoires oubliées des derniers gardiens de ces terres sauvages.",
    poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop",
    video_url: "https://www.youtube.com/watch?v=YQHsXMglC9A",
    director_name: "Sophie Laurent",
    director_email: "s.laurent@docs.fr",
    location: "Auvergne-Rhône-Alpes, France",
    duration_seconds: 6300,
    production_year: 2023,
    themes: ["Documentaire", "Nature", "Écologie", "Aventure"],
  },
};

// ─── Tag color variants ───────────────────────────────────────────────────────
const TAG_COLORS = [
  "bg-[rgba(123,47,255,0.25)] border border-[rgba(123,47,255,0.5)] text-[#c39fff] hover:bg-[rgba(123,47,255,0.4)] hover:shadow-[0_0_12px_rgba(123,47,255,0.4)]",
  "bg-[rgba(0,229,255,0.15)] border border-[rgba(0,229,255,0.4)] text-[#80f0ff] hover:bg-[rgba(0,229,255,0.25)] hover:shadow-[0_0_12px_rgba(0,229,255,0.3)]",
  "bg-[rgba(224,64,251,0.18)] border border-[rgba(224,64,251,0.4)] text-[#f09fff] hover:bg-[rgba(224,64,251,0.3)] hover:shadow-[0_0_12px_rgba(224,64,251,0.3)]",
  "bg-[rgba(255,215,64,0.15)] border border-[rgba(255,215,64,0.35)] text-[#ffe680] hover:bg-[rgba(255,215,64,0.25)] hover:shadow-[0_0_12px_rgba(255,215,64,0.25)]",
];

// ─── Vote options ─────────────────────────────────────────────────────────────
const VOTE_OPTIONS = [
  {
    key: "like",
    label: "J'aime",
    Icon: ThumbsUp,
    selectedCls:
      "text-[#00dc6e] border-[rgba(0,220,110,0.65)] bg-[rgba(0,220,110,0.1)] shadow-[0_0_28px_rgba(0,220,110,0.3),inset_0_0_20px_rgba(0,220,110,0.04)] -translate-y-[5px]",
    hoverCls:
      "hover:text-[#00dc6e] hover:border-[rgba(0,220,110,0.65)] hover:bg-[rgba(0,220,110,0.1)] hover:shadow-[0_0_28px_rgba(0,220,110,0.3)]",
  },
  {
    key: "discuss",
    label: "À discuter",
    Icon: MessageCircle,
    selectedCls:
      "text-[#ffd740] border-[rgba(255,215,64,0.65)] bg-[rgba(255,215,64,0.1)] shadow-[0_0_28px_rgba(255,215,64,0.28),inset_0_0_20px_rgba(255,215,64,0.04)] -translate-y-[5px]",
    hoverCls:
      "hover:text-[#ffd740] hover:border-[rgba(255,215,64,0.65)] hover:bg-[rgba(255,215,64,0.1)] hover:shadow-[0_0_28px_rgba(255,215,64,0.28)]",
  },
  {
    key: "dislike",
    label: "J'aime pas",
    Icon: ThumbsDown,
    selectedCls:
      "text-[#ff5370] border-[rgba(255,83,112,0.65)] bg-[rgba(255,83,112,0.1)] shadow-[0_0_28px_rgba(255,83,112,0.28),inset_0_0_20px_rgba(255,83,112,0.04)] -translate-y-[5px]",
    hoverCls:
      "hover:text-[#ff5370] hover:border-[rgba(255,83,112,0.65)] hover:bg-[rgba(255,83,112,0.1)] hover:shadow-[0_0_28px_rgba(255,83,112,0.28)]",
  },
];

// ─── Stars ────────────────────────────────────────────────────────────────────
// Using StarryBackground component imported from components

// ─── InfoCard ─────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, iconColor, label, children, className = "", mode = 'dark' }) => (
  <div style={{
    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15,12,30,0.85)',
    border: mode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = mode === 'light' ? 'rgba(124, 58, 237, 0.4)' : 'rgba(123,47,255,0.45)';
    e.currentTarget.style.boxShadow = mode === 'light' 
      ? '0 8px 32px rgba(124, 58, 237, 0.1)' 
      : '0 8px 32px rgba(0,0,0,0.4)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = mode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(123,47,255,0.25)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
      <div style={{
        width: '2.5rem',
        height: '2.5rem',
        flexShrink: 0,
        borderRadius: '10px',
        backgroundColor: mode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.2)',
        border: mode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s'
      }}>
        <Icon size={16} color={iconColor} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: 'orbitron',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: mode === 'light' ? '#7c3aed' : '#9b8ec4',
          marginBottom: '0.375rem'
        }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  </div>
);

// ─── SynopsisTranslateBtn ─────────────────────────────────────────────────────
// FIX: logique corrigée — "fr" = synopsis_original (français), "en" = synopsis_french (anglais)
// Le bouton affiche la langue VERS laquelle on peut basculer, avec indicateur de langue active.
const SynopsisTranslateBtn = ({ lang, onToggle, hasTranslation, mode = 'dark' }) => {
  if (!hasTranslation) return null;

  const isFr = lang === "fr";

  return (
    <button
      onClick={onToggle}
      aria-label={isFr ? "Voir le synopsis en anglais" : "Voir le synopsis en français"}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        paddingX: '0.875rem',
        paddingY: '0.375rem',
        borderRadius: '9999px',
        border: mode === 'light' ? '1px solid rgba(124, 58, 237, 0.35)' : '1px solid rgba(0,229,255,0.35)',
        backgroundColor: mode === 'light' ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
        color: mode === 'light' ? '#7c3aed' : '#80d8ff',
        cursor: 'pointer',
        transition: 'all 0.3s',
        outline: 'none',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
        letterSpacing: '0.8px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = mode === 'light' ? 'rgba(124, 58, 237, 0.7)' : 'rgba(0,229,255,0.7)';
        e.currentTarget.style.color = mode === 'light' ? '#6d28d9' : '#c0eeff';
        e.currentTarget.style.boxShadow = mode === 'light'
          ? '0 0 18px rgba(124, 58, 237, 0.25), inset 0 0 12px rgba(124, 58, 237, 0.06)'
          : '0 0 18px rgba(0,229,255,0.25), inset 0 0 12px rgba(0,229,255,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = mode === 'light' ? 'rgba(124, 58, 237, 0.35)' : 'rgba(0,229,255,0.35)';
        e.currentTarget.style.color = mode === 'light' ? '#7c3aed' : '#80d8ff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Shimmer sweep on hover */}
      <span style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.5s',
        pointerEvents: 'none'
      }} />

      {/* Globe icon — tourne légèrement au hover */}
      <Globe
        size={12}
        style={{ flexShrink: 0, transition: 'transform 0.5s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(20deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
      />

      {/* Langue active (badge pill) */}
      <span style={{
        fontFamily: 'orbitron',
        fontSize: '9px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        opacity: 0.5
      }}>
        {isFr ? "EN" : "FR"}
      </span>

      {/* Séparateur */}
      <span style={{
        color: mode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(0,229,255,0.3)',
        fontSize: '10px',
        userSelect: 'none'
      }}>→</span>

      {/* Langue cible */}
      <span style={{
        fontFamily: 'orbitron',
        fontSize: '9px',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        {isFr ? "FR" : "EN"}
      </span>
    </button>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NotationJury() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [currentMode, setCurrentMode] = useState('dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mode = document.documentElement.getAttribute('data-mode') || 'dark';
      setCurrentMode(mode);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    const initialMode = document.documentElement.getAttribute('data-mode') || 'dark';
    setCurrentMode(initialMode);
    return () => observer.disconnect();
  }, []);

  const [film, setFilm]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVote, setSelectedVote]     = useState(null);
  const [comment, setComment]         = useState("");
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  // FIX: "fr" = synopsis_original (texte français), "en" = synopsis_french (traduction anglaise)
  const [synopsisLang, setSynopsisLang] = useState("fr");
  const [draftReady, setDraftReady]   = useState(false);

  const getDraftKey = (submissionId) => {
    try {
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userId = user?.id || user?.user_id || user?.userId || "anon";
      return `juryVoteDraft:${userId}:${submissionId}`;
    } catch (err) {
      return `juryVoteDraft:anon:${submissionId}`;
    }
  };

  const loadDraft = (submissionId) => {
    try {
      const raw = localStorage.getItem(getDraftKey(submissionId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (err) {
      return null;
    }
  };

  const saveDraft = (submissionId, data) => {
    try {
      localStorage.setItem(getDraftKey(submissionId), JSON.stringify(data));
    } catch (err) {
      // ignore localStorage failures
    }
  };

  const clearDraft = (submissionId) => {
    try {
      localStorage.removeItem(getDraftKey(submissionId));
    } catch (err) {
      // ignore localStorage failures
    }
  };

  // Fetch film + vérifier si ce jury a déjà évalué ce film
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        
        // Récupérer le film
        const filmRes = await axios.get(`/submissions/${id}`);
        if(!filmRes.data) throw new Error("Film non trouvé");
        setFilm(filmRes.data);
        setError(null);
        
        // Récupérer les votes du jury connecté
        const votesRes = await axios.get('/jury/my-votes');
        let hasServerVote = false;
        if (votesRes.data.success && votesRes.data.votes) {
          // Chercher si ce jury a déjà voté pour ce film
          const myVote = votesRes.data.votes.find(v => v.submission_id === parseInt(id));
          
          if (myVote) {
            // Ce jury a déjà évalué ce film
            setSelectedVote(myVote.vote_status.toLowerCase());
            setComment(myVote.comment || "");
            setSubmitted(true);
            clearDraft(id);
            hasServerVote = true;
          }
        }

        const draft = !hasServerVote ? loadDraft(id) : null;
        if (draft && !draft.submitted) {
          if (draft.selectedVote) setSelectedVote(draft.selectedVote);
          if (typeof draft.comment === "string") setComment(draft.comment);
        }
        setDraftReady(true);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger le film");
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id]);

  useEffect(() => {
    if (!draftReady) return;

    if (submitted) {
      clearDraft(id);
      return;
    }

    if (!selectedVote && !comment) {
      clearDraft(id);
      return;
    }

    saveDraft(id, {
      selectedVote,
      comment,
      submitted: false,
      updatedAt: Date.now(),
    });
  }, [selectedVote, comment, submitted, id, draftReady]);

  // Escape → close modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setShowVideoModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmitVote = async () => {
    if (!selectedVote) return;
    setSubmitting(true);
    try {
      // Envoyer le vote à l'API backend
      const response = await axios.post('/jury/vote', {
        submissionId: id,
        vote_status: selectedVote.toUpperCase(),
        comment: comment
      });

      if (response.data) {
        // Marquer comme soumis
        setSubmitted(true);
        clearDraft(id);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du vote:', error);
      alert(t('notation_error_submit'));
    } finally {
      setSubmitting(false);
    }
  };

  const getEmbedUrl = (url, youtubeId) => {
    const vidFromUrl = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
    const vid = youtubeId || vidFromUrl;
    return vid ? `https://www.youtube.com/embed/${vid}?autoplay=1` : null;
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#0a0a12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
        backgroundImage: currentMode === 'light' 
          ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124, 58, 237, 0.15) 0%, transparent 60%)'
          : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,47,255,0.3) 0%, transparent 60%)'
      }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            border: `3px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(123,47,255,0.2)'}`,
            borderTop: currentMode === 'light' ? '3px solid #7c3aed' : '3px solid #7b2fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginX: 'auto',
            marginBottom: '1.25rem'
          }} />
          <p style={{
            fontFamily: 'orbitron',
            fontSize: '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4'
          }}>
            {t('notation_loading')}
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !film) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#0a0a12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', 'rajdhani', sans-serif"
      }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <p style={{ color: '#ff8090', fontSize: '1.125rem', marginBottom: '1.5rem' }}
            >
            {error || "Film introuvable"}
          </p>
          <button onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.15)',
              border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(123,47,255,0.25)',
              borderRadius: '9999px',
              fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4',
              cursor: 'pointer',
              transition: 'all 0.3s',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#7b2fff';
              e.target.style.color = currentMode === 'light' ? '#6d28d9' : '#f0eaff';
              e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(123,47,255,0.25)';
              e.target.style.boxShadow = currentMode === 'light' ? '0 0 20px rgba(124, 58, 237, 0.3)' : '0 0 20px rgba(123,47,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(123,47,255,0.25)';
              e.target.style.color = currentMode === 'light' ? '#7c3aed' : '#9b8ec4';
              e.target.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.15)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {t('notation_back')}
          </button>
        </div>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const resolveAssetUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${apiBaseUrl}${url}`;
  };

  const duration = film.duration_seconds ? `${Math.floor(film.duration_seconds / 60)} MIN` : "N/A";
  const embedUrl = getEmbedUrl(film.video_url, film.youtube_id);

  const director = film.Director || null;
  const directorName = director
    ? `${director.first_name || ""} ${director.last_name || ""}`.trim()
    : film.director_name;
  const directorEmail = director?.email || film.director_email;
  const location = director?.city
    ? `${director.city}${director.country ? `, ${director.country}` : ""}`
    : film.location;

  const themes = film.theme_tags
    ? film.theme_tags.split(",").map((t) => t.trim()).filter(Boolean)
    : (film.themes || []);

  // FIX: sélection du synopsis selon la langue active
  // "fr" → synopsis_original (version française d'origine)
  // "en" → synopsis_french  (traduction anglaise — le champ est nommé synopsis_french dans l'API
  //                           mais contient la traduction EN pour les jurés anglophones)
  const synopsisText =
    synopsisLang === "fr"
      ? film.synopsis_original
      : (film.synopsis_english || film.synopsis_french || film.synopsis_original);

  const hasTranslation = Boolean(film.synopsis_english || film.synopsis_french);

  return (
    <>
      <StarryBackground />
      <div style={{
        minHeight: '100vh',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#0a0a12',
        color: currentMode === 'light' ? '#000000' : '#f0eaff',
        fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
      backgroundImage: currentMode === 'light'
        ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124, 58, 237, 0.15) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(124, 58, 237, 0.08) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(124, 58, 237, 0.02) 60px, rgba(124, 58, 237, 0.02) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(124, 58, 237, 0.02) 60px, rgba(124, 58, 237, 0.02) 61px)'
        : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,47,255,0.3) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 90% 90%, rgba(224,64,251,0.15) 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(123,47,255,0.03) 60px, rgba(123,47,255,0.03) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(123,47,255,0.03) 60px, rgba(123,47,255,0.03) 61px)'
    }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', marginX: 'auto', paddingX: '1rem', paddingY: '2.5rem' }}>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            paddingX: '1.25rem',
            paddingY: '0.625rem',
            backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.15)',
            border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.25)' : '1px solid rgba(123,47,255,0.25)',
            borderRadius: '9999px',
            fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4',
            cursor: 'pointer',
            transition: 'all 0.3s',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#7b2fff';
            e.currentTarget.style.color = currentMode === 'light' ? '#6d28d9' : '#f0eaff';
            e.currentTarget.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(123,47,255,0.25)';
            e.currentTarget.style.boxShadow = currentMode === 'light' ? '0 0 20px rgba(124, 58, 237, 0.3)' : '0 0 20px rgba(123,47,255,0.3)';
            e.currentTarget.querySelector('svg').style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.25)' : 'rgba(123,47,255,0.25)';
            e.currentTarget.style.color = currentMode === 'light' ? '#7c3aed' : '#9b8ec4';
            e.currentTarget.style.backgroundColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.15)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.querySelector('svg').style.transform = 'translateX(0)';
          }}
        >
          <ChevronLeft size={16} style={{ transition: 'transform 0.3s' }} />
          {t('notation_back_selection')}
        </button>

        {/* ── Main 2-col grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

          {/* ── LEFT: poster + themes ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Poster */}
            <div
              onClick={() => embedUrl && setShowVideoModal(true)}
              style={{
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                cursor: embedUrl ? 'pointer' : 'default',
                boxShadow: currentMode === 'light'
                  ? '0 0 0 1px rgba(124, 58, 237, 0.3), 0 20px 60px rgba(124, 58, 237, 0.1), 0 0 80px rgba(124, 58, 237, 0.1)'
                  : '0 0 0 1px rgba(123,47,255,0.3), 0 20px 60px rgba(0,0,0,0.7), 0 0 80px rgba(123,47,255,0.2)',
                transition: 'all 0.5s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = currentMode === 'light'
                  ? '0 0 0 1px rgba(124, 58, 237, 0.6), 0 20px 80px rgba(124, 58, 237, 0.2), 0 0 120px rgba(124, 58, 237, 0.2)'
                  : '0 0 0 1px rgba(123,47,255,0.6), 0 20px 80px rgba(0,0,0,0.8), 0 0 120px rgba(123,47,255,0.4)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = currentMode === 'light'
                  ? '0 0 0 1px rgba(124, 58, 237, 0.3), 0 20px 60px rgba(124, 58, 237, 0.1), 0 0 80px rgba(124, 58, 237, 0.1)'
                  : '0 0 0 1px rgba(123,47,255,0.3), 0 20px 60px rgba(0,0,0,0.7), 0 0 80px rgba(123,47,255,0.2)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}
            >
              <img
                src={resolveAssetUrl(film.poster_url)}
                alt={film.title_original}
                style={{
                  width: '100%',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.7s'
                }}
              />

              {embedUrl && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: currentMode === 'light'
                    ? 'linear-gradient(to top, rgba(255,255,255,0.85), rgba(255,255,255,0.2), transparent)'
                    : 'linear-gradient(to top, rgba(10,10,18,0.95), rgba(10,10,18,0.3), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundImage: 'linear-gradient(to bottom right, #7b2fff, #e040fb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(0.75)',
                    transition: 'transform 0.3s',
                    boxShadow: '0 0 40px rgba(123,47,255,0.7), 0 0 80px rgba(224,64,251,0.4)',
                    marginBottom: '0.75rem'
                  }}>
                    <Play size={28} color="#fff" fill="#fff" />
                  </div>
                  <span style={{
                    fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                    fontWeight: 'bold',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fff'
                  }}>
                    {t('notation_watch_film')}
                  </span>
                </div>
              )}

              {/* Duration badge */}
              <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                right: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                backgroundColor: currentMode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(10,10,18,0.85)',
                border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(123,47,255,0.4)',
                borderRadius: '9999px',
                paddingX: '0.75rem',
                paddingY: '0.25rem',
                fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1.2px',
                color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4',
                backdropFilter: 'blur(4px)'
              }}>
                <Clock size={10} />
                {duration}
              </div>
            </div>

            {/* Themes */}
            {themes.length > 0 && (
              <div style={{
                backgroundColor: currentMode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15,12,30,0.85)',
                border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)',
                borderRadius: '0.75rem',
                padding: '1.125rem',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Tag size={12} color={currentMode === 'light' ? '#7c3aed' : '#9b8ec4'} />
                  <span style={{
                    fontFamily: 'orbitron',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4'
                  }}>
                    {t('notation_themes')}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {themes.map((theme, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-block',
                        paddingX: '0.875rem',
                        paddingY: '0.25rem',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s',
                        backgroundColor: currentMode === 'light' 
                          ? 'rgba(124, 58, 237, 0.1)' 
                          : TAG_COLORS[idx % 4].split(' ')[0],
                        border: currentMode === 'light'
                          ? '1px solid rgba(124, 58, 237, 0.2)'
                          : '1px solid rgba(124, 58, 237, 0.5)',
                        color: currentMode === 'light' ? '#7c3aed' : '#c39fff'
                      }}
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: film info ── */}
          <div className="flex flex-col gap-5">

            {/* Festival badge + title */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                paddingX: '0.875rem',
                paddingY: '0.25rem',
                borderRadius: '9999px',
                backgroundImage: currentMode === 'light'
                  ? 'linear-gradient(to right, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.1))'
                  : 'linear-gradient(to right, rgba(123,47,255,0.3), rgba(224,64,251,0.2))',
                border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(123,47,255,0.5)',
                marginBottom: '1rem'
              }}>
                <FilmIcon size={9} color={currentMode === 'light' ? '#7c3aed' : '#c39fff'} />
                <span style={{
                  fontFamily: 'orbitron',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: currentMode === 'light' ? '#7c3aed' : '#c39fff'
                }}>
                  {t('notation_official_selection')}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'orbitron',
                  fontWeight: 900,
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: '0.5rem',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  letterSpacing: '-0.5px',
                  textShadow: currentMode === 'light'
                    ? '0 0 20px rgba(124, 58, 237, 0.3)'
                    : '0 0 40px rgba(123,47,255,0.8), 0 0 80px rgba(123,47,255,0.4)'
                }}
              >
                {film.title_original}
              </h1>

              {film.title_english && film.title_english !== film.title_original && (
                <p style={{
                  fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  letterSpacing: '1.5px',
                  color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4'
                }}>
                  {film.title_english}
                </p>
              )}

              <div style={{
                height: '1px',
                backgroundImage: `linear-gradient(to right, transparent, ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(123,47,255,0.5)'}, transparent)`,
                marginTop: '0.5rem',
                marginBottom: '1.5rem'
              }} />
            </div>

            {/* ── Synopsis — CORRIGÉ ── */}
            <div style={{
              backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15,12,30,0.85)',
              border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              backdropFilter: 'blur(4px)'
            }}>

              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FilmIcon size={12} color={currentMode === 'light' ? '#7c3aed' : '#7b2fff'} />
                  <span style={{
                    fontFamily: 'orbitron',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: currentMode === 'light' ? '#7c3aed' : '#7b2fff'
                  }}>
                    {t('notation_synopsis')}
                  </span>
                  {/* Indicateur de langue active */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    paddingX: '0.5rem',
                    paddingY: '0.125rem',
                    borderRadius: '9999px',
                    backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(123,47,255,0.15)',
                    border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)'
                  }}>
                    <span style={{
                      fontFamily: 'orbitron',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4'
                    }}>
                      {synopsisLang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
                    </span>
                  </span>
                </div>

                {/* Bouton de traduction — corrigé */}
                <SynopsisTranslateBtn
                  lang={synopsisLang}
                  onToggle={() => setSynopsisLang((prev) => (prev === "fr" ? "en" : "fr"))}
                  hasTranslation={hasTranslation}
                  mode={currentMode}
                />
              </div>

              {/* Texte du synopsis avec transition */}
              <p
                style={{
                  fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: currentMode === 'light' ? '#333333' : '#c8bde8',
                  animation: 'njSlideDown 0.28s ease both',
                  letterSpacing: '0.5px'
                }}
              >
                {synopsisText}
              </p>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {directorName && (
                <InfoCard icon={User} iconColor={currentMode === 'light' ? '#7c3aed' : '#7b2fff'} label={t('notation_director')} mode={currentMode}>
                  <p style={{ fontFamily: "'Space Grotesk', 'rajdhani', sans-serif", fontSize: '17px', fontWeight: 600, color: currentMode === 'light' ? '#000000' : '#f0eaff', letterSpacing: '0.5px' }}>{directorName}</p>
                </InfoCard>
              )}

              <InfoCard icon={Clock} iconColor="#00e5ff" label={t('notation_duration')} mode={currentMode}>
                <p style={{ fontFamily: "'Space Grotesk', 'rajdhani', sans-serif", fontSize: '17px', fontWeight: 600, color: currentMode === 'light' ? '#000000' : '#f0eaff', letterSpacing: '0.5px' }}>{duration}</p>
              </InfoCard>

              {directorEmail && (
                <InfoCard icon={Mail} iconColor="#e040fb" label={t('notation_contact')} mode={currentMode}>
                  <a
                    href={`mailto:${directorEmail}`}
                    style={{
                      display: 'block',
                      fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: currentMode === 'light' ? '#7c3aed' : '#80c8ff',
                      letterSpacing: '0.8px',
                      truncate: 'ellipsis',
                      transition: 'color 0.2s',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.color = currentMode === 'light' ? '#6d28d9' : '#b0d8ff'}
                    onMouseLeave={(e) => e.target.style.color = currentMode === 'light' ? '#7c3aed' : '#80c8ff'}
                  >
                    {directorEmail}
                  </a>
                </InfoCard>
              )}

              {location && (
                <InfoCard icon={MapPin} iconColor="#ffd740" label={t('notation_location')} mode={currentMode}>
                  <p style={{ fontFamily: "'Space Grotesk', 'rajdhani', sans-serif", fontSize: '17px', fontWeight: 600, color: currentMode === 'light' ? '#000000' : '#f0eaff', letterSpacing: '0.5px' }}>{location}</p>
                </InfoCard>
              )}

              {film.production_year && (
                <InfoCard icon={Calendar} iconColor="#00e5ff" label={t('notation_production_year')} mode={currentMode}>
                  <p style={{ fontFamily: "'Space Grotesk', 'rajdhani', sans-serif", fontSize: '17px', fontWeight: 600, color: currentMode === 'light' ? '#000000' : '#f0eaff', letterSpacing: '0.5px' }}>{film.production_year}</p>
                </InfoCard>
              )}
            </div>
          </div>
        </div>

        {/* ── Rating section ── */}
        <div style={{
          position: 'relative',
          backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15,12,30,0.85)',
          border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          backdropFilter: 'blur(4px)',
          overflow: 'hidden'
        }}>

          {/* Top chromatic bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundImage: 'linear-gradient(to right, transparent, #7b2fff, #e040fb, #00e5ff, transparent)',
            opacity: currentMode === 'light' ? 0.6 : 1
          }} />

          <h2
            style={{
              fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
              fontWeight: 900,
              textAlign: 'center',
              color: currentMode === 'light' ? '#000000' : '#ffffff',
              marginBottom: '0.375rem',
              letterSpacing: '3px',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
              textShadow: currentMode === 'light'
                ? '0 0 15px rgba(124, 58, 237, 0.3)'
                : '0 0 30px rgba(123,47,255,0.6)'
            }}
          >
            {t('notation_your_evaluation')}
          </h2>
          <p style={{
            fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
            fontSize: '15px',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '1px',
            color: currentMode === 'light' ? '#666666' : '#9b8ec4',
            marginBottom: '2.25rem'
          }}>
            {t('notation_evaluation_subtitle')}
          </p>

          {/* Vote buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
            {VOTE_OPTIONS.map(({ key, Icon, selectedCls, hoverCls }) => {
              const isSelected = selectedVote === key;
              const labelKey = key === "like" ? "notation_vote_like" : key === "discuss" ? "notation_vote_discuss" : "notation_vote_dislike";
              return (
                <button
                  key={key}
                  disabled={submitted}
                  onClick={() => setSelectedVote(key)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.875rem',
                    paddingX: '1rem',
                    paddingY: '1.75rem',
                    borderRadius: '0.75rem',
                    fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                    fontSize: '15px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    border: isSelected 
                      ? 'none' 
                      : `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(123,47,255,0.2)'}`,
                    backgroundColor: isSelected
                      ? (key === 'like' ? '#00dc6e' : key === 'discuss' ? '#ffd740' : '#ff5370')
                      : currentMode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(10,8,22,0.7)',
                    color: isSelected ? '#000000' : currentMode === 'light' ? '#7c3aed' : '#9b8ec4',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    opacity: submitted ? 0.45 : 1,
                    boxShadow: isSelected
                      ? `0 0 28px ${key === 'like' ? 'rgba(0,220,110,0.3)' : key === 'discuss' ? 'rgba(255,215,64,0.28)' : 'rgba(255,83,112,0.28)'}`
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !submitted) {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !submitted) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {/* Icon ring */}
                  <span style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    border: `1.5px solid currentColor`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.3s'
                  }}>
                    <Icon size={24} strokeWidth={1.8} style={{ color: isSelected ? '#000000' : 'inherit' }} />
                  </span>

                  {t(labelKey)}

                  {/* Check badge */}
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.625rem',
                        right: '0.625rem',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'njPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both'
                      }}
                    >
                      <Check size={11} strokeWidth={3} style={{ color: '#000000' }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Comment */}
          {selectedVote && (
            <div style={{ marginBottom: '1.5rem', animation: 'njSlideDown 0.3s ease both' }}>
              <label style={{
                display: 'block',
                fontFamily: 'orbitron',
                fontSize: '10px',
                fontWeight: 'bold',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: currentMode === 'light' ? '#7c3aed' : '#9b8ec4',
                marginBottom: '0.625rem'
              }}>
                {t('notation_comment')}{" "}
                {!submitted && (
                  <span style={{
                    fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                    fontSize: '13px',
                    fontWeight: 400,
                    textTransform: 'none',
                    letterSpacing: '0.3px',
                    color: currentMode === 'light' ? 'rgba(124, 58, 237, 0.45)' : 'rgba(155,142,196,0.45)'
                  }}>
                    {t('jury_optional')}
                  </span>
                )}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitted}
                placeholder={t('notation_comment_placeholder')}
                rows={6}
                style={{
                  width: '100%',
                  paddingX: '1.25rem',
                  paddingY: '1rem',
                  backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(10,8,20,0.7)',
                  border: currentMode === 'light' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(123,47,255,0.25)',
                  borderRadius: '0.75rem',
                  fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: currentMode === 'light' ? '#000000' : '#f0eaff',
                  placeholderColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(155,142,196,0.5)',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s',
                  opacity: submitted ? 0.6 : 1,
                  cursor: submitted ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.5)' : '#7b2fff';
                  e.target.style.boxShadow = currentMode === 'light'
                    ? '0 0 0 3px rgba(124, 58, 237, 0.1), 0 0 20px rgba(124, 58, 237, 0.05)'
                    : '0 0 0 3px rgba(123,47,255,0.2), 0 0 20px rgba(123,47,255,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(123,47,255,0.25)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          {/* Submit / Success */}
          {!submitted ? (
            <button
              disabled={!selectedVote || submitting}
              onClick={handleSubmitVote}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                paddingY: '1.125rem',
                borderRadius: '0.75rem',
                fontFamily: 'orbitron',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                border: 'none',
                cursor: !selectedVote || submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: !selectedVote || submitting
                  ? currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(30,25,50,0.8)'
                  : currentMode === 'light' ? '#7c3aed' : 'linear-gradient(to right, #7b2fff, #e040fb)',
                color: !selectedVote || submitting
                  ? currentMode === 'light' ? '#7c3aed' : 'rgba(155,142,196,0.35)'
                  : '#ffffff',
                boxShadow: !selectedVote || submitting
                  ? 'none'
                  : currentMode === 'light' 
                    ? '0 8px 32px rgba(124, 58, 237, 0.2), 0 0 60px rgba(124, 58, 237, 0.1)'
                    : '0 8px 32px rgba(123,47,255,0.4), 0 0 60px rgba(224,64,251,0.2)'
              }}
              onMouseEnter={(e) => {
                if (!(!selectedVote || submitting)) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = currentMode === 'light'
                    ? '0 12px 40px rgba(124, 58, 237, 0.3), 0 0 80px rgba(124, 58, 237, 0.15)'
                    : '0 12px 40px rgba(123,47,255,0.6), 0 0 80px rgba(224,64,251,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!(!selectedVote || submitting)) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = currentMode === 'light'
                    ? '0 8px 32px rgba(124, 58, 237, 0.2), 0 0 60px rgba(124, 58, 237, 0.1)'
                    : '0 8px 32px rgba(123,47,255,0.4), 0 0 60px rgba(224,64,251,0.2)';
                }
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  {t('jury_submitting')}
                </>
              ) : (
                <>
                  {t('notation_submit')}
                  <ChevronRight size={18} strokeWidth={2} />
                </>
              )}
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundImage: 'linear-gradient(to right, rgba(0,200,100,0.12), rgba(0,180,90,0.06))',
                border: '1px solid rgba(0,220,110,0.4)',
                borderRadius: '0.75rem',
                paddingX: '1.5rem',
                paddingY: '1.375rem',
                animation: 'njSlideDown 0.35s ease both'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  flexShrink: 0,
                  borderRadius: '50%',
                  backgroundImage: 'linear-gradient(to bottom right, #00dc6e, #00b856)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 24px rgba(0,220,110,0.5)'
                }}>
                  <Check size={22} strokeWidth={2.5} color="#000000" />
                </div>
                <div>
                  <p style={{
                    fontFamily: 'orbitron',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#6dffa0',
                    marginBottom: '0.25rem'
                  }}>
                    {t('notation_vote_success')}
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(109,255,160,0.6)',
                    letterSpacing: '0.8px'
                  }}>
                    {t('notation_saved_message')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Video modal ── */}
      {showVideoModal && embedUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1100px',
              aspectRatio: '16/9',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: currentMode === 'light'
                ? '0 0 0 1px rgba(124, 58, 237, 0.4), 0 40px 100px rgba(124, 58, 237, 0.2), 0 0 80px rgba(124, 58, 237, 0.15)'
                : '0 0 0 1px rgba(123,47,255,0.4), 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(123,47,255,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              style={{
                position: 'absolute',
                top: '-52px',
                right: 0,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundImage: 'linear-gradient(to bottom right, #7b2fff, #e040fb)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 0 20px rgba(123,47,255,0.5)',
                zIndex: 51
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              <X size={18} />
            </button>
            <iframe
              src={embedUrl}
              title={film.title_original}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes njPop {
          0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg);  opacity: 1; }
        }
        @keyframes njSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </>
  );
}