// pages/Jury.jsx
import React, { useState, useEffect } from "react";
import { 
  Star, Award, Linkedin, Twitter, 
  Info, X, Cpu, Sparkles, Facebook 
} from "lucide-react";

const JuryPage = ({ usersFromDB = [] }) => {
  // usersFromDB sera le tableau venant de ta requête : SELECT * FROM users WHERE role = 'jury' OR role = 'admin'
  
  const [filter, setFilter] = useState("Tous");
  const [selectedJury, setSelectedJury] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { 
    setIsVisible(true); 
  }, []);

  // On filtre pour n'afficher que ceux qui ont le rôle 'jury' ou 'admin'
  // Et on applique le filtre de catégorie si nécessaire
  const juryMembers = usersFromDB.filter(u => u.role === 'jury' || u.role === 'admin');

  const filteredJury = filter === "Tous" 
    ? juryMembers 
    : juryMembers.filter(j => j.specialite === filter);

  // Le président est celui qui a l'ID le plus bas (souvent l'admin) ou un critère spécifique
  // Ici, on cherche par exemple le premier 'admin' trouvé
  const president = juryMembers.find(u => u.role === 'admin');

  return (
    <div className="min-h-screen pb-20 bg-[var(--color-bg)]">
      
      {/* --- HERO SECTION --- */}
      <section className="container-mars pt-16 pb-8 text-center">
        <div className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
          <h1 className="font-[var(--font-family-title)] text-4xl md:text-6xl font-bold italic mb-4 uppercase tracking-tighter text-white">
            Le <span className="text-[var(--color-primary)]">Grand</span> Jury
          </h1>
          <div className="h-1 w-24 bg-[var(--gradient-brand)] mx-auto mb-10 rounded-full" />
        </div>
      </section>

      {/* --- BADGE PRÉSIDENCE ISOLÉ --- */}
      {president && (
        <div className="container-mars mb-12 flex justify-center">
          <div className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
            <div className="mars-cta px-6 py-2 rounded-full flex items-center gap-3 text-[10px] font-black tracking-[0.3em] shadow-[0_0_25px_rgba(236,72,153,0.4)] animate-pulse border border-white/20 uppercase">
              <Star size={16} fill="currentColor" /> Présidence du Festival
            </div>
          </div>
        </div>
      )}

      {/* --- FILTRES --- */}
      <section className="container-mars mb-16 flex justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          {["Tous", "Cinéma", "IA", "Design"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`mars-btn px-8 py-2 text-[10px] font-black transition-all uppercase tracking-widest ${
                filter === cat ? "border-[var(--color-primary)] bg-[var(--color-surface-2)] text-[var(--color-primary)] shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "text-white/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- GRILLE --- */}
      <section className="container-mars">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredJury.map((user) => (
            <div key={user.id} className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
              
              <div className="mars-btn mars-glow relative overflow-hidden rounded-[60px] border border-[var(--color-border)] bg-[var(--color-surface)] h-full flex flex-col group transition-all duration-500 hover:border-[var(--color-primary)] shadow-2xl">
                
                {/* Image (avatar_url) */}
                <div className="relative h-80 w-full p-4">
                  <div className="w-full h-full overflow-hidden rounded-[50px] border border-[var(--color-border-strong)] relative bg-black">
                    <img 
                      src={user.avatar_url || "https://via.placeholder.com/400x500/000000/FFFFFF?text=Mars+AI"} 
                      alt={user.full_name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Bandeau Social (Statique ici car pas de colonnes URL dans ta table actuelle) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md py-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-8 border-t border-white/10">
                       <Linkedin size={22} className="text-white/80 hover:text-[var(--color-primary)] cursor-pointer" />
                       <Twitter size={22} className="text-white/80 hover:text-[var(--color-primary)] cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Infos (full_name / specialite) */}
                <div className="px-10 pb-10 pt-2 flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-[var(--font-family-title)] text-2xl font-bold tracking-tight text-white uppercase italic">
                        {user.full_name || "Membre Anonyme"}
                      </h3>
                      <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        {user.specialite || "Expert Festival"}
                      </p>
                    </div>
                    <Award size={24} className="text-[var(--color-secondary)] opacity-40" />
                  </div>

                  {/* Bouton Details */}
                  <button 
                    onClick={() => setSelectedJury(user)}
                    className="mt-auto flex items-center justify-center gap-3 w-full py-4 rounded-full border border-[var(--color-border-strong)] bg-white/5 text-[10px] font-black text-white hover:bg-[var(--color-primary)] hover:text-black transition-all group/btn uppercase tracking-[0.2em]"
                  >
                    Détails Jury <Info size={16} className="group-hover/btn:scale-125 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MODALE --- */}
      {selectedJury && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="mars-drawer relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[50px] overflow-hidden shadow-2xl">
            
            <button 
              onClick={() => setSelectedJury(null)}
              className="absolute top-8 right-8 z-20 p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all border border-white/10"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-80 md:h-[600px]">
                <img src={selectedJury.avatar_url || "https://via.placeholder.com/400"} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]" />
              </div>
              
              <div className="p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 text-[var(--color-secondary)]">
                  <Sparkles size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Fiche Officielle</span>
                </div>
                
                <h2 className="font-[var(--font-family-title)] text-5xl font-bold mb-2 tracking-tighter italic text-white leading-none">
                  {selectedJury.full_name}
                </h2>
                <p className="text-[var(--color-primary)] font-bold text-sm mb-8 uppercase tracking-[0.3em]">
                  {selectedJury.specialite}
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-white/40 flex items-center gap-2 uppercase tracking-[0.2em]">
                      <Cpu size={16} /> Identifiant Jury
                    </h4>
                    <p className="text-base text-white/80 font-light">
                      Membre accrédité sous le numéro #{selectedJury.id} <br/>
                      Inscrit le : {new Date(selectedJury.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedJury(null)}
                  className="mars-cta mt-12 w-full py-5 text-[10px] font-black tracking-[0.3em] uppercase rounded-full"
                >
                  Détails Jury
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