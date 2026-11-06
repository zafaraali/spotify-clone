import React from 'react';
import { Search as SearchIcon, User, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Header({
  currentView,
  searchQuery,
  setSearchQuery,
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  setShowPremiumModal,
  setShowProfileModal
}) {
  return (
    <header className="h-20 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6 py-4 md:px-10 border-b border-zinc-800/50">
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div className="hidden sm:flex items-center gap-3 text-zinc-400">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`p-1.5 rounded-full bg-black/40 transition ${
              canGoBack ? 'hover:bg-black/80 text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`p-1.5 rounded-full bg-black/40 transition ${
              canGoForward ? 'hover:bg-black/80 text-white cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {currentView === 'search' && (
          <div className="relative w-full">
            <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 text-white text-sm pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-zinc-400"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowPremiumModal(true)}
          className="hidden sm:block bg-white text-black text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition"
        >
          Explore Premium
        </button>
        <button
          onClick={() => setShowProfileModal(true)}
          className="p-2 rounded-full bg-black/60 hover:bg-zinc-800 transition text-zinc-200"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}