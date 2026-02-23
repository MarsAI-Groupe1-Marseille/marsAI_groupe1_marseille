import React, { useEffect, useState, useRef } from "react";
import {
  Film, MessageSquare, Check, X,
  Trophy, Award, Plus, Search,
  ThumbsUp, AlertCircle
} from "lucide-react";
import axios from "../config/axiosConfig";

/* ─── COMPOSANTS UTILITAIRES ─── */
function Avatar({ initials, size = "md" }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm" };
  const colors = { MC: "from-violet-500 to-purple-700", PR: "from-blue-500 to-blue-700", LS: "from-emerald-500 to-teal-700", HB: "from-amber-500 to-orange-700", CV: "from-rose-500 to-pink-700" };
  const grad = colors[initials] || "from-neutral-500 to-neutral-700";
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

function VoteBadge({ status }) {
  const normalized = status || "";
  const labels = {
    LIKE: "Like",
    DISCUSS: "A discuter",
    DISLIKE: "Dislike"
  };
  const styles = {
    LIKE: "bg-emerald-950/60 border-emerald-600 text-emerald-400",
    DISCUSS: "bg-amber-950/60 border-amber-600 text-amber-400",
    DISLIKE: "bg-rose-950/60 border-rose-600 text-rose-400"
  };
  const label = labels[normalized] || "Vote";
  const style = styles[normalized] || "bg-neutral-900 border-neutral-700 text-neutral-400";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${style}`}>
      {label}
    </span>
  );
}

/* ─── HELPER: COMPTER LES VOTES PAR STATUS ─── */
function countVotesByStatus(evaluations, status) {
  return (evaluations || []).filter(e => e.vote_status === status).length;
}

/* ─── MODAL VOTES ─── */
function VotesModal({ film, voteStatus, onClose }) {
  if (!film || !voteStatus) return null;
  const evaluations = (film.comments || []).filter(c => c.vote_status === voteStatus);
  const statusLabel = voteStatus === 'LIKE' ? 'Likes' : 'À discuter';
  const statusColor = voteStatus === 'LIKE' ? 'emerald' : 'amber';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-900">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {voteStatus === 'LIKE' ? <ThumbsUp size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-amber-400" />}
                <span className={`text-xs font-bold uppercase tracking-widest text-${statusColor}-400`}>{statusLabel} du Jury</span>
              </div>
              <h2 className="text-xl font-black text-white">{film.titre}</h2>
              <p className="text-sm text-neutral-400 mt-0.5">{film.real}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition text-neutral-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
          {evaluations.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              {voteStatus === 'LIKE' ? <ThumbsUp size={32} className="mx-auto mb-3 opacity-30" /> : <AlertCircle size={32} className="mx-auto mb-3 opacity-30" />}
              <p className="text-sm">Aucun {statusLabel.toLowerCase()} pour ce film</p>
            </div>
          ) : evaluations.map((c, idx) => (
            <div key={idx} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 hover:border-neutral-600 transition">
              <div className="flex items-start gap-3">
                <Avatar initials={c.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{c.jury}</span>
                    <span className="text-xs text-neutral-500 flex-shrink-0">{c.date}</span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">{c.text || "(Pas de commentaire)"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL COMMENTAIRES ─── */
function CommentsModal({ film, onClose }) {
  if (!film) return null;
  const voteCounts = film.comments.reduce((acc, c) => {
    const status = c.vote_status || "";
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += 1;
    return acc;
  }, { LIKE: 0, DISCUSS: 0, DISLIKE: 0 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-neutral-800 bg-gradient-to-r from-violet-950/60 to-neutral-900">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-violet-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Avis du Jury</span>
              </div>
              <h2 className="text-xl font-black text-white">{film.titre}</h2>
              <p className="text-sm text-neutral-400 mt-0.5">{film.real}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition text-neutral-500 hover:text-white">
                <X size={18} />
              </button>
              {film.comments.length > 0 && (
                <div className="text-right">
                  <div className="text-xs text-neutral-500">{film.comments.length} avis</div>
                  <div className="mt-2 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    <span>Like: {voteCounts.LIKE}</span>
                    <span>A discuter: {voteCounts.DISCUSS}</span>
                    <span>Dislike: {voteCounts.DISLIKE}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
          {film.comments.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun commentaire pour ce film</p>
            </div>
          ) : film.comments.map((c, idx) => (
            <div key={idx} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 hover:border-neutral-600 transition">
              <div className="flex items-start gap-3">
                <Avatar initials={c.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-white">{c.jury}</span>
                    <span className="text-xs text-neutral-500 flex-shrink-0">{c.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VoteBadge status={c.vote_status} />
                  </div>
                  <p className="text-sm text-neutral-300 mt-2 leading-relaxed">{c.text || "(Pas de commentaire)"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── GRAPHE SÉLECTION ─── */
function SelectionChart({ films }) {
  const selected = films.filter(f => f.selected).length;
  const total = films.length;
  const pct = Math.round((selected / total) * 100);
  const circumference = 2 * Math.PI * 52;
  const dash = (selected / total) * circumference;

  const byTag = {};
  films.filter(f => f.selected).forEach(f => {
    if (!f.tags) return;
    f.tags.split(",").forEach(t => {
      const tag = t.trim();
      if (!tag) return;
      byTag[tag] = (byTag[tag] || 0) + 1;
    });
  });
  const tagEntries = Object.entries(byTag).slice(0, 5);
  const maxTag = Math.max(...tagEntries.map(([,v]) => v), 1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="-rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#262626" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#violet-grad)" strokeWidth="10"
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <defs>
              <linearGradient id="violet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{selected}</span>
            <span className="text-xs text-neutral-500">/{total}</span>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">Films Sélectionnés</div>
          <div className="text-4xl font-black text-white">{pct}<span className="text-xl text-neutral-500">%</span></div>
          <div className="text-sm text-neutral-400 mt-1">de la sélection officielle</div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              Sélectionné ({selected})
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-neutral-700" />
              En attente ({total - selected})
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">Genres sélectionnés</div>
        <div className="space-y-3">
          {tagEntries.map(([tag, count]) => (
            <div key={tag}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-semibold truncate">{tag}</span>
                <span className="text-neutral-500 flex-shrink-0 ml-2">{count} film{count > 1 ? "s" : ""}</span>
              </div>
              <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
                  style={{ width: `${(count / maxTag) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {tagEntries.length === 0 && (
            <p className="text-sm text-neutral-500">Aucun film sélectionné</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── COMPOSANT PRINCIPAL ─── */
export default function SelectFinaliste() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSelected, setFilterSelected] = useState("all");
  const [commentFilm, setCommentFilm] = useState(null);
  const [voteFilm, setVoteFilm] = useState({ film: null, status: null });
  const [editingPrize, setEditingPrize] = useState(null);
  const [prizeInput, setPrizeInput] = useState("");
  const [toast, setToast] = useState({ visible: false, msg: "", color: "#8b5cf6" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const toastTimer = useRef(null);
  const limit = 12;

  useEffect(() => {
    let isMounted = true;

    const fetchFinalists = async () => {
      setLoading(true);
      setApiError("");

      try {
        const params = {
          page,
          limit,
          vote: "liked_or_discuss",
          includeSelected: "true"
        };

        if (filterSelected === "liked") {
          params.vote = "liked";
        } else if (filterSelected === "toDiscuss") {
          params.vote = "discuss";
        } else if (filterSelected === "selected") {
          params.selectedOnly = "true";
        }

        const response = await axios.get("/admin/finalists", { params });

        if (!isMounted) return;
        const payload = response.data || {};
        setFilms((payload.data || []).map(mapApiFilm));
        setTotalPages(payload.totalPages || 1);
      } catch (error) {
        if (!isMounted) return;
        setApiError("Impossible de charger les finalistes pour le moment.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFinalists();

    return () => {
      isMounted = false;
    };
  }, [page, filterSelected]);

  const showToast = (msg, color = "#8b5cf6") => {
    clearTimeout(toastTimer.current);
    setToast({ visible: true, msg, color });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const toggleSelected = async (id) => {
    const film = films.find(f => f.id === id);
    if (!film) return;

    const nowSelected = !film.selected;

    try {
      await axios.put(`/admin/finalists/${id}`, {
        is_selected: nowSelected,
        award_winner: nowSelected ? film.prize : null
      });

      setFilms(prev => prev.map(f => {
        if (f.id !== id) return f;
        if (!nowSelected) {
          showToast("Film retiré de la sélection", "#f05a5a");
          return { ...f, selected: false, prize: "" };
        }
        setEditingPrize(id);
        setPrizeInput("");
        showToast("Film sélectionné !", "#2ac98e");
        return { ...f, selected: true };
      }));
    } catch (error) {
      console.error("Erreur mise à jour sélection:", error);
      showToast("Erreur lors de la mise à jour", "#f05a5a");
    }
  };

  const savePrize = async (id) => {
    try {
      await axios.put(`/admin/finalists/${id}`, {
        award_winner: prizeInput || null
      });

      setFilms(prev => prev.map(f => f.id === id ? { ...f, prize: prizeInput } : f));
      setEditingPrize(null);
      showToast(prizeInput ? `Prix attribué : ${prizeInput}` : "Film sélectionné sans prix", "#2ac98e");
    } catch (error) {
      console.error("Erreur mise à jour prix:", error);
      showToast("Erreur lors de la sauvegarde du prix", "#f05a5a");
    }
  };

  const filtered = films.filter(f => {
    const matchSearch = f.titre.toLowerCase().includes(search.toLowerCase()) ||
                        f.real.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const selectedCount = films.filter(f => f.selected).length;
  const likedCount = films.filter(f => f.liked).length;
  const toDiscussCount = films.filter(f => f.toDiscuss).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-violet-600 p-2 rounded-lg">
              <Film size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs text-violet-400 font-bold uppercase tracking-widest">Festival Admin</div>
              <h1 className="text-lg font-black text-white leading-none">Selection Finale</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-violet-950/60 border border-violet-800/50 rounded-full px-4 py-2">
              <Trophy size={14} className="text-violet-400" />
              <span className="text-sm font-bold text-violet-300">{selectedCount} film{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Film, label: "Total soumis", value: films.length, color: "text-blue-400", bg: "bg-blue-950/40 border-blue-800/40" },
            { icon: Check, label: "Sélectionnés", value: selectedCount, color: "text-violet-400", bg: "bg-violet-950/40 border-violet-800/40" },
            { icon: Award, label: "Prix attribués", value: films.filter(f => f.prize).length, color: "text-amber-400", bg: "bg-amber-950/40 border-amber-800/40" },
            { icon: MessageSquare, label: "Commentaires", value: films.reduce((s, f) => s + f.comments.length, 0), color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-800/40" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`rounded-xl border p-4 ${bg}`}>
              <Icon size={18} className={`${color} mb-2`} />
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <SelectionChart films={films} />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un film ou un réalisateur..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-violet-600 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Tous */}
            <button
              onClick={() => { setFilterSelected("all"); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                filterSelected === "all"
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Tous
            </button>

            {/* Sélectionnés */}
            <button
              onClick={() => { setFilterSelected("selected"); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                filterSelected === "selected"
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Sélectionnés
            </button>

            {/* Like */}
            <button
              onClick={() => { setFilterSelected("liked"); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                filterSelected === "liked"
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-800"
              }`}
            >
              <ThumbsUp size={13} />
              Like
              {likedCount > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${filterSelected === "liked" ? "bg-emerald-500 text-white" : "bg-emerald-950 text-emerald-400"}`}>
                  {likedCount}
                </span>
              )}
            </button>

            {/* À discuter */}
            <button
              onClick={() => { setFilterSelected("toDiscuss"); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                filterSelected === "toDiscuss"
                  ? "bg-amber-600 border-amber-500 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-800"
              }`}
            >
              <AlertCircle size={13} />
              À discuter
              {toDiscussCount > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${filterSelected === "toDiscuss" ? "bg-amber-500 text-white" : "bg-amber-950 text-amber-400"}`}>
                  {toDiscussCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[64px_1fr_1fr_160px_1fr_auto] gap-0">
            {/* Header */}
            {["", "Film", "Réalisateur", "Statut", "Prix", "Actions"].map(h => (
              <div key={h} className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 bg-neutral-950/50">
                {h}
              </div>
            ))}

            {/* Rows */}
            {filtered.map(f => (
              <React.Fragment key={f.id}>
                {/* Poster */}
                <div className="px-3 py-3 border-b border-neutral-800/60 flex items-center">
                  <div className="w-10 h-14 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    {f.posterUrl ? (
                      <img src={f.posterUrl} alt={f.titre} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600"><Film size={16} /></div>
                    )}
                  </div>
                </div>

                {/* Titre */}
                <div className="px-4 py-3 border-b border-neutral-800/60 flex flex-col justify-center">
                  <div className="font-bold text-sm text-white">{f.titre}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(f.tags ? f.tags.split(",") : []).slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                {/* Réalisateur */}
                <div className="px-4 py-3 border-b border-neutral-800/60 flex items-center text-sm text-neutral-300 font-medium">
                  {f.real}
                </div>

                {/* Statut + Toggle */}
                <div className="px-4 py-3 border-b border-neutral-800/60 flex items-center gap-3">
                  <button
                    onClick={() => toggleSelected(f.id)}
                    className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                      f.selected ? "bg-violet-600" : "bg-neutral-700"
                    }`}
                  >
                    <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 mt-1 ${
                      f.selected ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <span className={`text-xs font-bold uppercase tracking-wider ${f.selected ? "text-violet-400" : "text-neutral-600"}`}>
                    {f.selected ? "Sélectionné" : "—"}
                  </span>
                </div>

                {/* Prix */}
                <div className="px-4 py-3 border-b border-neutral-800/60 flex items-center">
                  {editingPrize === f.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        autoFocus
                        value={prizeInput}
                        onChange={e => setPrizeInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") savePrize(f.id); if (e.key === "Escape") setEditingPrize(null); }}
                        placeholder="Ex: Grand Prix..."
                        className="flex-1 bg-neutral-800 border border-violet-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                      />
                      <button onClick={() => savePrize(f.id)} className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg transition">
                        <Check size={14} className="text-white" />
                      </button>
                      <button onClick={() => { setEditingPrize(null); if (!f.prize) setFilms(p => p.map(x => x.id === f.id ? { ...x, selected: false } : x)); }} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition">
                        <X size={14} className="text-neutral-400" />
                      </button>
                    </div>
                  ) : f.selected ? (
                    <button
                      onClick={() => { setEditingPrize(f.id); setPrizeInput(f.prize); }}
                      className="flex items-center gap-2 group"
                    >
                      {f.prize ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full group-hover:border-amber-600 transition">
                          <Trophy size={12} /> {f.prize}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-violet-400 transition">
                          <Plus size={12} /> Attribuer un prix
                        </span>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-700">—</span>
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-b border-neutral-800/60 flex items-center gap-2">
                  {/* Bouton commentaires */}
                  <button
                    onClick={() => setCommentFilm(f)}
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-violet-400 hover:border-violet-600 transition"
                    title="Voir les commentaires jury"
                  >
                    <MessageSquare size={15} />
                    {f.comments.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
                        {f.comments.length}
                      </span>
                    )}
                  </button>

                  {/* Bouton Like */}
                  <button
                    onClick={() => setVoteFilm({ film: f, status: 'LIKE' })}
                    title="Voir les likes"
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-600 transition"
                  >
                    <ThumbsUp size={15} />
                    {countVotesByStatus(f.comments, 'LIKE') > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                        {countVotesByStatus(f.comments, 'LIKE')}
                      </span>
                    )}
                  </button>

                  {/* Bouton À discuter */}
                  <button
                    onClick={() => setVoteFilm({ film: f, status: 'DISCUSS' })}
                    title="Voir les à discuter"
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-600 transition"
                  >
                    <AlertCircle size={15} />
                    {countVotesByStatus(f.comments, 'DISCUSS') > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center">
                        {countVotesByStatus(f.comments, 'DISCUSS')}
                      </span>
                    )}
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* MOBILE VIEW */}
          <div className="sm:hidden divide-y divide-neutral-800">
            {filtered.map(f => (
              <div key={f.id} className="p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                    {f.posterUrl ? (
                      <img src={f.posterUrl} alt={f.titre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600"><Film size={16} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-white truncate">{f.titre}</div>
                    <div className="text-xs text-neutral-400">{f.real}</div>
                    {f.selected && f.prize && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 mt-1">
                        <Trophy size={10} /> {f.prize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleSelected(f.id)}
                      className={`relative inline-flex w-10 h-5 rounded-full transition-colors flex-shrink-0 ${f.selected ? "bg-violet-600" : "bg-neutral-700"}`}
                    >
                      <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transform transition-transform mt-[3px] ${f.selected ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setCommentFilm(f)}
                        className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-violet-400 transition"
                      >
                        <MessageSquare size={14} />
                        {f.comments.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
                            {f.comments.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setVoteFilm({ film: f, status: 'LIKE' })}
                        className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-600 transition"
                      >
                        <ThumbsUp size={13} />
                        {countVotesByStatus(f.comments, 'LIKE') > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                            {countVotesByStatus(f.comments, 'LIKE')}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => setVoteFilm({ film: f, status: 'DISCUSS' })}
                        className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-600 transition"
                      >
                        <AlertCircle size={13} />
                        {countVotesByStatus(f.comments, 'DISCUSS') > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center">
                            {countVotesByStatus(f.comments, 'DISCUSS')}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {f.selected && (
                  <div className="mt-3">
                    {editingPrize === f.id ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={prizeInput}
                          onChange={e => setPrizeInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") savePrize(f.id); }}
                          placeholder="Nom du prix..."
                          className="flex-1 bg-neutral-800 border border-violet-600 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                        />
                        <button onClick={() => savePrize(f.id)} className="p-1.5 bg-violet-600 rounded-lg">
                          <Check size={14} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingPrize(f.id); setPrizeInput(f.prize); }} className="w-full text-left">
                        {f.prize ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
                            <Trophy size={11} /> {f.prize}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Plus size={11} /> Attribuer un prix
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <div className="text-center py-10 text-neutral-500">
              Chargement des finalistes...
            </div>
          )}

          {apiError && !loading && (
            <div className="text-center py-10 text-rose-400">
              {apiError}
            </div>
          )}

          {filtered.length === 0 && !loading && !apiError && (
            <div className="text-center py-16 text-neutral-500">
              <Film size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun film trouvé</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Page precedente
          </button>
          <div className="text-xs text-neutral-500">
            Page {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Page suivante
          </button>
        </div>

      </div>

      {/* Modal commentaires */}
      {commentFilm && <CommentsModal film={commentFilm} onClose={() => setCommentFilm(null)} />}

      {/* Modal votes */}
      {voteFilm.film && (
        <VotesModal
          film={voteFilm.film}
          voteStatus={voteFilm.status}
          onClose={() => setVoteFilm({ film: null, status: null })}
        />
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900 border border-neutral-700 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: toast.color }} />
        {toast.msg}
      </div>
    </div>
  );
}

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR");
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("") || "??";
};

const mapApiFilm = (item) => {
  const comments = (item.evaluations || []).map((evaluation) => {
    const juryName = evaluation.user?.full_name || "Jury";
    return {
      jury: juryName,
      avatar: getInitials(juryName),
      vote_status: evaluation.vote_status,
      text: evaluation.comment || "",
      date: formatDate(evaluation.created_at)
    };
  });

  return {
    id: item.id,
    titre: item.title_original,
    real: item.director?.full_name || "—",
    date: formatDate(item.created_at),
    selected: !!item.is_selected,
    prize: item.award_winner || "",
    liked: (item.vote_stats?.like || 0) > 0,
    toDiscuss: (item.vote_stats?.discuss || 0) > 0,
    posterUrl: item.poster_url,
    synopsis: item.synopsis_original,
    tags: item.theme_tags || "",
    comments
  };
};