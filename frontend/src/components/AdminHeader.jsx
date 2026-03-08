import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, ShieldCheck, Globe, Menu, X, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, toggleLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMode = () => {
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', newMode);
    localStorage.setItem('mode', newMode);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const roleLabel = user?.role === "moderator" ? t('admin_moderator') : "ADMIN";

  const headerBg = (() => {
    if (location.pathname.startsWith("/gestion-films")) {
      return "bg-neutral-950";
    }
    if (location.pathname.startsWith("/distribution_jury")) {
      return "bg-gradient-to-r from-violet-900/70 via-neutral-950 to-transparent";
    }
    if (location.pathname.startsWith("/jury-assignment")) {
      return "bg-gradient-to-r from-violet-900/70 via-neutral-950 to-transparent";
    }
    if (location.pathname.startsWith("/dashboard")) {
      return "bg-gradient-to-r from-violet-900/80 via-fuchsia-900/40 to-transparent";
    }
    if (location.pathname.startsWith("/Configuration")) {
      return "bg-gradient-to-r from-violet-900/90 via-indigo-950 to-transparent";
    }
    return "bg-neutral-950";
  })();

  return (
    <header 
      className="mars-header sticky top-0 z-50 w-full border-b border-neutral-800"
      style={{
        backgroundImage: 'linear-gradient(to left, transparent 0%, rgba(112, 26, 117, 0.4) 60%, rgba(255, 255, 255, 0.08) 100%)',
        backgroundColor: 'transparent'
      }}
    >
      <div className="container-mars flex items-center justify-start gap-2 md:gap-4" style={{ paddingTop: "var(--header-py)", paddingBottom: "var(--header-py)" }}>
        <Link to="/dashboard" className="flex items-center gap-2 group select-none flex-shrink-0 whitespace-nowrap">
          <ShieldCheck size={22} className="text-[var(--color-secondary)] flex-shrink-0" />
          <span
            className="font-[var(--font-family-title)] font-bold tracking-tighter italic text-white"
            style={{ fontSize: "var(--header-title-size)" }}
          >
            MARS<span style={{ color: "#22D3EE" }}>AI</span>
          </span>
          <span className="text-xs font-semibold tracking-[2px] text-white whitespace-nowrap">{roleLabel}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
          <Link
            to="/dashboard"
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2"
            aria-label="Dashboard"
            title={t('admin_dashboard')}
          >
            <span className="text-xs lg:text-sm">{t('admin_dashboard')}</span>
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
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Toggle language"
            title={lang === 'fr' ? 'English' : 'Français'}
          >
            <span className="text-xs lg:text-sm">{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>
          <button
            type="button"
            onClick={toggleMode}
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Toggle dark mode"
            title={currentMode === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {currentMode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>         
          <button
            type="button"
            onClick={handleLogout}
            className="mars-btn mars-glow inline-flex items-center justify-center p-1.5 md:p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Logout"
            title={t('admin_logout')}
          >
            <LogOut size={14} />
          </button>
        </nav>

        {/* Avatar utilisateur connecté - Complètement à droite */}
        <div className="hidden md:flex ml-auto pl-2 border-l border-neutral-700 items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-violet-400 overflow-hidden flex-shrink-0">
            {user?.avatar_url ? (
              <img src={`${user.avatar_url}?t=${Date.now()}`} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xs">
                {user?.full_name
                  ? user.full_name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()
                  : 'A'}
              </span>
            )}
          </div>
          <div className="text-right min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-white truncate">{user?.email}</p>
          </div>
        </div>

        {/* BURGER MOBILE */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center mars-btn mars-glow flex-shrink-0"
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="mars-drawer absolute left-0 right-0 top-4 mx-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
              <Link to="/dashboard" className="flex items-center gap-2 flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <ShieldCheck size={20} className="text-[var(--color-secondary)]" />
                <span className="font-[var(--font-family-title)] font-bold italic text-[var(--color-text)]">
                  MARS<span className="text-[var(--color-primary)]">AI</span>
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">{roleLabel}</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mars-btn mars-glow inline-flex items-center justify-center"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-4 py-4 flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] backdrop-blur-md px-4 py-3 font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('admin_dashboard')}
              </Link>
              <Link
                to="/gestion-films"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] backdrop-blur-md px-4 py-3 font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('admin_films')}
              </Link>
              <Link
                to="/distribution_jury"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] backdrop-blur-md px-4 py-3 font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('admin_jury')}
              </Link>
              <Link
                to="/Configuration"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] backdrop-blur-md px-4 py-3 font-semibold text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('admin_config')}
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="mars-btn mars-glow flex-1 inline-flex items-center justify-center gap-2 px-4 py-3"
                >
                  <Globe size={18} />
                  {lang === 'fr' ? 'EN' : 'FR'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mars-btn mars-glow flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <LogOut size={18} />
                  {t('admin_logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
