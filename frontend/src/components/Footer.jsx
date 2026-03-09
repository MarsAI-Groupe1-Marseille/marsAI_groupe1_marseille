// components/Footer.jsx

import React, { useEffect, useRef, useState } from "react"; //
import { Link } from "react-router-dom"; //
import { Rocket, Mail, Youtube, Instagram, X, ArrowRight, Sparkles } from "lucide-react"; //
import { useLanguage } from "../context/LanguageContext.jsx"; //

const Footer = () => {
  const { t } = useLanguage();
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) setIsVisible(true);
      }, //
      { threshold: 0.15 }
    ); //
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const onSubmitNewsletter = (e) => {
    e.preventDefault(); //
    // TODO: brancher API plus tard 
    setEmail("");
  };

  return (
    <footer className="w-full mt-10 border-t border-[var(--color-border)]">
      <div className="w-full bg-[var(--color-footer-bg)] backdrop-blur-md">
        <div
          ref={footerRef}
          className={["container-mars py-10 sm:py-12 mars-reveal", isVisible ? "is-visible" : ""].join(" ")}
        >
          {/* Top grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Branding */}
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center gap-2 group select-none">
                <Rocket size={28} className="text-[var(--color-secondary)] group-hover:animate-bounce" />
                <span className="font-[var(--font-family-title)] text-xl sm:text-2xl font-bold italic tracking-tight text-[var(--color-text)]">
                  MARS<span className="text-[var(--color-primary)]">AI</span>
                </span>
                <Sparkles size={18} className="text-[var(--color-accent)]" />
              </Link>

              <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                {t('footer_description')}
              </p>

              {/* Socials */}
              <div className="mt-4 flex items-center gap-2">
                <a
                  href="https://x.com/marsai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mars-btn mars-glow inline-flex items-center justify-center"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <X size={18} />
                </a>

                <a
                  href="https://instagram.com/marsai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mars-btn mars-glow inline-flex items-center justify-center"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>

                <a
                  href="https://youtube.com/@marsai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mars-btn mars-glow inline-flex items-center justify-center"
                  aria-label="YouTube"
                  title="YouTube"
                >
                  <Youtube size={18} />
                </a>

                <a
                  href="mailto:contact@marsai.fr"
                  className="mars-btn mars-glow inline-flex items-center justify-center"
                  aria-label="Email"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
              </div>

            </div>

            {/* Navigation */}
            <div className="lg:col-span-3">
              <h3 className="font-[var(--font-family-title)] text-sm tracking-widest text-[var(--color-text-muted)]">
                {t('footer_navigation')}
              </h3>

              <div className="mt-4 flex flex-col gap-2 text-sm">
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/">{t('footer_home')}</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/galerie">{t('footer_gallery')}</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/faq">FAQ</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/contact">Contact</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/jury">{t('footer_jury')}</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/palmares">{t('footer_palmares')}</Link>
                <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/submission">{t('footer_submission')}</Link>
              </div>
            </div>

            {/* Infos */}
            <div className="lg:col-span-2">
              <h3 className="font-[var(--font-family-title)] text-sm tracking-widest text-[var(--color-text-muted)]">
                {t('footer_infos')}
              </h3>

              <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                <span>{t('footer_location')}</span>
                <span>{t('footer_projections')}</span>
                <span>{t('footer_ai')}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h3 className="font-[var(--font-family-title)] text-sm tracking-widest text-[var(--color-text-muted)]">
                {t('footer_newsletter')}
              </h3>

              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                {t('footer_newsletter_desc')}
              </p>

              <form onSubmit={onSubmitNewsletter} className="mt-4 flex items-center gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder={t('footer_email_placeholder')}
                  className={[
                    "w-full rounded-xl border border-[var(--color-border)]",
                    "bg-[var(--color-surface)] backdrop-blur-md",
                    "px-4 py-3 text-sm outline-none",
                    "focus:border-[var(--color-border-strong)]",
                  ].join(" ")}
                />

                <button
                  type="submit"
                  className="mars-cta mars-glow inline-flex items-center justify-center gap-2 px-4 py-3"
                  aria-label={t('footer_subscribe')}
                  title={t('footer_subscribe')}
                >
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                {t('footer_spam_notice')}
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-[var(--color-border)] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} MarsAI — {t('footer_copyright')}
            </p>

            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <Link className="hover:text-[var(--color-secondary)] transition-colors" to="/legal">{t('footer_legal')}</Link>
              <a className="hover:text-[var(--color-secondary)] transition-colors" href="#">{t('footer_privacy')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  ); //
}; //

export default Footer; //
