"use client";

import { useState } from "react";

export default function DashboardJury() {

  const [playlists] = useState([
    {
      id: 1,
      name: "Sélection Officielle 2026",
      description: "Films compétition officielle",
      thumbnail: "/images/playlist1.jpg",
      videos: [
        {
          id: 1,
          title: "Gourou",
          director: "Yann Gozlan",
          duration: "12:30",
          status: "À évaluer",
        },
        {
          id: 2,
          title: "Le Mage Du Kremlin",
          director: "Olivier Assayas",
          duration: "1:45:00",
          status: "Approuvé",
        },
      ],
    },
    {
      id: 3,
      name: "Documentaires",
      description: "Sélection Documentaire",
      thumbnail: "/images/playlist2.jpg",
      videos: [],
    },
  ]);

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Jury</h1>
          <p className="text-neutral-400 mt-1">
            Playlists assignées par l'administrateur
          </p>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      {!selectedPlaylist ? (

        // PLAYLISTS
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="cursor-pointer bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:scale-105 transition"
            >
              <div className="h-40 bg-gradient-to-r from-violet-600 to-pink-600 flex items-center justify-center text-xl font-bold">
                {playlist.name}
              </div>

              <div className="p-4">
                <p className="font-semibold">{playlist.name}</p>
                <p className="text-sm text-neutral-400">
                  {playlist.videos.length} vidéos
                </p>
              </div>
            </div>
          ))}

        </div>

      ) : (

        // VIDEOS DE LA PLAYLIST
        <div>

          <button
            onClick={() => setSelectedPlaylist(null)}
            className="mb-6 px-4 py-2 bg-neutral-800 rounded-lg"
          >
            ← Retour aux playlists
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {selectedPlaylist.name}
          </h2>

          <div className="space-y-4">
            {selectedPlaylist.videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:bg-neutral-800 transition"
              >
                <div className="w-40 h-24 bg-neutral-700 rounded-lg flex items-center justify-center">
                  Thumbnail
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-sm text-neutral-400">
                    {video.director}
                  </p>
                </div>

                <a
                  href={`/videos/${video.id}`}
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm"
                >
                  Voir
                </a>

              </div>
            ))}
          </div>

        </div>

      )}

    </div>
  );
}
