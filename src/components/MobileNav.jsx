import React from 'react';
import { Home, Search, Library, Heart } from 'lucide-react';

export default function MobileNav({ currentView, setCurrentView }) {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'liked', label: 'Liked', icon: Heart },
  ];

  return (
    <div className="md:hidden bg-zinc-950 border-t border-zinc-900 flex justify-around items-center h-16 text-xs text-zinc-400 z-10">
      {items.map((item) => {
        const Icon = item.icon;
        const active = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 transition ${
              active ? 'text-white' : 'hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-green-500' : ''}`} />
            <span className={active ? 'font-semibold text-white' : ''}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}