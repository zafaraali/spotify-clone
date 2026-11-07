import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import AddIcon from '@mui/icons-material/Add';

export default function Sidebar({ currentView, setCurrentView, likedSongsCount, localSongsCount, playlists = [], onCreatePlaylist }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'search', label: 'Search', icon: <SearchIcon /> },
    { id: 'library', label: 'Your Library', icon: <LibraryMusicIcon /> },
  ];

  return (
    <Box
      component="aside"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: 260,
        bgcolor: 'black',
        color: 'white',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2.5,
        borderRight: '1px solid #27272a',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          onClick={() => setCurrentView('home')}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', px: 1 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: '#1DB954',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
              <circle cx="12" cy="12" r="10" fill="#1DB954"/>
              <path d="M12 6v8.5a2.5 2.5 0 1 1-2-2.45V8h5V6h-3z" fill="#000000"/>
            </svg>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.025em' }}>
            SoundPulse
          </Typography>
        </Box>

        <List component="nav" sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <ListItemButton
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                sx={{
                  borderRadius: 1,
                  py: 1.2,
                  px: 1.5,
                  bgcolor: active ? '#27272a' : 'transparent',
                  color: active ? 'white' : '#a1a1aa',
                  '&:hover': {
                    bgcolor: active ? '#27272a' : '#18181b',
                    color: 'white',
                  }
                }}
              >
                <ListItemIcon sx={{ color: active ? '#1DB954' : 'inherit', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Divider sx={{ borderColor: '#27272a', my: 1 }} />

        <List component="nav" sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <ListItemButton
            onClick={() => setCurrentView('liked')}
            sx={{
              borderRadius: 1,
              py: 1.2,
              px: 1.5,
              bgcolor: currentView === 'liked' ? '#27272a' : 'transparent',
              color: currentView === 'liked' ? 'white' : '#a1a1aa',
              '&:hover': {
                bgcolor: currentView === 'liked' ? '#27272a' : '#18181b',
                color: 'white',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 38 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 0.5,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #34d399 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FavoriteIcon sx={{ fontSize: 14, color: 'white' }} />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary="Liked Songs"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
            />
            {likedSongsCount > 0 && (
              <Typography variant="body2" sx={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 500 }}>
                {likedSongsCount}
              </Typography>
            )}
          </ListItemButton>

          <ListItemButton
            onClick={() => setCurrentView('local')}
            sx={{
              borderRadius: 1,
              py: 1.2,
              px: 1.5,
              bgcolor: currentView === 'local' ? '#27272a' : 'transparent',
              color: currentView === 'local' ? 'white' : '#a1a1aa',
              '&:hover': {
                bgcolor: currentView === 'local' ? '#27272a' : '#18181b',
                color: 'white',
              }
            }}
          >
            <ListItemIcon sx={{ color: currentView === 'local' ? '#1DB954' : '#a1a1aa', minWidth: 38 }}>
              <AudiotrackIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Local Music"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
            />
            {localSongsCount > 0 && (
              <Typography variant="body2" sx={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 500 }}>
                {localSongsCount}
              </Typography>
            )}
          </ListItemButton>
        </List>

        <Box>
          <ListItemButton onClick={() => setCurrentView('playlists')} sx={{ borderRadius: 1, py: 1.2, px: 1.5, bgcolor: currentView === 'playlists' ? '#27272a' : 'transparent', color: currentView === 'playlists' ? 'white' : '#a1a1aa', '&:hover': { bgcolor: '#18181b', color: 'white' } }}>
            <ListItemIcon sx={{ minWidth: 38, color: currentView === 'playlists' ? '#1DB954' : 'inherit' }}><PlaylistPlayIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Playlists" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
            <IconButton aria-label="Create playlist" onClick={(event) => { event.stopPropagation(); onCreatePlaylist(); }} size="small" sx={{ color: '#a1a1aa', '&:hover': { color: 'white' } }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
}
