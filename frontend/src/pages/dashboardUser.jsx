import React from "react";
import { Users, Eye, Pencil, Trash2, UserPlus } from "lucide-react";

const users = [
    { id: 1, name: "Benjamin Lacroix", email: "benjamin@gmail.com", role: "Admin" },
    { id: 2, name: "Diakité Mossad", email: "diakite@gmail.com", role: "Jury" },
    { id: 3, name: "Belinda santabou", email: "belinda@gmail.com", role: "Utilisateur" },
];

function UserRow({ user }) {
    return (
        <div className="grid grid-cols-4 items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition">
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-neutral-400">{user.email}</p>
            </div>

            <span className="text-sm text-violet-400">{user.role}</span>

            <div className="flex gap-3 justify-end col-span-2">
                <button className="p-2 rounded-lg bg-neutral-800 hover:bg-violet-500 transition">
                    <Eye size={18} />
                </button>
                <button className="p-2 rounded-lg bg-neutral-800 hover:bg-violet-500 transition">
                    <Pencil size={18} />
                </button>
                <button className="p-2 rounded-lg bg-neutral-800 hover:bg-red-600 transition">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default function UsersDashboard() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-8">

            <header className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
                <div className="flex items-center gap-3">
                    <Users className="text-violet-500" />
                    <h1 className="text-3xl font-bold text-violet-400">
                        Gestion des utilisateurs
                    </h1>
                </div>

                <button className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 px-4 py-2 rounded-lg font-semibold">
                    <UserPlus size={18} />
                    Ajouter un utilisateur
                </button>
            </header>

            <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 text-sm text-neutral-400 border-b border-neutral-800">
                    <span>Utilisateur</span>
                    <span>Rôle</span>
                    <span className="col-span-2 text-right">Actions</span>
                </div>

                {users.map((user) => (
                    <UserRow key={user.id} user={user} />
                ))}
            </section>

        </div>
    );
}