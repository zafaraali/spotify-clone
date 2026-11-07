import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TrackRow from '../components/TrackRow';

export default function SearchView({
  searchQuery,
  setSearchQuery,
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
        s.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      return s.genre.toLowerCase() === selectedCategory.name.toLowerCase();
    }
    return true;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {searchQuery || selectedCategory ? (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
              {searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory.name} Tracks`}
            </Typography>
            {(selectedCategory || searchQuery) && (
              <Button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} size="small" sx={{ color: '#a1a1aa', fontSize: '0.8rem', textTransform: 'none', '&:hover': { color: 'white' } }}>
                Clear
              </Button>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: '#71717a', display: 'block', mb: 2 }}>
            {filteredSongs.length} {filteredSongs.length === 1 ? 'result' : 'results'}
          </Typography>
          {filteredSongs.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
              No tracks found matching your selection.
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, fontSize: '1.2rem' }}>
            Browse All
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {categories.map((cat) => (
              <Box
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  bgcolor: cat.color,
                  height: 130,
                  borderRadius: 2,
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 3,
                  '&:hover': { transform: 'scale(1.02)' },
                  transition: 'transform 0.2s'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                  {cat.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
