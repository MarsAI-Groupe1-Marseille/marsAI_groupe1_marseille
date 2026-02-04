import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Share2, Heart, MessageCircle, Play, Info, Globe, Calendar, 
  Film, Users, Zap, Code2, ChevronLeft, Volume2, Maximize2,
  BarChart3, Clock, User, Mail, MapPin, X
} from 'lucide-react';
import './film_detail.css';

export default function FilmDetail() {
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
        
        // Utilise les données fictives pour le moment (API à implémenter)
        setFilm(fictionalFilm);
        setDirector(fictionalDirector);
        setCollaborators(fictionalCollaborators);
        setRelatedFilms(fictionalRelated);
        
        // Simule une requête API
        // const response = await axios.get(`/api/submissions/${id}`);
        // setFilm(response.data.film);
        // setDirector(response.data.director);
        // setCollaborators(response.data.collaborators);
        // setRelatedFilms(response.data.relatedFilms);
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du film:', err);
        setError('Impossible de charger les détails du film');
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
        <p className="loading-text">Chargement du film...</p>
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
        <ChevronLeft className="w-4 h-4" /> Retour à la galerie
      </button>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();
  if (!film) return renderError();

  const tags = film.theme_tags ? film.theme_tags.split(',').map(tag => tag.trim()) : [];
  const duration = formatDuration(film.duration_seconds);
  const directorName = director ? `${director.first_name} ${director.last_name}` : 'N/A';

  return (
    <div className="film-detail-container">
      {/* Header Navigation */}
      <header className="film-detail-header">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/galerie')}
            className="back-button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            <ChevronLeft className="w-5 h-5" /> Retour à la galerie
          </button>
          <div style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>Mars AI Festival</div>
          <button className="login-button">Se connecter</button>
        </div>
      </header>

      <main className="film-detail-main">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
          {/* ========== COLONNE PRINCIPALE ========== */}
          <div style={{ gridColumn: '1 / 3', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* IMAGE INTERACTIVE */}
            <div className="film-poster-container">
              <img 
                src={film.poster_url} 
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
                    Réalisé par <span className="director-name">{directorName}</span>
                  </p>
                </div>

                {/* Boutons d'interaction */}
                <div className="action-buttons">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    title="Aimer ce film"
                  >
                    <Heart className="w-6 h-6" style={{ fill: isLiked ? 'white' : 'none' }} />
                  </button>
                  <button 
                    className="action-button"
                    title="Partager ce film"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Infos rapides */}
              <div className="quick-info">
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Clock className="w-4 h-4" /> Durée
                  </p>
                  <p className="quick-info-value">{duration}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Globe className="w-4 h-4" /> Langue
                  </p>
                  <p className="quick-info-value">{film.language_main.toUpperCase()}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <Zap className="w-4 h-4" /> IA
                  </p>
                  <p className="quick-info-value">{film.ai_classification}</p>
                </div>
                <div className="quick-info-item">
                  <p className="quick-info-label">
                    <BarChart3 className="w-4 h-4" /> Statut
                  </p>
                  <p className="quick-info-value success">Approuvé</p>
                </div>
              </div>
            </div>

            {/* THÈMES ET TAGS */}
            {tags.length > 0 && (
              <div className="tags-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film className="w-5 h-5" /> Thèmes
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
                <Info className="w-6 h-6" style={{ color: '#ffb3ff' }} /> Synopsis
              </h2>
              <p className="synopsis-text">
                {showFullSynopsis ? film.synopsis_english || film.synopsis_original : film.synopsis_original}
              </p>
              {film.synopsis_english && (
                <button 
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="synopsis-toggle"
                >
                  {showFullSynopsis ? "← Voir moins" : "Voir la version anglaise →"}
                </button>
              )}
            </div>

            {/* MÉTHODOLOGIE IA */}
            {film.ai_methodology && (
              <div className="ai-methodology-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 className="w-6 h-6" style={{ color: '#ffb3ff' }} /> Méthodologie IA
                </h2>
                <p className="ai-text">{film.ai_methodology}</p>
                {film.ai_tools && (
                  <div className="tools-container">
                    <p className="tools-label">Outils utilisés:</p>
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
                <Users className="w-6 h-6" style={{ color: '#ffb3ff' }} /> Équipe de production
              </h2>
              
              <div className="team-members">
                {/* Réalisateur */}
                {director && (
                  <div className="team-member">
                    <p className="team-member-role">Réalisateur</p>
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
                  </div>
                ))}
              </div>
            </div>

            {/* GALERIE */}
            {film.gallery_urls && film.gallery_urls.length > 0 && (
              <div className="gallery-section">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film className="w-6 h-6" style={{ color: '#ffb3ff' }} /> Galerie
                </h2>
                <div className="gallery-grid">
                  {film.gallery_urls.map((url, idx) => (
                    <div key={idx} className="gallery-item">
                      <img src={url} alt={`Galerie ${idx + 1}`} />
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
                  <Film className="w-5 h-5" style={{ color: '#ffb3ff' }} /> Films similaires
                </h3>
                <div className="related-films-list">
                  {relatedFilms.map((film) => (
                    <div 
                      key={film.id}
                      className="related-film-card"
                      onClick={() => navigate(`/film/${film.id}`)}
                    >
                      <div className="related-film-poster">
                        <img src={film.poster_url} alt={film.title_original} />
                      </div>
                      <div className="related-film-info">
                        <p className="related-film-title">{film.title_original}</p>
                        <p className="related-film-director">{film.first_name} {film.last_name}</p>
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
              src={`https://www.youtube.com/embed/${film.youtube_id}`}
              title="Vidéo du film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
