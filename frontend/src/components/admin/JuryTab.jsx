import { useState, useEffect } from 'react';
import { useFilms } from '../../hooks/useFilms';
import axios from '../../config/axiosConfig';
import { BarChart3, Users, ThumbsUp, ThumbsDown, MessageCircle, Trophy, Scale, UserCheck, FileText } from 'lucide-react';

export default function JuryTab() {
  const { films } = useFilms();
  const [juryMembers, setJuryMembers] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    jury_count: 0,
    approved_films: 0,
    total_progress: 0,
    films_liked: 0,
    films_disliked: 0,
    films_discuss: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'jury'
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fonction pour générer les initiales et les couleurs
  const getAvatarData = (name) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
    const colors = [
      'from-violet-500 to-violet-600',
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-cyan-500 to-cyan-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return { initials, colorGradient: colors[index] };
  };

  const parseSpecialite = (specialite) => {
    if (!specialite) return [];
    if (typeof specialite === 'string') {
      try {
        const parsed = JSON.parse(specialite);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
        return parsed ? [parsed] : [];
      } catch {
        return specialite ? [specialite] : [];
      }
    }
    if (Array.isArray(specialite)) {
      return specialite.filter(Boolean);
    }
    return specialite ? [specialite] : [];
  };

  useEffect(() => {
    fetchJury();
  }, []);

  const fetchJury = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/jury/with-stats');
      setJuryMembers(response.data.juryMembers || []);
      if (response.data.globalStats) {
        setGlobalStats(response.data.globalStats);
      }
    } catch (err) {
      console.error('Erreur récupération jurys:', err);
      setError('Impossible de charger les jurys');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const response = await axios.post('/users/invite', {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role
      });

      if (response.data.message) {
        // Réinitialiser le formulaire et rafraîchir la liste
        setFormData({ email: '', full_name: '', role: 'jury' });
        setShowForm(false);
        await fetchJury();
      }
    } catch (err) {
      console.error('Erreur création utilisateur:', err);
      setFormError(err.response?.data?.error || 'Erreur lors de la création du membre');
    } finally {
      setFormLoading(false);
    }
  };

  const totalDecisions = globalStats.films_liked + globalStats.films_disliked + globalStats.films_discuss;
  const likedRatio = totalDecisions > 0 ? globalStats.films_liked / totalDecisions : 0;
  const dislikedRatio = totalDecisions > 0 ? globalStats.films_disliked / totalDecisions : 0;
  const discussRatio = totalDecisions > 0 ? globalStats.films_discuss / totalDecisions : 0;

  const donutSegments = [
    { label: 'Aimé', ratio: likedRatio, color: '#22c55e' },
    { label: 'Pas aimé', ratio: dislikedRatio, color: '#ef4444' },
    { label: 'A discuter', ratio: discussRatio, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8">
      {/* Section Statistiques Globales */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">Statistiques Globales</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Membres du jury</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{globalStats.jury_count || juryMembers.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Films à évaluer</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{globalStats.approved_films}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Progression totale</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{globalStats.total_progress}%</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Decisions globales</p>
                <p className="text-xs text-neutral-500 mt-1">Aimé / Pas aimé / A discuter</p>
              </div>
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 42 42" className="w-20 h-20">
                  <circle cx="21" cy="21" r="16" fill="none" stroke="#1f2937" strokeWidth="6" />
                  {(() => {
                    let offset = 0;
                    return donutSegments.map((seg, index) => {
                      const dash = seg.ratio * 100;
                      const gap = 100 - dash;
                      const dashArray = `${dash} ${gap}`;
                      const dashOffset = 25 - offset;
                      offset += dash;
                      return (
                        <circle
                          key={`donut-${index}`}
                          cx="21"
                          cy="21"
                          r="16"
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="6"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-300 font-semibold">
                  {totalDecisions}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {globalStats.films_liked}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                {globalStats.films_disliked}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                {globalStats.films_discuss}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Membres du Jury */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={22} className="text-violet-400" />
            <h3 className="text-xl font-bold text-violet-400">Membres du Jury</h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            + Ajouter un membre
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddMember}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={formLoading}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="Nom complet"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              disabled={formLoading}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={formLoading}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-violet-500 disabled:opacity-50"
            >
              <option value="jury">Jury</option>
            </select>
            {formError && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                {formError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {formLoading ? 'En cours...' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                }}
                disabled={formLoading}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold rounded-lg transition disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="text-sm text-neutral-400">Chargement des jurys...</div>
        )}
        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        {/* Cartes des Membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juryMembers.map((member) => {
            const { initials, colorGradient } = getAvatarData(member.full_name);
            const stats = member.stats || { like: 0, dislike: 0, discuss: 0, approval_rate: 0 };
            const totalFilms = stats.total_films || films.length || 0;
            const votesCast = stats.votes_cast || 0;
            const progressPercentage = totalFilms > 0 ? Math.round((votesCast / totalFilms) * 100) : 0;
            
            const getRoleIcon = (role) => {
              switch(role) {
                case 'lead': return <Trophy size={16} className="mr-1" />;
                case 'moderator': return <Scale size={16} className="mr-1" />;
                default: return <UserCheck size={16} className="mr-1" />;
              }
            };

            return (
              <div
                key={member.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition"
              >
                <div className="flex items-start gap-4 mb-6">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-lg flex-shrink-0"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10`}>
                      <span className="text-white font-bold text-lg">{initials}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-violet-400 mb-1">
                      {member.full_name}
                    </h4>
                    <p className="text-sm text-neutral-400 mb-3">
                      {member.email}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center ${
                          member.role === 'lead'
                            ? 'bg-orange-600'
                            : member.role === 'moderator'
                            ? 'bg-blue-600'
                            : 'bg-violet-600'
                        }`}
                      >
                        {getRoleIcon(member.role)}
                        {member.role === 'lead' && 'Leader'}
                        {member.role === 'moderator' && 'Modérateur'}
                        {member.role === 'jury' && 'Jury'}
                      </span>
                      {parseSpecialite(member.specialite).map((item, index) => (
                        <span
                          key={`${member.id}-spec-${index}`}
                          className="px-3 py-1 rounded-full text-xs font-semibold text-violet-300 bg-violet-900/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-violet-300">
                      Progression
                    </span>
                    <span className="text-sm text-neutral-400">
                      {votesCast}/{totalFilms}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-900/30 border border-green-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ThumbsUp size={18} className="text-green-400" />
                      <div className="text-2xl font-bold text-green-400">
                        {stats.like}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">Aimé</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ThumbsDown size={18} className="text-red-400" />
                      <div className="text-2xl font-bold text-red-400">
                        {stats.dislike}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">Pas aimé</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle size={18} className="text-yellow-400" />
                      <div className="text-2xl font-bold text-yellow-400">
                        {stats.discuss}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">A discuter</div>
                  </div>
                  <div className="bg-violet-900/30 border border-violet-700/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-400">Approbation</span>
                      <div className="text-2xl font-bold text-violet-400">
                        {stats.approval_rate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Resume */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">Resume des Membres</h3>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-800/50">
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Nom
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Specialite
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Progression
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp size={16} />
                      Aime
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsDown size={16} />
                      Pas aime
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Approbation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {juryMembers.map((member) => {
                  const { initials, colorGradient } = getAvatarData(member.full_name);
                  const stats = member.stats || { like: 0, dislike: 0, discuss: 0, approval_rate: 0 };
                  const totalFilms = stats.total_films || films.length || 0;
                  const votesCast = stats.votes_cast || 0;
                  const progressPercentage = totalFilms > 0 ? Math.round((votesCast / totalFilms) * 100) : 0;

                  return (
                    <tr key={member.id} className="hover:bg-neutral-800/50 transition">
                      <td className="text-center px-6 py-4 text-neutral-300">
                        <div className="flex items-center gap-3">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 border border-white/10`}>
                              <span className="text-white font-bold text-sm">{initials}</span>
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-semibold">{member.full_name}</div>
                            <div className="text-xs text-neutral-500">
                              {parseSpecialite(member.specialite).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-neutral-400">
                        <div className="text-neutral-300">
                          {parseSpecialite(member.specialite).length > 0 ? (
                            parseSpecialite(member.specialite).join(', ')
                          ) : (
                            <span className="text-neutral-500 italic">-</span>
                          )}
                        </div>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span className="text-violet-400 font-semibold">
                          {votesCast}/{totalFilms}
                        </span>
                        <div className="w-20 h-1 bg-neutral-700 rounded-full mx-auto mt-2">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-green-400 font-semibold">
                        {stats.like}
                      </td>
                      <td className="text-center px-6 py-4 text-red-400 font-semibold">
                        {stats.dislike}
                      </td>
                      <td className="text-center px-6 py-4">
                        <span
                          className={`font-semibold ${
                            stats.approval_rate > 70
                              ? 'text-green-400'
                              : stats.approval_rate > 50
                              ? 'text-yellow-400'
                              : 'text-violet-400'
                          }`}
                        >
                          {stats.approval_rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
