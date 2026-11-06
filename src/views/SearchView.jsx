import React from 'react';
import TrackRow from '../components/TrackRow';

export default function SearchView({
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  songs,
  categories,
  currentTrack,
  isPlaying,
  onPlayTrack,
  isLiked,
  toggleLike,
  formatTime
}) {
  const filteredSongs = songs.filter((s) => {
    if (searchQuery) {
      return (
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      return s.genre.toLowerCase() === selectedCategory.name.toLowerCase();
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {searchQuery || selectedCategory ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : `${selectedCategory.name} Tracks`}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                Clear Filter
              </button>
            )}
          </div>
          {filteredSongs.length > 0 ? (
            <div className="space-y-1">
              {filteredSongs.map((track, i) => (
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
            <p className="text-zinc-400">No tracks found matching your selection.</p>
          )}
        </section>
      ) : (
        <section>
          <h2 className="text-xl font-bold mb-4">Browse All</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`${cat.color} h-32 md:h-36 rounded-lg p-4 relative overflow-hidden font-bold text-base md:text-lg cursor-pointer hover:scale-[1.02] transition shadow-lg`}
              >
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}