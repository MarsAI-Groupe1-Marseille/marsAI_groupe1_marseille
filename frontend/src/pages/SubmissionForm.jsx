import React, { useState } from 'react';
import axios from '../config/axiosConfig';

const SubmissionForm = () => {
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

  const [files, setFiles] = useState({
    video_file: null,
    poster_file: null,
    subtitle_file: null,
    gallery_files: []
  });

  const [collaborators, setCollaborators] = useState([
    { first_name: '', last_name: '', role: '', email: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setUploadProgress(0);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.video_file) data.append('video_file', files.video_file);
    if (files.poster_file) data.append('poster_file', files.poster_file);
    if (files.subtitle_file) data.append('subtitle_file', files.subtitle_file);
    files.gallery_files.forEach(file => data.append('gallery_files', file));
    
    data.append('collaborators_json', JSON.stringify(collaborators));
    data.append('director_social_links', JSON.stringify({ instagram: '', linkedin: '' }));

    try {
      const response = await axios.post('/submissions', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setStatusMessage({ type: 'success', text: `Succès ! Film reçu et envoyé sur YouTube (ID: ${response.data.youtube_id})` });
    } catch (error) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || "Erreur lors de l'envoi." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a0b2e] to-[#16001e] relative overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">MarsAI Festival</h1>
          <p className="text-purple-300 text-lg font-light tracking-wider italic">Générations du Futur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1 : RÉALISATEUR */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-purple-500/30 pb-4">Informations Réalisateur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-purple-200 mb-2">Civilité</label>
                <select name="director_civility" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                  <option value="M">Monsieur</option>
                  <option value="F">Madame</option>
                  <option value="NB">Non-binaire</option>
                </select>
              </div>
              <input type="text" name="director_firstname" placeholder="Prénom *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="text" name="director_lastname" placeholder="Nom *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="email" name="director_email" placeholder="Email *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="tel" name="director_mobile" placeholder="Mobile *" onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="date" name="director_birth_date" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="text" name="director_job_title" placeholder="Fonction / Job Title" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              
              <div className="md:col-span-2 space-y-4">
                <input type="text" name="director_address" placeholder="Adresse (Rue, numéro...)" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="director_zip_code" placeholder="Code Postal" onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="director_city" placeholder="Ville" onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="director_country" placeholder="Pays" onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center">
                <input type="checkbox" name="director_newsletter" onChange={handleChange} className="h-5 w-5 text-purple-500 bg-slate-900/50 border-purple-500/30" />
                <label className="ml-3 text-sm text-purple-100">S'inscrire à la newsletter MarsAI</label>
              </div>
            </div>
          </section>

          {/* SECTION 2 : FILM */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-violet-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-violet-300 mb-6 border-b border-violet-500/30 pb-4">Votre Film</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title_original" placeholder="Titre Original *" required onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <input type="text" name="title_english" placeholder="Titre Anglais" onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <textarea name="synopsis_original" placeholder="Synopsis Original" rows="3" onChange={handleChange} className="md:col-span-2 w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              <textarea name="synopsis_english" placeholder="Synopsis Anglais" rows="3" onChange={handleChange} className="md:col-span-2 w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              
              <input type="number" name="duration_seconds" placeholder="Durée (secondes)" onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <input type="text" name="language_main" placeholder="Langue principale" onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              
              {/* INPUT THEME AVEC PLACEHOLDER EXPLICITE */}
              <input 
                type="text" 
                name="theme_tags" 
                placeholder="Thèmes / Tags (ex: Science-fiction, Cyberpunk, Drame, IA...)" 
                onChange={handleChange} 
                className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" 
              />

              <select name="ai_classification" onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400">
                <option value="Hybrid">Hybride</option>
                <option value="100% IA">100% IA</option>
              </select>
              <textarea name="ai_tools" placeholder="Outils IA utilisés (ex: Sora, Runway, Midjourney...)" onChange={handleChange} className="md:col-span-2 bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              <textarea name="ai_methodology" placeholder="Méthodologie (Prompt engineering, process...)" onChange={handleChange} className="md:col-span-2 bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
            </div>
          </section>

          {/* SECTION 3 : FICHIERS (HARMONISÉS) */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-fuchsia-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-6 border-b border-fuchsia-500/30 pb-4">Fichiers Médias</h2>
            <div className="space-y-6">
              {[
                { label: 'Vidéo du film (MP4, MOV, AVI, MKV) *', name: 'video_file', accept: 'video/*', required: true },
                { label: 'Affiche / Poster (PNG, JPG, WEBP, JPEG) *', name: 'poster_file', accept: 'image/*', required: true },
                { label: 'Sous-titres (.srt, .vtt)', name: 'subtitle_file', accept: '.srt,.vtt', required: false },
                { label: "Galerie d'images (Plusieurs fichiers possibles)", name: 'gallery_files', accept: 'image/*', required: false, multiple: true }
              ].map((input) => (
                <div key={input.name}>
                  <label className="block text-sm text-fuchsia-200 mb-2">{input.label}</label>
                  <input 
                    type="file" 
                    name={input.name} 
                    accept={input.accept} 
                    multiple={input.multiple}
                    onChange={handleFileChange} 
                    required={input.required} 
                    className="w-full bg-slate-900/50 border-2 border-dashed border-fuchsia-500/30 rounded-lg px-4 py-6 text-white file:mr-4 file:py-2 file:px-6 file:rounded-full file:bg-gradient-to-r file:from-fuchsia-500 file:to-pink-500 file:text-white file:border-0 cursor-pointer hover:border-fuchsia-400/50 transition-all"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4 : COLLABORATEURS */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/30">
              <h2 className="text-2xl font-bold text-purple-300">Collaborateurs</h2>
              <button type="button" onClick={addCollaborator} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold hover:scale-105 transition-transform">+ Ajouter</button>
            </div>
            <div className="space-y-4">
              {collaborators.map((collab, index) => (
                <div key={index} className="relative bg-slate-900/30 border border-purple-500/20 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="first_name" placeholder="Prénom" value={collab.first_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="last_name" placeholder="Nom" value={collab.last_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="role" placeholder="Rôle (ex: Monteur, Sound Designer)" value={collab.role} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="email" name="email" placeholder="Email" value={collab.email} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  {index > 0 && (
                    <button type="button" onClick={() => removeCollaborator(index)} className="absolute -right-2 -top-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS & SUBMIT */}
          <div className="pt-6">
            {statusMessage && (
              <div className={`p-4 mb-6 rounded-xl border-2 ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-red-500/10 border-red-500/50 text-red-300'}`}>
                {statusMessage.text}
              </div>
            )}
            <button type="submit" disabled={isLoading} className={`w-full relative overflow-hidden py-5 rounded-xl text-white font-bold text-lg transition-transform hover:scale-[1.01] ${isLoading ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40'}`}>
              {isLoading && <div className="absolute inset-0 bg-white/20 transition-all" style={{ width: `${uploadProgress}%` }}></div>}
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {uploadProgress < 100 ? `Upload Cloud : ${uploadProgress}%` : "Finalisation YouTube..."}
                  </>
                ) : "Soumettre mon film"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;