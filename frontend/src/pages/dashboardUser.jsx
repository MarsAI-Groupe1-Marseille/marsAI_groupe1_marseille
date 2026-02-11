import React, { useState,useEffect } from "react";
import { Users, Eye, Pencil, Trash2, UserPlus } from "lucide-react";
import axios from '../config/axiosConfig';


function BadgeAttribution({ role }) {
    const styles = {
        admin: "bg-red-500/20 text-red-400 border border-red-500/30",
        jury: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        moderator: "bg-purple-600/40 text-purple-200 border border-purple-400",
    };

    const labels = {
        admin: "Admin",
        jury: "Jury",
        moderator: "Modérateur",
    };

    return (
        <span className={`text-sm px-4 py-1.5 rounded-full font-medium whitespace-nowrap ${styles[role] || "bg-gray-500/20 text-gray-400 border border-gray-500/30"}`}>
            {labels[role] || role}
        </span>
    );
}

function FormEdition({ user, editingData, setEditingData, onSave, onCancel, isLoading }) {
    return (
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col w-full">
                <label className="text-sm text-neutral-400 mb-1">Nom complet :</label>
                <input
                    value={editingData?.full_name || ''}
                    onChange={(e) => setEditingData({ ...editingData, full_name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nom complet"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-neutral-400 mb-1">Email :</label>
                <input
                    value={editingData?.email || ''}
                    onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Email"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-neutral-400 mb-1">Rôle :</label>
                <select
                    value={editingData?.role || ''}
                    onChange={(e) => setEditingData({ ...editingData, role: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                    <option value="admin">Admin</option>
                    <option value="jury">Jury</option>
                    <option value="moderator">Modérateur</option>
                </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap justify-end gap-3 mt-4">
                <button type="button" onClick={onCancel} className="w-full md:w-auto px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition" disabled={isLoading}>
                    Annuler
                </button>

                <button type="submit" className="w-full md:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                    {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
            </div>
        </form>
    );
}


function UserRow({ user, isEditing, toggleEdit, editingData, setEditingData, onSaveUser, onDeleteUser, isLoading }) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition">                
                <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm text-neutral-400">{user.email}</p>
                </div>

                <div className="flex justify-center items-center">
                    <BadgeAttribution role={user.role} />
                </div>

                <div className="flex flex-wrap gap-2 justify-start sm:justify-end col-span-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-sm">
                        <Eye size={16} />
                        Voir
                    </button>

                    <button onClick={() => {
                        toggleEdit(user.id);
                        if (!editingData?.id || editingData.id !== user.id) {
                            setEditingData({ id: user.id, full_name: user.full_name, email: user.email, role: user.role });
                        }
                    }} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 transition text-sm">
                        <Pencil size={16} />
                        Modifier profil
                    </button>

                    <button onClick={() => onDeleteUser(user.id, user.full_name)} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-red-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
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
                        onSave={() => onSaveUser(user.id)}
                        onCancel={() => toggleEdit(user.id)}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </>
    );
}

export default function UsersDashboard() {
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingData, setEditingData] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "jury" });
    const [isLoading, setIsLoading] = useState(false);

    const toggleEdit = (id) => {
        setEditingUserId(prev => (prev === id ? null : id));
    };

    const handleUpdateUser = async (userId) => {
        if (!editingData || editingData.id !== userId) return;

        setIsLoading(true);
        try {
            const response = await axios.put(`/users/${userId}`, {
                full_name: editingData.full_name,
                email: editingData.email,
                role: editingData.role
            });

            // Mettre à jour la liste localement
            setUsersList(usersList.map(user => 
                user.id === userId ? { ...user, ...editingData } : user
            ));

            console.log("Utilisateur mis à jour avec succès :", response.data);
            alert("Utilisateur mis à jour avec succès !");
            setEditingUserId(null);
            setEditingData(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            alert(`Erreur : ${error.response?.data?.error || "Impossible de mettre à jour l'utilisateur"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ? Cette action est irréversible.`)) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(`/users/${userId}`);

            // Mettre à jour la liste en supprimant l'utilisateur
            setUsersList(prev => prev.filter(user => user.id !== userId));

            console.log("Utilisateur supprimé avec succès");
            alert("Utilisateur supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
            alert(`Erreur : ${error.response?.data?.error || "Impossible de supprimer l'utilisateur"}`);
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
            alert(`Invitation envoyée avec succès à ${newUser.email} !`);
            
            // Recharger la liste des utilisateurs
            const usersResponse = await axios.get('/users');
            setUsersList(usersResponse.data);
            
            // Réinitialiser le formulaire
            setNewUser({ fullName: "", email: "", role: "jury" });
            setShowAddForm(false);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur :", error);
            alert(`Erreur : ${error.response?.data?.error || "Impossible de créer l'utilisateur"}`);
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
        <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-8">

            <header className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
                <div className="flex items-center gap-3">
                    <Users className="text-white" />
                    <h1 className="text-3xl font-bold text-white">
                        Gestion des utilisateurs
                    </h1>
                </div>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition w-full md:w-auto">
                    <UserPlus size={18} />
                    Ajouter un utilisateur
                </button>
            </header>

            {showAddForm && (
                <form
                    onSubmit={handleAddUser}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 grid md:grid-cols-3 gap-4"
                >
                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">Nom complet</label>
                        <input
                            type="text"
                            placeholder="Nom complet"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1 w-full">
                        <label className="text-sm text-neutral-400 mb-1">Rôle</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="admin">Admin</option>
                            <option value="jury">Jury</option>
                            <option value="moderator">Modérateur</option>
                        </select>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition w-full"
                            disabled={isLoading}
                        >
                            Annuler
                        </button>

                        <button 
                            type="submit" 
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Envoi en cours..." : "Ajouter et inviter"}
                        </button>
                    </div>
                </form>
            )}
            <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 text-sm text-neutral-400 border-b border-neutral-800">
                    <span>Utilisateur</span>
                    <span>Rôle</span>
                    <span className="col-span-2 text-right">Actions</span>
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
                        isLoading={isLoading}
                    />
                ))}
            </section>

        </div>
    );
}