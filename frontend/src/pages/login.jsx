import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion ici
    console.log('Login submitted:', formData);
  };

  const handleGoogleLogin = () => {
    // Redirection vers la page de connexion Google (URL fournie)
    window.location.href = 'https://accounts.google.com/v3/signin/accountchooser?continue=https%3A%2F%2Faccounts.google.com%2F&dsh=S1780675980%3A1770209050043930&followup=https%3A%2F%2Faccounts.google.com%2F&ifkv=AXbMIuBzVVGi3rsJSIXSwz7iZ6nvA0-N9WWDlsN6okg0aSsOY7seCtI2X_pvA9Nxzh4j-6iHMLrf&passive=1209600&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
  };

  const handleFacebookLogin = () => {
    // Logique de connexion Facebook
    console.log('Facebook login');
  };

  const handleAppleLogin = () => {
    // Logique de connexion Apple
    console.log('Apple login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col min-h-screen">

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md">
            {/* Icon and Title */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 tracking-widest text-gray-300">
              CONNEXION
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
                  placeholder="Adresse mail"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <input
                  type="password"
                  id="motDePasse"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-900/40 border border-gray-800 rounded-full focus:outline-none focus:border-purple-500 transition text-white placeholder-gray-500 text-sm"
                  placeholder="Mot de passe :"
                  required
                />
              </div>

              {/* Submit Button with gradient */}
              <div className="pt-4">
                <button
                  type="submit"
                   link to="/pages/register" className="w-full py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 hover:from-purple-600 hover:via-purple-700 hover:to-blue-600 rounded-full font-semibold transition text-white shadow-lg shadow-purple-500/50 flex items-center justify-center space-x-2 uppercase tracking-wider"
                >
                  <span>Connexion</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Social Login Buttons */}
            <div className="mt-8">
              <div className="flex items-center justify-center space-x-4">
                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  link url="https://accounts.google.com/v3/signin/identifier?dsh=S1812573153%3A1655944654029516&flowEntry=ServiceLogin&flowName=WebLiteSignIn&ifkv=AX3vH39E0iYVTmn-NoMNM_C35EPrno8LWsRx2Qhr0HApkVLZ-Zc_Vql8ouaSQOiXzEmthrpOPAV5" className="w-14 h-14 bg-gray-900/40 border border-gray-800 hover:border-gray-600 rounded-full flex items-center justify-center transition group"
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
            <div className="mt-8 text-center space-y-3">
              <link url="https://accounts.google.com/v3/signin/identifier?dsh=S1812573153%3A1655944654029516&flowEntry=ServiceLogin&flowName=WebLiteSignIn&ifkv=AX3vH39E0iYVTmn-NoMNM_C35EPrno8LWsRx2Qhr0HApkVLZ-Zc_Vql8ouaSQOiXzEmthrpOPAV5" className="block text-sm text-gray-400 hover:text-purple-400 transition">
                Mot de passe oublié ?
              </link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;