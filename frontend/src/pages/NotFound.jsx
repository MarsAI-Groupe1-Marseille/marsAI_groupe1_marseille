import React from "react";
import { Link } from "react-router-dom";
import { Rocket, Home, LogIn } from "lucide-react";

const NotFound = () => {
  return (
    <div
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center px-6"
      style={{
        backgroundImage:
          "radial-gradient(80% 60% at 50% 0%, rgba(123,47,255,0.25) 0%, transparent 60%), radial-gradient(35% 25% at 90% 80%, rgba(0,229,255,0.15) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Rocket size={16} className="text-[var(--color-secondary)]" />
            <span className="text-xs tracking-[3px] uppercase text-[var(--color-text-muted)]">MarsAI</span>
          </div>

          <h1 className="mt-4 text-5xl sm:text-6xl font-bold leading-tight" style={{ textShadow: "0 0 30px rgba(123,47,255,0.35)" }}>
            404
            <span className="block text-2xl sm:text-3xl font-semibold text-[var(--color-text-muted)]">
              Page introuvable
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-xl">
            La page que vous cherchez a disparu dans une orbite inconnue. Revenez a la station.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="mars-cta mars-glow inline-flex items-center gap-2 px-5 py-3"
            >
              <Home size={18} />
              Retour accueil
            </Link>
            <Link
              to="/login"
              className="mars-btn mars-glow inline-flex items-center gap-2 px-5 py-3"
            >
              <LogIn size={18} />
              Connexion
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[rgba(123,47,255,0.35)] to-[rgba(0,229,255,0.2)] blur-2xl" />
          <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80"
              alt="Espace et nebuleuse"
              className="w-full h-[320px] sm:h-[420px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
