import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* SECTION HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Effet de halo lumineux en fond */}
        <div className="absolute w-[500px] h-[500px] bg-[var(--color-mars-primary)] opacity-10 blur-[120px] rounded-full -top-20 -left-20"></div>
        
        <div className="container-mars relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-mars-secondary)] text-[var(--color-mars-secondary)] text-xs font-bold mb-6 tracking-widest uppercase">
            <Sparkles size={14} /> Le futur du cinéma est ici
          </div>
          
          <h1 className="font-[var(--font-family-title)] text-5xl md:text-8xl font-black mb-6 leading-none italic uppercase">
            EXPLOREZ L'IA <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-mars-primary)] to-[var(--color-mars-secondary)]">
              SUR MARS
            </span>
          </h1>

          <p className="text-[var(--color-text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Le premier festival international dédié aux courts-métrages générés par Intelligence Artificielle. Rejoignez l'odyssée créative 2026.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/submission" className="bg-[var(--color-mars-primary)] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              Soumettre mon film <ChevronRight size={20} />
            </Link>
            <Link to="/galerie" className="border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2">
              Voir la galerie <Play size={20} fill="currentColor" />
            </Link>
          </div>
        </div>
      </section>

      {/* PETITE SECTION INFO */}
      <section className="py-20 bg-black/30">
        <div className="container-mars grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-[var(--color-mars-secondary)] text-4xl font-bold mb-2">100% IA</h3>
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest">Catégorie Reine</p>
          </div>
          <div>
            <h3 className="text-[var(--color-mars-secondary)] text-4xl font-bold mb-2">20 JUIN</h3>
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest">Soirée de Gala</p>
          </div>
          <div>
            <h3 className="text-[var(--color-mars-secondary)] text-4xl font-bold mb-2">MARSEILLE</h3>
            <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest">Le Prado</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;