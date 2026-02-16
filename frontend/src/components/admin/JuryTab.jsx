import { useState, useEffect } from 'react';
import { useFilms } from '../../hooks/useFilms';
import { User, Crown, Shield, BadgeCheck, TrendingUp, ThumbsUp, ThumbsDown, Clock, Percent, ListChecks } from 'lucide-react';

const INITIAL_JURY_MEMBERS = [
  {
    id: 1,
    full_name: 'Dr. Sophie Leclerc',
    email: 'sophie.leclerc@ai-festival.fr',
    role: 'lead',
    specialty: 'IA Créative',
    votes_cast: 12,
    total_films: 15,
    approved: 9,
    rejected: 3,
    pending: 0
  },
  {
    id: 2,
    full_name: 'Marc Dubois',
    email: 'marc.dubois@ai-festival.fr',
    role: 'jury',
    specialty: 'Production Vidéo',
    votes_cast: 15,
    total_films: 15,
    approved: 12,
    rejected: 3,
    pending: 0
  }
  
];

export default function JuryTab() {
  const { films } = useFilms();
  const [juryMembers, setJuryMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'jury',
    specialty: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('mars_ai_jury_members');
    if (stored) {
      setJuryMembers(JSON.parse(stored));
    } else {
      setJuryMembers(INITIAL_JURY_MEMBERS);
      localStorage.setItem('mars_ai_jury_members', JSON.stringify(INITIAL_JURY_MEMBERS));
    }
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: Math.max(...juryMembers.map(m => m.id), 0) + 1,
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      specialty: formData.specialty,
      votes_cast: 0,
      total_films: films.length,
      approved: 0,
      rejected: 0,
      pending: films.length
    };

    const updated = [...juryMembers, newMember];
    setJuryMembers(updated);
    localStorage.setItem('mars_ai_jury_members', JSON.stringify(updated));
    setFormData({ full_name: '', email: '', role: 'jury', specialty: '' });
    setShowForm(false);
  };

  const handleVote = (memberId, decision) => {
    const updated = juryMembers.map(member => {
      if (member.id === memberId && member.pending > 0) {
        return {
          ...member,
          votes_cast: member.votes_cast + 1,
          pending: Math.max(0, member.pending - 1),
          approved: decision === 'approved' ? member.approved + 1 : member.approved,
          rejected: decision === 'rejected' ? member.rejected + 1 : member.rejected
        };
      }
      return member;
    });
    setJuryMembers(updated);
    localStorage.setItem('mars_ai_jury_members', JSON.stringify(updated));
  };

  // Fonction pour obtenir l'icône avatar et la couleur basée sur le rôle
  const getAvatarConfig = (role) => {
    const configs = {
      'lead': { color: 'bg-orange-600', icon: Crown },
      'moderator': { color: 'bg-blue-600', icon: Shield },
      'jury': { color: 'bg-violet-600', icon: User }
    };
    return configs[role] || configs.jury;
  };

  return (
    <div className="space-y-8">
      {/* Section Statistiques Globales */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">Statistiques Globales</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Membres du jury</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{juryMembers.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Films à évaluer</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{films.length}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Progression totale</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">
              {Math.round(
                (juryMembers.reduce((acc, m) => acc + m.votes_cast, 0) /
                  (juryMembers.length * films.length || 1)) * 100
              )}%
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400">Films approuvés</p>
            <p className="text-3xl font-bold mt-2 text-violet-400">{juryMembers.reduce((acc, m) => acc + m.approved, 0)}</p>
          </div>
        </div>
      </section>

      {/* Section Gestion des Membres */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck size={24} className="text-violet-400" />
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
              type="text"
              placeholder="Nom complet"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
            />
            <input
              type="text"
              placeholder="Spécialité"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
            >
              <option value="jury">Membre du Jury</option>
              <option value="lead">Leader du Jury</option>
              <option value="moderator">Modérateur</option>
            </select>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-semibold rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Cartes des Membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juryMembers.map((member) => {
            const progressPercentage = (member.votes_cast / member.total_films) * 100;
            const approvalRate = member.votes_cast > 0
              ? (member.approved / member.votes_cast) * 100
              : 0;

            return (
              <div
                key={member.id}
                onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                className={`bg-neutral-900 border border-neutral-800 rounded-xl p-6 cursor-pointer hover:bg-neutral-800 transition ${
                  selectedMember?.id === member.id ? 'ring-2 ring-violet-500' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`${getAvatarConfig(member.role).color} w-16 h-16 rounded-lg flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const IconComponent = getAvatarConfig(member.role).icon;
                      return <IconComponent size={28} className="text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-violet-400 mb-1">
                      {member.full_name}
                    </h4>
                    <p className="text-sm text-neutral-400 mb-3">
                      {member.email}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          member.role === 'lead'
                            ? 'bg-orange-600'
                            : member.role === 'moderator'
                            ? 'bg-blue-600'
                            : 'bg-violet-600'
                        }`}
                      >
                        {member.role === 'lead' && 'Leader'}
                        {member.role === 'moderator' && 'Modérateur'}
                        {member.role === 'jury' && 'Jury'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-violet-300 bg-violet-900/30">
                        {member.specialty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-violet-300">
                      Progression
                    </span>
                    <span className="text-sm text-neutral-400">
                      {member.votes_cast}/{member.total_films}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-green-900/30 border border-green-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-400 mb-1">
                      <ThumbsUp size={14} />
                      <span className="text-xs text-neutral-400">Approuvé</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {member.approved}
                    </div>
                  </div>
                  <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <ThumbsDown size={14} />
                      <span className="text-xs text-neutral-400">Rejeté</span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                      {member.rejected}
                    </div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-400 mb-1">
                      <Clock size={14} />
                      <span className="text-xs text-neutral-400">En attente</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {member.pending}
                    </div>
                  </div>
                  <div className="bg-violet-900/30 border border-violet-700/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-violet-400 mb-1">
                      <Percent size={14} />
                      <span className="text-xs text-neutral-400">Taux</span>
                    </div>
                    <div className="text-2xl font-bold text-violet-400">
                      {approvalRate.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Résumé */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ListChecks size={24} className="text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">Résumé des Membres</h3>
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
                    Rôle
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Progression
                  </th>
                  <th className="text-center px-8 py-4 text-sm font-semibold text-green-400 whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1">
                      <ThumbsUp size={14} /> Approuvé
                    </div>
                  </th>
                  <th className="text-center px-8 py-4 text-sm font-semibold text-red-400 whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1">
                      <ThumbsDown size={14} /> Rejeté
                    </div>
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-violet-400">
                    Approbation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {juryMembers.map((member) => {
                  const progressPercentage = (member.votes_cast / member.total_films) * 100;
                  const approvalRate = member.votes_cast > 0
                    ? (member.approved / member.votes_cast) * 100
                    : 0;

                  return (
                    <tr key={member.id} className="hover:bg-neutral-800/50 transition">
                      <td className="text-center px-6 py-4 text-neutral-300">
                        <div className="flex items-center gap-3">
                          <div className={`${getAvatarConfig(member.role).color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {(() => {
                              const IconComponent = getAvatarConfig(member.role).icon;
                              return <IconComponent size={18} className="text-white" />;
                            })()}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-neutral-200">{member.full_name}</div>
                            <div className="text-xs text-neutral-500">
                              {member.specialty}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-sm text-neutral-400">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                          member.role === 'lead'
                            ? 'bg-orange-900/30 text-orange-300'
                            : member.role === 'moderator'
                            ? 'bg-blue-900/30 text-blue-300'
                            : 'bg-violet-900/30 text-violet-300'
                        }`}>
                          {member.role === 'lead' && <><Crown size={12} /> Leader</>}
                          {member.role === 'moderator' && <><Shield size={12} /> Modérateur</>}
                          {member.role === 'jury' && <><User size={12} /> Jury</>}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span className="text-violet-400 font-semibold">
                          {member.votes_cast}/{member.total_films}
                        </span>
                        <div className="w-20 h-1 bg-neutral-700 rounded-full mx-auto mt-2">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4 text-green-400 font-semibold">
                        {member.approved}
                      </td>
                      <td className="text-center px-6 py-4 text-red-400 font-semibold">
                        {member.rejected}
                      </td>
                      <td className="text-center px-6 py-4">
                        <span
                          className={`font-semibold ${
                            approvalRate > 70
                              ? 'text-green-400'
                              : approvalRate > 50
                              ? 'text-yellow-400'
                              : 'text-violet-400'
                          }`}
                        >
                          {approvalRate.toFixed(0)}%
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
