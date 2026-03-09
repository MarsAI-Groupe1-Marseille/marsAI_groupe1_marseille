import React, { useState,useEffect } from "react";
import { Users, Eye, Pencil, Trash2, UserPlus, X } from "lucide-react";
import axios from '../config/axiosConfig';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Dashboard User Component - Force recompile

// Fonction utilitaire pour obtenir l'avatar avec initiales
function getInitials(fullName) {
    if (!fullName) return 'U';
    return fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
}

// Fonction utilitaire pour déterminer la couleur de l'avatar en fonction du role
function getAvatarColor(role) {
    const colors = {
        admin: "from-red-500 to-red-700",
        jury: "from-blue-500 to-blue-700",
        moderator: "from-purple-500 to-purple-700",
    };
    return colors[role] || "from-violet-500 to-violet-700";
}

// Modal de détails utilisateur
function UserDetailModal({ user, onClose, t }) {
    if (!user) return null;

    const getRoleBg = (role) => {
        const styles = {
            admin: "bg-red-500/20 text-red-400 border border-red-500/30",
            jury: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
            moderator: "bg-purple-600/40 text-purple-200 border border-purple-400",
        };
        return styles[role] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    };

    const getRoleLabel = (role) => {
        const labels = {
            admin: t('dashboard_user_admin') || "Admin",
            jury: t('dashboard_user_jury') || "Jury",
            moderator: t('dashboard_user_moderator') || "Modérateur",
        };
        return labels[role] || role;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/95 backdrop-blur-xl"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-3xl bg-neutral-900 border border-violet-500/20 rounded-3xl overflow-hidden shadow-2xl h-auto sm:h-[70vh] md:h-[75vh]">
                
                {/* Bouton fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-3 bg-neutral-800 hover:bg-red-600 text-white rounded-full transition-all border border-neutral-700"
                    aria-label="Fermer"
                >
                    <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    
                    {/* Panel Avatar */}
                    <div className="relative group h-48 sm:h-60 md:h-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                className="w-full h-full object-cover transition-all duration-500"
                                alt={user.full_name}
                            />
                        ) : (
                            <div className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${getAvatarColor(user.role)} flex items-center justify-center border-4 border-violet-500/30 shadow-xl`}>
                                <span className="text-white font-bold text-4xl sm:text-5xl md:text-6xl">
                                    {getInitials(user.full_name)}
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-neutral-900/40 md:to-neutral-900 pointer-events-none" />
                    </div>

                    {/* Panel Info */}
                    <div className="p-6 sm:p-8 md:p-8 flex flex-col justify-between overflow-auto">
                        <div className="flex flex-col space-y-4">
                            {/* Date d'inscription */}
                            <div className="space-y-1">
                                <p className="text-xs text-neutral-500">
                                    {t('dashboard_user_registered_date') || 'Inscrit le '} {new Date(user.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Nom de l'utilisateur */}
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                                {user.full_name}
                            </h2>

                            {/* Rôle */}
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-4 py-2 rounded-full font-semibold ${getRoleBg(user.role)}`}>
                                    {getRoleLabel(user.role)}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="pt-2">
                                <p className="text-xs text-neutral-500 mb-1">{t('dashboard_user_email') || 'Email'}</p>
                                <p className="text-sm text-neutral-300 break-all">{user.email}</p>
                            </div>

                            {/* Details supplémentaires */}
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
                                    <p className="text-xs text-neutral-500 mb-1">{t('dashboard_user_status') || 'Statut'}</p>
                                    <p className="text-sm font-semibold text-violet-400">
                                        {user.account_status === 'active'
                                            ? (t('dashboard_user_status_active') || 'Actif')
                                            : (t('dashboard_user_status_pending') || 'En attente')}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-700">
                                    <p className="text-xs text-neutral-500 mb-1">{t('dashboard_user_role') || 'Rôle'}</p>
                                    <p className="text-sm font-semibold text-violet-400 capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bouton fermer */}
                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-500 hover:to-violet-700 text-white font-semibold transition"
                        >
                            {t('dashboard_user_close_modal') || 'Fermer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function BadgeAttribution({ role, t }) {
   
    const styles = {
        admin: "bg-red-500/20 text-red-400 border border-red-500/30",
        jury: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        moderator: "bg-purple-600/40 text-purple-200 border border-purple-400",
    };

    const labels = {
        admin: t ? t('dashboard_user_admin') : "Admin",
        jury: t ? t('dashboard_user_jury') : "Jury",
        moderator: t ? t('dashboard_user_moderator') : "Modérateur",
    };

    return (
        <span className={`text-sm px-4 py-1.5 rounded-full font-medium whitespace-nowrap ${styles[role] || "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
            {labels[role] || role}
        </span>
    );
}

function FormEdition({ user, editingData, setEditingData, onSave, onCancel, isLoading, t }) {
    const [avatarFile, setAvatarFile] = React.useState(null);
    const [avatarPreview, setAvatarPreview] = React.useState(user?.avatar_url || null);
    const fileInputRef = React.useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Valider le type de fichier
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Format image invalide. JPG, PNG, WEBP acceptés.');
                return;
            }

            // Valider la taille (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Fichier trop volumineux. Max 5MB.');
                return;
            }

            setAvatarFile(file);
            
            // Créer un aperçu
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Passer le fichier avatar au parent via une fonction callback
        onSave(avatarFile);
    };
    
    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col w-full">
            {/* Section Avatar - Centré en haut */}
            <div className="flex justify-center mb-6">
                <div className="relative group">
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500/30 hover:border-violet-500/80 transition cursor-pointer hover:shadow-lg hover:shadow-violet-500/30"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(editingData?.role || user?.role)} flex items-center justify-center`}>
                                <span className="text-white font-bold text-4xl">
                                    {getInitials(editingData?.full_name || user?.full_name)}
                                </span>
                            </div>
                        )}
                        
                        {/* Overlay au hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-white text-xs font-semibold text-center px-2">{t('dashboard_user_change_avatar') || 'Changer'}</span>
                        </div>
                    </button>

                    {/* Input file caché */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                        name="avatar"
                    />

                    {/* Badge si fichier sélectionné */}
                    {avatarFile && (
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                            ✓
                        </div>
                    )}
                </div>
            </div>

            {/* Inputs utilisateur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col w-full">
                    <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_fullname')}</label>
                    <input
                        value={editingData?.full_name || ''}
                        onChange={(e) => setEditingData({ ...editingData, full_name: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder={t('dashboard_user_fullname')}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_email')}</label>
                    <input
                        value={editingData?.email || ''}
                        onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder={t('dashboard_user_email')}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_role')}</label>
                    <select
                        value={editingData?.role || ''}
                        onChange={(e) => setEditingData({ ...editingData, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="admin">{t('dashboard_user_admin')}</option>
                        <option value="jury">{t('dashboard_user_jury')}</option>
                        <option value="moderator">{t('dashboard_user_moderator')}</option>
                    </select>
                </div>
            </div>

            {/* Boutons action */}
            <div className="md:col-span-2 flex flex-wrap justify-end gap-3 mt-6">
                <button type="button" onClick={onCancel} className="w-full md:w-auto px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition" disabled={isLoading}>
                    {t('dashboard_user_cancel')}
                </button>

                <button type="submit" className="w-full md:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                    {isLoading ? t('dashboard_user_saving') : t('dashboard_user_save')}
                </button>
            </div>
        </form>
    );
}


function UserRow({ user, isEditing, toggleEdit, editingData, setEditingData, onSaveUser, onDeleteUser, onViewUser, isLoading, t, currentUserRole }) {
    const isModerator = currentUserRole === "moderator";
    
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition">                
                <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-neutral-400">{user.email}</p>
                </div>

                <div className="flex justify-center items-center">
                    <BadgeAttribution role={user.role} t={t} />
                </div>

                <div className="flex flex-wrap gap-2 justify-start sm:justify-end col-span-2">
                    <button 
                        onClick={() => onViewUser(user.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-blue-600 transition text-sm">
                        <Eye size={16} />
                        {t('dashboard_user_see')}
                    </button>

                    <button 
                        onClick={() => {
                            if (!isModerator) {
                                toggleEdit(user.id);
                                if (!editingData?.id || editingData.id !== user.id) {
                                    setEditingData({ id: user.id, full_name: user.full_name, email: user.email, role: user.role });
                                }
                            }
                        }} 
                        disabled={isModerator}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isModerator ? "Action non autorisée pour les modérateurs" : ""}
                    >
                        <Pencil size={16} />
                        {t('dashboard_user_edit')}
                    </button>

                    <button 
                        onClick={() => !isModerator && onDeleteUser(user.id, user.full_name)} 
                        disabled={isLoading || isModerator} 
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-red-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isModerator ? "Action non autorisée pour les modérateurs" : ""}
                    >
                        <Trash2 size={16} />
                        Supprimer
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-neutral-950 p-6 border-b border-neutral-800">
                    <FormEdition 
                        user={user} 
                        editingData={editingData}
                        setEditingData={setEditingData}
                        onSave={(avatarFile) => onSaveUser(user.id, avatarFile)}
                        onCancel={() => toggleEdit(user.id)}
                        isLoading={isLoading}
                        t={t}
                    />
                </div>
            )}
        </>
    );
}

export default function DashboardUser() {
    const { t } = useLanguage();
    const { user: currentUser } = useAuth();
    const isModerator = currentUser?.role === "moderator";
    const [usersList, setUsersList] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingData, setEditingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "jury" });
    const [notice, setNotice] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const showNotice = (type, message) => {
        setNotice({ type, message });
        window.setTimeout(() => setNotice(null), 4000);
    };

    const toggleEdit = (id) => {
        setEditingUserId(prev => (prev === id ? null : id));
    };

    const handleViewUser = async (userId) => {
        setLoadingDetails(true);
        try {
            const response = await axios.get(`/users/${userId}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'utilisateur :", error);
            showNotice('error', t('dashboard_user_error_loading'));
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setSelectedUser(null);
    };

    const handleUpdateUser = async (userId, avatarFile) => {
        if (!editingData || editingData.id !== userId) return;

        setIsLoading(true);
        try {
            let response;

            // Si un fichier avatar est sélectionné, envoyer en FormData
            if (avatarFile) {
                const formData = new FormData();
                formData.append('full_name', editingData.full_name);
                formData.append('email', editingData.email);
                formData.append('role', editingData.role);
                formData.append('avatar', avatarFile);

                response = await axios.put(`/users/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } else {
                // Sinon, envoyer en JSON classique
                response = await axios.put(`/users/${userId}`, {
                    full_name: editingData.full_name,
                    email: editingData.email,
                    role: editingData.role
                });
            }

            // Mettre à jour la liste localement
            setUsersList(usersList.map(user => 
                user.id === userId ? { 
                    ...user, 
                    ...editingData,
                    avatar_url: response.data?.user?.avatar_url || user.avatar_url
                } : user
            ));

            console.log("Utilisateur mis à jour avec succès :", response.data);
            showNotice('success', t('dashboard_user_updated'));
            setEditingUserId(null);
            setEditingData(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            showNotice('error', `${t('dashboard_user_error')} : ${error.response?.data?.error || t('dashboard_user_error_update')}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`${t('dashboard_user_confirm_delete')} ${userName} ${t('dashboard_user_irreversible')}`)) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(`/users/${userId}`);

            // Mettre à jour la liste en supprimant l'utilisateur
            setUsersList(prev => prev.filter(user => user.id !== userId));

            console.log("Utilisateur supprimé avec succès");
            showNotice('success', t('dashboard_user_success'));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            showNotice('error', `${t('dashboard_user_error')} : ${error.response?.data?.error || t('dashboard_user_error_delete')}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Appel à l'API pour créer et inviter l'utilisateur
            const response = await axios.post('/users/invite', {
                email: newUser.email,
                full_name: newUser.fullName,
                role: newUser.role
            });
            
            // Afficher un message de succès
            console.log("Utilisateur créé avec succès :", response.data);
            showNotice('success', `${t('dashboard_user_invited')} ${newUser.email} !`);
            
            // Recharger la liste des utilisateurs
            const usersResponse = await axios.get('/users');
            setUsersList(usersResponse.data);
            
            // Réinitialiser le formulaire
            setNewUser({ fullName: "", email: "", role: "jury" });
            setShowAddForm(false);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            showNotice('error', `${t('dashboard_user_error')} : ${error.response?.data?.error || t('dashboard_user_error_create')}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Appel à l'API pour récupérer les utilisateurs
        axios.get('/users')     
            .then(response => {
                console.log("Utilisateurs récupérés :", response.data);
                setUsersList(response.data); // On suppose que l'API renvoie un tableau d'utilisateurs
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            });
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
            <main className="w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto space-y-8">

            {notice && (
                <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${notice.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                    {notice.message}
                </div>
            )}

            <header className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
                <div className="flex items-center gap-3">
                    <Users className="text-white" />
                    <h1 className="text-3xl font-bold text-white">
                        {t('dashboard_user_title')}
                    </h1>
                </div>

                <button
                    onClick={() => !isModerator && setShowAddForm(!showAddForm)}
                    disabled={isModerator}
                    className="flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50"
                    title={isModerator ? "Action non autorisée pour les modérateurs" : ""}
                >
                    <UserPlus size={18} />
                    {t('dashboard_user_add')}
                </button>
            </header>

            {showAddForm && (
                <form
                    onSubmit={handleAddUser}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 grid md:grid-cols-3 gap-4"
                >
                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_fullname')}</label>
                        <input
                            type="text"
                            placeholder={t('dashboard_user_fullname')}
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_email')}</label>
                        <input
                            type="email"
                            placeholder={t('dashboard_user_email')}
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">{t('dashboard_user_role')}</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="admin">{t('dashboard_user_admin')}</option>
                            <option value="jury">{t('dashboard_user_jury')}</option>
                            <option value="moderator">{t('dashboard_user_moderator')}</option>
                        </select>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition w-full md:w-auto"
                            disabled={isLoading}
                        >
                            {t('dashboard_user_cancel')}
                        </button>

                        <button 
                            type="submit" 
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? t('dashboard_user_sending') : t('dashboard_user_add_invite')}
                        </button>
                    </div>
                </form>
            )}
            <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 text-sm text-neutral-400 border-b border-neutral-800">
                    <span>{t('dashboard_user_column_user')}</span>
                    <span className="text-left sm:text-center">{t('dashboard_user_column_role')}</span>
                    <span className="col-span-1 sm:col-span-2 text-left sm:text-right">{t('dashboard_user_column_actions')}</span>
                </div>

                {usersList.map((user) => (
                    <UserRow 
                        key={user.id}
                        user={user} 
                        isEditing={editingUserId === user.id}
                        toggleEdit={toggleEdit}
                        editingData={editingData}
                        setEditingData={setEditingData}
                        onSaveUser={handleUpdateUser}
                        onDeleteUser={handleDeleteUser}
                        onViewUser={handleViewUser}
                        isLoading={isLoading}
                        t={t}
                        currentUserRole={currentUser?.role}
                    />
                ))}
            </section>

                </div>
            </main>

            {/* Modal de détails utilisateur */}
            {selectedUser && <UserDetailModal user={selectedUser} onClose={closeModal} t={t} />}
        </div>
    );
}