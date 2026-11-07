import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

export default function PlaylistsView({ playlists, onSelect, onCreate }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.35rem' }}>Your Playlists</Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 0.75 }}>Keep your favorite songs together.</Typography>
        </Box>
        <Button onClick={onCreate} variant="contained" sx={{ bgcolor: '#1DB954', color: 'black', fontWeight: 700, borderRadius: '9999px', textTransform: 'none', '&:hover': { bgcolor: '#1ed760' } }}>Create playlist</Button>
      </Box>
      {playlists.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {playlists.map((playlist) => (
            <Button key={playlist.id} onClick={() => onSelect(playlist.id)} sx={{ justifyContent: 'flex-start', textAlign: 'left', color: 'white', bgcolor: '#18181b', borderRadius: 2, p: 2, minHeight: 96, textTransform: 'none', '&:hover': { bgcolor: '#27272a' } }}>
              <PlaylistPlayIcon sx={{ color: '#1DB954', mr: 2, fontSize: 36 }} />
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{playlist.name}</Typography>
                <Typography variant="body2" sx={{ color: '#a1a1aa' }}>{playlist.songIds.length} {playlist.songIds.length === 1 ? 'song' : 'songs'}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
      ) : (
        <Box sx={{ bgcolor: '#18181b', borderRadius: 2, p: 4, textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>No playlists yet</Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Create one to organize your music.</Typography>
        </Box>
      )}
    </Box>
  );
}
