import React, { useState } from "react";
import { Users, Eye, Pencil, Trash2, UserPlus } from "lucide-react";

const users = [
    { id: 1, name: "Benjamin Lacroix", email: "benjamin@gmail.com", role: "Admin" },
    { id: 2, name: "Diakité Mossad", email: "diakite@gmail.com", role: "Jury" },
    { id: 3, name: "Belinda santabou", email: "belinda@gmail.com", role: "Utilisateur" },
];

function BadgeAttribution({ role }) {
    const styles = {
        Admin: "bg-red-500/20 text-red-400 border border-red-500/30",
        Jury: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        Utilisateur: "bg-green-500/20 text-green-400 border border-green-500/30",
    };

    return (
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${styles[role]}`}>
            {role}
        </span>
    );
}

function FormEdition({ user }) {
    return (
        <form className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-neutral-400 mb-1">Nom :</label>
                <input
                    defaultValue={user.name}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Nom"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-neutral-400 mb-1">Prénom :</label>
                <input
                    defaultValue={user.firstName || ""}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Prénom"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-neutral-400 mb-1">Email :</label>
                <input
                    defaultValue={user.email}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Email"
                />
            </div>

            <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <button type="button" className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition">
                    Annuler
                </button>

                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition">
                    Enregistrer
                </button>
            </div>
        </form>
    );
}


function UserRow({ user, isEditing, toggleEdit }) {
    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition">                
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-neutral-400">{user.email}</p>
                </div>

                <BadgeAttribution role={user.role} />

                <div className="flex gap-3 justify-end col-span-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition text-sm">
                        <Eye size={16} />
                        Voir
                    </button>

                    <button onClick={() => toggleEdit(user.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 transition text-sm">
                        <Pencil size={16} />
                        Modifier profil
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-red-600 transition text-sm">
                        <Trash2 size={16} />
                        Supprimer
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="bg-neutral-950 p-6 border-b border-neutral-800">
                    <FormEdition user={user} />
                </div>
            )}
        </>
    );
}

export default function UsersDashboard() {
    const [editingUserId, setEditingUserId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [usersList, setUsersList] = useState(users);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", role: "Utilisateur" });

    const toggleEdit = (id) => {
    setEditingUserId(prev => (prev === id ? null : id));
};
    const handleAddUser = (e) => {
        e.preventDefault();
        const id = usersList.length + 1;
        setUsersList([...usersList, { id, name: newUser.fullName, email: newUser.email, role: newUser.role }]);
        setNewUser({ fullName: "", email: "", role: "Utilisateur" });
        setShowAddForm(false);
    };
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
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition">
                    <UserPlus size={18} />
                    Ajouter un utilisateur
                </button>
            </header>

             {/* FORMULAIRE AJOUT UTILISATEUR */}
            {showAddForm && (
                <form
                    onSubmit={handleAddUser}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 grid md:grid-cols-3 gap-4"
                >
                    <div className="flex flex-col md:col-span-1">
                        <label className="text-sm text-neutral-400 mb-1">Nom complet</label>
                        <input
                            type="text"
                            placeholder="Nom complet"
                            value={newUser.fullName}
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1">
                        <label className="text-sm text-neutral-400 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:col-span-1">
                        <label className="text-sm text-neutral-400 mb-1">Rôle</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        >
                            <option value="Admin">Modérateur</option>
                            <option value="Jury">Jury</option>
                            <option value="Utilisateur">Utilisateur</option>
                        </select>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition"
                        >
                            Annuler
                        </button>

                        <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition">
                            Ajouter
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

                {users.map((user) => (
                    <UserRow 
                    key={user.id}
                    user={user} 
                    isEditing={editingUserId === user.id}
                    toggleEdit={toggleEdit} />
                ))}
            </section>

        </div>
    );
}