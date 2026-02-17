import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "moderator" ? "MODERATOR" : "ADMIN";

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

        <nav className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="mars-btn mars-glow inline-flex items-center gap-2"
            aria-label="Dashboard"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            to="/gestion-films"
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Gestion films"
          >
            Films
          </Link>
          <Link
            to="/distribution_jury"
            className="mars-btn mars-glow inline-flex items-center justify-center"
            aria-label="Distribution jury"
          >
            Jury
          </Link>
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

export default AdminHeader;
