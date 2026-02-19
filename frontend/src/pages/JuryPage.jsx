// pages/Jury.jsx
import React, { useState, useEffect } from "react";
import { 
  Star, Award, Globe, Linkedin, Twitter, 
  Info, X, Cpu, Film, Sparkles, Facebook 
} from "lucide-react";

// --- DONNÉES (Assure-toi que ce bloc est bien présent au-dessus de JuryPage) ---


const JURY_DATA = [
  {
    id: 1,
    name: "Dr. Elara Vance",
    role: "Présidente du Jury",
    mission: "Supervision Éthique IA",
    specialty: "IA & Éthique",
    category: "IA",
    bio: "Pionnière dans la recherche sur la conscience synthétique, Elara dirige le département de neuro-IA à l'Université de Mars Prime.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    isPresident: true,
    socials: { linkedin: "#", twitter: "#", facebook: "#" },
    notableWorks: ["Synthetica (2024)", "The Silicon Soul"]
  },
  {
    id: 2,
    name: "Marcus Kael",
    role: "Juré Cinéma",
    mission: "Direction Artistique VFX",
    specialty: "Réalisation VFX",
    category: "Cinéma",
    bio: "Réalisateur oscarisé pour ses visuels révolutionnaires, Marcus explore la frontière entre le réel et le généré.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    isPresident: false,
    socials: { linkedin: "#", twitter: "#" },
    notableWorks: ["Void Runner", "Neon Echoes"]
  },
  {
    id: 3,
    name: "Sora Nakajima",
    role: "Jurée Création",
    mission: "Analyse Algorithmique",
    specialty: "Design Génératif",
    category: "Design",
    bio: "Artiste multidisciplinaire utilisant des algorithmes génératifs pour sculpter des environnements virtuels immersifs.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    isPresident: false,
    socials: { linkedin: "#", facebook: "#" },
    notableWorks: ["Algorithmic Flora", "Digital Zen"]
  }
];

const JuryPage = () => {
  const [filter, setFilter] = useState("Tous");
  const [selectedJury, setSelectedJury] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  // Filtrage des données
  const filteredJury = filter === "Tous" 
    ? JURY_DATA 
    : JURY_DATA.filter(j => j.category === filter);

  // Récupération de la présidence pour l'affichage isolé
  const president = JURY_DATA.find(j => j.isPresident);

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

      {/* --- GRILLE DES JURÉS (Cartes Ovulées) --- */}
      <section className="container-mars">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredJury.map((jury) => (
            <div key={jury.id} className={`mars-reveal ${isVisible ? "is-visible" : ""}`}>
              
              <div className="mars-btn mars-glow relative overflow-hidden rounded-[60px] border border-[var(--color-border)] bg-[var(--color-surface)] h-full flex flex-col group transition-all duration-500 hover:border-[var(--color-primary)] shadow-2xl">
                
                {/* Image Conteneur (Épouse la forme) */}
                <div className="relative h-80 w-full p-4">
                  <div className="w-full h-full overflow-hidden rounded-[50px] border border-[var(--color-border-strong)] relative bg-black">
                    <img 
                      src={jury.image} 
                      alt={jury.full_name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    
                    {/* Bandeau Social au Hover */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md py-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center gap-8 border-t border-white/10">
                      {jury.socials.linkedin && <Linkedin size={22} className="text-white/80 hover:text-[var(--color-primary)] cursor-pointer" />}
                      {jury.socials.twitter && <Twitter size={22} className="text-white/80 hover:text-[var(--color-primary)] cursor-pointer" />}
                      {jury.socials.facebook && <Facebook size={22} className="text-white/80 hover:text-[var(--color-primary)] cursor-pointer" />}
                    </div>
                  </div>
                </div>

                {/* Infos du Juré */}
                <div className="px-10 pb-10 pt-2 flex flex-col flex-grow text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-[var(--font-family-title)] text-2xl font-bold tracking-tight text-white uppercase italic">
                        {jury.full_name}
                      </h3>
                      <p className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        {jury.role}
                      </p>
                    </div>
                    <Award size={24} className="text-[var(--color-secondary)] opacity-40" />
                  </div>

                  <p className="text-sm text-white/60 line-clamp-2 mb-8 italic">
                    "{jury.bio}"
                  </p>

                  <button 
                    onClick={() => setSelectedJury(jury)}
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

      {/* --- MODALE DÉTAILS --- */}
      {selectedJury && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="mars-drawer relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[50px] overflow-hidden">
            
            <button 
              onClick={() => setSelectedJury(null)}
              className="absolute top-8 right-8 z-20 p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-all border border-white/10"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="relative h-80 md:h-[600px]">
                <img src={selectedJury.image} className="w-full h-full object-cover" alt="" />
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
                  {selectedJury.specialty}
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-white/40 flex items-center gap-2 uppercase tracking-[0.2em]">
                      <Cpu size={16} /> Biographie
                    </h4>
                    <p className="text-base text-white/80 leading-relaxed font-light">
                      {selectedJury.bio}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedJury(null)}
                  className="mars-cta mt-12 w-full py-5 text-[10px] font-black tracking-[0.3em] uppercase rounded-full"
                >
                  Fermer détails jury
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