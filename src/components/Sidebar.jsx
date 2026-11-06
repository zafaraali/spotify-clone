import React from 'react';
import { Home, Search, Library, Heart } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, likedSongsCount }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-black flex-col justify-between p-6 select-none shrink-0 border-r border-zinc-900">
      <div className="space-y-6">
        <div 
          className="flex items-center gap-3 text-green-500 px-2 cursor-pointer" 
          onClick={() => setCurrentView('home')}
        >
          <div className="w-9 h-9 rounded-full bg-green-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-green-500/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SoundPulse</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-md font-semibold text-sm transition-colors ${
                  active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-green-500' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <hr className="border-zinc-800 my-4" />

        <div className="space-y-1">
          <button
            onClick={() => setCurrentView('liked')}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-md font-semibold text-sm transition-colors ${
              currentView === 'liked' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-emerald-400 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="flex-1 text-left">Liked Songs</span>
            {likedSongsCount > 0 && (
              <span className="text-xs text-zinc-500 font-normal">{likedSongsCount}</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}