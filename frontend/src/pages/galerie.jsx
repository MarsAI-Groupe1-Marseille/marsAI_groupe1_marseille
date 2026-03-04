// ============================================================
// IMPORTS - Importation des dépendances nécessaires
// ============================================================
// React: Bibliothèque principale pour créer les composants
// useState: Hook pour gérer l'état local (variables réactives)
// useEffect: Hook pour exécuter du code à des moments spécifiques
import React, { useState, useEffect } from 'react'

// axios: Bibliothèque pour faire des requêtes HTTP vers l'API
import axios from '../config/axiosConfig'

// useNavigate: Hook pour naviguer vers d'autres pages
import { useNavigate } from 'react-router-dom'

// useLanguage: Hook pour accéder aux traductions
import { useLanguage } from '../context/LanguageContext'
import { sanitizeText } from '../utils/sanitize'

// Importe le fichier CSS pour styliser la galerie
import '../pages/galerie.css'

// ============================================================
// COMPOSANT PRINCIPAL - Galerie
// ============================================================
// C'est le composant React qui gère toute la page de la galerie
const Galerie = () => {
  // Hook de navigation
  const navigate = useNavigate()
  
  // Hook pour les traductions
  const { t } = useLanguage()

  // ========== GESTION DE L'ÉTAT (State Management) ==========
  
  // films: Stocke les films reçus de l'API pour la page actuelle
  // setFilms: Fonction pour modifier la liste des films
  const [films, setFilms] = useState([])
  
  // genres: Liste dynamique des genres extraits des films
  // setGenres: Fonction pour modifier la liste des genres
  const [genres, setGenres] = useState(['Tous'])
  
  // loading: Booléen (true/false) - Indique si l'API charge les données
  // setLoading: Fonction pour modifier cet état
  const [loading, setLoading] = useState(true)
  
  // error: Stocke le message d'erreur s'il y en a une
  // setError: Fonction pour modifier l'erreur
  const [error, setError] = useState(null)
  
  // searchTerm: Texte saisi dans la barre de recherche (input local)
  // setSearchTerm: Fonction pour mettre à jour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('')
  
  // debouncedSearchTerm: Terme de recherche utilisé pour l'API (avec délai)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  // selectedFilm: Stocke le film cliqué par l'utilisateur (pour la modal)
  // setSelectedFilm: Fonction pour modifier le film sélectionné
  const [selectedFilm, setSelectedFilm] = useState(null)
  
  // selectedGenre: Stocke le genre sélectionné pour le filtre
  // setSelectedGenre: Fonction pour modifier le genre sélectionné
  const [selectedGenre, setSelectedGenre] = useState('Tous')
  
  // Langue pour le filtre (fr = titre original, en = titre anglais)
  // setLanguage: Fonction pour changer la langue
  const [language, setLanguage] = useState('fr')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)


  // ========== EFFET: Récupération initiale de tous les genres ==========
  // S'exécute UNE SEULE FOIS au chargement pour récupérer tous les genres disponibles
  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        // Appel à la route dédiée qui retourne uniquement les genres
        const response = await axios.get('/submissions/genres/all')
        const genresList = response.data.genres || []
        
        // Ajoute "Tous" au début et met à jour l'état
        setGenres(['Tous', ...genresList])
      } catch (err) {
        console.error('Erreur lors de la récupération des genres:', err)
        // En cas d'erreur, garde juste "Tous"
      }
    }
    
    fetchAllGenres()
  }, []) // Tableau vide = s'exécute une seule fois au montage

  // ========== EFFET: Debounce pour la recherche ==========
  // Attend 1000ms après que l'utilisateur ait arrêté de taper avant de lancer la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1000) // 1000ms de délai

    // Nettoyage: annule le timer si l'utilisateur continue de taper
    return () => clearTimeout(timer)
  }, [searchTerm])

  // ========== EFFET: Récupérer les films depuis l'API ==========
  // S'exécute chaque fois que currentPage, debouncedSearchTerm ou selectedGenre changent
  useEffect(() => {
    // Fonction asynchrone pour charger les films
    const fetchFilms = async () => {
      try {
        // Montre le message "Chargement..." en mettant loading à true
        setLoading(true)
        
        // Construction des paramètres de requête
        const params = new URLSearchParams({
          page: currentPage,
          limit: 12, // Nombre de films par page
          lang: language // Langue pour le filtre
        })
        
        // Ajout du terme de recherche si présent
        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm)
        }
        
        // Ajout du filtre de genre si ce n'est pas "Tous"
        if (selectedGenre && selectedGenre !== 'Tous') {
          params.append('genre', selectedGenre)
        }
        
        // Appel à l'API
        const response = await axios.get(`/submissions?${params.toString()}`)
        
        console.log('Réponse API:', response.data)
        
        // Stocke les films dans la variable 'films'
        setFilms(response.data.data || [])
        
        // Stocke les informations de pagination
        setTotalPages(response.data.totalPages || 1)
        setTotalItems(response.data.totalItems || 0)
        
        // Efface les erreurs précédentes s'il y en avait
        setError(null)
      } catch (err) {
        // Si une erreur s'est produite, affiche l'erreur dans la console
        console.error('Erreur lors du chargement des films:', err)
        
        // Stocke un message d'erreur pour l'afficher à l'écran
        setError('Impossible de charger les films. Veuillez réessayer plus tard.')
        setFilms([])
      } finally {
        // Cette partie s'exécute TOUJOURS, que ça marche ou pas
        // Retire le message "Chargement..."
        setLoading(false)
      }
    }
    
    // Appelle la fonction fetchFilms
    fetchFilms()
  }, [currentPage, debouncedSearchTerm, selectedGenre, language]) // Re-exécute si l'un de ces paramètres change

  // ========== FONCTIONS DE GESTION DES CLICS ==========
  
  // Fonction appelée quand l'utilisateur clique sur un film
  // Elle navigue vers la page détail du film
  const handleSelectFilm = (film) => {
    // Navigue vers la page détail avec l'ID du film
    navigate(`/galerie/${film.id}`)
  }

  // Fonction appelée quand l'utilisateur clique sur le X ou en dehors de la modal
  // Elle ferme la modal en vidant selectedFilm
  const handleCloseModal = () => {
    // Remet selectedFilm à null (la modal disparaît)
    setSelectedFilm(null)
  }
  
  // Fonction pour changer de page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Remonte en haut de la page
  }
  
  // Fonction pour gérer le changement de recherche
  const handleSearchChange = (value) => {
    setSearchTerm(value)
    // La page sera réinitialisée automatiquement quand debouncedSearchTerm change
  }
  
  // Fonction pour gérer le changement de genre
  const handleGenreChange = (value) => {
    setSelectedGenre(value)
    setCurrentPage(1) // Retour à la première page lors d'un nouveau filtre
  }
  
  // ========== EFFET: Retour à la page 1 quand la recherche change ==========
  useEffect(() => {
    if (debouncedSearchTerm !== '') {
      setCurrentPage(1)
    }
  }, [debouncedSearchTerm])

  // ========== RENDU CONDITIONNEL - GESTION DU CHARGEMENT ==========
  // Si les données sont en train de charger, affiche le message "Chargement..."
  if (loading) {
    return (
      <div className="galerie-container">
        {/* Texte de chargement stylisé avec la classe CSS */}
        <div className="loading">{t('gallery_loading')}</div>
      </div>
    )
  }

  // ========== RENDU CONDITIONNEL - GESTION DES ERREURS ==========
  // Si une erreur s'est produite, l'affiche à l'écran
  if (error) {
    return (
      <div className="galerie-container">
        {/* Message d'erreur stylisé avec la classe CSS */}
        <div className="error-message">{error}</div>
      </div>
    )
  }

  // ========== RENDU PRINCIPAL - AFFICHAGE DE LA GALERIE ==========
  // Après le chargement, affiche la galerie complète
  return (
    <div className="galerie-container">
      {/* EN-TÊTE DE LA GALERIE */}
      <div className="galerie-header">
        {/* Titre principal de la page */}
        <h1>{t('gallery_title')}</h1>
        {/* Sous-titre descriptif */}
        <p>{t('gallery_subtitle')}</p>
      </div>

      {/* CONTRÔLES (Recherche et Tri) */}
      <div className="galerie-controls">
        {/* BARRE DE RECHERCHE */}
        <div className="search-box">
          <input
            type="text" // Type de l'input: texte
            placeholder={t('gallery_search')} // Texte affiché quand le champ est vide
            value={searchTerm} // Le contenu actuel de la barre
            // onChange: s'exécute chaque fois qu'on tape dans l'input
            onChange={(e) => handleSearchChange(e.target.value)} // Met à jour le searchTerm
            className="search-input" // Classe CSS pour le style
          />
        </div>

        {/* SÉLECTEUR DE GENRE */}
        <div className="sort-box">
          <select
            value={selectedGenre} // La valeur actuellement sélectionnée
            // onChange: s'exécute quand on change l'option
            onChange={(e) => handleGenreChange(e.target.value)} // Met à jour le genre sélectionné
            className="sort-select" // Classe CSS pour le style
          >
            {/* Options de genres */}
            {genres.map((genre) => (
              <option style={{color: "black"}} key={genre} value={genre}>{genre === 'Tous' ? t('gestion_films_all') : genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AFFICHAGE CONDITIONNEL - Pas de résultats ou Grille de films */}
      {/* Si films.length === 0, affiche "Aucun film", sinon affiche la grille */}
      {films.length === 0 ? (
        // CAS 1: Aucun film ne correspond aux critères de recherche
        <div className="no-films">
          <p>{t('gallery_no_results')}</p>
        </div>
      ) : (
        // CAS 2: Affiche la grille des films
        <>
          <div className="films-grid">
            {/* Boucle sur chaque film avec .map() */}
            {/* film: C'est un film dans la boucle */}
            {films.map((film) => (
              <div
                key={film.id} // Clé unique (important pour React)
                className="film-card" // Classe CSS pour styliser la carte
                onClick={() => handleSelectFilm(film)} // Au clic, ouvre la modal
              >
                {/* AFFICHAGE DU POSTER - TOUJOURS AFFICHER LE CONTENEUR */}
                <div className="film-poster">
                  <img 
                    src={
                    film.poster_url 
                      ? (film.poster_url.startsWith('http') 
                          ? film.poster_url 
                          : `${import.meta.env.VITE_API_URL}${film.poster_url}`)
                      : "https://placehold.co/300x450?text=Pas+d'affiche"
                  }
                    alt={film.title_original} 
                    onError={(e) => {
                      // Image de remplacement si le poster ne charge pas
                      e.target.src = "https://placehold.co/300x450?text=Pas+d'affiche"
                    }}
                  />
                </div>
                
                {/* INFORMATIONS DU FILM (Titre, Synopsis, Durée) */}
                <div className="film-info">
                  {/* TITRE DU FILM */}
                  <h3 className="film-title">{sanitizeText(film.title_original)}</h3>
                  
                  {/* RÉALISATEUR */}
                  {film.Director && (
                    <p className="film-director" style={{fontSize: '0.85rem', color: '#9090b0', marginBottom: '8px'}}>
                      {t('gallery_by')} {sanitizeText(film.Director.first_name)} {sanitizeText(film.Director.last_name)}
                    </p>
                  )}
                  
                  {/* SYNOPSIS (Extrait limité à 80 caractères) */}
                  <p className="film-synopsis">
                    {/* Ternaire (? :): Si synopsis existe, affiche 80 premiers caractères + "..." */}
                    {film.synopsis_original ? `${sanitizeText(film.synopsis_original).substring(0, 80)}...` : t('gallery_no_synopsis')}
                  </p>
                  
                  {/* DURÉE DU FILM */}
                  <p className="film-duration">
                    {/* Affiche la durée en minutes (durée est en secondes dans l'API) */}
                    {film.duration_seconds ? `${Math.floor(film.duration_seconds / 60)} ${t('detail_minutes')}` : t('gallery_unknown_duration')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '40px',
              marginBottom: '20px'
            }}>
              {/* Bouton Précédent */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 20px',
                  background: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 150, 0.3)',
                  border: '1px solid #ff0096',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                &larr; {t('gallery_prev')}
              </button>
              
              {/* Numéros de pages */}
              <div style={{display: 'flex', gap: '5px'}}>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '10px 15px',
                        background: currentPage === pageNum ? '#ff0096' : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid #ff0096',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              {/* Bouton Suivant */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 20px',
                  background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 150, 0.3)',
                  border: '1px solid #ff0096',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {t('gallery_next')} &rarr;
              </button>
            </div>
          )}
          
          {/* Affichage du nombre total de films */}
          <div style={{
            textAlign: 'center',
            color: '#b0b0d0',
            fontSize: '0.9rem',
            marginTop: '10px'
          }}>
            {totalItems} {totalItems > 1 ? t('gallery_total').replace('film(s)', 'films') : t('gallery_total').replace('film(s)', 'film')}
          </div>
        </>
      )}

      {/* MODAL DE DÉTAILS DU FILM */}
      {/* Affiche la modal SEULEMENT si selectedFilm n'est pas null */}
      {selectedFilm && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          {/* Fond sombre cliquable pour fermer la modal */}
          
          {/* Contenu de la modal */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* e.stopPropagation(): Empêche le clic de fermer la modal */}
            
            {/* BOUTON FERMETURE (X) */}
            <button className="modal-close" onClick={handleCloseModal}>
              ✕ {/* Symbole de croix */}
            </button>

            {/* CORPS DE LA MODAL */}
            <div className="modal-body">
              {/* AFFICHAGE DU POSTER SI DISPONIBLE */}
              {selectedFilm.poster_url && (
                <div className="modal-poster">
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${selectedFilm.poster_url}`} 
                    alt={sanitizeText(selectedFilm.title_original)} 
                    onError={(e) => {
                      e.target.src = "https://placehold.co/400x600?text=Pas+d'affiche"
                    }}
                  />
                </div>
              )}

              {/* DÉTAILS DU FILM */}
              <div className="modal-details">
                {/* TITRE DU FILM */}
                <h2>{sanitizeText(selectedFilm.title_original)}</h2>
                
                {/* TITRE ANGLAIS SI DIFFÉRENT */}
                {selectedFilm.title_english && selectedFilm.title_english !== selectedFilm.title_original && (
                  <p style={{color: '#9090b0', fontSize: '1.1rem', marginTop: '-10px', marginBottom: '15px'}}>
                    ({sanitizeText(selectedFilm.title_english)})
                  </p>
                )}
                
                {/* RÉALISATEUR */}
                {selectedFilm.Director && (
                  <p style={{color: '#ffb3ff', fontSize: '1rem', marginBottom: '15px'}}>
                    {t('detail_director')} <strong>{sanitizeText(selectedFilm.Director.first_name)} {sanitizeText(selectedFilm.Director.last_name)}</strong>
                  </p>
                )}
                
                {/* SYNOPSIS COMPLET */}
                <p className="modal-synopsis">
                  {/* Affiche le synopsis ou un message par défaut */}
                  {sanitizeText(selectedFilm.synopsis_original) || t('detail_no_synopsis_available')}
                </p>

                {/* SYNOPSIS ANGLAIS SI DISPONIBLE */}
                {selectedFilm.synopsis_english && (
                  <div style={{marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                    <p style={{fontSize: '0.85rem', color: '#9090b0', marginBottom: '5px'}}>{t('detail_english_synopsis')}</p>
                    <p style={{fontSize: '0.9rem', color: '#c0c0e0', lineHeight: '1.5'}}>
                      {sanitizeText(selectedFilm.synopsis_english)}
                    </p>
                  </div>
                )}

                {/* MÉTADONNÉES DU FILM */}
                <div className="modal-meta">
                  {/* Durée */}
                  {selectedFilm.duration_seconds && (
                    <p><strong>{t('detail_duration')} :</strong> {Math.floor(selectedFilm.duration_seconds / 60)} {t('detail_minutes')} ({selectedFilm.duration_seconds} {t('detail_seconds')})</p>
                  )}
                  
                  {/* Langue principale */}
                  {selectedFilm.language_main && (
                    <p><strong>{t('detail_language')}</strong> {sanitizeText(selectedFilm.language_main)}</p>
                  )}
                  
                  {/* Thèmes/Genres */}
                  {selectedFilm.theme_tags && (
                    <p><strong>{t('detail_genres')}</strong> {sanitizeText(selectedFilm.theme_tags)}</p>
                  )}
                  
                  {/* Classification IA */}
                  {selectedFilm.ai_classification && (
                    <p><strong>{t('detail_ai_class')}</strong> {sanitizeText(selectedFilm.ai_classification)}</p>
                  )}
                  
                  {/* Outils IA */}
                  {selectedFilm.ai_tools && (
                    <p><strong>{t('detail_ai_tools')}</strong> {sanitizeText(selectedFilm.ai_tools)}</p>
                  )}
                  
                  {/* Méthodologie IA */}
                  {selectedFilm.ai_methodology && (
                    <p><strong>{t('detail_methodology')} :</strong> {sanitizeText(selectedFilm.ai_methodology)}</p>
                  )}
                  
                  {/* Sous-titres */}
                  <p><strong>{t('detail_subtitles')}</strong> {selectedFilm.has_subtitles ? t('modal_yes') : t('modal_no')}</p>
                </div>

                {/* GALERIE D'IMAGES */}
                {selectedFilm.gallery_urls && selectedFilm.gallery_urls.length > 0 && (
                  <div style={{marginTop: '25px'}}>
                    <h3 style={{color: '#ffb3ff', fontSize: '1.2rem', marginBottom: '15px'}}>{t('gallery_images')}</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px'}}>
                      {selectedFilm.gallery_urls.map((url, index) => (
                        <img 
                          key={index}
                          src={`${import.meta.env.VITE_API_URL}${url}`}
                          alt={`Galerie ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 0, 150, 0.3)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* LECTEUR VIDÉO YOUTUBE */}
                {/* Affiche la vidéo seulement si youtube_id existe */}
                {selectedFilm.youtube_id && (
                  <div className="video-container">
                    {/* iframe: Élément pour intégrer une page web (vidéo YouTube ici) */}
                    <iframe
                      width="100%" // Largeur 100% du conteneur
                      height="315" // Hauteur en pixels
                      // Construction de l'URL YouTube pour intégrer la vidéo
                      src={`https://www.youtube.com/embed/${selectedFilm.youtube_id}`}
                      title={selectedFilm.title_original} // Titre de la vidéo
                      frameBorder="0" // Pas de bordure
                      // Permissions pour la vidéo (contrôles, autoplay, etc.)
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen // Autorise le mode plein écran
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Ceci est donc la page galerie pour les réalisateurs

// Exporte le composant pour qu'il soit utilisable ailleurs
export default Galerie