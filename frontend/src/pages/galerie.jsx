// ============================================================
// IMPORTS - Importation des dépendances nécessaires
// ============================================================
// React: Bibliothèque principale pour créer les composants
// useState: Hook pour gérer l'état local (variables réactives)
// useEffect: Hook pour exécuter du code à des moments spécifiques
import React, { useState, useEffect } from 'react'

// axios: Bibliothèque pour faire des requêtes HTTP vers l'API
import axios from 'axios'

// useNavigate: Hook pour naviguer vers d'autres pages
import { useNavigate } from 'react-router-dom'

// Importe le fichier CSS pour styliser la galerie
import '../pages/galerie.css'

// ============================================================
// COMPOSANT PRINCIPAL - Galerie
// ============================================================
// C'est le composant React qui gère toute la page de la galerie
const Galerie = () => {
  // Hook de navigation
  const navigate = useNavigate()
  // ========== TABLEAU DE FILMS FICTIFS ==========
  const fictionalFilms = [
    {
      id: 1,
      title: "Les Rouges de Mars",
      synopsis: "Une épopée scientifique suivant les premiers explorateurs humains découvrant les mystères cachés de la planète rouge.",
      duration: 1.42,
      poster_url: "https://via.placeholder.com/300x450?text=Les+Rouges+de+Mars",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 11, 15).toISOString()
    },
    {
      id: 2,
      title: "Horizon Martien",
      synopsis: "Une histoire captivante d'une femme astronaute qui doit survivre seule sur Mars après un accident catastrophique.",
      duration: 1.28,
      poster_url: "https://via.placeholder.com/300x450?text=Horizon+Martien",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 10, 20).toISOString()
    },
    {
      id: 3,
      title: "Base Éternelle",
      synopsis: "Une documentaire immersive sur la construction de la première colonie permanente sur Mars par des équipes internationales.",
      duration: 1.95,
      poster_url: "https://via.placeholder.com/300x450?text=Base+Eternelle",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 9, 10).toISOString()
    },
    {
      id: 4,
      title: "Signal du Silence",
      synopsis: "Un thriller de science-fiction où des astronautes découvrent des traces d'une ancienne civilisation extraterrestre.",
      duration: 1.56,
      poster_url: "https://via.placeholder.com/300x450?text=Signal+du+Silence",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 8, 5).toISOString()
    },
    {
      id: 5,
      title: "Tempête de Poussière",
      synopsis: "Une aventure où une équipe doit traverser les plus dangereuses tempêtes de la planète pour atteindre la base scientifique perdue.",
      duration: 1.38,
      poster_url: "https://via.placeholder.com/300x450?text=Tempete+de+Poussiere",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 7, 18).toISOString()
    },
    {
      id: 6,
      title: "Retour à l'Aube",
      synopsis: "Une histoire émouvante sur le voyage de retour vers la Terre et la nostalgie des explorateurs martiens pour leur première maison.",
      duration: 1.12,
      poster_url: "https://via.placeholder.com/300x450?text=Retour+a+l+Aube",
      youtube_id: "dQw4w9WgXcQ",
      created_at: new Date(2025, 6, 22).toISOString()
    }
  ]

  // ========== GESTION DE L'ÉTAT (State Management) ==========
  
  // films: Stocke TOUS les films reçus de l'API
  // setFilms: Fonction pour modifier la liste des films
  const [films, setFilms] = useState([])
  
  // filteredFilms: Stocke les films FILTRÉS selon la recherche/tri
  // setFilteredFilms: Fonction pour modifier les films filtrés
  const [filteredFilms, setFilteredFilms] = useState([])
  
  // loading: Booléen (true/false) - Indique si l'API charge les données
  // setLoading: Fonction pour modifier cet état
  const [loading, setLoading] = useState(true)
  
  // error: Stocke le message d'erreur s'il y en a une
  // setError: Fonction pour modifier l'erreur
  const [error, setError] = useState(null)
  
  // searchTerm: Texte saisi dans la barre de recherche
  // setSearchTerm: Fonction pour mettre à jour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('')
  
  // selectedFilm: Stocke le film cliqué par l'utilisateur (pour la modal)
  // setSelectedFilm: Fonction pour modifier le film sélectionné
  const [selectedFilm, setSelectedFilm] = useState(null)
  
  // sortBy: Stocke le type de tri choisi ('recent' ou 'alphabetic')
  // setSortBy: Fonction pour modifier le mode de tri
  const [sortBy, setSortBy] = useState('recent')


  // ========== EFFET 1: Récupérer les films au chargement de la page ==========
  // useEffect s'exécute UNE SEULE FOIS au montage du composant ([] = dépendance vide)
  useEffect(() => {
    // Fonction asynchrone pour charger les films
    const fetchFilms = async () => {
      try {
        // Montre le message "Chargement..." en mettant loading à true
        setLoading(true)
        
        // Utilise les films fictifs au lieu de l'API
        // Simule un délai pour avoir un effet de chargement réaliste
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Stocke les films fictifs dans la variable 'films'
        setFilms(fictionalFilms)
        
        // Stocke également les films filtrés (au départ = tous les films)
        setFilteredFilms(fictionalFilms)
        
        // Efface les erreurs précédentes s'il y en avait
        setError(null)
      } catch (err) {
        // Si une erreur s'est produite, affiche l'erreur dans la console
        console.error('Erreur lors du chargement des films:', err)
        
        // Stocke un message d'erreur pour l'afficher à l'écran
        setError('Impossible de charger les films. Veuillez réessayer plus tard.')
      } finally {
        // Cette partie s'exécute TOUJOURS, que ça marche ou pas
        // Retire le message "Chargement..."
        setLoading(false)
      }
    }
    // Appelle la fonction fetchFilms
    fetchFilms()
  }, []) // [] = S'exécute qu'une fois au démarrage


  // ========== EFFET 2: Filtrer et trier les films ==========
  // S'exécute CHAQUE FOIS que searchTerm, sortBy ou films changent
  // [searchTerm, sortBy, films] = dépendances
  useEffect(() => {
    // Commence avec la liste complète des films
    let result = films.filter(film =>
      // Filtre les films qui contiennent le terme de recherche
      // film.title?.toLowerCase(): Récupère le titre en minuscules (? = optionnel)
      // .includes(): Vérifie si le texte contient le terme de recherche
      // OU (||) vérifie aussi dans le synopsis
      film.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.synopsis?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Tri selon le choix de l'utilisateur
    // Si "recent" est sélectionné:
    if (sortBy === 'recent') {
      // Trie par date décroissante (le plus récent en premier)
      // new Date(b.created_at) - new Date(a.created_at) = du plus grand au plus petit
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } 
    // Si "alphabetic" est sélectionné:
    else if (sortBy === 'alphabetic') {
      // Trie par ordre alphabétique (A -> Z)
      // localeCompare(): Compare les titres de manière linguistique
      result.sort((a, b) => a.title?.localeCompare(b.title))
    }

    // Met à jour les films filtrés et triés
    setFilteredFilms(result)
  }, [searchTerm, sortBy, films]) // Re-exécute si l'un de ces trois change

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

  // ========== RENDU CONDITIONNEL - GESTION DU CHARGEMENT ==========
  // Si les données sont en train de charger, affiche le message "Chargement..."
  if (loading) {
    return (
      <div className="galerie-container">
        {/* Texte de chargement stylisé avec la classe CSS */}
        <div className="loading">Chargement des films...</div>
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
        <h1>Galerie des Films</h1>
        {/* Sous-titre descriptif */}
        <p>Découvrez les films du Festival Mars AI</p>
      </div>

      {/* CONTRÔLES (Recherche et Tri) */}
      <div className="galerie-controls">
        {/* BARRE DE RECHERCHE */}
        <div className="search-box">
          <input
            type="text" // Type de l'input: texte
            placeholder="Rechercher un film..." // Texte affiché quand le champ est vide
            value={searchTerm} // Le contenu actuel de la barre
            // onChange: s'exécute chaque fois qu'on tape dans l'input
            onChange={(e) => setSearchTerm(e.target.value)} // Met à jour le searchTerm
            className="search-input" // Classe CSS pour le style
          />
        </div>

        {/* SÉLECTEUR DE TRI */}
        <div className="sort-box">
          <select
            value={sortBy} // La valeur actuellement sélectionnée
            // onChange: s'exécute quand on change l'option
            onChange={(e) => setSortBy(e.target.value)} // Met à jour le mode de tri
            className="sort-select" // Classe CSS pour le style
          >
            {/* Option 1: Trier par date décroissante */}
            <option value="recent">Plus récent</option>
            {/* Option 2: Trier par ordre alphabétique */}
            <option value="alphabetic">Alphabétique</option>
          </select>
        </div>
      </div>

      {/* AFFICHAGE CONDITIONNEL - Pas de résultats ou Grille de films */}
      {/* Si filteredFilms.length === 0, affiche "Aucun film", sinon affiche la grille */}
      {filteredFilms.length === 0 ? (
        // CAS 1: Aucun film ne correspond aux critères de recherche
        <div className="no-films">
          <p>Aucun film ne correspond à votre recherche.</p>
        </div>
      ) : (
        // CAS 2: Affiche la grille des films
        <div className="films-grid">
          {/* Boucle sur chaque film filtrés avec .map() */}
          {/* film: C'est un film dans la boucle */}
          {filteredFilms.map((film) => (
            <div
              key={film.id} // Clé unique (important pour React)
              className="film-card" // Classe CSS pour styliser la carte
              onClick={() => handleSelectFilm(film)} // Au clic, ouvre la modal
            >
              {/* AFFICHAGE DU POSTER SI DISPONIBLE */}
              {/* && (ET): Affiche le poster seulement s'il existe */}
              {film.poster_url && (
                <div className="film-poster">
                  {/* Image du poster */}
                  <img src={film.poster_url} alt={film.title} />
                </div>
              )}
              
              {/* INFORMATIONS DU FILM (Titre, Synopsis, Durée) */}
              <div className="film-info">
                {/* TITRE DU FILM */}
                <h3 className="film-title">{film.title}</h3>
                
                {/* SYNOPSIS (Extrait limité à 80 caractères) */}
                <p className="film-synopsis">
                  {/* Ternaire (? :): Si synopsis existe, affiche 80 premiers caractères + "..." */}
                  {film.synopsis ? film.synopsis.substring(0, 80) + '...' : 'Pas de synopsis'}
                </p>
                
                {/* DURÉE DU FILM */}
                <p className="film-duration">
                  {/* Affiche la durée ou "Durée inconnue" */}
                  {film.duration ? `${film.duration} min` : 'Durée inconnue'}
                </p>
              </div>
            </div>
          ))}
        </div>
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
                  <img src={selectedFilm.poster_url} alt={selectedFilm.title} />
                </div>
              )}

              {/* DÉTAILS DU FILM */}
              <div className="modal-details">
                {/* TITRE DU FILM */}
                <h2>{selectedFilm.title}</h2>
                
                {/* SYNOPSIS COMPLET */}
                <p className="modal-synopsis">
                  {/* Affiche le synopsis ou un message par défaut */}
                  {selectedFilm.synopsis || 'Pas de synopsis disponible'}
                </p>

                {/* MÉTADONNÉES DU FILM (Durée) */}
                <div className="modal-meta">
                  {/* Affiche la durée seulement si elle existe */}
                  {selectedFilm.duration && (
                    <p><strong>Durée :</strong> {selectedFilm.duration} minutes</p>
                  )}
                </div>

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
                      title={selectedFilm.title} // Titre de la vidéo
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