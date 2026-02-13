"use client";

import { useState } from "react";
import { X, Filter } from "lucide-react";

export default function DashboardJury() {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "Sélection Officielle 2026",
      description: "Films compétition officielle",
      gradient: "from-violet-600 to-pink-500",
      videos: [
        { id: 1, title: "Gourou", director: "Yann Gozlan", duration: "12:30", thumbnail: "/images/video1.jpg" },
        { id: 2, title: "Le Mage Du Kremlin", director: "Olivier Assayas", duration: "1:45:00", thumbnail: "/images/video2.jpg" },
      ],
    },
    {
      id: 2,
      name: "Documentaires",
      description: "Sélection Documentaire",
      gradient: "from-green-500 to-blue-500",
      videos: [
        { id: 3, title: "Film Doc 1", director: "Réalisateur A", duration: "0:50:00", thumbnail: "/images/video3.jpg" },
      ],
    },
    {
      id: 3,
      name: "Courts Métrages",
      description: "Sélection de courts métrages",
      gradient: "from-pink-500 to-orange-500",
      videos: [
        { id: 4, title: "Short Film 1", director: "Réalisateur B", duration: "15:20", thumbnail: "/images/video4.jpg" },
      ],
    },
    {
      id: 4,
      name: "Films Expérimentaux",
      description: "Sélection expérimentale",
      gradient: "from-purple-500 to-indigo-500",
      videos: [
        { id: 5, title: "Exp Film 1", director: "Réalisateur C", duration: "22:10", thumbnail: "/images/video5.jpg" },
      ],
    },
    {
      id: 5,
      name: "Animation",
      description: "Films d'animation",
      gradient: "from-yellow-400 to-red-400",
      videos: [
        { id: 6, title: "Animé 1", director: "Réalisateur D", duration: "10:45", thumbnail: "/images/video6.jpg" },
      ],
    },
    {
      id: 6,
      name: "Sélection Jeunes Talents",
      description: "Films des nouveaux réalisateurs",
      gradient: "from-teal-400 to-blue-600",
      videos: [
        { id: 7, title: "Talent 1", director: "Réalisateur E", duration: "18:20", thumbnail: "/images/video7.jpg" },
      ],
    },
  ]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6 w-full max-w-6xl">
        <div>
          <h1 className="text-3xl font-bold">Mes Playlists</h1>
          <p className="text-neutral-400 mt-1">
            Cliquez sur une playlist pour consulter les vidéos
          </p>
        </div>
      </header>

      {/* Playlists */}
      {selectedPlaylist && (
        <section className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl p-6 relative">
      {/* Bouton fermer */}
      <button
        onClick={() => setSelectedPlaylist(null)}
        className="absolute top-4 right-4 text-neutral-400 hover:text-white z-20"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6">{selectedPlaylist.name}</h2>

      {/* Slider horizontal */}
      <div className="relative group">
        <div className="flex overflow-x-auto space-x-4 scrollbar-none">
          {selectedPlaylist.videos.map((video) => (
            <a
              key={video.id}
              href={`/videos/${video.id}`}
              className="flex-shrink-0 w-48 bg-neutral-800 rounded-xl overflow-hidden hover:scale-105 transition transform"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-neutral-400">{video.director}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Chevrons gauche/droite */}
        <button
          onClick={() => {
            const slider = document.querySelector(
              ".group > .flex.overflow-x-auto"
            );
            slider.scrollBy({ left: -300, behavior: "smooth" });
          }}
          className="absolute top-1/2 -left-2 -translate-y-1/2 bg-neutral-800/70 hover:bg-neutral-800 p-2 rounded-full hidden group-hover:block"
        >
          ◀
        </button>
        <button
          onClick={() => {
            const slider = document.querySelector(
              ".group > .flex.overflow-x-auto"
            );
            slider.scrollBy({ left: 300, behavior: "smooth" });
          }}
          className="absolute top-1/2 -right-2 -translate-y-1/2 bg-neutral-800/70 hover:bg-neutral-800 p-2 rounded-full hidden group-hover:block"
        >
          ▶
        </button>
      </div>
    </div>
  </section>
)}

    </div>
  );
}
