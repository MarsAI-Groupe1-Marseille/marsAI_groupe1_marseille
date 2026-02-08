import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Clapperboard, LayoutDashboard } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[var(--color-mars-dark)] border-b border-gray-800 py-4 sticky top-0 z-50">
      <div className="container-mars flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <Rocket className="text-[var(--color-mars-primary)] group-hover:animate-bounce" size={32} />
          <span className="font-[var(--font-family-title)] text-2xl font-bold tracking-tighter italic">
            MARS<span className="text-[var(--color-mars-primary)]">AI</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/galerie" className="hover:text-[var(--color-mars-secondary)] transition-colors font-medium">Galerie</Link>
          <Link to="/submission" className="bg-[var(--color-mars-primary)] hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 flex items-center gap-2">
            <Clapperboard size={18} /> Soumettre un film
          </Link>
          <Link to="/login" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
            <LayoutDashboard size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;