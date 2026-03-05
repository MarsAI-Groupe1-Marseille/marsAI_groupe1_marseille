import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig'; 
import { useLanguage } from '../context/LanguageContext';
import { 
  Share2, Heart, MessageCircle, Play, Info, Globe, Calendar, 
  Film, Users, Zap, Code2, ChevronLeft, Volume2, Maximize2,
  BarChart3, Clock, User, Mail, MapPin, X
} from 'lucide-react';
import './film_detail.css';
import StarryBackground from '../components/StarryBackground.jsx';

export default function FilmDetail() {
  // Hook pour les traductions
  const { t, lang } = useLanguage();
  
  // ========== ÉTATS ==========
  const [isLiked, setIsLiked] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [film, setFilm] = useState(null);
  const [director, setDirector] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [relatedFilms, setRelatedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // ========== HOOKS ==========
  const { id } = useParams();
  const navigate = useNavigate();

  // ========== DONNÉES FICTIVES (Fallback si API non disponible) ==========
  const fictionalFilm = {
    id: 1,
    title_original: "SYNTHETICA : L'AUBE",
    title_english: "SYNTHETICA: Dawn",
    director_id: 1,
    poster_url: "https://images.unsplash.com/photo-1579954614171-828baf2dcef5?w=800&h=450&fit=crop",
    synopsis_original: "Dans un monde où la réalité s'efface à peine devant une intelligence artificielle omnipotente, un groupe de créateurs repousse les limites technologiques pour construire une nouvelle société.",
    synopsis_english: "In a world where reality barely fades before omnipotent artificial intelligence, a group of creators pushes technological limits to build a new society.",
    duration_seconds: 5220,
    language_main: "fr",
    theme_tags: "Science-Fiction,Drame,Expérimental",
    ai_classification: "100% IA",
    ai_tools: "Midjourney, Runway, Stable Diffusion",
    ai_methodology: "Utilisation d'IA générative pour tous les éléments visuels avec supervision créative humaine",
    youtube_id: "dQw4w9WgXcQ",
    gallery_urls: ["https://images.unsplash.com/photo-1579954614171-828baf2dcef5?w=400&h=300", "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300"],
    created_at: new Date().toISOString()
  };

  const fictionalDirector = {
    id: 1,
    first_name: "Jean",
    last_name: "Duverneil",
    email: "jean.duverneil@example.com",
    mobile: "+33 6 XX XX XX XX",
    city: "Paris",
    country: "France",
    job_title: "Réalisateur & Directeur Artistique"
  };

  const fictionalCollaborators = [
    { id: 1, role: "Cinématographie", first_name: "Michel", last_name: "Laurent" },
    { id: 2, role: "Montage", first_name: "Sophie", last_name: "Marchand" },
    { id: 3, role: "Musique", first_name: "Yann", last_name: "Tiersen" },
    { id: 4, role: "Design Sonore", first_name: "David", last_name: "Arnold" }
  ];

  const fictionalRelated = [
    { 
      id: 2, 
      title_original: "NUIT ÉTOILÉE", 
      first_name: "Sophie",
      last_name: "Marchand",
      poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop" 
    },
    { 
      id: 3, 
      title_original: "HORIZON NOUVEAU", 
      first_name: "Marc",
      last_name: "Delacroix",
      poster_url: "https://images.unsplash.com/photo-1595429676179-444eb8479eca?w=300&h=400&fit=crop" 
    },
    { 
      id: 4, 
      title_original: "ÉCHO FUTUR", 
      first_name: "Clara",
      last_name: "Rousseau",
      poster_url: "https://images.unsplash.com/photo-1489599849228-bed96c3f6098?w=300&h=400&fit=crop" 
    }
  ];

  // ========== CHARGEMENT DES DONNÉES ==========
  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/submissions/${id}`);
        console.log(res.data);
        
        // Utilise les vraies données de l'API
        setFilm(res.data);
        setDirector(res.data.Director);
        setCollaborators(res.data.Collaborators || []);
        
        // TODO: Implémenter l'API pour les films similaires
        setRelatedFilms(fictionalRelated);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du film:', err);
        setError(t('film_detail_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchFilmDetails();
  }, [id]);

  // ========== FONCTIONS UTILITAIRES ==========
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderLoading = () => (
    <div className="film-detail-container loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">{t('film_detail_loading')}</p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="film-detail-container error-container">
      <p className="error-message">{error}</p>
      <button
        onClick={() => navigate('/galerie')}
        className="error-button"
      >
        <ChevronLeft className="w-4 h-4" /> {t('film_detail_back')}
      </button>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!film) return renderError();

  const tags = film.theme_tags ? film.theme_tags.split(',').map(tag => tag.trim()) : [];
  const duration = formatDuration(film.duration_seconds);
  const directorName = director ? `${director.first_name} ${director.last_name}` : 'N/A';
  
  // Helper pour les URLs d'images
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
  };
  
  // Fonction robuste pour parser gallery_urls (string ou array)
  const parseGalleryUrls = (galleryData) => {
    if (!galleryData) return [];
    // Si c'est déjà un array, retourner directement
    if (Array.isArray(galleryData)) return galleryData;
    // Si c'est une string, essayer de la parser
    if (typeof galleryData === 'string') {
      try {
        return JSON.parse(galleryData);
      } catch (e) {
        console.error('Erreur lors du parsing de gallery_urls:', e);
        return [];
      }
    }
    return [];
  };
  
  // Formater le statut d'approbation
  const formatApprovalStatus = (status) => {
    const statuses = {
      'submitted': t('film_detail_status_pending'),
      'approved': t('film_detail_status_approved'),
      'rejected': t('film_detail_status_rejected')
    };
    return statuses[status] || status;
  };

  return (
    <>
      <StarryBackground />
      <div className="film-detail-container" style={{ position: 'relative', zIndex: 2 }}>
      <main className="film-detail-main">
        {/* Bouton retour simple en haut */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 16px 0 16px' }}>
          <button
            onClick={() => navigate('/galerie')}
            className="back-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#b0b0d0', fontWeight: '600', marginBottom: '20px' }}
          >
            <ChevronLeft className="w-5 h-5" /> {t('film_detail_back')}
          </button>
        </div>
        
        <div className="film-detail-grid">
          {/* ========== COLONNE PRINCIPALE ========== */}
          <div className="film-detail-main-content">
            
            {/* IMAGE INTERACTIVE */}
            <div className="film-poster-container">
              <img 
                src={getImageUrl(film.poster_url)} 
                alt={film.title_original}
              />
              
              {/* Overlay avec gradient au survol */}
              <div className="film-poster-overlay">
                <button 
                  onClick={() => setIsPlayingVideo(true)}
                  className="film-poster-button"
                  style={{ background: 'rgba(255, 0, 150, 0.3)' }}
                >
                  <Play className="w-8 h-8" style={{ fill: 'white' }} />
                </button>
                <button className="film-poster-button">
                  <Volume2 className="w-8 h-8" style={{ fill: 'white' }} />
                </button>
                <button className="film-poster-button">
                  <Maximize2 className="w-8 h-8" />
                </button>
              </div>

              {/* Badge IA */}
              <div className="film-poster-badge">
                <Zap className="w-4 h-4" />
                {film.ai_classification}
              </div>
            </div>

            {/* TITRE ET INFOS PRINCIPALES */}
            <div className="film-info-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <h1>{film.title_original}</h1>
                  {film.title_english && (
                    <p className="subtitle">{film.title_english}</p>
                  )}
                  <p className="director">
                    {t('film_detail_directed_by')} <span className="director-name">{directorName}</span>
                  </p>
                </div>

                {/* Boutons d'interaction */}
                <div className="action-buttons">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    title={t('film_detail_like')}
                  >
                    <Heart className="w-6 h-6" style={{ fill: isLiked ? 'white' : 'none' }} />
                  </button>
                  <button 
                    className="action-button"
                    title={t('film_detail_share')}
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Infos rapides */}
              <div className="quick-info">
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Clock className="w-4 h-4" /> {t('film_detail_duration')}
                  </p>
                  <p className="quick-info-value">{duration}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Globe className="w-4 h-4" /> {t('film_detail_language')}
                  </p>
                  <p className="quick-info-value">{film.language_main}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Zap className="w-4 h-4" /> {t('film_detail_ai')}
                  </p>
                  <p className="quick-info-value">{film.ai_classification}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <BarChart3 className="w-4 h-4" /> {t('film_detail_status')}
                  </p>
                  <p className="quick-info-value" style={{ color: film.approval_status === 'approved' ? '#4ade80' : film.approval_status === 'rejected' ? '#f87171' : '#fbbf24' }}>
                    {formatApprovalStatus(film.approval_status)}
                  </p>
                </div>
              </div>
            </div>

            {/* THÈMES ET TAGS */}
            {tags.length > 0 && (
              <div className="tags-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film className="w-5 h-5" /> {t('film_detail_themes')}
                </h3>
                <div className="tags-container">
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SYNOPSIS */}
            <div className="synopsis-section">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info className="w-6 h-6" style={{ color: '#ffb3ff' }} /> {t('film_detail_synopsis')}
              </h2>
              <p className="synopsis-text">
                {showFullSynopsis ? film.synopsis_english || film.synopsis_original : film.synopsis_original}
              </p>
              {film.synopsis_english && (
                <button 
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="synopsis-toggle"
                >
                  {showFullSynopsis ? t('film_detail_see_less') : t('film_detail_see_english')}
                </button>
              )}
            </div>

            {/* MÉTHODOLOGIE IA */}
            {film.ai_methodology && (
              <div className="ai-methodology-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 className="w-6 h-6" style={{ color: '#ffb3ff' }} /> {t('film_detail_methodology')}
                </h2>
                <p className="ai-text">{film.ai_methodology}</p>
                {film.ai_tools && (
                  <div className="tools-container">
                    <p className="tools-label">{t('film_detail_tools_used')}</p>
                    <div className="tools-list">
                      {film.ai_tools.split(',').map((tool) => (
                        <span key={tool} className="tool-badge">
                          {tool.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ÉQUIPE */}
            <div className="team-section">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users className="w-6 h-6" style={{ color: '#ffb3ff' }} /> {t('film_detail_team')}
              </h2>
              
              <div className="team-members">
                {/* Réalisateur */}
                {director && (
                  <div className="team-member">
                    <p className="team-member-role">{t('film_detail_director')}</p>
                    <p className="team-member-name">{directorName}</p>
                    <p className="team-member-info">
                      <Mail className="w-4 h-4" /> {director.email}
                    </p>
                    {director.city && (
                      <p className="team-member-info">
                        <MapPin className="w-4 h-4" /> {director.city}, {director.country}
                      </p>
                    )}
                  </div>
                )}

                {/* Collaborateurs */}
                {collaborators.map((collab) => (
                  <div key={collab.id} className="team-member">
                    <p className="team-member-role">{collab.role}</p>
                    <p className="team-member-name">{collab.first_name} {collab.last_name}</p>
                    {collab.email && (
                      <p className="team-member-info">
                        <Mail className="w-4 h-4" /> {collab.email}
                      </p>
                    )}
                    {collab.job_title && (
                      <p className="team-member-info">
                        <User className="w-4 h-4" /> {collab.job_title}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GALERIE */}
            {film.gallery_urls && parseGalleryUrls(film.gallery_urls).length > 0 && (
              <div className="gallery-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film className="w-6 h-6" style={{ color: '#ffb3ff' }} /> {t('film_detail_gallery')}
                </h2>
                <div className="gallery-grid">
                  {parseGalleryUrls(film.gallery_urls).map((url, idx) => (
                    <div key={idx} className="gallery-item">
                      <img src={getImageUrl(url)} alt={`Galerie ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========== SIDEBAR ========== */}
          <aside className="sidebar">
            {relatedFilms.length > 0 && (
              <div className="related-films-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film className="w-5 h-5" style={{ color: '#ffb3ff' }} /> {t('film_detail_related')}
                </h3>
                <div className="related-films-list">
                  {relatedFilms.map((relatedFilm) => (
                    <div 
                      key={relatedFilm.id}
                      className="related-film-card"
                      onClick={() => navigate(`/film/${relatedFilm.id}`)}
                    >
                      <div className="related-film-poster">
                        <img src={getImageUrl(relatedFilm.poster_url)} alt={relatedFilm.title_original} />
                      </div>
                      <div className="related-film-info">
                        <p className="related-film-title">{relatedFilm.title_original}</p>
                        <p className="related-film-director">{relatedFilm.first_name} {relatedFilm.last_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* VIDEO MODAL */}
      {isPlayingVideo && (
        <div className="video-modal-overlay" onClick={() => setIsPlayingVideo(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="video-modal-close"
              onClick={() => setIsPlayingVideo(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              className="video-modal-iframe"
              src={`https://www.youtube.com/embed/${film.youtube_id}?autoplay=1`}
              title={t('film_detail_video_title')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
