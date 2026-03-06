import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../config/axiosConfig';
import { useError } from '../context/ErrorContext.jsx';
import StarryBackground from '../components/StarryBackground.jsx';

const ActiveCompte = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [specialiteText, setSpecialiteText] = useState('');
  const [searchParams] = useSearchParams();
  const { addError } = useError();
  const tokenFromSearch = searchParams.get('token');
  const token = tokenFromSearch;
  const navigate = useNavigate();
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
    if (!token) {
      addError('Token manquant dans l\'URL.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addError('Les mots de passe ne correspondent pas.', 'error');
      return;
    }
    const specialiteList = specialiteText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append('token', token);
    formData.append('new_password', password);

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    if (specialiteList.length > 0) {
      formData.append('specialite', JSON.stringify(specialiteList));
    }

    setLoading(true);
    try {
      await axios.post('/users/active-compte', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addError('Compte activé avec succès.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      // Afficher les erreurs de validation du backend
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const validationErrors = err.response.data.errors.map(e => e.message).join(' • ');
        addError(validationErrors, 'error');
      } else {
        const errorMsg = err.response?.data?.error || 'Erreur lors de l\'activation.';
        addError(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log('Google auth');
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
      <div style={{ width: '100%', maxWidth: '450px', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        
        {/* Icon User */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: '#6366f1',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{
                width: '35px',
                height: '35px',
                fill: '#ffffff'
              }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
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
          color: currentMode === 'light' ? '#333333' : '#d1d5db'
        }}>
            ACTIVER VOTRE COMPTE
        </h1>

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
                padding: '1rem 1.5rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.875rem',
                transition: 'all 0.3',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a060ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937';
              }}
              placeholder="Mot de passe :"
              required
              disabled={loading}
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
                padding: '1rem 1.5rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a060ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937';
              }}
              placeholder="Confirmation du mot de passe :"
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              fontSize: '0.75rem',
              color: currentMode === 'light' ? '#999999' : '#999999',
              marginBottom: '0.5rem'
            }}>Avatar (Photo de profil)</div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              id="specialite"
              name="specialite"
              value={specialiteText}
              onChange={(e) => setSpecialiteText(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                borderRadius: '9999px',
                outline: 'none',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a060ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937';
              }}
              placeholder="Spécialité (séparées par des virgules, ex: Réalisation, Montage)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              background: 'linear-gradient(to right, #c084fc, #6366f1, #60a5fa)',
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
            {loading ? 'ACTIVATION EN COURS...' : 'RÉINITIALISER'}
            {!loading && <span style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              transition: 'transform 0.3s',
              display: 'inline'
            }}>→</span>}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
            Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
    </>
  );
};

export default ActiveCompte