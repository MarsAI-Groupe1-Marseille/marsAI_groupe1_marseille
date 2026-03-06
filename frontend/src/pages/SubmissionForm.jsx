import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import StarryBackground from '../components/StarryBackground.jsx';

const SubmissionForm = () => {
  const { t } = useLanguage();
  const [currentMode, setCurrentMode] = useState('dark');

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
    <>
      <StarryBackground />
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: ${currentMode === 'light' ? 'invert(0)' : 'invert(1)'};
            cursor: pointer;
          }
        `}
      </style>
      <div style={{
        minHeight: '100vh',
        backgroundColor: currentMode === 'light' ? '#ffffff' : '#0a0a12',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', 'rajdhani', sans-serif"
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: currentMode === 'light' ? '2.25rem' : '3rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: currentMode === 'light' ? '#000000' : '#ffffff',
              letterSpacing: '1px'
            }}>
              {t('submission_form_title')}
            </h1>
            <p style={{
              color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff',
              fontSize: '1.125rem',
              fontWeight: '300',
              letterSpacing: '2px',
              fontStyle: 'italic'
            }}>
              {t('submission_form_subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* SECTION 1 : RÉALISATEUR */}
          <section style={{
            backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(71, 38, 82, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff',
              marginBottom: '1.5rem',
              borderBottom: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
              paddingBottom: '1rem'
            }}>{t('submission_director_section')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label style={{ fontSize: '0.875rem', color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff' }}>{t('submission_civility')}</label>
                <select name="director_civility" onChange={handleChange} style={{
                  width: '100%',
                  backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                  border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: currentMode === 'light' ? '#000000' : '#ffffff'
                }}>
                  <option value="M">{t('submission_civility_mr')}</option>
                  <option value="F">{t('submission_civility_ms')}</option>
                  <option value="Iel">{t('submission_civility_nb')}</option>
                </select>
              </div>
              <input type="text" name="director_firstname" placeholder={t('submission_firstname')} onChange={handleChange} required style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="text" name="director_lastname" placeholder={t('submission_lastname')} onChange={handleChange} required style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="email" name="director_email" placeholder={t('submission_email')} onChange={handleChange} required style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="tel" name="director_mobile" placeholder={t('submission_mobile')} onChange={handleChange} required style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="date" name="director_birth_date" onChange={handleChange} style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} title={t('submission_birth_date')} />
              <input type="text" name="director_job_title" placeholder={t('submission_job_title')} onChange={handleChange} style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              
              <div className="md:col-span-2 space-y-4">
                <input type="text" name="director_address" placeholder={t('submission_address')} onChange={handleChange} style={{
                  width: '100%',
                  backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                  border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: currentMode === 'light' ? '#000000' : '#ffffff'
                }} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" name="director_zip_code" placeholder={t('submission_zip_code')} onChange={handleChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="text" name="director_city" placeholder={t('submission_city')} onChange={handleChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="text" name="director_country" placeholder={t('submission_country')} onChange={handleChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center">
                <input type="checkbox" name="director_newsletter" onChange={handleChange} style={{
                  accentColor: currentMode === 'light' ? '#7c3aed' : '#7b2fff'
                }} />
                <label style={{ marginLeft: '0.75rem', fontSize: '0.875rem', color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff' }}>{t('submission_newsletter')}</label>
              </div>

              <div className="md:col-span-2">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff' }}>{t('submission_social_links_section')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="url" name="website" placeholder={t('submission_social_website')} value={socialLinks.website} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="instagram" placeholder={t('submission_social_instagram')} value={socialLinks.instagram} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="linkedin" placeholder={t('submission_social_linkedin')} value={socialLinks.linkedin} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="youtube" placeholder={t('submission_social_youtube')} value={socialLinks.youtube} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="vimeo" placeholder={t('submission_social_vimeo')} value={socialLinks.vimeo} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="tiktok" placeholder={t('submission_social_tiktok')} value={socialLinks.tiktok} onChange={handleSocialLinkChange} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="url" name="x" placeholder={t('submission_social_x')} value={socialLinks.x} onChange={handleSocialLinkChange} className="md:col-span-2" style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 : FILM */}
          <section style={{
            backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(71, 38, 82, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: currentMode === 'light' ? '#7c3aed' : '#d8b4fe',
              marginBottom: '1.5rem',
              borderBottom: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
              paddingBottom: '1rem'
            }}>{t('submission_film_section')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title_original" placeholder={t('submission_title_original')} required onChange={handleChange} style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="text" name="title_english" placeholder={t('submission_title_english')} onChange={handleChange} style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <textarea name="synopsis_original" placeholder={t('submission_synopsis_original')} rows="3" onChange={handleChange} className="md:col-span-2" style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                resize: 'none'
              }}></textarea>
              <textarea name="synopsis_english" placeholder={t('submission_synopsis_english')} rows="3" onChange={handleChange} className="md:col-span-2" style={{
                width: '100%',
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                resize: 'none'
              }}></textarea>
              
              <input type="number" name="duration_seconds" placeholder={t('submission_duration')} onChange={handleChange} style={{
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              <input type="text" name="language_main" placeholder={t('submission_language')} onChange={handleChange} style={{
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }} />
              
              <input 
                type="text" 
                name="theme_tags" 
                placeholder={t('submission_themes')} 
                onChange={handleChange} 
                style={{
                  backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                  border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  color: currentMode === 'light' ? '#000000' : '#ffffff'
                }} 
              />

              <select name="ai_classification" onChange={handleChange} style={{
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff'
              }}>
                <option value="Hybrid">{t('submission_ai_hybrid')}</option>
                <option value="100% IA">{t('submission_ai_100percent')}</option>
              </select>
              <textarea name="ai_tools" placeholder={t('submission_ai_tools')} onChange={handleChange} className="md:col-span-2" style={{
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                resize: 'none'
              }}></textarea>
              <textarea name="ai_methodology" placeholder={t('submission_ai_methodology')} onChange={handleChange} className="md:col-span-2" style={{
                backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                border: `1px solid ${currentMode === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(167, 34, 255, 0.2)'}`,
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                color: currentMode === 'light' ? '#000000' : '#ffffff',
                resize: 'none'
              }}></textarea>
            </div>
          </section>

          {/* SECTION 3 : FICHIERS (HARMONISÉS) */}
          <section style={{
            backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(71, 38, 82, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: `1px solid ${currentMode === 'light' ? 'rgba(217, 70, 239, 0.2)' : 'rgba(217, 70, 239, 0.2)'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: currentMode === 'light' ? '#d946ef' : '#f0abfc',
              marginBottom: '1.5rem',
              borderBottom: `1px solid ${currentMode === 'light' ? 'rgba(217, 70, 239, 0.2)' : 'rgba(217, 70, 239, 0.2)'}`,
              paddingBottom: '1rem'
            }}>{t('submission_media_section')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: t('submission_video_file'), name: 'video_file', accept: 'video/*', required: true },
                { label: t('submission_poster_file'), name: 'poster_file', accept: 'image/*', required: true },
                { label: t('submission_subtitle_file'), name: 'subtitle_file', accept: '.srt,.vtt', required: false },
                { label: t('submission_gallery_files'), name: 'gallery_files', accept: 'image/*', required: false, multiple: true }
              ].map((input) => (
                <div key={input.name}>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: currentMode === 'light' ? '#d946ef' : '#f0abfc', marginBottom: '0.5rem' }}>{input.label}</label>
                  <input 
                    type="file" 
                    name={input.name} 
                    accept={input.accept} 
                    multiple={input.multiple}
                    onChange={handleFileChange} 
                    required={input.required}
                    style={{
                      width: '100%',
                      backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                      border: `2px dashed ${currentMode === 'light' ? 'rgba(217, 70, 239, 0.3)' : 'rgba(217, 70, 239, 0.3)'}`,
                      borderRadius: '0.5rem',
                      padding: '1.5rem 1rem',
                      color: currentMode === 'light' ? '#000000' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4 : COLLABORATEURS */}
          <section style={{
            backgroundColor: currentMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(71, 38, 82, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}` }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: currentMode === 'light' ? '#7c3aed' : '#e9d5ff' }}>{t('submission_collaborators_section')}</h2>
              <button type="button" onClick={addCollaborator} style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                background: 'linear-gradient(to right, #a855f7, #7c3aed)',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>{t('submission_add_collaborator')}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {collaborators.map((collab, index) => (
                <div key={index} style={{
                  position: 'relative',
                  backgroundColor: currentMode === 'light' ? 'rgba(243, 240, 255, 0.5)' : 'rgba(71, 38, 82, 0.3)',
                  border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr 1fr 1fr' }
                }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" name="first_name" placeholder={t('submission_collab_firstname')} value={collab.first_name} onChange={(e) => handleCollaboratorChange(index, e)} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="text" name="last_name" placeholder={t('submission_collab_lastname')} value={collab.last_name} onChange={(e) => handleCollaboratorChange(index, e)} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="text" name="role" placeholder={t('submission_collab_role')} value={collab.role} onChange={(e) => handleCollaboratorChange(index, e)} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  <input type="email" name="email" placeholder={t('submission_collab_email')} value={collab.email} onChange={(e) => handleCollaboratorChange(index, e)} style={{
                    backgroundColor: currentMode === 'light' ? '#f3f0ff' : 'rgba(71, 38, 82, 0.5)',
                    border: `1px solid ${currentMode === 'light' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(160, 33, 255, 0.2)'}`,
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    color: currentMode === 'light' ? '#000000' : '#ffffff'
                  }} />
                  {index > 0 && (
                    <button type="button" onClick={() => removeCollaborator(index)} style={{
                      position: 'absolute',
                      right: '-0.5rem',
                      top: '-0.5rem',
                      backgroundColor: '#ec4899',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '1.5rem',
                      height: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS & SUBMIT */}
          <div style={{ paddingTop: '1.5rem' }}>
            {statusMessage && (
              <div style={{
                padding: '1rem',
                marginBottom: '1.5rem',
                borderRadius: '0.75rem',
                border: '2px solid',
                ...(statusMessage.type === 'success' ? {
                  backgroundColor: currentMode === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  color: currentMode === 'light' ? '#059669' : '#6ee7b7'
                } : {
                  backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: currentMode === 'light' ? '#dc2626' : '#fca5a5'
                })
              }}>
                {statusMessage.text}
              </div>
            )}

            {/* AFFICHAGE DES ERREURS DE VALIDATION */}
            {validationErrors.length > 0 && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                backgroundColor: currentMode === 'light' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'
              }}>
                <h3 style={{ color: currentMode === 'light' ? '#dc2626' : '#fca5a5', fontWeight: 'bold', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Erreurs de validation
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {validationErrors.map((error, index) => (
                    <li key={index} style={{ color: currentMode === 'light' ? '#b91c1c' : '#fca5a5', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: currentMode === 'light' ? '#dc2626' : '#fca5a5', fontWeight: 'bold' }}>•</span>
                      <span>
                        <span style={{ fontWeight: '600', color: currentMode === 'light' ? '#dc2626' : '#fca5a5' }}>{error.field}:</span> {error.message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" disabled={isLoading} style={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              transition: 'transform 0.2s',
              border: 'none',
              cursor: isLoading ? 'wait' : 'pointer',
              background: isLoading ? '#404040' : 'linear-gradient(to right, #06b6d4, #a855f7, #ec4899)',
              boxShadow: isLoading ? 'none' : '0 20px 25px -5px rgba(168, 85, 247, 0.4)'
            }}>
              {isLoading && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.2)', transition: 'all 0.3s', width: `${uploadProgress}%` }}></div>}
              <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
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
    </>
  );
};

export default SubmissionForm;