import React from 'react';
import TrackRow from '../components/TrackRow';

export default function LibraryView({
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  isLiked,
  toggleLike,
  formatTime,
  title = "Your Library"
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {songs.length > 0 ? (
        <div className="space-y-1">
          {songs.map((track, i) => (
            <TrackRow
              key={track.id}
              track={track}
              index={i}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlay={onPlayTrack}
              isLiked={isLiked}
              toggleLike={toggleLike}
              formatTime={formatTime}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">No songs to display.</p>
      )}
    </div>
  );
}