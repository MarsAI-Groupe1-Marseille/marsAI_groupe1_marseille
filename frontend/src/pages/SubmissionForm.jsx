import React, { useState } from 'react';
import axios from 'axios';

const SubmissionForm = () => {
  // --- ÉTATS (STATE) ---
  
  // 1. Infos Réalisateur & Film (Texte)
  const [formData, setFormData] = useState({
    director_civility: 'M',
    director_firstname: '',
    director_lastname: '',
    director_birth_date: '',
    director_email: '',
    director_phone: '',
    director_mobile: '',
    director_address: '',
    director_zip_code: '',
    director_city: '',
    director_country: '',
    director_job_title: '',
    director_marketing_source: '',
    director_newsletter: false,
    title_original: '',
    title_english: '',
    synopsis_original: '',
    synopsis_english: '',
    duration_seconds: '',
    language_main: '',
    theme_tags: '',
    ai_classification: 'Hybrid',
    ai_tools: '',
    ai_methodology: ''
  });

  // 2. Gestion des fichiers
  const [files, setFiles] = useState({
    video_file: null,
    poster_file: null,
    subtitle_file: null,
    gallery_files: []
  });

  // 3. Liste dynamique des collaborateurs
  const [collaborators, setCollaborators] = useState([
    { first_name: '', last_name: '', role: '', email: '' }
  ]);

  // 4. États d'UI (Chargement, Message, Progression)
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // <-- NOUVEAU
  const [statusMessage, setStatusMessage] = useState(null);

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (name === 'gallery_files') {
      setFiles(prev => ({ ...prev, [name]: Array.from(inputFiles) }));
    } else {
      setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

  const handleCollaboratorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index][name] = value;
    setCollaborators(updatedCollaborators);
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, { first_name: '', last_name: '', role: '', email: '' }]);
  };

  const removeCollaborator = (index) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  // --- SOUMISSION ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setUploadProgress(0);

    const data = new FormData();

    // 1. Textes
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    // 2. Fichiers
    if (files.video_file) data.append('video_file', files.video_file);
    if (files.poster_file) data.append('poster_file', files.poster_file);
    if (files.subtitle_file) data.append('subtitle_file', files.subtitle_file);
    files.gallery_files.forEach(file => data.append('gallery_files', file));

    // 3. JSON
    data.append('collaborators_json', JSON.stringify(collaborators));
    data.append('director_social_links', JSON.stringify({ instagram: '', linkedin: '' }));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/submissions`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setStatusMessage({ 
        type: 'success', 
        text: `Succès ! Film reçu et envoyé sur YouTube (ID: ${response.data.youtube_id})` 
      });
      
    } catch (error) {
      console.error("Erreur upload :", error);
      setStatusMessage({ 
        type: 'error', 
        text: error.response?.data?.message || "Erreur lors de l'envoi." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a0b2e] to-[#16001e] relative overflow-hidden font-sans">
      {/* Background Animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            MarsAI Festival
          </h1>
          <p className="text-purple-300 text-lg font-light tracking-wider">
            Courts-métrages générés par Intelligence Artificielle
          </p>
          <div className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1 : RÉALISATEUR */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-purple-300">Informations Réalisateur</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">Civilité</label>
                <select name="director_civility" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                  <option value="M">Monsieur</option>
                  <option value="F">Madame</option>
                  <option value="NB">Non-binaire</option>
                </select>
              </div>
              <input type="text" name="director_firstname" placeholder="Prénom *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400" />
              <input type="text" name="director_lastname" placeholder="Nom *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400" />
              <input type="email" name="director_email" placeholder="Email *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400" />
              <input type="tel" name="director_mobile" placeholder="Mobile *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400" />
            </div>
          </section>

          {/* SECTION 2 : FILM */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-violet-500/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-violet-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-violet-300">Votre Film</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title_original" placeholder="Titre Original *" required onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <input type="text" name="title_english" placeholder="Titre Anglais" onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <textarea name="synopsis_original" placeholder="Synopsis Original" rows="4" onChange={handleChange} className="md:col-span-2 w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400 resize-none"></textarea>
            </div>
          </section>

          {/* SECTION 3 : FICHIERS */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-fuchsia-500/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-fuchsia-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-fuchsia-300">Fichiers (Upload S3)</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">Vidéo (MP4, MOV) *</label>
                <input type="file" name="video_file" accept="video/*" onChange={handleFileChange} required className="w-full bg-slate-900/50 border-2 border-dashed border-fuchsia-500/30 rounded-lg px-4 py-6 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white file:border-0 cursor-pointer" />
              </div>

              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">Affiche (Image) *</label>
                <input type="file" name="poster_file" accept="image/*" onChange={handleFileChange} required className="w-full bg-slate-900/50 border-2 border-dashed border-fuchsia-500/30 rounded-lg px-4 py-6 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white file:border-0 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* SECTION 4 : COLLABORATEURS */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-300">Collaborateurs</h2>
              <button type="button" onClick={addCollaborator} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-sm transform hover:scale-105 transition-all shadow-lg">
                + Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {collaborators.map((collab, index) => (
                <div key={index} className="relative bg-slate-900/30 border border-purple-500/20 rounded-xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="first_name" placeholder="Prénom" value={collab.first_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400" />
                    <input type="text" name="last_name" placeholder="Nom" value={collab.last_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400" />
                  </div>
                  {index > 0 && (
                    <button type="button" onClick={() => removeCollaborator(index)} className="absolute -right-3 -top-3 bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg hover:scale-110 transition-all">✕</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS & PROGRESS BAR */}
          <div className="pt-6">
            {statusMessage && (
              <div className={`p-5 mb-6 rounded-xl border-2 backdrop-blur-xl ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-red-500/10 border-red-500/50 text-red-300'}`}>
                {statusMessage.text}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full relative overflow-hidden py-5 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-[1.01] shadow-2xl ${
                isLoading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500'
              }`}
            >
              {/* Overlay de progression */}
              {isLoading && (
                <div 
                  className="absolute inset-0 bg-white/20 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              )}

              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {uploadProgress < 100 
                      ? `Upload en cours : ${uploadProgress}%` 
                      : "Finalisation YouTube..."}
                  </>
                ) : "Soumettre mon film"}
              </span>
            </button>
            <p className="text-center text-slate-400 text-sm mt-4">Marseille · Fevrier 2026</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;