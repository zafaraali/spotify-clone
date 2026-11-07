import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TrackRow from '../components/TrackRow';

export default function LibraryView({
  songs,
  currentTrack,
  isPlaying,
  onPlayTrack,
  isLiked,
  toggleLike,
  formatTime,
  title = "Your Library",
  onDelete,
  onCreatePlaylist,
  onOpenPlaylists
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.35rem' }}>{title}</Typography>
        {onCreatePlaylist && <Box sx={{ display: 'flex', gap: 1 }}>
          {onOpenPlaylists && <Button onClick={onOpenPlaylists} variant="text" sx={{ color: '#a1a1aa', textTransform: 'none' }}>Playlists</Button>}
          <Button onClick={onCreatePlaylist} variant="outlined" sx={{ color: 'white', borderColor: '#3f3f46', borderRadius: '9999px', textTransform: 'none', '&:hover': { borderColor: 'white' } }}>New playlist</Button>
        </Box>}
      </Box>
      {songs.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
              onDelete={onDelete}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: '#a1a1aa', fontSize: '0.875rem' }}>
          No songs to display. Upload local audio files using the Add Local Songs button in the top navigation bar.
        </Typography>
      )}
    </Box>
  );
}
