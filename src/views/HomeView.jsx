import React from 'react';
import { Box, Typography, CardMedia, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function HomeView({ songs, currentTrack, isPlaying, onPlayTrack }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5, fontSize: '1.35rem' }}>
          Good afternoon
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {songs.slice(0, 6).map((song) => (
            <Box
              key={song.id}
              onClick={() => onPlayTrack(song)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)', '& .play-btn': { opacity: 1 } },
                transition: 'background-color 0.2s'
              }}
            >
              <CardMedia component="img" image={song.cover} alt={song.title} sx={{ width: 72, height: 72, objectFit: 'cover' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem', flex: 1, px: 1 }}>
                {song.title}
              </Typography>
              <IconButton
                className="play-btn"
                sx={{
                  bgcolor: '#1DB954',
                  color: 'black',
                  width: 38,
                  height: 38,
                  mr: 2,
                  opacity: 0,
                  boxShadow: 3,
                  '&:hover': { bgcolor: '#1ed760', transform: 'scale(1.05)' },
                  transition: 'opacity 0.2s, transform 0.2s'
                }}
              >
                <PlayArrowIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, fontSize: '1.2rem' }}>
          Made For You
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2.5 }}>
          {songs.map((song) => (
            <Box
              key={song.id}
              onClick={() => onPlayTrack(song)}
              sx={{
                bgcolor: '#18181b',
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#27272a', '& .play-btn-card': { opacity: 1, transform: 'translateY(0)' } },
                transition: 'background-color 0.2s'
              }}
            >
              <Box sx={{ position: 'relative', mb: 2 }}>
                <CardMedia component="img" image={song.cover} alt={song.title} sx={{ width: '100%', aspectRatio: '1/1', borderRadius: 1.5, objectFit: 'cover' }} />
                <IconButton
                  className="play-btn-card"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: '#1DB954',
                    color: 'black',
                    width: 40,
                    height: 40,
                    opacity: 0,
                    transform: 'translateY(8px)',
                    boxShadow: 4,
                    '&:hover': { bgcolor: '#1ed760', transform: 'scale(1.05)' },
                    transition: 'all 0.2s'
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', truncate: 'true' }}>
                {song.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: '0.75rem', display: 'block', truncate: 'true', mt: 0.5 }}>
                {song.artist}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}