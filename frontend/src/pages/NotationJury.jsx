import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
import { useLanguage } from "../context/LanguageContext.jsx";
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
const Stars = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {Array.from({ length: 60 }).map((_, i) => (
      <span
        key={i}
        className="absolute w-px h-px rounded-full bg-white animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.6 + 0.2,
          animationDuration: `${2 + Math.random() * 4}s`,
          animationDelay: `${Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// ─── InfoCard ─────────────────────────────────────────────────────────────────
const InfoCard = ({ icon: Icon, iconColor, label, children, className = "" }) => (
  <div className={`group bg-[rgba(15,12,30,0.85)] border border-[rgba(123,47,255,0.25)] rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-[rgba(123,47,255,0.45)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 flex-shrink-0 rounded-[10px] bg-[rgba(123,47,255,0.2)] border border-[rgba(123,47,255,0.3)] flex items-center justify-center transition-all duration-300 group-hover:bg-[rgba(123,47,255,0.35)] group-hover:border-[rgba(123,47,255,0.6)]">
        <Icon size={16} color={iconColor} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-orbitron text-[10px] font-bold tracking-[3px] uppercase text-[#9b8ec4] mb-1.5">
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
const SynopsisTranslateBtn = ({ lang, onToggle, hasTranslation }) => {
  if (!hasTranslation) return null;

  const isFr = lang === "fr";

  return (
    <button
      onClick={onToggle}
      aria-label={isFr ? "Voir le synopsis en anglais" : "Voir le synopsis en français"}
      className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 overflow-hidden
        border-[rgba(0,229,255,0.35)] text-[#80d8ff]
        hover:border-[rgba(0,229,255,0.7)] hover:text-[#c0eeff]
        hover:shadow-[0_0_18px_rgba(0,229,255,0.25),inset_0_0_12px_rgba(0,229,255,0.06)]
        focus:outline-none focus:ring-2 focus:ring-[rgba(0,229,255,0.4)]"
    >
      {/* Shimmer sweep on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 pointer-events-none" />

      {/* Globe icon — tourne légèrement au hover */}
      <Globe
        size={12}
        className="flex-shrink-0 transition-transform duration-500 group-hover:rotate-[20deg]"
      />

      {/* Langue active (badge pill) */}
      <span className="font-orbitron text-[9px] font-bold tracking-[2px] uppercase opacity-50">
        {isFr ? "EN" : "FR"}
      </span>

      {/* Séparateur */}
      <span className="text-[rgba(0,229,255,0.3)] text-[10px] select-none">→</span>

      {/* Langue cible */}
      <span className="font-orbitron text-[9px] font-bold tracking-[2px] uppercase">
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
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center font-rajdhani"
        style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,47,255,0.3) 0%, transparent 60%)" }}>
        <Stars />
        <div className="text-center relative z-10">
          <div className="w-14 h-14 border-[3px] border-[rgba(123,47,255,0.2)] border-t-[#7b2fff] rounded-full animate-spin mx-auto mb-5" />
          <p className="font-orbitron text-[11px] tracking-[4px] uppercase text-[#9b8ec4]">
            {t('notation_loading')}
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !film) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center font-rajdhani">
        <Stars />
        <div className="text-center relative z-10">
          <p className="text-[#ff8090] text-lg mb-6">{error || "Film introuvable"}</p>
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[rgba(123,47,255,0.15)] border border-[rgba(123,47,255,0.25)] rounded-full font-rajdhani text-sm font-semibold tracking-[1px] uppercase text-[#9b8ec4] cursor-pointer transition-all duration-300 hover:border-[#7b2fff] hover:text-[#f0eaff] hover:bg-[rgba(123,47,255,0.25)] hover:shadow-[0_0_20px_rgba(123,47,255,0.3)]">
            {t('notation_back')}
          </button>
        </div>
      </div>
    );
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || "https://localhost:3000";
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
    <div
      className="min-h-screen bg-[#0a0a12] text-[#f0eaff] font-rajdhani"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,47,255,0.3) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 90% 90%, rgba(224,64,251,0.15) 0%, transparent 50%),
          repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(123,47,255,0.03) 60px, rgba(123,47,255,0.03) 61px),
          repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(123,47,255,0.03) 60px, rgba(123,47,255,0.03) 61px)
        `,
      }}
    >
      <Stars />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-10">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-[rgba(123,47,255,0.15)] border border-[rgba(123,47,255,0.25)] rounded-full font-rajdhani text-sm font-semibold tracking-[1px] uppercase text-[#9b8ec4] cursor-pointer transition-all duration-300 hover:border-[#7b2fff] hover:text-[#f0eaff] hover:bg-[rgba(123,47,255,0.25)] hover:shadow-[0_0_20px_rgba(123,47,255,0.3)]"
        >
          <ChevronLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          {t('notation_back_selection')}
        </button>

        {/* ── Main 2-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 mb-10">

          {/* ── LEFT: poster + themes ── */}
          <div className="flex flex-col gap-4">

            {/* Poster */}
            <div
              onClick={() => embedUrl && setShowVideoModal(true)}
              className={`relative group rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(123,47,255,0.3),0_20px_60px_rgba(0,0,0,0.7),0_0_80px_rgba(123,47,255,0.2)] transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(123,47,255,0.6),0_20px_80px_rgba(0,0,0,0.8),0_0_120px_rgba(123,47,255,0.4)] ${embedUrl ? "cursor-pointer" : ""}`}
            >
              <img
                src={resolveAssetUrl(film.poster_url)}
                alt={film.title_original}
                className="w-full aspect-[2/3] object-cover block transition-transform duration-700 group-hover:scale-[1.04]"
              />

              {embedUrl && (
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,18,0.95)] via-[rgba(10,10,18,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                  <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#7b2fff] to-[#e040fb] flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_40px_rgba(123,47,255,0.7),0_0_80px_rgba(224,64,251,0.4)] mb-3">
                    <Play size={28} color="#fff" fill="#fff" />
                  </div>
                  <span className="font-rajdhani font-bold text-[13px] tracking-[2px] uppercase text-white">
                    {t('notation_watch_film')}
                  </span>
                </div>
              )}

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-[rgba(10,10,18,0.85)] border border-[rgba(123,47,255,0.4)] rounded-full px-3 py-1 font-rajdhani text-xs font-semibold tracking-[1px] text-[#9b8ec4] backdrop-blur-sm">
                <Clock size={10} />
                {duration}
              </div>
            </div>

            {/* Themes */}
            {themes.length > 0 && (
              <div className="bg-[rgba(15,12,30,0.85)] border border-[rgba(123,47,255,0.25)] rounded-xl p-[18px] backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={12} color="#9b8ec4" />
                  <span className="font-orbitron text-[10px] font-bold tracking-[3px] uppercase text-[#9b8ec4]">
                    {t('notation_themes')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {themes.map((theme, idx) => (
                    <span
                      key={idx}
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-[1px] uppercase transition-all duration-300 ${TAG_COLORS[idx % 4]}`}
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
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[rgba(123,47,255,0.3)] to-[rgba(224,64,251,0.2)] border border-[rgba(123,47,255,0.5)] mb-4">
                <FilmIcon size={9} color="#c39fff" />
                <span className="font-orbitron text-[9px] font-bold tracking-[2px] uppercase text-[#c39fff]">
                  {t('notation_official_selection')}
                </span>
              </div>

              <h1
                className="font-orbitron font-black text-white leading-tight mb-2"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  letterSpacing: "-0.5px",
                  textShadow: "0 0 40px rgba(123,47,255,0.8), 0 0 80px rgba(123,47,255,0.4)",
                }}
              >
                {film.title_original}
              </h1>

              {film.title_english && film.title_english !== film.title_original && (
                <p className="font-rajdhani text-[1.1rem] font-light italic tracking-[1px] text-[#9b8ec4]">
                  {film.title_english}
                </p>
              )}

              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(123,47,255,0.5)] to-transparent mt-2 mb-6" />
            </div>

            {/* ── Synopsis — CORRIGÉ ── */}
            <div className="bg-[rgba(15,12,30,0.85)] border border-[rgba(123,47,255,0.25)] rounded-xl p-6 backdrop-blur-sm">

              {/* Header row */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <FilmIcon size={12} color="#7b2fff" />
                  <span className="font-orbitron text-[11px] font-bold tracking-[3px] uppercase text-[#7b2fff]">
                    {t('notation_synopsis')}
                  </span>
                  {/* Indicateur de langue active */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(123,47,255,0.15)] border border-[rgba(123,47,255,0.25)]">
                    <span className="font-orbitron text-[8px] font-bold tracking-[2px] uppercase text-[#9b8ec4]">
                      {synopsisLang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
                    </span>
                  </span>
                </div>

                {/* Bouton de traduction — corrigé */}
                <SynopsisTranslateBtn
                  lang={synopsisLang}
                  onToggle={() => setSynopsisLang((prev) => (prev === "fr" ? "en" : "fr"))}
                  hasTranslation={hasTranslation}
                />
              </div>

              {/* Texte du synopsis avec transition */}
              <p
                key={synopsisLang}
                className="font-rajdhani text-base font-normal leading-[1.75] text-[#c8bde8]"
                style={{ animation: "njSlideDown 0.28s ease both" }}
              >
                {synopsisText}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {directorName && (
                <InfoCard icon={User} iconColor="#7b2fff" label={t('notation_director')}>
                  <p className="font-rajdhani text-[17px] font-semibold text-[#f0eaff]">{directorName}</p>
                </InfoCard>
              )}

              <InfoCard icon={Clock} iconColor="#00e5ff" label={t('notation_duration')}>
                <p className="font-rajdhani text-[17px] font-semibold text-[#f0eaff]">{duration}</p>
              </InfoCard>

              {directorEmail && (
                <InfoCard icon={Mail} iconColor="#e040fb" label={t('notation_contact')}>
                  <a
                    href={`mailto:${directorEmail}`}
                    className="block font-rajdhani text-sm font-semibold text-[#80c8ff] hover:text-[#b0d8ff] truncate transition-colors duration-200 no-underline"
                  >
                    {directorEmail}
                  </a>
                </InfoCard>
              )}

              {location && (
                <InfoCard icon={MapPin} iconColor="#ffd740" label={t('notation_location')}>
                  <p className="font-rajdhani text-[17px] font-semibold text-[#f0eaff]">{location}</p>
                </InfoCard>
              )}

              {film.production_year && (
                <InfoCard icon={Calendar} iconColor="#00e5ff" label={t('notation_production_year')} className="sm:col-span-2">
                  <p className="font-rajdhani text-[17px] font-semibold text-[#f0eaff]">{film.production_year}</p>
                </InfoCard>
              )}
            </div>
          </div>
        </div>

        {/* ── Rating section ── */}
        <div className="relative bg-[rgba(15,12,30,0.85)] border border-[rgba(123,47,255,0.25)] rounded-[20px] p-10 backdrop-blur-lg overflow-hidden sm:p-6">

          {/* Top chromatic bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7b2fff] via-[#e040fb] via-[#00e5ff] to-transparent" />

          <h2
            className="font-orbitron font-black text-center text-white mb-1.5 tracking-[2px]"
            style={{
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              textShadow: "0 0 30px rgba(123,47,255,0.6)",
            }}
          >
            {t('notation_your_evaluation')}
          </h2>
          <p className="font-rajdhani text-[15px] font-normal text-center tracking-[0.5px] text-[#9b8ec4] mb-9">
            {t('notation_evaluation_subtitle')}
          </p>

          {/* Vote buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            {VOTE_OPTIONS.map(({ key, Icon, selectedCls, hoverCls }) => {
              const isSelected = selectedVote === key;
              const labelKey = key === "like" ? "notation_vote_like" : key === "discuss" ? "notation_vote_discuss" : "notation_vote_dislike";
              return (
                <button
                  key={key}
                  disabled={submitted}
                  onClick={() => setSelectedVote(key)}
                  className={[
                    "relative flex flex-col items-center gap-3.5 px-4 py-7 rounded-xl",
                    "font-rajdhani text-[15px] font-bold tracking-[2px] uppercase",
                    "border bg-[rgba(10,8,22,0.7)] text-[#9b8ec4]",
                    "cursor-pointer outline-none overflow-hidden",
                    "transition-all duration-300",
                    isSelected
                      ? selectedCls
                      : `border-[rgba(123,47,255,0.2)] ${!submitted ? `${hoverCls} hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]` : ""}`,
                    submitted ? "opacity-45 cursor-not-allowed !transform-none" : "",
                  ].join(" ")}
                >
                  {/* Shimmer */}
                  {!isSelected && !submitted && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 pointer-events-none" />
                  )}

                  {/* Icon ring */}
                  <span className="w-[58px] h-[58px] rounded-full border-[1.5px] border-current flex items-center justify-center bg-white/[0.03] transition-all duration-300">
                    <Icon size={24} strokeWidth={1.8} />
                  </span>

                  {t(labelKey)}

                  {/* Check badge */}
                  {isSelected && (
                    <span
                      className="absolute top-2.5 right-2.5 w-[22px] h-[22px] rounded-full bg-current flex items-center justify-center"
                      style={{ animation: "njPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
                    >
                      <Check size={11} strokeWidth={3} className="text-[#0a0a12]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Comment */}
          {selectedVote && (
            <div className="mb-6" style={{ animation: "njSlideDown 0.3s ease both" }}>
              <label className="block font-orbitron text-[10px] font-bold tracking-[3px] uppercase text-[#9b8ec4] mb-2.5">
                {t('notation_comment')}{" "}
                {!submitted && (
                  <span className="font-rajdhani text-[13px] font-normal normal-case tracking-normal text-[rgba(155,142,196,0.45)]">
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
                className="w-full px-5 py-4 bg-[rgba(10,8,20,0.7)] border border-[rgba(123,47,255,0.25)] rounded-xl font-rajdhani text-base font-normal leading-relaxed text-[#f0eaff] placeholder:text-[rgba(155,142,196,0.5)] resize-y outline-none transition-all duration-300 focus:border-[#7b2fff] focus:shadow-[0_0_0_3px_rgba(123,47,255,0.2),0_0_20px_rgba(123,47,255,0.1)] disabled:opacity-60 disabled:cursor-not-allowed box-border"
              />
            </div>
          )}

          {/* Submit / Success */}
          {!submitted ? (
            <button
              disabled={!selectedVote || submitting}
              onClick={handleSubmitVote}
              className={[
                "w-full flex items-center justify-center gap-2.5 py-[18px] rounded-xl",
                "font-orbitron text-[13px] font-bold tracking-[2px] uppercase",
                "border-none cursor-pointer transition-all duration-300 relative overflow-hidden",
                !selectedVote || submitting
                  ? "bg-[rgba(30,25,50,0.8)] text-[rgba(155,142,196,0.35)] border border-[rgba(123,47,255,0.12)] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#7b2fff] to-[#e040fb] text-white shadow-[0_8px_32px_rgba(123,47,255,0.4),0_0_60px_rgba(224,64,251,0.2)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(123,47,255,0.6),0_0_80px_rgba(224,64,251,0.3)] active:translate-y-0",
              ].join(" ")}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
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
              className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-[rgba(0,200,100,0.12)] to-[rgba(0,180,90,0.06)] border border-[rgba(0,220,110,0.4)] rounded-xl px-6 py-[22px]"
              style={{ animation: "njSlideDown 0.35s ease both" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[#00dc6e] to-[#00b856] flex items-center justify-center shadow-[0_0_24px_rgba(0,220,110,0.5)]">
                  <Check size={22} strokeWidth={2.5} color="#0a0a12" />
                </div>
                <div>
                  <p className="font-orbitron text-[12px] font-bold tracking-[2px] uppercase text-[#6dffa0] mb-1">
                    {t('notation_vote_success')}
                  </p>
                  <p className="font-rajdhani text-[13px] text-[rgba(109,255,160,0.6)] tracking-[0.5px]">
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
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-[1100px] aspect-video rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(123,47,255,0.4),0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(123,47,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-[52px] right-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#7b2fff] to-[#e040fb] border-none flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-[0_0_20px_rgba(123,47,255,0.5)]"
            >
              <X size={18} />
            </button>
            <iframe
              src={embedUrl}
              title={film.title_original}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
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
  );
}