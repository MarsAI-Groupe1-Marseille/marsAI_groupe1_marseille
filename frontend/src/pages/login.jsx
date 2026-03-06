import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition.jsx';
import StarryBackground from '../components/StarryBackground.jsx';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentMode, setCurrentMode] = useState('dark');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.email, formData.password);
      console.log('Login successful:', user);
      // Rediriger selon le rôle
      if (user.role === 'admin' || user.role === 'moderator') {
        navigate('/dashboard');
      } else if (user.role === 'jury') {
        navigate('/dashboardJury');
      } else {
        setError('Rôle non autorisé');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur de connexion');
    }   
   
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
    console.log('Google login');
  };

 

  

  return (
    <PageTransition pageKey="login">
    <>
    <StarryBackground />
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentMode === 'light' ? '#ffffff' : '#000000',
      color: currentMode === 'light' ? '#000000' : '#ffffff',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Main Content */}
        <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem' }}>
            {/* Icon and Title */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(to bottom right, #3b82f6, #9333ea)',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '1rem',
                  height: '1rem',
                  backgroundColor: '#60a5fa',
                  borderRadius: '9999px',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
            </div>

            <h1 style={{
              fontSize: currentMode === 'light' ? '1.875rem' : '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '2rem',
              letterSpacing: '0.1em',
              color: currentMode === 'light' ? '#333333' : '#d1d5db'
            }}>
              CONNEXION
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(127, 29, 29, 0.3)',
                  border: `1px solid ${currentMode === 'light' ? '#dc2626' : '#b91c1c'}`,
                  borderRadius: '0.5rem',
                  color: currentMode === 'light' ? '#991b1b' : '#fca5a5',
                  fontSize: '0.875rem'
                }}>
                  {error}
                </div>
              )}
              {/* Email */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                    borderRadius: '9999px',
                    outline: 'none',
                    color: currentMode === 'light' ? '#000000' : '#ffffff',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a060ff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937';
                  }}
                  placeholder="Adresse mail"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937'}`,
                    borderRadius: '9999px',
                    outline: 'none',
                    color: currentMode === 'light' ? '#000000' : '#ffffff',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? '#7c3aed' : '#a060ff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.3)' : '#1f2937';
                  }}
                  placeholder="Mot de passe :"
                  required
                />
              </div>

              {/* Submit Button with gradient */}
              <div style={{ paddingTop: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(to right, #a855f7, #9333ea, #3b82f6)',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    color: '#ffffff',
                    boxShadow: '0 10px 20px rgba(168, 85, 247, 0.5)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 30px rgba(168, 85, 247, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 20px rgba(168, 85, 247, 0.5)';
                  }}
                >
                  <span>Connexion</span>
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Social Login Buttons */}
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(17, 24, 39, 0.4)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124,58,237,0.2)' : '#374151'}`,
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.5)' : '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = currentMode === 'light' ? 'rgba(124,58,237,0.2)' : '#374151';
                  }}
                  aria-label="Se connecter avec Google"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>

              </div>
            </div>

            {/* Footer Links */}
            <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/forgotpass"
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
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>      
    </PageTransition>
  );
};

export default Connexion;