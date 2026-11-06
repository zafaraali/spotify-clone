import React, { useRef } from 'react';
import { Box, IconButton, InputBase, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function Header({
  currentView,
  searchQuery,
  setSearchQuery,
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  setShowPremiumModal,
  setShowProfileModal,
  onAddLocalSongs
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddLocalSongs(files);
    }
    e.target.value = '';
  };

  return (
    <Box
      component="header"
      sx={{
        py: 2.5,
        px: { xs: 3, md: 5 },
        bgcolor: 'rgba(24, 24, 27, 0.9)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(39, 39, 42, 0.6)',
        gap: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1, maxWidth: 450 }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={goBack}
            disabled={!canGoBack}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              p: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              '&.Mui-disabled': { opacity: 0.3, color: 'white' }
            }}
            size="small"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={goForward}
            disabled={!canGoForward}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              p: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
              '&.Mui-disabled': { opacity: 0.3, color: 'white' }
            }}
            size="small"
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {currentView === 'search' && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              bgcolor: '#27272a',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.75,
              border: '1px solid transparent',
              '&:focus-within': { borderColor: 'white' }
            }}
          >
            <SearchIcon sx={{ color: '#a1a1aa', fontSize: 20, mr: 1.5 }} />
            <InputBase
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: 'white', fontSize: '0.875rem', width: '100%' }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="audio/*"
          style={{ display: 'none' }}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outlined"
          startIcon={<UploadFileIcon />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.2)',
            fontWeight: 600,
            fontSize: '0.85rem',
            px: 2.5,
            py: 1,
            borderRadius: '9999px',
            textTransform: 'none',
            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          Add Local Songs
        </Button>

        <Button
          onClick={() => setShowPremiumModal(true)}
          variant="contained"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            bgcolor: 'white',
            color: 'black',
            fontWeight: 700,
            fontSize: '0.85rem',
            px: 3.5,
            py: 1,
            borderRadius: '9999px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f4f4f5', transform: 'scale(1.04)' },
            transition: 'transform 0.2s'
          }}
        >
          Explore Premium
        </Button>
        <IconButton
          onClick={() => setShowProfileModal(true)}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: '#e4e4e7',
            p: 1,
            '&:hover': { bgcolor: '#27272a' }
          }}
        >
          <PersonIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}