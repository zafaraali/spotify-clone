import React from 'react';
import { Play } from 'lucide-react';

export default function HomeView({ songs, currentTrack, isPlaying, onPlayTrack }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Good afternoon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.slice(0, 6).map((song) => (
            <div
              key={song.id}
              onClick={() => onPlayTrack(song)}
              className="flex items-center gap-4 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-md overflow-hidden cursor-pointer group transition duration-200"
            >
              <img src={song.cover} alt={song.title} className="w-20 h-20 object-cover" />
              <span className="font-bold text-sm flex-1 truncate">{song.title}</span>
              <button className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center mr-4 opacity-0 group-hover:opacity-100 shadow-xl group-hover:scale-105 transition">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Made For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => onPlayTrack(song)}
              className="bg-zinc-900/60 p-4 rounded-lg hover:bg-zinc-800/60 transition group cursor-pointer"
            >
              <div className="relative mb-3">
                <img src={song.cover} alt={song.title} className="w-full aspect-square object-cover rounded-md shadow-lg" />
                <button className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 shadow-xl hover:scale-105 transition duration-200">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>
              <h3 className="font-semibold text-sm truncate">{song.title}</h3>
              <p className="text-xs text-zinc-400 truncate mt-1">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}