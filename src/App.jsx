import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import LibraryView from './views/LibraryView';
import { SAMPLE_SONGS, CATEGORIES } from './data/mockData';
import { ChevronDown, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, X, Check, ShieldCheck } from 'lucide-react';

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

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
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
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden font-sans">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          setCurrentView={handleSetCurrentView}
          likedSongsCount={likedSongIds.size}
        />

        <main className="flex-1 bg-gradient-to-b from-zinc-800/80 to-zinc-950 flex flex-col overflow-y-auto">
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

          <div className="p-4 md:p-8 flex-1 pb-24 md:pb-8">
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
          </div>
        </main>
      </div>

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
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-3">
              <span className="inline-block bg-green-500/10 text-green-400 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                SoundPulse Premium
              </span>
              <h3 className="text-2xl font-bold">Get 3 Months Free</h3>
              <p className="text-sm text-zinc-400">Enjoy ad-free music, offline playback, and unlimited skips.</p>
            </div>
            <div className="mt-6 space-y-3">
              {['Ad-free music listening', 'Download to listen offline', 'Play songs in any order', 'High quality audio'].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="w-full mt-6 bg-green-500 text-black font-bold py-3 rounded-full hover:scale-105 transition"
            >
              Get 3 Months Free
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-300 text-black flex items-center justify-center font-bold text-2xl">
                ZA
              </div>
              <div>
                <h3 className="text-xl font-bold">Zafar Ali</h3>
                <p className="text-xs text-zinc-400">zafar@example.com</p>
                <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Free Plan</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm text-zinc-300">
              <div className="flex justify-between py-2 border-b border-zinc-800/50">
                <span>Account Status</span>
                <span className="text-white font-semibold">Active</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800/50">
                <span>Liked Songs</span>
                <span className="text-white font-semibold">{likedSongIds.size}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Audio Quality</span>
                <span className="text-white font-semibold">High (320kbps)</span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full mt-6 bg-zinc-800 text-white font-semibold py-2.5 rounded-full hover:bg-zinc-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}