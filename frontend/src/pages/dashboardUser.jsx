import React from "react";
import {Users, Eye, Pencil, Trash2, UserPlus} from "lucide-react";

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