import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axiosConfig';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
      <div className="w-full max-w-[450px] px-5">
        {/* Icon Wrapper */}
        <div className="flex justify-center mb-10 relative">
          <div className="w-[70px] h-[70px] bg-indigo-500 rounded-full flex items-center justify-center relative">
            <svg 
              className="w-[35px] h-[35px] fill-white" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <div className="absolute top-0 right-0 w-[18px] h-[18px] bg-blue-500 rounded-full border-2 border-black"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-widest uppercase text-gray-300">
              Reset-password
        </h1>

        {/* Feedback */}
        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form id="resetForm" onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse mail"
              required
              autoComplete="email"
              disabled={loading}
              className="w-full py-5 px-7 bg-transparent border-[1.5px] border-white/15 rounded-full text-white text-[15px] outline-none transition-all duration-300 placeholder:text-white/35 focus:border-indigo-500/50 focus:bg-white/[0.02]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 border-none rounded-full text-white text-sm font-medium tracking-[3px] uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 mt-[30px] shadow-[0_8px_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(99,102,241,0.4)] active:translate-y-0 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg font-bold transition-transform duration-300 group-hover:translate-x-1">
             {loading ? 'ENVOI...' : 'Valider →'}
            </span>
          </button>
        </form>

        {/* Divider */}


        {/* Back Link */}
        <div className="text-center mt-[30px]">
          <Link
            to="/login"
            className="block text-sm text-gray-400 hover:text-purple-400 transition"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;