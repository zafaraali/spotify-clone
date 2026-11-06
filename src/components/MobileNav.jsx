import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

export default function MobileNav({ currentView, setCurrentView }) {
  const getViewValue = (view) => {
    switch (view) {
      case 'home': return 0;
      case 'search': return 1;
      case 'library': return 2;
      case 'liked': return 3;
      case 'local': return 4;
      default: return 0;
    }
  };

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0: setCurrentView('home'); break;
      case 1: setCurrentView('search'); break;
      case 2: setCurrentView('library'); break;
      case 3: setCurrentView('liked'); break;
      case 4: setCurrentView('local'); break;
      default: setCurrentView('home');
    }
  };

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'sticky', bottom: 0, zIndex: 10 }}>
      <BottomNavigation
        value={getViewValue(currentView)}
        onChange={handleChange}
        sx={{
          bgcolor: '#09090b',
          borderTop: '1px solid #18181b',
          height: 60,
          '& .MuiBottomNavigationAction-root': {
            color: '#a1a1aa',
            fontSize: '0.75rem',
            minWidth: 'auto',
            px: 1,
            '&.Mui-selected': { color: '#1DB954' }
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon sx={{ fontSize: 20 }} />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon sx={{ fontSize: 20 }} />} />
        <BottomNavigationAction label="Library" icon={<LibraryMusicIcon sx={{ fontSize: 20 }} />} />
        <BottomNavigationAction label="Liked" icon={<FavoriteIcon sx={{ fontSize: 20 }} />} />
        <BottomNavigationAction label="Local" icon={<AudiotrackIcon sx={{ fontSize: 20 }} />} />
      </BottomNavigation>
    </Box>
  );
}