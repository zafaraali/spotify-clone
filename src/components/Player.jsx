import React from 'react';
import { Box, Typography, IconButton, Slider, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

export default function Player({
  currentTrack,
  isPlaying,
  togglePlay,
  playNext,
  playPrev,
  currentTime,
  duration,
  handleSeek,
  volume,
  handleVolumeChange,
  isMuted,
  toggleMute,
  isShuffle,
  setIsShuffle,
  isRepeat,
  setIsRepeat,
  isLiked,
  toggleLike,
  formatTime,
  setShowMobilePlayer
}) {
  if (!currentTrack) return null;

  return (
    <Box
      component="footer"
      sx={{
        height: 84,
        bgcolor: '#09090b',
        borderTop: '1px solid #18181b',
        px: { xs: 2.5, md: 3.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        userSelect: 'none',
        zIndex: 20
      }}
    >
      <Box
        onClick={() => setShowMobilePlayer && setShowMobilePlayer(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: { xs: 'auto', md: '25%' },
          minWidth: 0,
          cursor: { xs: 'pointer', md: 'default' }
        }}
      >
        <Avatar
          src={currentTrack.cover}
          variant="rounded"
          sx={{ width: 50, height: 50, boxShadow: 2, borderRadius: 1 }}
        />
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', truncate: 'true', '&:hover': { textDecoration: 'underline' } }}>
            {currentTrack.title}
          </Typography>
          <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: '0.75rem', truncate: 'true', display: 'block', '&:hover': { textDecoration: 'underline' } }}>
            {currentTrack.artist}
          </Typography>
        </Box>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(currentTrack.id);
          }}
          size="small"
          sx={{ color: isLiked(currentTrack.id) ? '#1DB954' : '#a1a1aa', ml: 0.5, '&:hover': { color: 'white' } }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: 0.75, width: '45%', maxWidth: 580 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <IconButton
            onClick={() => setIsShuffle(!isShuffle)}
            sx={{ color: isShuffle ? '#1DB954' : '#a1a1aa', '&:hover': { color: 'white' } }}
            size="small"
          >
            <ShuffleIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={playPrev} sx={{ color: '#a1a1aa', '&:hover': { color: 'white' } }} size="small">
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={togglePlay}
            sx={{
              bgcolor: 'white',
              color: 'black',
              width: 34,
              height: 34,
              '&:hover': { bgcolor: '#f4f4f5', transform: 'scale(1.05)' }
            }}
          >
            {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
          <IconButton onClick={playNext} sx={{ color: '#a1a1aa', '&:hover': { color: 'white' } }} size="small">
            <SkipNextIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setIsRepeat(!isRepeat)}
            sx={{ color: isRepeat ? '#1DB954' : '#a1a1aa', '&:hover': { color: 'white' } }}
            size="small"
          >
            <RepeatIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
          <Typography variant="caption" sx={{ color: '#a1a1aa', minWidth: 35, textAlign: 'right', fontSize: '0.75rem' }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            size="small"
            sx={{
              color: 'white',
              height: 4,
              '& .MuiSlider-thumb': { width: 10, height: 10, display: 'none', '&:hover': { display: 'block' } },
              '&:hover .MuiSlider-thumb': { display: 'block' },
              '& .MuiSlider-track': { border: 'none', bgcolor: '#1DB954' },
              '& .MuiSlider-rail': { bgcolor: '#27272a' }
            }}
          />
          <Typography variant="caption" sx={{ color: '#a1a1aa', minWidth: 35, fontSize: '0.75rem' }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, width: '25%' }}>
        <IconButton onClick={toggleMute} sx={{ color: '#a1a1aa', '&:hover': { color: 'white' } }} size="small">
          {isMuted || volume === 0 ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
        </IconButton>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          size="small"
          sx={{
            width: 110,
            color: 'white',
            height: 4,
            '& .MuiSlider-thumb': { width: 10, height: 10, display: 'none', '&:hover': { display: 'block' } },
            '&:hover .MuiSlider-thumb': { display: 'block' },
            '& .MuiSlider-track': { border: 'none', bgcolor: '#1DB954' },
            '& .MuiSlider-rail': { bgcolor: '#27272a' }
          }}
        />
      </Box>

      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={togglePlay}
          sx={{ bgcolor: 'white', color: 'black', width: 36, height: 36, '&:hover': { bgcolor: '#f4f4f5' } }}
        >
          <PlayArrowIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={() => setShowMobilePlayer && setShowMobilePlayer(true)} sx={{ color: '#a1a1aa' }} size="small">
          <FullscreenIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}