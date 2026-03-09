// components/Header.jsx

import React, { useEffect, useMemo, useState } from "react"; //
import { Link, useLocation } from "react-router-dom"; //
import {
  Rocket,
  Clapperboard,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  Palette,
} from "lucide-react"; //
import { useTheme } from "../providers/ThemeProvider.jsx"; //
import { useLanguage } from "../context/LanguageContext.jsx"; //
import axios from "../config/axiosConfig";

// ---------------------------------------------------------- //
// Flags SVG (pro) //
// ---------------------------------------------------------- //

// Drapeau FR (SVG) //
const FlagFR = ({ className = "" }) => ( //
  <svg
    className={`mars-flag ${className}`} //
    viewBox="0 0 36 24" //
    xmlns="http://www.w3.org/2000/svg" //
    role="img" //
    aria-label="Français" //
  >
    <rect width="12" height="24" x="0" y="0" fill="#0055A4" />
    <rect width="12" height="24" x="12" y="0" fill="#FFFFFF" />
    <rect width="12" height="24" x="24" y="0" fill="#EF4135" />
  </svg> //
); //

// Drapeau UK (SVG) simplifié //
const FlagEN = ({ className = "" }) => ( //
  <svg
    className={`mars-flag ${className}`} //
    viewBox="0 0 60 30" //
    xmlns="http://www.w3.org/2000/svg" //
    role="img" //
    aria-label="English" //
  >
    <rect width="60" height="30" fill="#012169" />
    <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
    <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="3" />
    <path d="M30 0 V30 M0 15 H60" stroke="#FFFFFF" strokeWidth="10" />
    <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
  </svg> //
); //

const Header = () => { //
  const { mode, toggleMode, toggleTheme } = useTheme(); //
  const { lang, toggleLanguage, t } = useLanguage(); //

  const [isScrolled, setIsScrolled] = useState(false); //
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); //
  const [showPalmaresLink, setShowPalmaresLink] = useState(false);

  const location = useLocation(); //

  const navLinks = useMemo( //
    () => {
      const links = [
        { label: t('home'), to: "/" },
        { label: t('gallery'), to: "/galerie" },
        { label: "JURY", to: "/jury" },
      ];

      if (showPalmaresLink) {
        links.push({ label: t('palmares'), to: "/palmares" });
      }

      return links;
    },
    [lang, t, showPalmaresLink]
  ); //

  useEffect(() => {
    let isMounted = true;

    const fetchAwardsCount = async () => {
      try {
        const response = await axios.get('/awards', { skipErrorHandling: true });
        const awards = Array.isArray(response?.data?.awards) ? response.data.awards : [];

        if (isMounted) {
          setShowPalmaresLink(awards.length >= 3);
        }
      } catch (error) {
        if (isMounted) {
          setShowPalmaresLink(false);
        }
      }
    };

    fetchAwardsCount();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => { //
    const onScroll = () => setIsScrolled(window.scrollY > 8); //
    onScroll(); //
    window.addEventListener("scroll", onScroll, { passive: true }); //
    return () => window.removeEventListener("scroll", onScroll); //
  }, []); //

  useEffect(() => { //
    setIsMobileMenuOpen(false); //
  }, [location.pathname]); //

  useEffect(() => { //
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""; //
    return () => {
      document.body.style.overflow = "";
    }; //
  }, [isMobileMenuOpen]); //

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v); //

  const submitLabel = t('submit'); //

  return ( //
    <header //
      className={[
        "mars-header sticky top-0 z-50 w-full",
        "border-b border-[var(--color-border)]",
        "bg-[var(--color-header-bg)]",
        isScrolled ? "mars-header--scrolled" : "",
      ].join(" ")} //
    >
      {/* ===================================================== */}
      {/* SUBHEADER MOBILE (EN PREMIER) : compact, pas de débordement */}
      {/* ===================================================== */}
      <div className="md:hidden mars-subheader border-b border-[var(--color-border)]">
        <div className="container-mars flex items-center justify-between overflow-x-clip">
          {/* Lang switch : wrapper compact (pas de double padding) */}
          <div className="mars-btn mars-btn-compact inline-flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`rounded-full ${lang === "fr" ? "bg-[var(--color-surface-2)]" : "opacity-70"
                }`}
              aria-label="Français/English"
              title={lang === 'fr' ? 'English' : 'Français'}
            >
              {lang === 'fr' ? <FlagFR /> : <FlagEN />}
            </button>
          </div>

          {/* Theme + Mode : compacts */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="mars-btn mars-btn-compact mars-glow inline-flex items-center justify-center"
              aria-label="Changer le thème"
              title="Thème"
            >
              <Palette size={18} />
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="mars-btn mars-btn-compact mars-glow inline-flex items-center justify-center"
              aria-label="Mode clair/sombre"
              title="Mode"
            >
              {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
              {/* {mode === "neon-soft" ? <Moon size={18} /> : <Sun size={18} />} */}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TOP ROW : logo + burger mobile / nav desktop */}
      {/* ===================================================== */}
      <div
        className="container-mars flex items-center justify-between overflow-x-clip"
        style={{ paddingTop: "var(--header-py)", paddingBottom: "var(--header-py)" }}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group select-none min-w-0">
          <Rocket
            size={24}
            className="mars-logo-icon text-[var(--color-secondary)] group-hover:animate-bounce"
          />
          <span
            className="font-[var(--font-family-title)] font-bold tracking-tighter italic text-[var(--color-text)] truncate"
            style={{ fontSize: "var(--header-title-size)" }}
          >
            MARS<span className="text-[var(--color-primary)]">AI</span>
          </span>
        </Link>

        {/* BURGER MOBILE : seul ici (zéro risque d’overflow) */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* NAV DESKTOP (inchangé) */}
        <nav className="hidden md:flex items-center shrink-0 flex-wrap" style={{ gap: "var(--header-nav-gap)" }}>
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-semibold text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors text-xs lg:text-sm"
              style={{ fontSize: "var(--btn-font)" }}
            >
              {item.label}
            </Link>
          ))}

          <div className="mars-btn inline-flex items-center gap-1">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`rounded-full px-1.5 lg:px-2 py-1 ${lang === "fr" ? "bg-[var(--color-surface-2)]" : "opacity-70"}`}
              aria-label="Français/English"
              title={lang === 'fr' ? 'English' : 'Français'}
            >
              {lang === 'fr' ? <FlagFR /> : <FlagEN />}
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Changer le thème"
            title="Thème"
          >
            <Palette size={16} className="md:size-[18px]" />
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Mode clair/sombre"
            title="Mode"
          >
            {mode === "light" ? <Moon size={16} className="md:size-[18px]" /> : <Sun size={16} className="md:size-[18px]" />}
          </button>

          <Link to="/submission" className="mars-cta mars-glow inline-flex items-center gap-1 md:gap-2 text-xs lg:text-sm px-2 md:px-3 py-1.5 md:py-2">
            <Clapperboard size={14} className="md:size-[16px]" />
            <span className="hidden lg:inline">{submitLabel}</span>
          </Link>

          <Link
            to="/login"
            className="mars-btn mars-glow inline-flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Connexion / Dashboard"
          >
            <LayoutDashboard size={16} className="md:size-[18px]" />
          </Link>
        </nav>
      </div>

      {/* ===================================================== */}
      {/* MOBILE DRAWER : logo + glass blur sur links */}
      {/* ===================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer overlay"
          />
          {/* <div className="mars-drawer absolute left-0 right-0 top-full mx-3 rounded-2xl ..."> */}

          <div className="mars-drawer absolute left-0 right-0 top-4 mx-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
            {/* Header du drawer : logo + close */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
              <Link to="/" className="flex items-center gap-2 min-w-0" onClick={() => setIsMobileMenuOpen(false)}>
                <Rocket size={22} className="text-[var(--color-secondary)]" />
                <span className="font-[var(--font-family-title)] font-bold italic tracking-tight text-[var(--color-text)] truncate">
                  MARS<span className="text-[var(--color-primary)]">AI</span>
                </span>
                <Sparkles size={18} className="text-[var(--color-accent)]" />
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mars-btn mars-glow inline-flex items-center justify-center"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Links : glass blur */}
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "rounded-xl border border-[var(--color-border)]",
                    "bg-[var(--color-surface-2)] backdrop-blur-md",
                    "px-4 py-3 font-semibold text-[var(--color-text)]",
                    "hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center gap-2">
                <Link
                  to="/submission"
                  className="mars-cta mars-glow flex-1 inline-flex items-center justify-center gap-2 px-4 py-3"
                >
                  <Clapperboard size={18} />
                  {submitLabel}
                </Link>

                <Link
                  to="/login"
                  className="mars-btn mars-glow inline-flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  aria-label="Connexion / Dashboard"
                >
                  <LayoutDashboard size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}; //

export default Header; //
