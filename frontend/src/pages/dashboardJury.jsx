// Indique à Next.js que ce composant s’exécute côté navigateur. Obligatoire car on utilise 
// Obligatoire ici car on utilise :
// useState
// useRef
// interactions (clic, modal, scroll…)
"use client";

// useRef : Permet de manipuler directement un élément du DOM comme contrôler le scroll horizontal du slider.
// X Icone de la fermeture de la modal
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function DashboardJury() {
  // Gère l'ouverture de la modal.
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  // Référence vers le conteneur scrollable des vidéos.
  const sliderRef = useRef(null);
  
  // États pour les playlists
  const [playlists, setPlaylists] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluatedVideoIds, setEvaluatedVideoIds] = useState(new Set());

  const resolvePosterUrl = (poster) => {
    if (!poster) return '/images/placeholder.jpg';
    if (poster.startsWith('http://') || poster.startsWith('https://')) return poster;
    const normalized = poster.startsWith('/') ? poster : `/${poster}`;
    return `${import.meta.env.VITE_API_URL}${normalized}`;
  };

  // Récupérer les playlists et les votes de l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les playlists et les votes en parallèle
        const [playlistsRes, votesRes] = await Promise.all([
          axios.get('/jury/my-playlists'),
          axios.get('/jury/my-votes')
        ]);

        // Extraire les votes et les IDs des films évalués
        if (votesRes.data.success && votesRes.data.votes) {
          setVotes(votesRes.data.votes);
          const evaluated = new Set(votesRes.data.votes.map(v => v.submission_id));
          setEvaluatedVideoIds(evaluated);
        }

        if (playlistsRes.data.success && playlistsRes.data.playlists) {
          // Les données de l'API sont déjà au bon format
          setPlaylists(playlistsRes.data.playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            videos: (playlist.videos || []).map(video => ({
              id: video.id,
              title: video.title,
              director: video.director?.full_name || 'Réalisateur inconnu',
              thumbnail: resolvePosterUrl(video.poster),
              youtubeId: video.youtubeId,
              status: 'pas'
            }))
          })));
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

// Tableau de classes Taiwind pour donner une couleur différentes à chaque playlist.
  const gradients = [
    "from-purple-700 via-indigo-600 to-purple-900",
    "from-pink-600 via-rose-500 to-red-700",
    "from-cyan-500 via-blue-600 to-indigo-800",
  ];


// Calcul des statistiques à partir des votes du jury
  const liked = votes.filter(v => v.vote_status === "LIKE").length;
  const disliked = votes.filter(v => v.vote_status === "DISLIKE").length;
  const discussion = votes.filter(v => v.vote_status === "DISCUSS").length;
  
  // Nombre total de films assignés
  const totalFilmsAssigned = playlists.reduce((acc, playlist) => acc + (playlist.videos?.length || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-6">

        {/* BLOCS STATISTIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-14">

          <StatCard            title="Films assignés"
            value={totalFilmsAssigned}
            gradient="from-blue-500 to-cyan-600"
          />

          <StatCard            title="J’aime"
            value={liked}
            gradient="from-green-500 to-emerald-600"
          />

          <StatCard
            title="J’aime pas"
            value={disliked}
            gradient="from-red-500 to-rose-600"
          />

          <StatCard
            title="À discuter"
            value={discussion}
            gradient="from-yellow-400 to-orange-500"
          />

        </div>

        {/* HEADER */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Mes Playlists
          </h1>
          <p className="text-neutral-400">
            Sélectionnez une playlist pour consulter les vidéos
          </p>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-neutral-400 mt-4">Chargement des playlists...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* PLAYLIST GRID */}
        {/* Affichage conditionnel des playlists : Si aucune playlist n'est sélectionnée alors on affiche la grille. */}
        {!loading && !error && !selectedPlaylist && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {playlists.map((playlist, i) => (
              <div
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                className={`cursor-pointer rounded-3xl p-1 bg-gradient-to-br ${gradients[i % gradients.length]}
                transform transition duration-300 hover:scale-105`}
              >
                <div className="bg-neutral-900 rounded-3xl p-8 text-center h-40 flex items-center justify-center">
                  <h2 className="text-xl font-semibold">
                    {playlist.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */} 
        {/* Si une playlist existe alors afficher la modal */}
        {selectedPlaylist && (
          <section className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            
            <div className="bg-gradient-to-br from-neutral-900 via-purple-900/60 to-black
            border border-purple-700/40 backdrop-blur-xl 
            rounded-3xl w-full max-w-6xl p-8 relative animate-scaleIn">

              <button
                onClick={() => setSelectedPlaylist(null)}
                className="absolute top-6 right-6 text-neutral-300 hover:text-white"
              >
                <X size={28} />
              </button>

              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-purple-300">
                {selectedPlaylist.name}
              </h2>

              {/* SLIDER */}
              <div className="relative group">
                <div
                  ref={sliderRef}
                  className="flex overflow-x-auto gap-6 scroll-smooth no-scrollbar"
                >
                  {selectedPlaylist.videos.map((video) => {
                    const isEvaluated = evaluatedVideoIds.has(video.id);
                    return (
                    <a
                      key={video.id}
                      // Redirection vers la page notation jury
                      href={`/notationjury/${video.id}`}
                      className="relative flex-shrink-0 w-56 md:w-64 bg-neutral-800 
                      rounded-2xl overflow-hidden transition 
                      hover:scale-105 hover:shadow-2xl group"
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-40 object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/50 opacity-0 
                        group-hover:opacity-100 transition duration-300 
                        flex items-center justify-center">

                          <div className="w-14 h-14 bg-white rounded-full 
                          flex items-center justify-center text-black text-xl 
                          shadow-lg transform group-hover:scale-110 transition">
                            ▶
                          </div>
                        </div>

                        {/* Badge évalué */}
                        {isEvaluated && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="font-semibold truncate">
                          {video.title}
                        </p>
                        <p className="text-sm text-neutral-400">
                          {video.director}
                        </p>
                      </div>
                    </a>
                    );
                  })}
                </div>

                {/* CHEVRONS */}
                <button
                  onClick={() =>
                    // Fait défiler horizontalement de 300px.
                    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="absolute top-1/2 -left-4 -translate-y-1/2 
                  bg-black/60 hover:bg-black/80 p-3 rounded-full 
                  hidden group-hover:block"
                >
                  ◀
                </button>

                <button
                  onClick={() =>
                    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="absolute top-1/2 -right-4 -translate-y-1/2 
                  bg-black/60 hover:bg-black/80 p-3 rounded-full 
                  hidden group-hover:block"
                >
                  ▶
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Animations */}
      {/* @keyframes fadeIn et scaleIn Ajoute animation : Apparition douce Zoom léger */}
      <style jsx>{`
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
// Composant réutilisable avec Props : title, value et gradient pour personnaliser le contenu et le style de chaque carte statistique.
function StatCard({ title, value, gradient }) {
  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} text-center shadow-lg hover:scale-105 transition`}>
      <p className="text-sm opacity-80">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
