# SoundPulse

A modern, responsive music streaming web application built with React, Vite, and Material-UI (MUI v5), featuring a Spotify-inspired dark aesthetic.

## Features

- **MUI v5 Dark Theme**: Sleek dark mode styling with custom green accents (`#1DB954`).
- **Interactive Audio Player**: Play, pause, skip, shuffle, repeat, volume control, and timeline scrubbing with royalty-free tracks (SoundHelix).
- **Navigation & Search**: Functional back/forward history, live search, and genre category filtering (Pop, Lo-Fi, Hip-Hop, Rock, etc.).
- **Library & Liked Songs**: Save and manage favorite tracks.
- **Modals**: Explore Premium promotional modal and User Profile overlay.
- **Responsive Layout**: Desktop sidebar and mobile bottom navigation with mini-player.

## Tech Stack

- React, Vite
- Material-UI (`@mui/material`, `@mui/icons-material`, `@emotion/react`)
- HTML5 Audio API

## Quick Start

1. Extract the project archive.
2. Open terminal in the project directory:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## Project Structure

```text
soundpulse-clone-mui/
├── index.html
├── package.json
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── data/mockData.js
    └── components/ (Sidebar, Header, Player, TrackRow, MobileNav)
```
