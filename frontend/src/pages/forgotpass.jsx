import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Un lien de réinitialisation a été envoyé à ${email}`);
    // Ici, vous ajouteriez votre logique d'envoi réelle
    // fetch('/api/reset-password', { ... })
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
              className="w-full py-5 px-7 bg-transparent border-[1.5px] border-white/15 rounded-full text-white text-[15px] outline-none transition-all duration-300 placeholder:text-white/35 focus:border-indigo-500/50 focus:bg-white/[0.02]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-400 border-none rounded-full text-white text-sm font-medium tracking-[3px] uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 mt-[30px] shadow-[0_8px_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(99,102,241,0.4)] active:translate-y-0 group"
          >
            VALIDER
            <span className="text-lg font-bold transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-[35px]">
          <button
            type="button"
            className="w-[50px] h-[50px] bg-[#1a1a1a] border border-white/15 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#252525] hover:border-white/25"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center mt-[30px]">
          <a 
            href="login.html" 
            className="text-white/50 no-underline text-sm transition-colors duration-300 hover:text-white"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;