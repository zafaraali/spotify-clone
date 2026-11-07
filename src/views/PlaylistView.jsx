import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TrackRow from '../components/TrackRow';

export default function PlaylistView({ playlist, songs, currentTrack, isPlaying, onPlayTrack, isLiked, toggleLike, formatTime, onRename, onDelete, onRemoveSong, onAddSong }) {
  const [showAddSongs, setShowAddSongs] = useState(false);
  const playlistSongs = playlist.songIds.map((id) => songs.find((song) => song.id === id)).filter(Boolean);
  const availableSongs = songs.filter((song) => !playlist.songIds.includes(song.id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.35rem' }}>{playlist.name}</Typography>
        <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.75 }}>
          {playlistSongs.length} {playlistSongs.length === 1 ? 'song' : 'songs'}
        </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          <Button size="small" onClick={() => setShowAddSongs((value) => !value)} sx={{ color: '#a1a1aa', textTransform: 'none' }}>Add songs</Button>
          <Button size="small" onClick={() => onRename(playlist)} sx={{ color: '#a1a1aa', textTransform: 'none' }}>Rename</Button>
          <Button size="small" onClick={() => onDelete(playlist)} sx={{ color: '#f87171', textTransform: 'none' }}>Delete</Button>
        </Box>
      </Box>
      {showAddSongs && availableSongs.length > 0 && (
        <Box sx={{ bgcolor: '#18181b', borderRadius: 2, p: 2 }}>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1 }}>Choose a song to add</Typography>
          {availableSongs.map((song) => <Button key={song.id} onClick={() => onAddSong(playlist.id, song.id)} sx={{ display: 'block', color: 'white', textTransform: 'none', textAlign: 'left', width: '100%' }}>{song.title} · {song.artist}</Button>)}
        </Box>
      )}
      {playlistSongs.length > 0 ? playlistSongs.map((track, index) => (
        <TrackRow key={track.id} track={track} index={index} currentTrack={currentTrack} isPlaying={isPlaying} onPlay={onPlayTrack} isLiked={isLiked} toggleLike={toggleLike} formatTime={formatTime} onRemoveFromPlaylist={() => onRemoveSong(playlist.id, track.id)} />
      )) : (
        <Typography variant="body2" sx={{ color: '#a1a1aa' }}>This playlist is empty.</Typography>
      )}
    </Box>
  );
}
