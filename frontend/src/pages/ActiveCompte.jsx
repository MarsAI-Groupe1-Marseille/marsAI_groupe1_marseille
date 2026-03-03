import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../config/axiosConfig';
import { useError } from '../context/ErrorContext.jsx';

const ActiveCompte = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [specialiteText, setSpecialiteText] = useState('');
  const [searchParams] = useSearchParams();
  const { addError } = useError();
  const tokenFromSearch = searchParams.get('token');
  const token = tokenFromSearch 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
            ACTIVER VOTRE COMPTE
        </h1>

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
              placeholder="Mot de passe :"
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
              placeholder="Confirmation du mot de passe :"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <div className="text-xs text-gray-500 mb-2">Avatar (Photo de profil)</div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
            />
          </div>

          <div className="mb-5">
            <input
              type="text"
              id="specialite"
              name="specialite"
              value={specialiteText}
              onChange={(e) => setSpecialiteText(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
              placeholder="Spécialité (séparées par des virgules, ex: Réalisation, Montage)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 px-5 bg-gradient-to-r from-[#c084fc] via-[#6366f1] to-[#60a5fa] border-none rounded-full text-white text-sm font-medium tracking-[3px] uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(99,102,241,0.4)] active:translate-y-0 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ACTIVATION EN COURS...' : 'RÉINITIALISER'}
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

export default ActiveCompte