import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const JuryHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const headerBg = (() => {
    if (location.pathname.startsWith("/dashboardJury")) {
      return "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600";
    }
    if (location.pathname.startsWith("/notation-jury")) {
      return "bg-gradient-to-r from-violet-900/70 via-neutral-950 to-neutral-950";
    }
    return "bg-[var(--color-header-bg)]";
  })();

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

        <nav className="flex items-center gap-4">
          <Link
            to="/dashboardJury"
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Dashboard jury"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mars-btn mars-glow inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            aria-label="Deconnexion"
          >
            <LogOut size={18} />
            Deconnexion
          </button>
        </nav>
      </div>
    </header>
  );
};

export default JuryHeader;
