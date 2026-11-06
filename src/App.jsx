import React, { useState, useRef, useEffect } from 'react';
import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import LibraryView from './views/LibraryView';
import { SAMPLE_SONGS, CATEGORIES } from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [navHistory, setNavHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [songs] = useState(SAMPLE_SONGS);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [likedSongIds, setLikedSongIds] = useState(new Set(['1', '3', '6']));
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showMobilePlayer, setShowMobilePlayer] = useState(false);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const audioRef = useRef(new Audio());

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    audio.src = currentTrack.url;
    if (isPlaying) {
      audio.play().catch((err) => console.log('Playback error:', err));
    }

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePlayTrack = (track) => {
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
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          likedSongsCount={likedSongIds.size}
        />

        <Box component="main" sx={{ flex: 1, background: 'linear-gradient(180deg, rgba(39,39,42,0.8) 0%, rgba(9,9,11,1) 100%)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
          />

          <Box sx={{ p: { xs: 3, md: 5 }, flex: 1, pb: { xs: 12, md: 5 } }}>
            {currentView === 'home' && (
              <HomeView
                songs={songs}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
              />
            )}
            {currentView === 'search' && (
              <SearchView
                searchQuery={searchQuery}
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
              />
            )}
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
        isRepeat={isRepeat}
        setIsRepeat={setIsRepeat}
        isLiked={isLiked}
        toggleLike={toggleLike}
        formatTime={formatTime}
        setShowMobilePlayer={setShowMobilePlayer}
      />

      <MobileNav currentView={currentView} setCurrentView={handleSetCurrentView} />

      {/* Premium Modal */}
      <Modal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 4, p: 4, maxWidth: 500, width: '100%', position: 'relative', outline: 'none' }}>
          <IconButton onClick={() => setShowPremiumModal(false)} sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa' }}>
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
          <IconButton onClick={() => setShowProfileModal(false)} sx={{ position: 'absolute', top: 16, right: 16, color: '#a1a1aa' }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1DB954 0%, #34d399 100%)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.5rem' }}>
              ZA
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Zafar Ali</Typography>
              <Typography variant="caption" sx={{ color: '#a1a1aa' }}>zafar@example.com</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4ade80', mt: 0.5 }}>
                <VerifiedUserIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">Free Plan</Typography>
              </Box>
            </Box>
          </Box>
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