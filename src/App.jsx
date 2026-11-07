import React, { useState, useRef, useEffect } from 'react';
import { Box, Modal, Typography, Button, IconButton, Slider, TextField, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import LibraryView from './views/LibraryView';
import PlaylistView from './views/PlaylistView';
import PlaylistsView from './views/PlaylistsView';
import { SAMPLE_SONGS, CATEGORIES, DEFAULT_COVER } from './data/mockData';
import { getAllLocalSongsFromDB, saveLocalSongToDB, deleteLocalSongFromDB } from './db';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [navHistory, setNavHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [localSongs, setLocalSongs] = useState([]);
  const [songs, setSongs] = useState(SAMPLE_SONGS);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_SONGS[0]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const saved = localStorage.getItem('soundpulse_liked_songs');
      return saved ? new Set(JSON.parse(saved)) : new Set(['1', '3', '6']);
    } catch {
      return new Set(['1', '3', '6']);
    }
  });
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: playlist, 2: single track
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistSongIds, setPlaylistSongIds] = useState([]);
  const [playlists, setPlaylists] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soundpulse_playlists') || '[]'); } catch { return []; }
  });
  const [libraryError, setLibraryError] = useState('');
  const [audioError, setAudioError] = useState('');
  const [recentTracks, setRecentTracks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soundpulse_recent_tracks') || '[]'); } catch { return []; }
  });
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soundpulse_profile') || '{"name":"Zafar Ali","email":"zafar@example.com"}'); } catch { return { name: 'Zafar Ali', email: 'zafar@example.com' }; }
  });

  const audioRef = useRef(new Audio());
  const localSongsRef = useRef(localSongs);
  const playbackStateRef = useRef({ currentTrack, songs, isShuffle, repeatMode });

  useEffect(() => {
    playbackStateRef.current = { currentTrack, songs, isShuffle, repeatMode };
  }, [currentTrack, songs, isShuffle, repeatMode]);

  useEffect(() => { localSongsRef.current = localSongs; }, [localSongs]);

  useEffect(() => {
    getAllLocalSongsFromDB().then((savedSongs) => {
      if (savedSongs && savedSongs.length > 0) {
        const hydratedSongs = savedSongs.map((song) => {
          if (song.blob && !song.url?.startsWith('blob:')) {
            const blobUrl = URL.createObjectURL(song.blob);
            return { ...song, url: blobUrl };
          }
          return song;
        });
        setLocalSongs(hydratedSongs);
        setSongs([...hydratedSongs, ...SAMPLE_SONGS]);
        setCurrentTrack(hydratedSongs[0]);
      }
    }).catch((err) => { console.log('Error loading from IndexedDB:', err); setLibraryError('Local songs could not be loaded.'); });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('soundpulse_liked_songs', JSON.stringify(Array.from(likedSongIds)));
    } catch (e) {
      console.log('Error saving liked songs:', e);
    }
  }, [likedSongIds]);

  useEffect(() => {
    try { localStorage.setItem('soundpulse_playlists', JSON.stringify(playlists)); } catch (err) { console.log('Error saving playlists:', err); }
  }, [playlists]);

  useEffect(() => { localStorage.setItem('soundpulse_recent_tracks', JSON.stringify(recentTracks)); }, [recentTracks]);
  useEffect(() => { localStorage.setItem('soundpulse_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => {
    const savedVolume = Number(localStorage.getItem('soundpulse_volume'));
    if (Number.isFinite(savedVolume)) setVolume(Math.min(1, Math.max(0, savedVolume)));
    const savedRepeat = Number(localStorage.getItem('soundpulse_repeat_mode'));
    if ([0, 1, 2].includes(savedRepeat)) setRepeatMode(savedRepeat);
  }, []);
  useEffect(() => { localStorage.setItem('soundpulse_volume', String(volume)); }, [volume]);
  useEffect(() => { localStorage.setItem('soundpulse_repeat_mode', String(repeatMode)); }, [repeatMode]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === 'Space') { event.preventDefault(); togglePlay(); }
      if (event.code === 'ArrowRight') playNext();
      if (event.code === 'ArrowLeft') playPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  useEffect(() => () => {
    localSongsRef.current.forEach((song) => { if (song.url?.startsWith('blob:')) URL.revokeObjectURL(song.url); });
    audioRef.current.pause();
  }, []);

  const handleSetCurrentView = (view) => {
    if (view === currentView) return;
    const newHistory = navHistory.slice(0, historyIndex + 1);
    newHistory.push(view);
    setNavHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentView(view);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentView(navHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentView(navHistory[historyIndex + 1]);
    }
  };

  const handleAddLocalSongs = (fileList) => {
    Array.from(fileList).forEach((file, idx) => {
      const blobUrl = URL.createObjectURL(file);
      const titleWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const newTrack = {
        id: `local-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        title: titleWithoutExt,
        artist: "Local File",
        album: "Local Uploads",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
        url: blobUrl,
        blob: file,
        duration: 200,
        genre: "Local",
        plays: "1"
      };

      saveLocalSongToDB(newTrack).catch((err) => { console.log('Failed to save to IndexedDB:', err); setLibraryError('This song will play for now but could not be saved locally.'); });

      setLocalSongs((prev) => [newTrack, ...prev]);
      setSongs((prev) => [newTrack, ...prev]);

      if (!currentTrack || currentTrack.id === SAMPLE_SONGS[0].id) {
        setCurrentTrack(newTrack);
        setIsPlaying(true);
      }
    });
  };

  const handleDeleteLocalSong = async (track) => {
    if (!window.confirm(`Remove “${track.title}” from local music?`)) return;
    try {
      await deleteLocalSongFromDB(track.id);
      if (track.url?.startsWith('blob:')) URL.revokeObjectURL(track.url);
      setLocalSongs((prev) => prev.filter((song) => song.id !== track.id));
      setSongs((prev) => prev.filter((song) => song.id !== track.id));
      setPlaylists((prev) => prev.map((playlist) => ({ ...playlist, songIds: playlist.songIds.filter((id) => id !== track.id) })));
      if (currentTrack?.id === track.id) {
        audioRef.current.pause();
        setCurrentTrack(SAMPLE_SONGS[0]);
        setIsPlaying(false);
      }
    } catch (err) {
      console.log('Failed to delete local song:', err);
      setLibraryError('That local song could not be removed.');
    }
  };

  const openCreatePlaylist = () => {
    setPlaylistName('');
    setPlaylistSongIds([]);
    setShowCreatePlaylist(true);
  };

  const handleCreatePlaylist = () => {
    const name = playlistName.trim();
    if (!name) return;
    const playlist = { id: `playlist-${Date.now()}`, name, songIds: playlistSongIds };
    setPlaylists((prev) => [...prev, playlist]);
    setShowCreatePlaylist(false);
    setPlaylistName('');
    handleSetCurrentView(`playlist:${playlist.id}`);
  };

  const handleRenamePlaylist = (playlist) => {
    const name = window.prompt('Rename playlist', playlist.name)?.trim();
    if (name) setPlaylists((prev) => prev.map((item) => item.id === playlist.id ? { ...item, name } : item));
  };

  const handleDeletePlaylist = (playlist) => {
    if (!window.confirm(`Delete “${playlist.name}”?`)) return;
    setPlaylists((prev) => prev.filter((item) => item.id !== playlist.id));
    if (currentView === `playlist:${playlist.id}`) handleSetCurrentView('library');
  };

  const handleRemoveFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) => prev.map((playlist) => playlist.id === playlistId ? { ...playlist, songIds: playlist.songIds.filter((id) => id !== trackId) } : playlist));
  };

  const handleAddToPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) => prev.map((playlist) => playlist.id === playlistId && !playlist.songIds.includes(trackId) ? { ...playlist, songIds: [...playlist.songIds, trackId] } : playlist));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.url || '';
    setAudioError('');
    if (isPlaying) {
      audio.play().catch((err) => { console.log('Playback error:', err); setIsPlaying(false); setAudioError('This track could not be played. Try uploading a local audio file instead.'); });
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleError = () => {
      if (currentTrack.url) {
        setIsPlaying(false);
        setAudioError('This audio source is unavailable. Upload a local file to keep listening.');
      }
    };
    const handleEnded = () => {
      const { currentTrack: activeTrack, songs: playlist, isShuffle: shuffle, repeatMode: mode } = playbackStateRef.current;
      if (mode === 2) {
        audio.currentTime = 0;
        audio.play().catch((err) => console.log('Repeat playback error:', err));
        return;
      }

      const currentIndex = playlist.findIndex((song) => song.id === activeTrack?.id);
      if (mode === 1 && currentIndex === playlist.length - 1) {
        setCurrentTrack(playlist[0]);
        setIsPlaying(true);
        return;
      }
      const nextIndex = shuffle
        ? Math.floor(Math.random() * playlist.length)
        : (currentIndex + 1) % playlist.length;
      setCurrentTrack(playlist[nextIndex]);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => { console.log('Playback error:', err); setIsPlaying(false); });
    }
  };

  const handlePlayTrack = (track) => {
    setAudioError('');
    setRecentTracks((prev) => [track, ...prev.filter((item) => item.id !== track.id)].slice(0, 8));
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }
    setCurrentTrack(songs[nextIndex]);
    setIsPlaying(true);
  };

  const playPrev = () => {
    if (!currentTrack) return;
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const currentIndex = songs.findIndex((s) => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentTrack(songs[prevIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (e, newValue) => {
    setCurrentTime(newValue);
    audioRef.current.currentTime = newValue;
  };

  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
    if (newValue > 0) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const toggleLike = (trackId) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  };

  const isLiked = (trackId) => likedSongIds.has(trackId);

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: 'black', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          likedSongsCount={likedSongIds.size}
          localSongsCount={localSongs.length}
          playlists={playlists}
          onCreatePlaylist={openCreatePlaylist}
        />

        <Box component="main" sx={{ flex: 1, minHeight: 0, background: 'linear-gradient(180deg, rgba(39,39,42,0.8) 0%, rgba(9,9,11,1) 100%)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Header
            currentView={currentView}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < navHistory.length - 1}
            goBack={goBack}
            goForward={goForward}
            setShowPremiumModal={setShowPremiumModal}
            setShowProfileModal={setShowProfileModal}
            onAddLocalSongs={handleAddLocalSongs}
          />

          {libraryError && (
            <Box sx={{ mx: { xs: 3, md: 5 }, mt: 2, px: 2, py: 1.25, borderRadius: 1, bgcolor: 'rgba(248,113,113,0.12)', color: '#fca5a5', fontSize: '0.875rem' }}>
              {libraryError}
            </Box>
          )}
          {audioError && (
            <Box sx={{ mx: { xs: 3, md: 5 }, mt: 2, px: 2, py: 1.25, borderRadius: 1, bgcolor: 'rgba(251,191,36,0.12)', color: '#fcd34d', fontSize: '0.875rem' }}>
              {audioError}
            </Box>
          )}

          <Box sx={{ p: { xs: 3, md: 5 }, flex: 1, pb: { xs: 12, md: 5 } }}>
            {currentView === 'home' && (
              <HomeView
                songs={songs}
                recentTracks={recentTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
              />
            )}
            {currentView === 'search' && (
              <SearchView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                songs={songs}
                categories={CATEGORIES}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                isLiked={isLiked}
                toggleLike={toggleLike}
                formatTime={formatTime}
              />
            )}
            {currentView === 'library' && (
              <LibraryView
                songs={songs}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                isLiked={isLiked}
                toggleLike={toggleLike}
                formatTime={formatTime}
                onCreatePlaylist={openCreatePlaylist}
                onOpenPlaylists={() => handleSetCurrentView('playlists')}
              />
            )}
            {currentView === 'playlists' && (
              <PlaylistsView playlists={playlists} onSelect={(playlistId) => handleSetCurrentView(`playlist:${playlistId}`)} onCreate={openCreatePlaylist} />
            )}
            {currentView.startsWith('playlist:') && (() => {
              const playlist = playlists.find((item) => item.id === currentView.slice('playlist:'.length));
              return playlist ? <PlaylistView playlist={playlist} songs={songs} currentTrack={currentTrack} isPlaying={isPlaying} onPlayTrack={handlePlayTrack} isLiked={isLiked} toggleLike={toggleLike} formatTime={formatTime} onRename={handleRenamePlaylist} onDelete={handleDeletePlaylist} onRemoveSong={handleRemoveFromPlaylist} onAddSong={handleAddToPlaylist} /> : null;
            })()}
            {currentView === 'liked' && (
              <LibraryView
                title="Liked Songs"
                songs={songs.filter((s) => likedSongIds.has(s.id))}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                isLiked={isLiked}
                toggleLike={toggleLike}
                formatTime={formatTime}
              />
            )}
            {currentView === 'local' && (
              <LibraryView
                title="Local Music"
                songs={localSongs}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                isLiked={isLiked}
                toggleLike={toggleLike}
                formatTime={formatTime}
                onDelete={handleDeleteLocalSong}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        playNext={playNext}
        playPrev={playPrev}
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isShuffle={isShuffle}
        setIsShuffle={setIsShuffle}
        repeatMode={repeatMode}
        setRepeatMode={setRepeatMode}
        isLiked={isLiked}
        toggleLike={toggleLike}
        formatTime={formatTime}
        setShowMobilePlayer={setShowMobilePlayer}
      />

      <Modal
        open={showMobilePlayer}
        onClose={() => setShowMobilePlayer(false)}
        sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: '#18181b', width: '100%', maxWidth: 560, borderRadius: '24px 24px 0 0', p: 3, outline: 'none' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="Close player" onClick={() => setShowMobilePlayer(false)} sx={{ color: '#a1a1aa' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component="img" src={currentTrack?.cover || DEFAULT_COVER} onError={(event) => { event.currentTarget.src = DEFAULT_COVER; }} alt="" sx={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 2, mb: 3 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{currentTrack?.title}</Typography>
          <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2 }}>{currentTrack?.artist}</Typography>
          <Slider min={0} max={duration || 100} value={currentTime} onChange={handleSeek} sx={{ color: '#1DB954' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.75rem' }}>
            <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mt: 2 }}>
            <IconButton aria-label="Previous track" onClick={playPrev} sx={{ color: 'white' }}><SkipPreviousIcon /></IconButton>
            <IconButton aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay} sx={{ bgcolor: 'white', color: 'black', width: 52, height: 52, '&:hover': { bgcolor: '#f4f4f5' } }}>
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton aria-label="Next track" onClick={playNext} sx={{ color: 'white' }}><SkipNextIcon /></IconButton>
          </Box>
        </Box>
      </Modal>

      <Modal open={showCreatePlaylist} onClose={() => setShowCreatePlaylist(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 3, p: 3, maxWidth: 500, width: '100%', maxHeight: '80vh', overflowY: 'auto', outline: 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Create playlist</Typography>
          <TextField autoFocus fullWidth label="Playlist name" value={playlistName} onChange={(event) => setPlaylistName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') handleCreatePlaylist(); }} sx={{ mb: 2, input: { color: 'white' }, label: { color: '#a1a1aa' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f3f46' } }} />
          <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 1 }}>Add songs now</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
            {songs.map((song) => (
              <FormControlLabel key={song.id} control={<Checkbox checked={playlistSongIds.includes(song.id)} onChange={() => setPlaylistSongIds((prev) => prev.includes(song.id) ? prev.filter((id) => id !== song.id) : [...prev, song.id])} sx={{ color: '#71717a', '&.Mui-checked': { color: '#1DB954' } }} />} label={<Typography variant="body2" sx={{ color: 'white' }}>{song.title} <span style={{ color: '#a1a1aa' }}>· {song.artist}</span></Typography>} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setShowCreatePlaylist(false)} sx={{ color: '#a1a1aa', textTransform: 'none' }}>Cancel</Button>
            <Button onClick={handleCreatePlaylist} disabled={!playlistName.trim()} variant="contained" sx={{ bgcolor: '#1DB954', color: 'black', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#1ed760' } }}>Create</Button>
          </Box>
        </Box>
      </Modal>

      <MobileNav currentView={currentView} setCurrentView={handleSetCurrentView} />

      {/* Premium Modal */}
      <Modal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 4, p: 4, maxWidth: 500, width: '100%', position: 'relative', outline: 'none' }}>
          <IconButton aria-label="Close premium dialog" onClick={() => setShowPremiumModal(false)} sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa' }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="caption" sx={{ bgcolor: 'rgba(29, 185, 84, 0.1)', color: '#4ade80', fontWeight: 700, px: 2, py: 0.5, borderRadius: '9999px', textTransform: 'uppercase' }}>
              SoundPulse Premium
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>
              Get 3 Months Free
            </Typography>
            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 1 }}>
              Enjoy ad-free music, offline playback, and unlimited skips.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 3 }}>
            {['Ad-free music listening', 'Download to listen offline', 'Play songs in any order', 'High quality audio'].map((feat, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckIcon sx={{ color: '#1DB954', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#d4d4d8' }}>{feat}</Typography>
              </Box>
            ))}
          </Box>
          <Button
            onClick={() => setShowPremiumModal(false)}
            variant="contained"
            fullWidth
            sx={{ bgcolor: '#1DB954', color: 'black', fontWeight: 700, py: 1.5, borderRadius: '9999px', '&:hover': { bgcolor: '#1ed760' } }}
          >
            Get 3 Months Free
          </Button>
        </Box>
      </Modal>

      {/* Profile Modal */}
      <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 4, p: 4, maxWidth: 400, width: '100%', position: 'relative', outline: 'none' }}>
          <IconButton aria-label="Close profile dialog" onClick={() => setShowProfileModal(false)} sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa' }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1DB954 0%, #34d399 100%)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem' }}>
              ZA
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
              <Typography variant="caption" sx={{ color: '#a1a1aa' }}>{profile.email}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4ade80', mt: 0.5 }}>
                <VerifiedUserIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">Free Plan</Typography>
              </Box>
            </Box>
          </Box>
          <TextField
            fullWidth
            size="small"
            label="Display name"
            value={profile.name}
            onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: '#a1a1aa' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f3f46' } }}
          />
          <Button onClick={() => setRecentTracks([])} startIcon={<DeleteOutlineIcon />} fullWidth sx={{ justifyContent: 'flex-start', color: '#fca5a5', textTransform: 'none', mb: 2 }}>
            Clear recently played
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid #27272a', pt: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Account Status</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Active</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Liked Songs</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{likedSongIds.size}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>Audio Quality</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>High (320kbps)</Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setShowProfileModal(false)}
            variant="contained"
            fullWidth
            sx={{ bgcolor: '#27272a', color: 'white', fontWeight: 600, py: 1.25, borderRadius: '9999px', '&:hover': { bgcolor: '#3f3f46' } }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
