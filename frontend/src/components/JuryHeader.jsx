import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Star, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const JuryHeader = () => {
  const { logout } = useAuth();
  const { t, lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Unified transparent gradient for all jury pages
  const headerBg = "bg-gradient-to-r from-violet-900/70 via-neutral-950 to-neutral-950";

  return (
    <header className={`mars-header sticky top-0 z-50 w-full border-b border-[var(--color-border)] ${headerBg}`}>
      <div className="container-mars flex items-center justify-between" style={{ paddingTop: "var(--header-py)", paddingBottom: "var(--header-py)" }}>
        <Link to="/dashboardJury" className="flex items-center gap-2 group select-none min-w-0">
          <Star size={22} className="text-[var(--color-secondary)]" />
          <span
            className="font-[var(--font-family-title)] font-bold tracking-tighter italic text-[var(--color-text)] truncate"
            style={{ fontSize: "var(--header-title-size)" }}
          >
            MARS<span className="text-[var(--color-primary)]">AI</span>
          </span>
          <span className="ml-2 text-xs font-semibold tracking-[2px] text-[var(--color-text-muted)]">JURY</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
          <Link
            to="/dashboardJury"
            className="mars-btn mars-glow inline-flex items-center gap-1 md:gap-2 text-xs lg:text-sm"
            aria-label="Dashboard jury"
          >
            <span>Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={toggleLanguage}
            className="mars-btn mars-glow inline-flex items-center gap-1 text-xs lg:text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Toggle language"
            title={lang === 'fr' ? 'English' : 'Français'}
          >
            <Globe size={16} className="md:size-[18px]" />
            <span className="hidden lg:inline">{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="mars-btn mars-glow inline-flex items-center gap-1 text-xs lg:text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Deconnexion"
          >
            <LogOut size={16} className="md:size-[18px]" />
            <span className="hidden lg:inline">Deconnexion</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default JuryHeader;
