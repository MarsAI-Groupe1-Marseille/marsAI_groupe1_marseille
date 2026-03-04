import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../config/axiosConfig';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const tokenFromSearch = searchParams.get('token');
  const token = tokenFromSearch 
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-[450px] px-5">
        
        {/* Icon User */}
        <div className="flex justify-center mb-10 relative">
          <div className="relative">
            <div className="w-[70px] h-[70px] bg-[#6366f1] rounded-full flex items-center justify-center">
              <svg className="w-[35px] h-[35px] fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#3b82f6] rounded-full border-2 border-black"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-widest text-gray-300">
            RÉINITIALISER MOT DE PASSE
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
              placeholder="Nouveau mot de passe :"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
              placeholder="Confirmer le mot de passe :"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 px-5 bg-gradient-to-r from-[#c084fc] via-[#6366f1] to-[#60a5fa] border-none rounded-full text-white text-sm font-medium tracking-[3px] uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(99,102,241,0.4)] active:translate-y-0 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'TRAITEMENT...' : 'RÉINITIALISER'}
            {!loading && <span className="text-lg font-bold transition-transform duration-300 group-hover:translate-x-1">→</span>}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center space-y-3">
          <Link to="/login" className="block text-sm text-gray-400 hover:text-purple-400 transition">
            Retour à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword