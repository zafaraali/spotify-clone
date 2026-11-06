import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';

export default function TrackRow({
  track,
  index,
  currentTrack,
  isPlaying,
  onPlay,
  isLiked,
  toggleLike,
  formatTime
}) {
  const isCurrent = currentTrack?.id === track.id;

  return (
    <div
      onClick={() => onPlay(track)}
      className={`group flex items-center justify-between px-3 md:px-4 py-2.5 rounded-md hover:bg-zinc-800/60 cursor-pointer transition ${
        isCurrent ? 'bg-zinc-800/40 text-green-500' : 'text-zinc-300'
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4 truncate">
        <span className="w-4 text-sm text-zinc-500 group-hover:hidden shrink-0">
          {index + 1}
        </span>
        <button className="w-4 hidden group-hover:block text-white shrink-0">
          {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>
        <img src={track.cover} alt={track.title} className="w-10 h-10 rounded object-cover shrink-0" />
        <div className="truncate">
          <p className={`font-semibold text-sm truncate ${isCurrent ? 'text-green-500' : 'text-white'}`}>
            {track.title}
          </p>
          <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
        </div>
      </div>

      <div className="hidden md:block text-sm text-zinc-400 truncate max-w-[200px]">{track.album}</div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          className="text-zinc-400 hover:text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition"
        >
          <Heart className={`w-4 h-4 ${isLiked(track.id) ? 'fill-green-500 text-green-500' : ''}`} />
        </button>
        <span className="text-xs text-zinc-400">{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}