import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axiosConfig';
import StarryBackground from '../components/StarryBackground.jsx';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post('/users/forgotpass', { email });
      setSuccess("Si cet email existe, un lien de réinitialisation a été envoyé sur votre adresse email. Vous avez 24 heures pour réinitialiser votre mot de passe.");
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <StarryBackground />
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentMode === 'light' ? '#ffffff' : '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: currentMode === 'light' ? '#000000' : '#ffffff',
      fontFamily: 'sans-serif',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ width: '100%', maxWidth: '450px', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        {/* Icon Wrapper */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{
            width: '70px',
            height: '70px',
            backgroundColor: '#6366f1',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg 
              style={{
                width: '35px',
                height: '35px',
                fill: '#ffffff'
              }}
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '18px',
              height: '18px',
              backgroundColor: '#3b82f6',
              borderRadius: '9999px',
              border: `2px solid ${currentMode === 'light' ? '#ffffff' : '#000000'}`
            }}></div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: currentMode === 'light' ? '1.875rem' : '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: currentMode === 'light' ? '#333333' : '#d1d5db'
        }}>
              Reset-password
        </h1>

        {/* Feedback */}
        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(127, 29, 29, 0.3)',
            border: `1px solid ${currentMode === 'light' ? '#dc2626' : '#b91c1c'}`,
            color: currentMode === 'light' ? '#991b1b' : '#fca5a5',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: currentMode === 'light' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(20, 83, 45, 0.3)',
            border: `1px solid ${currentMode === 'light' ? '#16a34a' : '#15803d'}`,
            color: currentMode === 'light' ? '#166534' : '#86efac',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form id="resetForm" onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse mail"
              required
              autoComplete="email"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.25rem 1.75rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'transparent',
                border: `1.5px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : 'rgba(255, 255, 255, 0.15)'} `,
                borderRadius: '9999px',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all 0.3s',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : 'rgba(99, 102, 241, 0.5)';
                e.target.style.backgroundColor = currentMode === 'light' ? '#ffffff' : 'rgba(255, 255, 255, 0.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : 'rgba(255, 255, 255, 0.15)';
                e.target.style.backgroundColor = currentMode === 'light' ? '#f3f0ff' : 'transparent';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: 'linear-gradient(to right, #a78bfa, #6366f1, #60a5fa)',
              border: 'none',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '500',
              letterSpacing: '0.125em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1.875rem',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
              }
            }}
          >
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              transition: 'transform 0.3s'
            }}>
             {loading ? 'ENVOI...' : 'Valider →'}
            </span>
          </button>
        </form>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.875rem' }}>
          <Link
            to="/login"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              color: currentMode === 'light' ? '#7c3aed' : '#9ca3af',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = currentMode === 'light' ? '#6d28d9' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = currentMode === 'light' ? '#7c3aed' : '#9ca3af';
            }}
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default PasswordReset;