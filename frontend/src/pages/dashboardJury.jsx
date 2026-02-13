"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function DashboardJury() {
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "Sélection Officielle 2026",
      description: "Films compétition officielle",
      thumbnail: "/images/playlist1.jpg",
      videos: [
        { id: 1, title: "Gourou", director: "Yann Gozlan", thumbnail: "/images/video1.jpg", status: "Assigné" },
        { id: 2, title: "Le Mage Du Kremlin", director: "Olivier Assayas", thumbnail: "/images/video2.jpg", status: "Aimé" },
      ],
    },
    {
      id: 2,
      name: "Documentaires",
      description: "Sélection Documentaire",
      thumbnail: "/images/playlist2.jpg",
      videos: [
        { id: 3, title: "Océans Profonds", director: "Luc Jacquet", thumbnail: "/images/video3.jpg", status: "Assigné" },
      ],
    },
    {
      id: 3,
      name: "Courts métrages",
      description: "Sélection courts métrages",
      thumbnail: "/images/playlist3.jpg",
      videos: [
        { id: 4, title: "Évasion", director: "Jean Dupont", thumbnail: "/images/video4.jpg", status: "Détesté" },
        { id: 5, title: "Mystère", director: "Claire Martin", thumbnail: "/images/video5.jpg", status: "Aimé" },
      ],
    },
  ]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // --- STATS ---
  const totalVideos = playlists.reduce((sum, p) => sum + p.videos.length, 0);
  const liked = playlists.reduce(
    (sum, p) => sum + p.videos.filter((v) => v.status === "Aimé").length,
    0
  );
  const disliked = playlists.reduce(
    (sum, p) => sum + p.videos.filter((v) => v.status === "Détesté").length,
    0
  );
  const assigned = playlists.reduce(
    (sum, p) => sum + p.videos.filter((v) => v.status === "Assigné").length,
    0
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Mes Playlists</h1>
        <p className="text-neutral-400">Cliquez sur une playlist pour voir les vidéos</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
        <StatCard title="Vidéos assignées" value={assigned} color="bg-blue-600" />
        <StatCard title="Vidéos aimées" value={liked} color="bg-green-600" />
        <StatCard title="Vidéos détestées" value={disliked} color="bg-red-600" />
      </div>

      {/* PLAYLISTS GRID */}
      {!selectedPlaylist && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {playlists.map((playlist, i) => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className={`cursor-pointer rounded-2xl overflow-hidden transform transition hover:scale-105 border border-neutral-800`}
              style={{ background: `linear-gradient(135deg, hsl(${i*60},70%,50%), hsl(${i*60+30},80%,60%))` }}
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-xl font-bold text-white">
                  {playlist.name}
                </div>
              </div>
              <div className="p-4">
                <p className="text-neutral-200">{playlist.videos.length} vidéos</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PLAYLIST */}
      {selectedPlaylist && (
        <section className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-6xl p-6 relative">
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white z-20"
            >
              <X size={28} />
            </button>

            <h2 className="text-2xl font-bold mb-6">{selectedPlaylist.name}</h2>

            {/* Slider */}
            <div className="relative group">
              <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
                {selectedPlaylist.videos.map((video) => (
                  <a
                    key={video.id}
                    href={`/videos/${video.id}`}
                    className="flex-shrink-0 w-48 bg-neutral-800 rounded-xl overflow-hidden hover:scale-105 hover:shadow-lg transition transform"
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

              {/* Chevrons */}
              <button
                onClick={() => {
                  const slider = document.querySelector(".group > .flex.overflow-x-auto");
                  slider.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="absolute top-1/2 -left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full hidden group-hover:block z-10"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  const slider = document.querySelector(".group > .flex.overflow-x-auto");
                  slider.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="absolute top-1/2 -right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full hidden group-hover:block z-10"
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

// --- Composants ---
function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-2xl text-center ${color}`}>
      <p className="text-sm text-neutral-200">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
