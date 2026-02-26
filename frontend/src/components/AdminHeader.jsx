import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, ShieldCheck, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "moderator" ? t('admin_moderator') : "ADMIN";

  const headerBg = (() => {
    if (location.pathname.startsWith("/gestion-films")) {
      return "bg-neutral-950";
    }
    if (location.pathname.startsWith("/distribution_jury")) {
      return "bg-gradient-to-r from-violet-900/70 via-neutral-950 to-neutral-950";
    }
    if (location.pathname.startsWith("/dashboard")) {
      return "bg-gradient-to-r from-violet-900/80 via-fuchsia-900/40 to-neutral-950";
    }
    if (location.pathname.startsWith("/Configuration")) {
      return "bg-gradient-to-r from-violet-900/90 via-indigo-950 to-neutral-950";
    }
    return "bg-neutral-950";
  })();

  return (
    <header className={`mars-header sticky top-0 z-50 w-full border-b border-neutral-800 ${headerBg}`}>
      <div className="container-mars flex items-center justify-between" style={{ paddingTop: "var(--header-py)", paddingBottom: "var(--header-py)" }}>
        <Link to="/dashboard" className="flex items-center gap-2 group select-none min-w-0">
          <ShieldCheck size={22} className="text-[var(--color-secondary)]" />
          <span
            className="font-[var(--font-family-title)] font-bold tracking-tighter italic text-[var(--color-text)] truncate"
            style={{ fontSize: "var(--header-title-size)" }}
          >
            MARS<span className="text-[var(--color-primary)]">AI</span>
          </span>
          <span className="ml-2 text-xs font-semibold tracking-[2px] text-[var(--color-text-muted)]">{roleLabel}</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
          <Link
            to="/dashboard"
            className="mars-btn mars-glow inline-flex items-center gap-1 md:gap-2 text-xs lg:text-sm"
            aria-label="Dashboard"
          >
            <LayoutDashboard size={16} className="md:size-[18px]" />
            <span className="hidden lg:inline">{t('admin_dashboard')}</span>
          </Link>
          <Link
            to="/gestion-films"
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2"
            aria-label="Film management"
            title={t('admin_films')}
          >
            <span className="text-xs lg:text-sm">{t('admin_films')}</span>
          </Link>

          <Link
            to="/distribution_jury"
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2"
            aria-label="Jury distribution"
            title={t('admin_jury')}
          >
            <span className="text-xs lg:text-sm">{t('admin_jury')}</span>
          </Link>
          <Link
            to="/Configuration"
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2"
            aria-label="Configuration"
            title={t('admin_config')}
          >
            <span className="text-xs lg:text-sm">{t('admin_config')}</span>
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
          
          <Link
            to="/Configuration"
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Distribution jury"
          >
            Config
          </Link>          
          <button
            type="button"
            onClick={handleLogout}
            className="mars-btn mars-glow inline-flex items-center gap-1 text-xs lg:text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Logout"
          >
            <LogOut size={16} className="md:size-[18px]" />
            <span className="hidden lg:inline">{t('admin_logout')}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
