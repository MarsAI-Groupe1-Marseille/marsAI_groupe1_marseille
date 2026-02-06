import React, { useState } from 'react';
import axios from 'axios';

const SubmissionForm = () => {
  // --- ÉTATS (STATE) ---
  
  // 1. Infos Réalisateur & Film (Texte)
  const [formData, setFormData] = useState({
    // Réalisateur
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
    
    // Film - Titres & Synopsis
    title_original: '',
    title_english: '',
    synopsis_original: '',
    synopsis_english: '',
    
    // Film - Technique & IA
    duration_seconds: '',
    language_main: '',
    theme_tags: '',
    ai_classification: 'Hybrid', // ou '100% IA'
    ai_tools: '',
    ai_methodology: ''
  });

  // 2. Gestion des fichiers (File Objects)
  const [files, setFiles] = useState({
    video_file: null,
    poster_file: null,
    subtitle_file: null,
    gallery_files: [] // Tableau de fichiers
  });

  // 3. Liste dynamique des collaborateurs
  const [collaborators, setCollaborators] = useState([
    { first_name: '', last_name: '', role: '', email: '' } // Un collaborateur vide par défaut
  ]);

  // 4. États d'UI (Chargement, Message)
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // --- HANDLERS (Gestion des inputs) ---

  // Pour les champs textes simples
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Pour les fichiers
  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (name === 'gallery_files') {
      // Pour la galerie (multiple)
      setFiles(prev => ({ ...prev, [name]: Array.from(inputFiles) }));
    } else {
      // Pour les fichiers uniques (vidéo, affiche...)
      setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

  // --- GESTION COLLABORATEURS ---
  
  // Modifier un collaborateur spécifique
  const handleCollaboratorChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index][name] = value;
    setCollaborators(updatedCollaborators);
  };

  // Ajouter une ligne collaborateur
  const addCollaborator = () => {
    setCollaborators([...collaborators, { first_name: '', last_name: '', role: '', email: '' }]);
  };

  // Supprimer une ligne collaborateur
  const removeCollaborator = (index) => {
    const updatedCollaborators = collaborators.filter((_, i) => i !== index);
    setCollaborators(updatedCollaborators);
  };

  // --- SOUMISSION DU FORMULAIRE ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    // 📦 CRÉATION DU FORMDATA (Le colis pour le backend)
    const data = new FormData();

    // 1. Ajout des champs textes simples
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    // 2. Ajout des fichiers obligatoires/optionnels
    if (files.video_file) data.append('video_file', files.video_file);
    if (files.poster_file) data.append('poster_file', files.poster_file);
    if (files.subtitle_file) data.append('subtitle_file', files.subtitle_file);
    
    // Ajout galerie (boucle car multiple)
    files.gallery_files.forEach(file => {
      data.append('gallery_files', file);
    });

    // 3. TRANSFORMATIONS JSON (Le point crucial pour ton Controller !)
    // Pour les collaborateurs : Array -> JSON String
    data.append('collaborators_json', JSON.stringify(collaborators));

    // Pour les réseaux sociaux (Exemple simple fixe ici, à adapter si besoin)
    const socialLinks = { instagram: '', linkedin: '' }; // Tu pourrais lier ça à des champs inputs
    data.append('director_social_links', JSON.stringify(socialLinks));

    try {
      // 🚀 ENVOI VERS TON BACKEND
      const response = await axios.post('http://localhost:3000/api/submissions', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // Optionnel : Suivre la progression de l'upload
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      console.log("Succès :", response.data);
      setStatusMessage({ type: 'success', text: `Film envoyé ! ID YouTube: ${response.data.youtube_id}` });
      
    } catch (error) {
      console.error("Erreur upload :", error);
      const errorMsg = error.response?.data?.message || "Erreur lors de l'envoi.";
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER (AFFICHAGE) ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a0b2e] to-[#16001e] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Header avec gradient text */}
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
          




  
          {/* --- SECTION 1 : RÉALISATEUR --- */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-500/30">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            </div>
            <h2 className="text-2xl font-bold text-purple-300">Informations Réalisateur</h2>
            </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">Civilité</label>
                <select 
                  name="director_civility" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                >
                  <option value="M">Monsieur</option>
                  <option value="F">Madame</option>
                  <option value="NB">Non-binaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Prénom *</label>
                <input 
                  type="text" 
                  name="director_firstname" 
                  placeholder="Prénom" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Nom *</label>
                <input 
                  type="text" 
                  name="director_lastname" 
                  placeholder="Nom" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Email *</label>
                <input 
                  type="email" 
                  name="director_email" 
                  placeholder="votre@email.com" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Mobile *</label>
                <input 
                  type="tel" 
                  name="director_mobile" 
                  placeholder="+33 6 12 34 56 78" 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Date de naissance</label>
                <input 
                  type="date" 
                  name="director_birth_date" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Fonction / Job Title</label>
                <input 
                  type="text" 
                  name="director_job_title" 
                  placeholder="Réalisateur, Artiste IA..." 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-200 mb-2">Adresse complète</label>
                <input 
                  type="text" 
                  name="director_address" 
                  placeholder="Rue, numéro..." 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    name="director_zip_code" 
                    placeholder="Code Postal" 
                    onChange={handleChange} 
                    className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                  <input 
                    type="text" 
                    name="director_city" 
                    placeholder="Ville" 
                    onChange={handleChange} 
                    className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                  <input 
                    type="text" 
                    name="director_country" 
                    placeholder="Pays" 
                    onChange={handleChange} 
                    className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-center mt-2">
                <input 
                  type="checkbox" 
                  name="director_newsletter" 
                  onChange={handleChange} 
                  className="h-5 w-5 rounded border-purple-500/30 bg-slate-900/50 text-purple-500 focus:ring-purple-400/20 focus:ring-2"
                />
                <label className="ml-3 text-sm text-purple-100">S'inscrire à la newsletter MarsAI</label>
              </div>
            </div>
          </section>

          {/* --- SECTION 2 : FILM --- */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl basic p-8 border border-violet-500/20 shadow-2xl shadow-violet-500/10">
  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-violet-500/30">
    
    <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    </div>

    {/* Le texte (maintenant bien à côté) */}
    <h2 className="text-2xl font-bold text-violet-300">Votre Film</h2>
    
  </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Titre Original *</label>
                <input 
                  type="text" 
                  name="title_original" 
                  placeholder="Le titre de votre film" 
                  required 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Titre Anglais</label>
                <input 
                  type="text" 
                  name="title_english" 
                  placeholder="English title" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-violet-200 mb-2">Synopsis Original</label>
                <textarea 
                  name="synopsis_original" 
                  placeholder="Décrivez votre histoire..." 
                  rows="4" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-violet-200 mb-2">Synopsis Anglais</label>
                <textarea 
                  name="synopsis_english" 
                  placeholder="Describe your story..." 
                  rows="4" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Durée (secondes)</label>
                <input 
                  type="number" 
                  name="duration_seconds" 
                  placeholder="180" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Langue principale</label>
                <input 
                  type="text" 
                  name="language_main" 
                  placeholder="Français, English..." 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Thèmes / Tags</label>
                <input 
                  type="text" 
                  name="theme_tags" 
                  placeholder="Science-fiction, Drame, Expérimental..." 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-violet-200 mb-2">Classification IA</label>
                <select 
                  name="ai_classification" 
                  onChange={handleChange} 
                  className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 transition-all"
                >
                  <option value="Hybrid">Hybride</option>
                  <option value="100% IA">100% IA</option>
                </select>
              </div>
            </div>
          </section>

          {/* --- SECTION 3 : FICHIERS (UPLOAD) --- */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-fuchsia-500/20 shadow-2xl shadow-fuchsia-500/10">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-fuchsia-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-fuchsia-300">Fichiers</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">
                  Fichier Vidéo (MP4, MOV...) <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="video_file" 
                    accept="video/*" 
                    onChange={handleFileChange} 
                    required 
                    className="w-full bg-slate-900/50 border-2 border-dashed border-fuchsia-500/30 rounded-lg px-4 py-6 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white hover:file:from-fuchsia-600 hover:file:to-pink-600 file:cursor-pointer focus:outline-none focus:border-fuchsia-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">
                  Affiche / Poster (Image) <span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="poster_file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required 
                    className="w-full bg-slate-900/50 border-2 border-dashed border-fuchsia-500/30 rounded-lg px-4 py-6 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white hover:file:from-fuchsia-600 hover:file:to-pink-600 file:cursor-pointer focus:outline-none focus:border-fuchsia-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">
                  Sous-titres (.srt, .vtt) <span className="text-slate-400 text-xs">(Optionnel)</span>
                </label>
                <input 
                  type="file" 
                  name="subtitle_file" 
                  accept=".srt,.vtt" 
                  onChange={handleFileChange} 
                  className="w-full bg-slate-900/50 border border-fuchsia-500/30 rounded-lg px-4 py-4 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-fuchsia-500/20 file:text-fuchsia-300 hover:file:bg-fuchsia-500/30 file:cursor-pointer focus:outline-none focus:border-fuchsia-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-fuchsia-200 mb-2">
                  Galerie d'images <span className="text-slate-400 text-xs">(Multiple)</span>
                </label>
                <input 
                  type="file" 
                  name="gallery_files" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full bg-slate-900/50 border border-fuchsia-500/30 rounded-lg px-4 py-4 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-fuchsia-500/20 file:text-fuchsia-300 hover:file:bg-fuchsia-500/30 file:cursor-pointer focus:outline-none focus:border-fuchsia-400 transition-all"
                />
              </div>
            </div>
          </section>

          {/* --- SECTION 4 : COLLABORATEURS (DYNAMIQUE) --- */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-500/10">

  <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/30">
    
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-purple-300">Collaborateurs</h2>
    </div>

    <button 
      type="button" 
      onClick={addCollaborator} 
      className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold text-sm hover:from-purple-600 hover:to-violet-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
    >
      + Ajouter
    </button>

  </div>

            <div className="space-y-4">
              {collaborators.map((collab, index) => (
                <div key={index} className="relative bg-slate-900/30 border border-purple-500/20 rounded-xl p-5 hover:border-purple-500/40 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="first_name" 
                      placeholder="Prénom" 
                      value={collab.first_name} 
                      onChange={(e) => handleCollaboratorChange(index, e)} 
                      className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                    <input 
                      type="text" 
                      name="last_name" 
                      placeholder="Nom" 
                      value={collab.last_name} 
                      onChange={(e) => handleCollaboratorChange(index, e)} 
                      className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                    <input 
                      type="text" 
                      name="role" 
                      placeholder="Rôle (ex: Monteur, Sound Designer)" 
                      value={collab.role} 
                      onChange={(e) => handleCollaboratorChange(index, e)} 
                      className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email" 
                      value={collab.email} 
                      onChange={(e) => handleCollaboratorChange(index, e)} 
                      className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    />
                  </div>
                  
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeCollaborator(index)} 
                      className="absolute -right-3 -top-3 bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg hover:from-pink-600 hover:to-fuchsia-600 transition-all transform hover:scale-110"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* --- ACTIONS --- */}
          <div className="pt-6">
            {statusMessage && (
              <div className={`p-5 mb-6 rounded-xl backdrop-blur-xl border-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/50 text-red-300'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
                  <span className="font-medium">{statusMessage.text}</span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-5 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-[1.02] shadow-2xl ${
                isLoading 
                  ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 shadow-purple-500/50'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi & Upload YouTube en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Soumettre mon film
                </span>
              )}
            </button>

            <p className="text-center text-slate-400 text-sm mt-4">
              Marseille · Fevrier 2026
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;