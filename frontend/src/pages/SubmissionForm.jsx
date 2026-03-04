import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const SubmissionForm = () => {
  const { t } = useLanguage();
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

  const [socialLinks, setSocialLinks] = useState({
    website: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    vimeo: '',
    tiktok: '',
    x: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

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

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCollaborator = () => {
    setCollaborators([...collaborators, { first_name: '', last_name: '', role: '', email: '' }]);
  };

  const removeCollaborator = (index) => {
    setCollaborators(collaborators.filter((_, i) => i !== index));
  };

  const socialFieldLabelMap = {
    website: 'Site web',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    tiktok: 'TikTok',
    x: 'X / Twitter'
  };

  const isValidHttpsUrl = (value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:';
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    setValidationErrors([]);
    setUploadProgress(0);

    const socialLinkErrors = Object.entries(socialLinks)
      .filter(([, value]) => (value || '').trim() !== '')
      .filter(([, value]) => !isValidHttpsUrl(value.trim()))
      .map(([field]) => ({
        field: `director_social_links.${field}`,
        message: (t('submission_social_invalid_url') || 'URL invalide pour {label}. Utilisez un lien complet commençant par https://')
          .replace('{label}', socialFieldLabelMap[field] || field)
      }));

    if (socialLinkErrors.length > 0) {
      setValidationErrors(socialLinkErrors);
      setStatusMessage({
        type: 'error',
        text: t('submission_validation_error') || 'Erreurs de validation. Veuillez corriger les champs ci-dessous.'
      });
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.video_file) data.append('video_file', files.video_file);
    if (files.poster_file) data.append('poster_file', files.poster_file);
    if (files.subtitle_file) data.append('subtitle_file', files.subtitle_file);
    files.gallery_files.forEach(file => data.append('gallery_files', file));
    const socialLinksPayload = Object.fromEntries(
      Object.entries(socialLinks).filter(([, value]) => (value || '').trim() !== '')
    );
    
    data.append('collaborators_json', JSON.stringify(collaborators));
    data.append('director_social_links', JSON.stringify(socialLinksPayload));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/submissions`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setStatusMessage({ type: 'success', text: t('submission_success').replace('{youtube_id}', response.data.youtube_id) });
      setValidationErrors([]);
    } catch (error) {
      console.error('Erreur soumission:', error.response?.data);
      const responseData = error.response?.data || {};
      
      // Si c'est une erreur de validation (status 400)
      if (error.response?.status === 400 && responseData?.errors) {
        setValidationErrors(responseData.errors);
        setStatusMessage({ 
          type: 'error', 
          text: t('submission_validation_error') || 'Erreurs de validation. Veuillez corriger les champs ci-dessous.' 
        });
      } else if (error.response?.status === 400 && responseData?.field && responseData?.message) {
        setValidationErrors([{ field: responseData.field, message: responseData.message }]);
        setStatusMessage({
          type: 'error',
          text: t('submission_validation_error') || 'Erreurs de validation. Veuillez corriger les champs ci-dessous.'
        });
      } else if (error.response?.status === 400 && responseData?.error) {
        setValidationErrors([{ field: 'file', message: responseData.error }]);
        setStatusMessage({
          type: 'error',
          text: t('submission_validation_error') || 'Erreurs de validation. Veuillez corriger les champs ci-dessous.'
        });
      } else {
        // Autre type d'erreur
        setStatusMessage({ 
          type: 'error', 
          text: responseData?.message || t('submission_error') || 'Une erreur est survenue lors de la soumission.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#1a0b2e] to-[#16001e] relative overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">{t('submission_form_title')}</h1>
          <p className="text-purple-300 text-lg font-light tracking-wider italic">{t('submission_form_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1 : RÉALISATEUR */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b border-purple-500/30 pb-4">{t('submission_director_section')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-purple-200 mb-2">{t('submission_civility')}</label>
                <select name="director_civility" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400">
                  <option value="M">{t('submission_civility_mr')}</option>
                  <option value="F">{t('submission_civility_ms')}</option>
                  <option value="Iel">{t('submission_civility_nb')}</option>
                </select>
              </div>
              <input type="text" name="director_firstname" placeholder={t('submission_firstname')} onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="text" name="director_lastname" placeholder={t('submission_lastname')} onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="email" name="director_email" placeholder={t('submission_email')} onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="tel" name="director_mobile" placeholder={t('submission_mobile')} onChange={handleChange} required className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              <input type="date" name="director_birth_date" onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" title={t('submission_birth_date')} />
              <input type="text" name="director_job_title" placeholder={t('submission_job_title')} onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
              
              <div className="md:col-span-2 space-y-4">
                <input type="text" name="director_address" placeholder={t('submission_address')} onChange={handleChange} className="w-full bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="director_zip_code" placeholder={t('submission_zip_code')} onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="director_city" placeholder={t('submission_city')} onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="director_country" placeholder={t('submission_country')} onChange={handleChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center">
                <input type="checkbox" name="director_newsletter" onChange={handleChange} className="h-5 w-5 text-purple-500 bg-slate-900/50 border-purple-500/30" />
                <label className="ml-3 text-sm text-purple-100">{t('submission_newsletter')}</label>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-purple-200 mb-3">{t('submission_social_links_section')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="url" name="website" placeholder={t('submission_social_website')} value={socialLinks.website} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="instagram" placeholder={t('submission_social_instagram')} value={socialLinks.instagram} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="linkedin" placeholder={t('submission_social_linkedin')} value={socialLinks.linkedin} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="youtube" placeholder={t('submission_social_youtube')} value={socialLinks.youtube} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="vimeo" placeholder={t('submission_social_vimeo')} value={socialLinks.vimeo} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="tiktok" placeholder={t('submission_social_tiktok')} value={socialLinks.tiktok} onChange={handleSocialLinkChange} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                  <input type="url" name="x" placeholder={t('submission_social_x')} value={socialLinks.x} onChange={handleSocialLinkChange} className="md:col-span-2 bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400" />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 : FILM */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-violet-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-violet-300 mb-6 border-b border-violet-500/30 pb-4">{t('submission_film_section')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title_original" placeholder={t('submission_title_original')} required onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <input type="text" name="title_english" placeholder={t('submission_title_english')} onChange={handleChange} className="w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <textarea name="synopsis_original" placeholder={t('submission_synopsis_original')} rows="3" onChange={handleChange} className="md:col-span-2 w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              <textarea name="synopsis_english" placeholder={t('submission_synopsis_english')} rows="3" onChange={handleChange} className="md:col-span-2 w-full bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              
              <input type="number" name="duration_seconds" placeholder={t('submission_duration')} onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              <input type="text" name="language_main" placeholder={t('submission_language')} onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" />
              
              {/* INPUT THEME AVEC PLACEHOLDER EXPLICITE */}
              <input 
                type="text" 
                name="theme_tags" 
                placeholder={t('submission_themes')} 
                onChange={handleChange} 
                className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400" 
              />

              <select name="ai_classification" onChange={handleChange} className="bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-400">
                <option value="Hybrid">{t('submission_ai_hybrid')}</option>
                <option value="100% IA">{t('submission_ai_100percent')}</option>
              </select>
              <textarea name="ai_tools" placeholder={t('submission_ai_tools')} onChange={handleChange} className="md:col-span-2 bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
              <textarea name="ai_methodology" placeholder={t('submission_ai_methodology')} onChange={handleChange} className="md:col-span-2 bg-slate-900/50 border border-violet-500/30 rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-violet-400"></textarea>
            </div>
          </section>

          {/* SECTION 3 : FICHIERS (HARMONISÉS) */}
          <section className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-fuchsia-500/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-fuchsia-300 mb-6 border-b border-fuchsia-500/30 pb-4">{t('submission_media_section')}</h2>
            <div className="space-y-6">
              {[
                { label: t('submission_video_file'), name: 'video_file', accept: 'video/*', required: true },
                { label: t('submission_poster_file'), name: 'poster_file', accept: 'image/*', required: true },
                { label: t('submission_subtitle_file'), name: 'subtitle_file', accept: '.srt,.vtt', required: false },
                { label: t('submission_gallery_files'), name: 'gallery_files', accept: 'image/*', required: false, multiple: true }
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
              <h2 className="text-2xl font-bold text-purple-300">{t('submission_collaborators_section')}</h2>
              <button type="button" onClick={addCollaborator} className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white text-sm font-semibold hover:scale-105 transition-transform">{t('submission_add_collaborator')}</button>
            </div>
            <div className="space-y-4">
              {collaborators.map((collab, index) => (
                <div key={index} className="relative bg-slate-900/30 border border-purple-500/20 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="first_name" placeholder={t('submission_collab_firstname')} value={collab.first_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="last_name" placeholder={t('submission_collab_lastname')} value={collab.last_name} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="text" name="role" placeholder={t('submission_collab_role')} value={collab.role} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
                  <input type="email" name="email" placeholder={t('submission_collab_email')} value={collab.email} onChange={(e) => handleCollaboratorChange(index, e)} className="bg-slate-900/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400" />
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

            {/* AFFICHAGE DES ERREURS DE VALIDATION */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-5 rounded-xl border-2 bg-red-500/10 border-red-500/50">
                <h3 className="text-red-300 font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Erreurs de validation
                </h3>
                <ul className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-200 text-sm flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>
                        <span className="font-semibold text-red-300">{error.field}:</span> {error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={`w-full relative overflow-hidden py-5 rounded-xl text-white font-bold text-lg transition-transform hover:scale-[1.01] ${isLoading ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/40'}`}>
              {isLoading && <div className="absolute inset-0 bg-white/20 transition-all" style={{ width: `${uploadProgress}%` }}></div>}
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {uploadProgress < 100 ? t('submission_uploading').replace('{progress}', uploadProgress) : t('submission_finalizing')}
                  </>
                ) : t('submission_button')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;