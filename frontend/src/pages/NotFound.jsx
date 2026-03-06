import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Rocket, Home, LogIn } from "lucide-react";
import StarryBackground from '../components/StarryBackground.jsx';

const NotFound = () => {
  const [currentMode, setCurrentMode] = useState('dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mode = document.documentElement.getAttribute('data-mode');
      setCurrentMode(mode || 'dark');
    });

    const mode = document.documentElement.getAttribute('data-mode');
    setCurrentMode(mode || 'dark');

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <StarryBackground />
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: currentMode === 'light' ? '#ffffff' : '#000000',
          color: currentMode === 'light' ? '#000000' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          backgroundImage: currentMode === 'light' 
            ? 'radial-gradient(80% 60% at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(35% 25% at 90% 80%, rgba(0,229,255,0.1) 0%, transparent 60%)'
            : 'radial-gradient(80% 60% at 50% 0%, rgba(123,47,255,0.25) 0%, transparent 60%), radial-gradient(35% 25% at 90% 80%, rgba(0,229,255,0.15) 0%, transparent 60%)',
          position: 'relative',
          zIndex: 10
        }}
      >
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.3)'}`,
            backgroundColor: currentMode === 'light' ? 'rgba(243,240,255,0.5)' : 'rgba(17,24,39,0.5)'
          }}>
            <Rocket size={16} style={{ color: currentMode === 'light' ? '#7c3aed' : '#a78bfa' }} />
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.125em', textTransform: 'uppercase', color: currentMode === 'light' ? '#666666' : '#9ca3af' }}>MarsAI</span>
          </div>

          <h1 style={{ 
            marginTop: '1rem',
            fontSize: currentMode === 'light' ? '3rem' : '3.75rem',
            fontWeight: 'bold',
            lineHeight: '1.2',
            textShadow: currentMode === 'light' ? '0 0 30px rgba(124,58,237,0.2)' : '0 0 30px rgba(123,47,255,0.35)',
            color: currentMode === 'light' ? '#000000' : '#ffffff'
          }}>
            404
            <span style={{ 
              display: 'block',
              fontSize: currentMode === 'light' ? '1.5rem' : '1.875rem',
              fontWeight: '600',
              color: currentMode === 'light' ? '#666666' : '#9ca3af'
            }}>
              Page introuvable
            </span>
          </h1>

          <p style={{
            marginTop: '1rem',
            fontSize: '1rem',
            color: currentMode === 'light' ? '#666666' : '#9ca3af',
            maxWidth: '28rem'
          }}>
            La page que vous cherchez a disparu dans une orbite inconnue. Revenez a la station.
          </p>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <Home size={18} />
              Retour accueil
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(124,58,237,0.2)',
                color: currentMode === 'light' ? '#7c3aed' : '#a78bfa',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '500',
                border: `1px solid ${currentMode === 'light' ? '#7c3aed' : 'rgba(124,58,237,0.3)'}`,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = currentMode === 'light' ? '#e9d5ff' : 'rgba(124,58,237,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentMode === 'light' ? '#f3f0ff' : 'rgba(124,58,237,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <LogIn size={18} />
              Connexion
            </Link>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '-0.5rem',
            borderRadius: '1.5rem',
            background: currentMode === 'light'
              ? 'linear-gradient(to bottom right, rgba(124,58,237,0.2), rgba(0,229,255,0.1))'
              : 'linear-gradient(to bottom right, rgba(123,47,255,0.35), rgba(0,229,255,0.2))',
            filter: 'blur(64px)'
          }} />
          <div style={{
            position: 'relative',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.3)'}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80"
              alt="Espace et nebuleuse"
              style={{
                width: '100%',
                height: window.innerWidth < 640 ? '320px' : '420px',
                objectFit: 'cover'
              }}
              loading="lazy"
            />
            <div style={{
              position: 'absolute',
              inset: '0',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent)'
            }} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NotFound;
