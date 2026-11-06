import React from 'react';
import { Box, Typography } from '@mui/material';
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.35rem' }}>
        {title}
      </Typography>
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