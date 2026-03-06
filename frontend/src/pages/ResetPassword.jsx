import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../config/axiosConfig';
import StarryBackground from '../components/StarryBackground.jsx';

const ResetPassword = () => {
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const tokenFromSearch = searchParams.get('token');
  const token = tokenFromSearch;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('Token manquant dans l\'URL.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/users/reset-password', {
        token,
        new_password: password
      });
      alert('Mot de passe réinitialisé avec succès.');
      navigate('/login');
    } catch (err) {
      // Afficher les erreurs de validation du backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const validationErrors = err.response.data.errors.map(e => e.message).join(' • ');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.error || 'Erreur lors de la réinitialisation.');
      }
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
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ width: '100%', maxWidth: '450px', padding: '1.25rem' }}>
        
          {/* Icon User */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg className="w-[35px] h-[35px] fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div style={{ position: 'absolute', top: '0', right: '0', width: '18px', height: '18px', backgroundColor: '#3b82f6', borderRadius: '50%', border: '2px solid', borderColor: currentMode === 'light' ? '#ffffff' : '#000000' }}></div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: currentMode === 'light' ? '1.5rem' : '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          letterSpacing: '0.125em',
          color: currentMode === 'light' ? '#000000' : '#d1d5db'
        }}>
            RÉINITIALISER MOT DE PASSE
        </h1>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fca5a5',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(107, 114, 128, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                placeholder: 'Nouveau mot de passe',
                fontSize: '0.875rem'
              }}
              placeholder="Nouveau mot de passe :"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : '#1f2937'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                backgroundColor: currentMode === 'light' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(107, 114, 128, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                placeholder: 'Confirmer le mot de passe',
                fontSize: '0.875rem'
              }}
              placeholder="Confirmer le mot de passe :"
              required
              disabled={loading}
              onFocus={(e) => e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = currentMode === 'light' ? 'rgba(124, 58, 237, 0.3)' : '#1f2937'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              paddingTop: '1rem',
              paddingBottom: '1rem',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              background: 'linear-gradient(to right, #c084fc, #6366f1, #60a5fa)',
              border: 'none',
              borderRadius: '9999px',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '500',
              letterSpacing: '0.075em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-0.125rem)', e.target.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.4)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)')}
          >
            {loading ? 'TRAITEMENT...' : 'RÉINITIALISER'}
            {!loading && <span style={{ fontSize: '1.125rem', fontWeight: 'bold', transition: 'transform 0.3s', display: 'inline-block' }} className="group-hover:translate-x-1">→</span>}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/login" style={{
            display: 'block',
            fontSize: '0.875rem',
            color: currentMode === 'light' ? '#7c3aed' : '#9ca3af',
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.color = currentMode === 'light' ? '#6d28d9' : '#a78bfa'}
          onMouseLeave={(e) => e.target.style.color = currentMode === 'light' ? '#7c3aed' : '#9ca3af'}>
            Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
    </>
  );
};

export default ResetPassword