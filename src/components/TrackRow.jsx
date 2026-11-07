import React from 'react';
import { Box, Typography, IconButton, Avatar, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { DEFAULT_COVER } from '../data/mockData';

export default function TrackRow({
  track,
  index,
  currentTrack,
  isPlaying,
  onPlay,
  isLiked,
  toggleLike,
  formatTime,
  onDelete,
  onRemoveFromPlaylist
}) {
  const isCurrent = currentTrack?.id === track.id;

  return (
    <Box
      onClick={() => onPlay(track)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 3 },
        py: 1,
        borderRadius: 1,
        cursor: 'pointer',
        bgcolor: isCurrent ? 'rgba(39, 39, 42, 0.4)' : 'transparent',
        color: isCurrent ? '#1DB954' : '#d4d4d8',
        '&:hover': { bgcolor: 'rgba(39, 39, 42, 0.6)' },
        transition: 'background-color 0.2s'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
        <Box sx={{ width: 24, textAlign: 'center', flexShrink: 0 }}>
          <Typography variant="body2" sx={{ color: '#71717a', fontSize: '0.875rem' }}>
            {index + 1}
          </Typography>
        </Box>
        <Avatar src={track.cover || DEFAULT_COVER} onError={(event) => { event.currentTarget.src = DEFAULT_COVER; }} variant="rounded" sx={{ width: 40, height: 40, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: '0.875rem', color: isCurrent ? '#1DB954' : 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {track.title}
          </Typography>
        <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
            {track.artist}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' }, color: '#a1a1aa', fontSize: '0.85rem', px: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
        {track.album}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexShrink: 0 }}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          size="small"
          sx={{ color: isLiked(track.id) ? '#1DB954' : '#a1a1aa', '&:hover': { color: 'white' } }}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
        {onDelete && (
          <Tooltip title="Remove local song">
            <IconButton aria-label={`Remove ${track.title}`} onClick={(e) => { e.stopPropagation(); onDelete(track); }} size="small" sx={{ color: '#71717a', '&:hover': { color: '#f87171' } }}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onRemoveFromPlaylist && (
          <IconButton aria-label={`Remove ${track.title} from playlist`} onClick={(e) => { e.stopPropagation(); onRemoveFromPlaylist(track); }} size="small" sx={{ color: '#71717a', '&:hover': { color: '#f87171' } }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
        <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: '0.8rem', minWidth: 35, textAlign: 'right' }}>
          {formatTime(track.duration)}
        </Typography>
      </Box>
    </Box>
  );
}
