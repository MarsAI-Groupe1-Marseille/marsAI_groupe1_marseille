import React from "react";
import { Users, Eye, Pencil, Trash2, UserPlus } from "lucide-react";

const UsersList = [
    {
        id: 1,
        name: "Xavier Dupont",
        email: "xavier.dupont@example.com",
        role: "Administrateur"
    },
    {
        id: 2,
        name: "Marie Curie",
        email: "marie.curie@example.com",
        role: "Utilisateur"
    },
    {
        id: 3,
        name: "Bobbie Smith",
        email: "bobbie.smith@example.com",
        role: "Jury"
    },
];

function UserRow({ user }) {
    return (
        <section className="grid grid-cols-4 items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition">
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
        </section>