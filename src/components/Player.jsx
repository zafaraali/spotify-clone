import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Heart, Maximize2 } from 'lucide-react';

export default function Player({
  currentTrack,
  isPlaying,
  togglePlay,
  playNext,
  playPrev,
  currentTime,
  duration,
  handleSeek,
  volume,
  handleVolumeChange,
  isMuted,
  toggleMute,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat,
  isLiked,
  toggleLike,
  formatTime,
  setShowMobilePlayer
}) {
  if (!currentTrack) return null;

  return (
    <footer className="h-20 bg-zinc-950 border-t border-zinc-900 px-4 md:px-6 flex items-center justify-between text-white select-none z-20">
      {/* Track Info */}
      <div 
        className="flex items-center gap-3 w-full md:w-1/4 min-w-0 md:min-w-[180px] cursor-pointer md:cursor-auto"
        onClick={() => setShowMobilePlayer && setShowMobilePlayer(true)}
      >
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-12 h-12 md:w-14 md:h-14 rounded shadow-md object-cover shrink-0"
        />
        <div className="truncate">
          <h4 className="text-sm font-semibold truncate hover:underline">{currentTrack.title}</h4>
          <p className="text-xs text-zinc-400 truncate hover:underline">{currentTrack.artist}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(currentTrack.id);
          }} 
          className="ml-2 text-zinc-400 hover:text-white transition shrink-0"
        >
          <Heart className={`w-4 h-4 ${isLiked(currentTrack.id) ? 'fill-green-500 text-green-500' : ''}`} />
        </button>
      </div>

      {/* Desktop Controls & Progress */}
      <div className="hidden md:flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition ${isShuffle ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={playPrev} className="text-zinc-400 hover:text-white transition">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button onClick={playNext} className="text-zinc-400 hover:text-white transition">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition ${isRepeat ? 'text-green-500' : 'text-zinc-400 hover:text-white'}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Desktop Volume Control */}
      <div className="hidden md:flex items-center justify-end gap-2 w-1/4 min-w-[180px]">
        <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
        />
      </div>

      {/* Mobile Play Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition shrink-0"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>
        <button 
          onClick={() => setShowMobilePlayer && setShowMobilePlayer(true)}
          className="text-zinc-400 p-1"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}