import React, { useState, useEffect } from "react";
import { 
  Star, Award, Linkedin, Twitter, 
  Info, X, Cpu, Sparkles, MessageSquare 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig.js";

const JuryPage = () => {
  const navigate = useNavigate();
  const [juryList, setJuryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Tous");
  const [selectedJury, setSelectedJury] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // --- CONFIGURATION PRÉSIDENT (DONNÉES EN DUR) ---
  const PRESIDENT_BIO = "Visionnaire et pionnier de l'industrie, le Président supervise l'intégrité artistique du Mars AI Festival. Son rôle est de garantir que l'innovation technologique serve l'expression humaine la plus pure.";
  const PRESIDENT_LINKS = {
    linkedin: "https://linkedin.com/in/president",
    twitter: "https://twitter.com/president"
  };

  useEffect(() => {
    const fetchJury = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/jury/all');
        setJuryList(response.data.juryMembers || []);
      } catch (err) {
        setError('Impossible de charger les jurys');
      } finally {
        setLoading(false);
        setIsVisible(true);
      }
    };
    fetchJury();
  }, []);

  // LOGIQUE DE TRI :
  // On isole l'admin pour la section du haut
  const presidentData = juryList.find(u => u.role === 'admin');
  // On isole les jurys pour la grille du bas
  const juryMembers = juryList.filter(u => u.role === 'jury');

  const filteredJury = filter === "Tous" 
    ? juryMembers 
    : juryMembers.filter(j => j.specialite === filter);

  const getAvatarUrl = (user) => {
    if (user.avatar_url) return user.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random&color=fff&size=400`;
  };

  if (loading) return <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-white font-black italic uppercase tracking-widest">Initialisation du flux...</div>;

  return (
    <div className="min-h-screen pb-20 bg-[var(--color-bg)] text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="container-mars pt-16 pb-8 text-center">
        <div className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
          <h1 className="font-[var(--font-family-title)] text-4xl md:text-6xl font-bold italic mb-4 uppercase tracking-tighter">
            Le <span className="text-[var(--color-primary)]">Grand</span> Jury
          </h1>
          <div className="h-1 w-24 bg-[var(--gradient-brand)] mx-auto mb-10 rounded-full" />
        </div>
      </section>

      {/* --- SECTION PRÉSIDENT (CARTE GÉANTE) --- */}
      {presidentData && (
        <section className="container-mars mb-24">
          <div className={`mars-reveal ${isVisible ? "is-visible" : ""} flex flex-col items-center`}>
            {/* Badge Président */}
            <div className="mars-cta px-6 py-2 rounded-full flex items-center gap-3 text-[10px] font-black tracking-[0.3em] mb-8 animate-pulse border border-white/20 uppercase">
              <Star size={16} fill="currentColor" className="text-[var(--color-primary)]" /> 
              Présidence Permanente
            </div>

            {/* Grande Carte */}
            <div className="relative w-full max-w-5xl bg-[var(--color-surface)] rounded-[80px] border border-[var(--color-primary)]/30 overflow-hidden shadow-[0_0_60px_rgba(34,211,238,0.1)]">
              <div className="flex flex-col md:row items-center">
                <div className="w-full md:w-2/5 h-[450px]">
                  <img src={getAvatarUrl(presidentData)} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt={presidentData.full_name} />
                </div>
                <div className="p-12 md:w-3/5">
                  <h2 className="text-5xl font-black uppercase italic mb-2 tracking-tighter">{presidentData.full_name}</h2>
                  <p className="text-[var(--color-primary)] font-black tracking-[0.4em] text-xs mb-6 uppercase">Organisateur & Super Admin</p>
                  
                  {/* Bio en dur comme demandé */}
                  <p className="text-white/60 italic mb-8 leading-relaxed text-lg font-light">
                    "{PRESIDENT_BIO}"
                  </p>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <button onClick={() => setSelectedJury({...presidentData, bio: PRESIDENT_BIO})} className="mars-btn px-8 py-3 rounded-full flex items-center gap-2 text-[10px] font-black uppercase">
                      <Info size={16} /> Fiche Complète
                    </button>
                    <button onClick={() => navigate('/contact')} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-full flex items-center gap-2 text-[10px] font-black uppercase border border-white/10 transition-all">
                      <MessageSquare size={16} /> Lui écrire directement
                    </button>
                    
                    {/* Réseaux uniquement pour le président */}
                    <div className="flex items-center gap-6 ml-auto px-6 border-l border-white/10">
                        <a href={PRESIDENT_LINKS.linkedin} className="hover:text-[var(--color-primary)] transition-colors"><Linkedin size={24} /></a>
                        <a href={PRESIDENT_LINKS.twitter} className="hover:text-[var(--color-primary)] transition-colors"><Twitter size={24} /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- FILTRES --- */}
      <section className="container-mars mb-12 flex justify-center">
        <div className="flex flex-wrap gap-3">
          {["Tous", "Cinéma", "IA", "Design"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`mars-btn px-6 py-2 text-[10px] font-black uppercase tracking-widest ${filter === cat ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "opacity-40"}`}>{cat}</button>
          ))}
        </div>
      </section>

      {/* --- GRILLE JURY MEMBERS --- */}
      <section className="container-mars">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredJury.map((user) => (
            <div key={user.id} className="mars-reveal is-visible">
              <div className="mars-btn relative overflow-hidden rounded-[60px] border border-white/10 bg-[var(--color-surface)] group transition-all duration-500 hover:border-[var(--color-primary)]">
                <div className="p-4">
                  <div className="relative h-72 w-full overflow-hidden rounded-[50px]">
                    <img src={getAvatarUrl(user)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-70 group-hover:opacity-100" alt="" />
                    
                    {/* HOVER : Affichage de la spécialité */}
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 text-center">
                       <Cpu size={30} className="mb-4 text-[var(--color-primary)]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Expertise Festival</span>
                       <p className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider">{user.specialite || "Spécialiste IA"}</p>
                    </div>
                  </div>
                </div>

                <div className="px-10 pb-10 text-left">
                  <h3 className="text-xl font-bold uppercase italic text-white">{user.full_name}</h3>
                  <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest mt-1 mb-6">Membre du Jury</p>
                  <button onClick={() => setSelectedJury(user)} className="w-full py-4 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase hover:bg-[var(--color-primary)] hover:text-black transition-all">Détails Jury</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODALE COMMUNE --- */}
      {selectedJury && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[50px] overflow-hidden">
            <button onClick={() => setSelectedJury(null)} className="absolute top-8 right-8 z-20 p-4 bg-white/5 rounded-full hover:bg-red-500/20 transition-all text-white"><X size={24} /></button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={getAvatarUrl(selectedJury)} className="h-[400px] md:h-[600px] w-full object-cover" alt="" />
              <div className="p-12 flex flex-col justify-center text-left">
                <Sparkles className="text-[var(--color-secondary)] mb-4" />
                <h2 className="text-5xl font-bold italic uppercase mb-2 leading-none text-white">{selectedJury.full_name}</h2>
                <p className="text-[var(--color-primary)] font-bold text-sm mb-8 tracking-widest uppercase">{selectedJury.specialite || "Expert Mars Festival"}</p>
                
                {/* Affiche la bio si elle existe (pour le président) ou un texte par défaut pour les jurés */}
                <p className="text-white/70 leading-relaxed mb-8">
                  {selectedJury.bio || "Ce membre du jury apporte son expertise unique pour évaluer les créations les plus innovantes de la compétition."}
                </p>
                
                <button onClick={() => setSelectedJury(null)} className="mars-cta py-5 w-full rounded-full font-black uppercase tracking-widest text-[10px]">Retour au Festival</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JuryPage;