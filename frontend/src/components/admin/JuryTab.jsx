import { useState, useEffect } from 'react';
import { useFilms } from '../../hooks/useFilms';
import axios from '../../config/axiosConfig';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { BarChart3, Users, ThumbsUp, ThumbsDown, MessageCircle, Trophy, Scale, UserCheck, FileText, TrendingUp } from 'lucide-react';

export default function JuryTab() {
  const { films } = useFilms();
  const { t } = useLanguage();
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

  const specialtyBadgeColors = [
    'bg-violet-900/30 text-violet-200 border-violet-700/40',
    'bg-blue-900/30 text-blue-200 border-blue-700/40',
    'bg-emerald-900/30 text-emerald-200 border-emerald-700/40',
    'bg-amber-900/30 text-amber-200 border-amber-700/40',
    'bg-rose-900/30 text-rose-200 border-rose-700/40',
    'bg-cyan-900/30 text-cyan-200 border-cyan-700/40'
  ];

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
      setError(t('jury_error'));
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
      setFormError(err.response?.data?.error || t('error_required'));
    } finally {
      setFormLoading(false);
    }
  };

  const totalDecisions = globalStats.films_liked + globalStats.films_disliked + globalStats.films_discuss;
  const likedRatio = totalDecisions > 0 ? globalStats.films_liked / totalDecisions : 0;
  const dislikedRatio = totalDecisions > 0 ? globalStats.films_disliked / totalDecisions : 0;
  const discussRatio = totalDecisions > 0 ? globalStats.films_discuss / totalDecisions : 0;

  const donutSegments = [
    { label: t('jury_tab_liked'), ratio: likedRatio, color: '#22c55e' },
    { label: t('jury_tab_disliked'), ratio: dislikedRatio, color: '#ef4444' },
    { label: t('jury_tab_to_discuss'), ratio: discussRatio, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Section Statistiques Globales */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-violet-400" />
          <h3 className="text-lg md:text-xl font-bold text-violet-400">{t('jury_tab_global_stats')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition">
            <p className="text-xs md:text-sm text-neutral-400 font-medium">{t('jury_jury_members_label')}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-3 md:mt-4 text-violet-400">{globalStats.jury_count || juryMembers.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 hover:bg-neutral-800/50 hover:border-neutral-700 transition">
            <p className="text-xs md:text-sm text-neutral-400 font-medium">{t('jury_tab_films_to_evaluate')}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-3 md:mt-4 text-violet-400">{globalStats.approved_films}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">{t('jury_tab_total_progress')}</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{globalStats.total_progress}%</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">{t('jury_tab_global_decisions')}</p>
                <p className="text-xs text-neutral-500 mt-1">{t('jury_tab_liked')} / {t('jury_tab_disliked')} / {t('jury_tab_to_discuss')}</p>
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
      <section className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users size={22} className="text-violet-400" />
            <h3 className="text-lg md:text-xl font-bold text-violet-400">{t('jury_tab_members')}</h3>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {t('jury_tab_add_member')}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAddMember}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 space-y-4"
          >
            <input
              type="email"
              placeholder={t('jury_tab_email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={formLoading}
              className="w-full px-4 py-2 md:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm md:text-base focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
            <input
              type="text"
              placeholder={t('jury_tab_full_name')}
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              disabled={formLoading}
              className="w-full px-4 py-2 md:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm md:text-base focus:outline-none focus:border-violet-500 disabled:opacity-50"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={formLoading}
              className="w-full px-4 py-2 md:py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-violet-500 disabled:opacity-50"
            >
              <option value="jury">{t('jury_tab_role_option')}</option>
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
                className="flex-1 px-4 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 text-sm md:text-base"
              >
                {formLoading ? t('jury_tab_in_progress') : t('jury_tab_add_button')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                }}
                disabled={formLoading}
                className="flex-1 px-4 py-2 md:py-3 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold rounded-lg transition disabled:opacity-50 text-sm md:text-base"
              >
                {t('jury_tab_cancel_button')}
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="text-sm text-neutral-400">{t('jury_tab_loading')}</div>
        )}
        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        {/* Cartes des Membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 auto-rows-max">
          {juryMembers.map((member) => {
            const { initials, colorGradient } = getAvatarData(member.full_name);
            const stats = member.stats || { like: 0, dislike: 0, discuss: 0, approval_rate: 0 };
            const totalFilms = stats.total_films || films.length || 0;
            const votesCast = stats.votes_cast || 0;
            const progressPercentage = totalFilms > 0 ? Math.round((votesCast / totalFilms) * 100) : 0;
            
            const specialties = parseSpecialite(member.specialite);

            return (
          <div key={member.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 hover:bg-neutral-800 transition">
            <div className="flex items-start gap-4 mb-6">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.full_name}
                  className="w-12 sm:w-16 h-12 sm:h-16 rounded-full object-cover border border-white/10 shadow-lg flex-shrink-0"
                />
              ) : (
                <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10`}>
                  <span className="text-white font-bold text-sm sm:text-lg">{initials}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-base md:text-lg font-semibold text-violet-400 mb-1 truncate">
                  {member.full_name}
                </h4>
                <p className="text-xs md:text-sm text-neutral-400 mb-3 truncate">
                  {member.email}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {specialties.length > 0 ? (
                    specialties.map((item, index) => (
                      <span
                        key={`${member.id}-spec-${index}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border truncate ${specialtyBadgeColors[index % specialtyBadgeColors.length]}`}
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-blue-200 bg-blue-900/30 border border-blue-700/40">
                      Jury
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs md:text-sm font-semibold text-violet-300">
                  {t('jury_tab_progress')}
                </span>
                <span className="text-xs md:text-sm text-neutral-400">
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

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="bg-green-900/30 border border-green-700/30 rounded-lg p-2 md:p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ThumbsUp size={16} className="text-green-400 flex-shrink-0" />
                  <div className="text-xl md:text-2xl font-bold text-green-400">
                    {stats.like}
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{t('jury_tab_liked')}</div>
              </div>
              <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-2 md:p-3">
                <div className="flex items-center gap-2 mb-1">
                  <ThumbsDown size={16} className="text-red-400 flex-shrink-0" />
                  <div className="text-xl md:text-2xl font-bold text-red-400">
                    {stats.dislike}
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{t('jury_tab_disliked')}</div>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-lg p-2 md:p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle size={16} className="text-yellow-400 flex-shrink-0" />
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">
                    {stats.discuss}
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{t('jury_tab_to_discuss')}</div>
              </div>
              <div className="bg-violet-900/30 border border-violet-700/30 rounded-lg p-2 md:p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-400">{t('jury_tab_approval_rate')}</span>
                  <div className="text-xl md:text-2xl font-bold text-violet-400">
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

      {/* Section Resume - RESPONSIVE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText size={22} className="text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">{t('jury_summary_title')}</h3>
        </div>

        {/* VERSION MOBILE & TABLETTE (< lg) */}
        <div className="lg:hidden space-y-3">
          {juryMembers.map((member) => {
            const { initials, colorGradient } = getAvatarData(member.full_name);
            const stats = member.stats || { like: 0, dislike: 0, discuss: 0, approval_rate: 0 };
            const totalFilms = stats.total_films || films.length || 0;
            const votesCast = stats.votes_cast || 0;
            const progressPercentage = totalFilms > 0 ? Math.round((votesCast / totalFilms) * 100) : 0;

            return (
              <div
                key={member.id}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800/70 transition"
              >
                {/* Nom & Avatar */}
                <div className="flex items-center gap-3 mb-3">
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
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-200 truncate">{member.full_name}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parseSpecialite(member.specialite).length > 0 ? (
                        parseSpecialite(member.specialite).map((item, index) => (
                          <span
                            key={`${member.id}-mobile-spec-${index}`}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border truncate ${specialtyBadgeColors[index % specialtyBadgeColors.length]}`}
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-blue-200 bg-blue-900/30 border border-blue-700/40">
                          Jury
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grille 2x3 des stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-neutral-400 mb-1">{t('jury_tab_progress')}</div>
                    <div className="font-bold text-violet-400 text-sm">{votesCast}/{totalFilms}</div>
                    <div className="w-full h-1 bg-neutral-700 rounded-full mt-1">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-neutral-800/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-neutral-400 mb-1">{t('jury_tab_approval_rate')}</div>
                    <div
                      className={`font-bold text-sm ${
                        stats.approval_rate > 70
                          ? 'text-green-400'
                          : stats.approval_rate > 50
                          ? 'text-yellow-400'
                          : 'text-violet-400'
                      }`}
                    >
                      {stats.approval_rate}%
                    </div>
                  </div>

                  <div className="bg-green-900/30 rounded-lg p-2 text-center border border-green-700/30">
                    <div className="text-xs text-neutral-400 mb-1">{t('jury_table_approved')}</div>
                    <div className="font-bold text-green-400 text-sm">{stats.like}</div>
                  </div>

                  <div className="bg-red-900/30 rounded-lg p-2 text-center border border-red-700/30">
                    <div className="text-xs text-neutral-400 mb-1">{t('jury_table_rejected')}</div>
                    <div className="font-bold text-red-400 text-sm">{stats.dislike}</div>
                  </div>

                  <div className="bg-yellow-900/30 rounded-lg p-2 text-center border border-yellow-700/30 col-span-2">
                    <div className="text-xs text-neutral-400 mb-1">{t('jury_tab_to_discuss')}</div>
                    <div className="font-bold text-yellow-400 text-sm">{stats.discuss}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VERSION DESKTOP (lg et +) - TABLEAU */}
        <div className="hidden lg:block bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-violet-400 min-w-fit">
                    {t('jury_table_name')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-violet-400 min-w-fit">
                    {t('jury_tab_specialty')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-violet-400 min-w-fit">
                    {t('jury_tab_progress')}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-violet-400 min-w-fit">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsUp size={16} />
                      {t('jury_table_approved')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-violet-400 min-w-fit">
                    <div className="flex items-center justify-center gap-1">
                      <ThumbsDown size={16} />
                      {t('jury_table_rejected')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-violet-400 min-w-fit">
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle size={16} />
                      {t('jury_tab_to_discuss')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-violet-400 min-w-fit">
                    {t('jury_tab_approval_rate')}
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
                      <td className="px-6 py-4 text-neutral-300 sticky left-0 z-10 bg-neutral-900 hover:bg-neutral-800/30">
                        <div className="flex items-center gap-3 min-w-fit">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorGradient} flex items-center justify-center flex-shrink-0 border border-white/10`}>
                              <span className="text-white font-bold text-sm">{initials}</span>
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-semibold">{member.full_name}</div>
                            <div className="text-xs text-neutral-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        <div className="max-w-xs">
                          {parseSpecialite(member.specialite).length > 0 ? (
                            parseSpecialite(member.specialite).join(', ')
                          ) : (
                            <span className="text-neutral-500 italic">{t('jury_tab_no_specialty')}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-violet-400 font-semibold whitespace-nowrap">
                            {votesCast}/{totalFilms}
                          </span>
                          <div className="w-24 h-2 bg-neutral-700 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-neutral-500">{progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="bg-green-900/20 text-green-400 font-semibold rounded-lg py-2 px-3 inline-block">
                          {stats.like}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="bg-red-900/20 text-red-400 font-semibold rounded-lg py-2 px-3 inline-block">
                          {stats.dislike}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="bg-yellow-900/20 text-yellow-400 font-semibold rounded-lg py-2 px-3 inline-block">
                          {stats.discuss}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-semibold px-3 py-2 rounded-lg inline-block ${
                            stats.approval_rate > 70
                              ? 'bg-green-900/20 text-green-400'
                              : stats.approval_rate > 50
                              ? 'bg-yellow-900/20 text-yellow-400'
                              : 'bg-violet-900/20 text-violet-400'
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
