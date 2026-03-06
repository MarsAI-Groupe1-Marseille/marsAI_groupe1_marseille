import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import StarryBackground from "../components/StarryBackground.jsx";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <StarryBackground />
      <div style={{
        minHeight: '100vh',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#0a0a12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '28rem',
          width: '100%'
        }}>
          <div style={{
            backgroundColor: currentMode === 'light' ? '#f8f9fa' : '#1a1a2e',
            border: currentMode === 'light' ? '2px solid rgba(220, 38, 38, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: currentMode === 'light'
              ? '0 10px 40px rgba(220, 38, 38, 0.1)'
              : '0 20px 60px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Icon */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                backgroundColor: currentMode === 'light' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: currentMode === 'light' ? '2px solid rgba(220, 38, 38, 0.5)' : '2px solid rgba(239, 68, 68, 0.5)'
              }}>
                <ShieldX size={40} style={{
                  color: currentMode === 'light' ? '#dc2626' : '#ef4444'
                }} />
              </div>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: currentMode === 'light' ? '#000000' : '#ffffff',
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
              letterSpacing: '0.5px'
            }}>
              {t('unauthorized_title') || 'Accès Refusé'}
            </h1>

            {/* Message */}
            <p style={{
              color: currentMode === 'light' ? '#666666' : '#9ca3af',
              marginBottom: '2rem',
              lineHeight: '1.5',
              fontSize: '1rem',
              fontFamily: "'Space Grotesk', 'rajdhani', sans-serif"
            }}>
              {t('unauthorized_message') || 
                "Vous n'avez pas les permissions nécessaires pour accéder à cette page. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur."}
            </p>

            {/* Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={handleGoBack}
                style={{
                  width: '100%',
                  backgroundColor: currentMode === 'light' ? '#7c3aed' : '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#6d28d9' : '#a78bfa';
                  e.currentTarget.style.boxShadow = currentMode === 'light'
                    ? '0 8px 20px rgba(124, 58, 237, 0.3)'
                    : '0 8px 20px rgba(139, 92, 246, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#7c3aed' : '#8b5cf6';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeft size={20} />
                {t('unauthorized_go_back') || 'Retour'}
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  width: '100%',
                  backgroundColor: currentMode === 'light' ? '#e5e7eb' : '#374151',
                  color: currentMode === 'light' ? '#000000' : '#ffffff',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontFamily: "'Space Grotesk', 'rajdhani', sans-serif",
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#d1d5db' : '#4b5563';
                  e.currentTarget.style.boxShadow = currentMode === 'light'
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentMode === 'light' ? '#e5e7eb' : '#374151';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {t('unauthorized_go_dashboard') || 'Aller au tableau de bord'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
