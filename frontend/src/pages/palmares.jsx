import React, { useState, useEffect } from 'react';
import { Trophy, Heart, ThumbsDown, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import axios from '../config/axiosConfig';
import StarryBackground from '../components/StarryBackground';

const Palmares = () => {
    const { lang, t } = useLanguage();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPalmares = async () => {
            try {
                setLoading(true);
                // Récupérer tous les films approuvés
                const response = await axios.get('/submissions?approval_status=approved');
                
                if (response.data && Array.isArray(response.data)) {
                    // Trier par nombre de likes/votes
                    const sortedFilms = response.data.sort((a, b) => {
                        const aLikes = a.jury_evaluations?.filter(e => e.vote_status === 'LIKE').length || 0;
                        const bLikes = b.jury_evaluations?.filter(e => e.vote_status === 'LIKE').length || 0;
                        return bLikes - aLikes;
                    });
                    setFilms(sortedFilms);
                }
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement du palmares:', err);
                setError('Erreur lors du chargement des films');
                // Données fallback pour développement
                setFilms([
                    {
                        id: 1,
                        title_original: "L'Algorithme Perdu",
                        title_english: "The Lost Algorithm",
                        duration_seconds: 300,
                        director: { first_name: 'Jean', last_name: 'Dupont' },
                        ai_classification: 'Hybrid',
                        jury_evaluations: [
                            { vote_status: 'LIKE' },
                            { vote_status: 'LIKE' },
                            { vote_status: 'DISCUSS' }
                        ],
                        poster_url: 'https://via.placeholder.com/300x450?text=Lost+Algorithm'
                    },
                    {
                        id: 2,
                        title_original: "Rêves Numériques",
                        title_english: "Digital Dreams",
                        duration_seconds: 420,
                        director: { first_name: 'Marie', last_name: 'Martin' },
                        ai_classification: '100% IA',
                        jury_evaluations: [
                            { vote_status: 'LIKE' },
                            { vote_status: 'LIKE' }
                        ],
                        poster_url: 'https://via.placeholder.com/300x450?text=Digital+Dreams'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPalmares();
    }, []);

    const getVoteStats = (evaluations = []) => {
        return {
            likes: evaluations.filter(e => e.vote_status === 'LIKE').length,
            dislikes: evaluations.filter(e => e.vote_status === 'DISLIKE').length,
            discusses: evaluations.filter(e => e.vote_status === 'DISCUSS').length,
            total: evaluations.length
        };
    };

    const getScore = (evaluations = []) => {
        const stats = getVoteStats(evaluations);
        return stats.likes - stats.dislikes;
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}min`;
    };

    const content = {
        fr: {
            title: 'Palmarès',
            subtitle: 'Les films les mieux classés',
            noFilms: 'Aucun film pour le moment',
            director: 'Réalisateur',
            duration: 'Durée',
            classification: 'Classification IA',
            votes: 'Votes',
            score: 'Score'
        },
        en: {
            title: 'Awards',
            subtitle: 'Top-rated films',
            noFilms: 'No films yet',
            director: 'Director',
            duration: 'Duration',
            classification: 'AI Classification',
            votes: 'Votes',
            score: 'Score'
        }
    };

    const t_content = content[lang] || content.fr;

    return (
        <>
            <StarryBackground />
            <div className="min-h-screen bg-black/20 backdrop-blur-sm text-white relative z-10">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
            </div>

            <main className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy size={40} className="text-yellow-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-transparent bg-clip-text">
                                {t_content.title}
                            </span>
                        </h1>
                        <p className="text-neutral-400 text-lg">{t_content.subtitle}</p>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin">
                                <Trophy size={32} className="text-violet-400" />
                            </div>
                            <p className="mt-4 text-neutral-400">Chargement...</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 mb-8">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Films grid */}
                    {!loading && films.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {films.map((film, idx) => {
                                const stats = getVoteStats(film.jury_evaluations);
                                const score = getScore(film.jury_evaluations);
                                const title = lang === 'en' && film.title_english ? film.title_english : film.title_original;

                                return (
                                    <div
                                        key={film.id}
                                        className="group rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Rank badge */}
                                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                                            #{idx + 1}
                                        </div>

                                        {/* Poster */}
                                        <div className="aspect-video bg-gradient-to-br from-violet-900 to-neutral-900 overflow-hidden">
                                            {film.poster_url && (
                                                <img
                                                    src={film.poster_url}
                                                    alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                                {title}
                                            </h3>

                                            {/* Director */}
                                            <p className="text-sm text-neutral-400 mb-4">
                                                <span className="text-neutral-500">{t_content.director}:</span>
                                                {' '}
                                                {film.director?.first_name} {film.director?.last_name}
                                            </p>

                                            {/* Info row */}
                                            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                                <div className="bg-neutral-800 rounded p-2">
                                                    <p className="text-neutral-500">{t_content.duration}</p>
                                                    <p className="font-semibold">{formatDuration(film.duration_seconds)}</p>
                                                </div>
                                                <div className="bg-neutral-800 rounded p-2">
                                                    <p className="text-neutral-500">{t_content.classification}</p>
                                                    <p className="font-semibold">{film.ai_classification}</p>
                                                </div>
                                            </div>

                                            {/* Vote stats */}
                                            <div className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4 mb-4">
                                                <p className="text-xs text-neutral-500 mb-3 font-semibold">{t_content.votes}</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <Heart size={14} className="text-green-500" />
                                                            <span className="font-bold text-green-500">{stats.likes}</span>
                                                        </div>
                                                        <p className="text-xs text-neutral-400">Like</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <MessageCircle size={14} className="text-yellow-500" />
                                                            <span className="font-bold text-yellow-500">{stats.discusses}</span>
                                                        </div>
                                                        <p className="text-xs text-neutral-400">Discuss</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <ThumbsDown size={14} className="text-red-500" />
                                                            <span className="font-bold text-red-500">{stats.dislikes}</span>
                                                        </div>
                                                        <p className="text-xs text-neutral-400">Dislike</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score badge */}
                                            <div className={`rounded-lg py-2 text-center font-bold ${
                                                score > 0 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : score < 0 
                                                    ? 'bg-red-500/20 text-red-400' 
                                                    : 'bg-neutral-700/50 text-neutral-300'
                                            }`}>
                                                {t_content.score}: {score > 0 ? '+' : ''}{score}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : !loading && (
                        <div className="text-center py-12">
                            <Trophy size={48} className="mx-auto text-neutral-600 mb-4" />
                            <p className="text-neutral-400 text-lg">{t_content.noFilms}</p>
                        </div>
                    )}
                </div>
            </main>
            </div>
        </>
    );
};

export default Palmares;
