
## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture & Code Walkthrough](#architecture--code-walkthrough)
- [Customization Guide](#customization-guide)
- [Reusable Code Snippets](#reusable-code-snippets)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

This project is a fully responsive, dark-themed music showcase page dedicated to Linkin Park. It features a cinematic hero section, a searchable track listing with 8 essential songs, a studio album gallery, an about section with band statistics, and a persistent bottom player bar with playback controls, seek, and volume.

The app is self-contained — all track data is defined statically in the source, and no backend or database is required to run it.

---

## Features

### Visual

- **Cinematic hero section** — full-screen concert photo with gradient overlays, bold display typography, and dual call-to-action buttons
- **Animated marquee** — infinite scrolling band of track titles at the bottom of the hero
- **Dark, concert-inspired theme** — neutral-950 background, red-600 accents, Bebas Neue display font + Inter body font
- **Fully responsive** — adapts from mobile to desktop with Tailwind breakpoints

### Interactive

- **Searchable track listing** — filter songs by title or album name in real time
- **Sticky audio player bar** — fixed at the bottom of the viewport, always accessible
- **Playback controls** — play / pause, skip forward / backward, auto-advance to next track
- **Seek bar** — click anywhere on the progress bar to jump to that point in the track
- **Volume control** — mute toggle + range slider (desktop)
- **Favorites** — heart any track; state persists for the session
- **Now-playing indicator** — animated equalizer bars on the active track row
- **Hover states** — play icon appears on track row hover, album cards lift and zoom on hover

---

## Tech Stack

| Technology        | Version | Purpose                          |
| ----------------- | ------- | -------------------------------- |
| React             | 18.3    | UI framework                     |
| TypeScript        | 5.5     | Type safety                      |
| Vite              | 5.4     | Build tool & dev server          |
| Tailwind CSS      | 3.4     | Utility-first styling            |
| lucide-react      | 0.446   | Icon library                     |
| PostCSS           | 8.4     | CSS processing                   |
| Supabase JS       | 2.57    | Available (not currently used)   |

> **Note:** `@supabase/supabase-js` is listed as a dependency but this project does not use it. It is available if you want to add data persistence (e.g., saving favorites to a database). See [Roadmap](#roadmap).

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** 9+ (ships with Node)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/Page_Linkin_Park_React.git
cd Page_Linkin_Park_React

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The built files are output to the `dist/` directory and can be served by any static host (GitHub Pages, Netlify, Vercel, etc.).

---

## Project Structure

```
Page_Linkin_Park_React/
├── index.html              # HTML entry point (title, meta tags)
├── package.json            # Dependencies and npm scripts
├── vite.config.ts          # Vite config (React plugin, @/ path alias)
├── tailwind.config.js      # Tailwind theme configuration
├── postcss.config.js       # PostCSS (Tailwind + Autoprefixer)
├── tsconfig.json           # TypeScript project references
├── tsconfig.app.json       # TS config for app source
├── tsconfig.node.json      # TS config for Node-side files
├── eslint.config.js        # ESLint flat config
└── src/
    ├── main.tsx            # React entry — mounts <App /> into #root
    ├── App.tsx             # Main component (all UI + player logic)
    ├── index.css           # Global styles, fonts, custom animations
    └── vite-env.d.ts       # Vite type declarations
```

---

## Architecture & Code Walkthrough

The entire application lives in **`src/App.tsx`** as a single React component. Below is a breakdown of each part.

### 1. Data Model (`Track` type)

```typescript
type Track = {
  id: number;
  title: string;
  album: string;
  year: number;
  duration: string;   // "3:36" format
  cover: string;      // image URL
};
```

All tracks are stored in a static `TRACKS` array (lines 23–88). Each entry includes the song title, album name, release year, duration in `M:SS` format, and a cover image URL from Pexels.

### 2. State Management

The component uses React's `useState` hooks for all state — no external state library is needed:

| State          | Type               | Purpose                                     |
| -------------- | ------------------ | ------------------------------------------- |
| `currentId`    | `number`           | ID of the track currently loaded in player  |
| `isPlaying`    | `boolean`          | Whether playback is active                  |
| `progress`     | `number`           | Elapsed seconds of current track            |
| `volume`       | `number`           | Volume level (0–1)                          |
| `muted`        | `boolean`          | Whether audio is muted                      |
| `query`        | `string`           | Current search filter text                  |
| `favorites`    | `Set<number>`      | Set of favorited track IDs                  |

A `useRef` (`intervalRef`) holds the interval timer ID for the simulated playback progress.

### 3. Playback Logic

The player uses a **simulated playback timer** (since no real audio files are bundled). A `useEffect` sets up a `setInterval` that increments `progress` every second while `isPlaying` is `true`. When progress reaches the track's total duration, it auto-advances to the next track via the `next()` callback.

Key functions:

- **`play(id)`** — loads a track by ID, resets progress to 0, sets `isPlaying` to true
- **`toggle()`** — toggles play/pause
- **`next()` / `prev()`** — cycles through `TRACKS` with modular arithmetic (wraps around)
- **`toggleFavorite(id)`** — adds/removes a track ID from the `favorites` set

### 4. Search / Filtering

The `filtered` array is derived on each render by filtering `TRACKS` against the `query` string (case-insensitive match on title or album). When the search yields no results, a "No tracks match" message is displayed.

### 5. UI Sections

| Section        | Anchor     | Description                                                        |
| -------------- | ---------- | ------------------------------------------------------------------ |
| Hero           | *(top)*    | Full-screen image, band name, genre tag, CTA buttons, marquee      |
| Track Listing  | `#songs`   | Searchable table of 8 tracks with play-on-click and favorites      |
| Studio Albums  | `#albums`  | 3-column grid of album cards with hover overlay + play button      |
| About the Band | `#about`   | Band bio text, live photo, stats (albums / records / Grammys)      |
| Footer         | *(bottom)* | Band name + fan-made disclaimer                                    |
| Player Bar     | *(fixed)*  | Sticky bottom bar with track info, controls, seek, volume          |

### 6. Styling & Animations

Global styles and custom utilities are defined in **`src/index.css`**:

- **Fonts** — Bebas Neue (display headings) and Inter (body text) loaded from Google Fonts
- **Custom keyframe animations:**
  - `marquee` — infinite horizontal scroll for the track-title band
  - `pulse-glow` — pulsing box-shadow (used on the now-playing indicator)
  - `fade-up` — entrance animation for hero content
- **Utility classes:** `.font-display`, `.font-inter`, `.text-balance`, `.scrollbar-hide`

All other styling uses Tailwind utility classes directly in JSX.

---

## Customization Guide

### Adding or Changing Tracks

Edit the `TRACKS` array at the top of `src/App.tsx`. Each track needs a unique `id`, and the `duration` must be in `M:SS` format (the `durationToSeconds()` helper parses it).

```typescript
{
  id: 9,
  title: 'New Divide',
  album: 'Transformers Soundtrack',
  year: 2009,
  duration: '4:28',
  cover: 'https://example.com/cover.jpg',
},
```

### Changing the Theme Colors

The accent color is `red-600` throughout. To change it, search-and-replace `red-600` and `red-500` in `src/App.tsx` with your preferred Tailwind color (e.g., `amber-500`, `sky-500`).

### Changing Fonts

Edit the `@import` URL in `src/index.css` to load different Google Fonts, then update the `.font-display` and `.font-inter` utility classes.

### Adding Real Audio Playback

The player currently simulates progress with a timer. To add real audio:

1. Add an `audioUrl` field to the `Track` type and to each track in the `TRACKS` array.
2. Create an `<audio>` ref in the component:
   ```typescript
   const audioRef = useRef<HTMLAudioElement>(null);
   ```
3. Replace the `setInterval` simulation with `audioRef.current?.play()` / `.pause()` calls and listen to the `timeupdate` event to update `progress`.
4. Add a hidden `<audio ref={audioRef} src={currentTrack.audioUrl} />` element in the JSX.

### Replacing Cover Images

Cover images use Pexels stock photos via URL. Replace the `cover` URLs in the `TRACKS` array and the album objects with your own image URLs. If you have local images, place them in a `public/` folder and reference them as `/my-image.jpg`.

---

## Reusable Code Snippets

### Snippet 1: Duration string to seconds converter

```typescript
function durationToSeconds(d: string): number {
  const [m, s] = d.split(':').map(Number);
  return m * 60 + s;
}

// Usage: durationToSeconds("3:36") → 216
```

### Snippet 2: Toggle items in a Set (favorites pattern)

```typescript
const [favorites, setFavorites] = useState<Set<number>>(new Set());

const toggleFavorite = (id: number) => {
  setFavorites((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};
```

### Snippet 3: Click-to-seek progress bar

```tsx
<div
  className="h-1.5 bg-neutral-800 cursor-pointer"
  onClick={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    setProgress(pct * totalSeconds);
  }}
>
  <div className="h-full bg-red-600" style={{ width: `${progressPct}%` }} />
</div>
```

### Snippet 4: Infinite scrolling marquee

```tsx
<div className="flex whitespace-nowrap animate-marquee">
  {Array.from({ length: 2 }).map((_, i) => (
    <div key={i} className="flex items-center gap-6 px-3">
      {items.map((item) => (
        <span key={item.id}>{item.title}</span>
      ))}
    </div>
  ))}
</div>
```

The corresponding CSS animation (in `src/index.css`):

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
```

### Snippet 5: Now-playing equalizer bars

```tsx
<div className="flex items-end gap-0.5 h-4">
  <span className="w-0.5 bg-red-500 h-full" style={{ animationDelay: '0ms' }} />
  <span className="w-0.5 bg-red-500 h-2/3" style={{ animationDelay: '150ms' }} />
  <span className="w-0.5 bg-red-500 h-4/5" style={{ animationDelay: '300ms' }} />
</div>
```

---

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start Vite dev server (hot reload)       |
| `npm run build`   | Production build to `dist/`              |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint                               |
| `npm run typecheck` | Run TypeScript type checking (no emit) |

---

## Roadmap

Ideas for extending this project:

- **Real audio playback** — connect actual audio file URLs to each track
- **Persistent favorites** — use Supabase to save favorites per user account
- **User authentication** — add Supabase email/password auth so users get their own library
- **Playlists** — let users create and reorder custom playlists
- **Full album pages** — dedicated routes for each album with complete track lists
- **Lyrics display** — show synced lyrics alongside playback
- **Dark/light theme toggle** — add a theme switcher

---

## Disclaimer

This is a **fan-made tribute page** for educational and demonstration purposes only. All music, album names, lyrics, and related trademarks belong to Linkin Park and their respective rights holders. Cover images are sourced from [Pexels](https://www.pexels.com) (free-to-use stock photography) and are not actual album artwork.

---

## License

This project is open source and available under the [MIT License](LICENSE).

Feel free to fork it, learn from it, and reuse any code snippets in your own projects.
