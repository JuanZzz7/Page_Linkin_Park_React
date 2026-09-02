import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Clock,
  Search,
  Heart,
} from 'lucide-react';

type Track = {
  id: number;
  title: string;
  album: string;
  year: number;
  duration: string;
  cover: string;
};

const TRACKS: Track[] = [
  {
    id: 1,
    title: 'In the End',
    album: 'Hybrid Theory',
    year: 2001,
    duration: '3:36',
    cover: 'https://images.pexels.com/photos/3755771/pexels-photo-3755771.png?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 2,
    title: 'Numb',
    album: 'Meteora',
    year: 2003,
    duration: '3:07',
    cover: 'https://images.pexels.com/photos/2016810/pexels-photo-2016810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 3,
    title: 'Crawling',
    album: 'Hybrid Theory',
    year: 2001,
    duration: '3:29',
    cover: 'https://images.pexels.com/photos/7715637/pexels-photo-7715637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 4,
    title: 'Somewhere I Belong',
    album: 'Meteora',
    year: 2003,
    duration: '3:33',
    cover: 'https://images.pexels.com/photos/632305/pexels-photo-632305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 5,
    title: 'Faint',
    album: 'Meteora',
    year: 2003,
    duration: '2:42',
    cover: 'https://images.pexels.com/photos/33923311/pexels-photo-33923311.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 6,
    title: 'Breaking the Habit',
    album: 'Meteora',
    year: 2004,
    duration: '3:16',
    cover: 'https://images.pexels.com/photos/36448405/pexels-photo-36448405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 7,
    title: 'One Step Closer',
    album: 'Hybrid Theory',
    year: 2000,
    duration: '2:35',
    cover: 'https://images.pexels.com/photos/2020432/pexels-photo-2020432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    id: 8,
    title: 'What I\'ve Done',
    album: 'Minutes to Midnight',
    year: 2007,
    duration: '3:25',
    cover: 'https://images.pexels.com/photos/736355/pexels-photo-736355.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

const HERO_IMAGE = 'https://images.pexels.com/photos/13717323/pexels-photo-13717323.jpeg?auto=compress&cs=tinysrgb&h=1200&w=1900';

function formatTime(s: string): string {
  return s;
}

function durationToSeconds(d: string): number {
  const [m, s] = d.split(':').map(Number);
  return m * 60 + s;
}

export default function App() {
  const [currentId, setCurrentId] = useState<Track['id']>(TRACKS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<Track['id']>>(new Set());
  const intervalRef = useRef<number | null>(null);

  const currentTrack = TRACKS.find((t) => t.id === currentId) ?? TRACKS[0];
  const totalSeconds = durationToSeconds(currentTrack.duration);

  const filtered = TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.album.toLowerCase().includes(query.toLowerCase())
  );

  const play = useCallback((id: Track['id']) => {
    setCurrentId(id);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const next = useCallback(() => {
    const idx = TRACKS.findIndex((t) => t.id === currentId);
    const nIdx = (idx + 1) % TRACKS.length;
    setCurrentId(TRACKS[nIdx].id);
    setProgress(0);
    setIsPlaying(true);
  }, [currentId]);

  const prev = useCallback(() => {
    const idx = TRACKS.findIndex((t) => t.id === currentId);
    const pIdx = (idx - 1 + TRACKS.length) % TRACKS.length;
    setCurrentId(TRACKS[pIdx].id);
    setProgress(0);
    setIsPlaying(true);
  }, [currentId]);

  // Simulated playback progress (no real audio file available)
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => {
          if (p >= totalSeconds) {
            next();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, totalSeconds, next]);

  const toggleFavorite = (id: Track['id']) => {
    setFavorites((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const progressPct = (progress / totalSeconds) * 100;
  const elapsedStr = `${Math.floor(progress / 60)}:${String(progress % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <header className="relative min-h-[100svh] flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Linkin Park live on stage"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 to-transparent" />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md bg-red-600 grid place-items-center font-display text-xl text-white">
              LP
            </div>
            <span className="font-display text-2xl tracking-wider">LINKIN PARK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a href="#songs" className="hover:text-white transition-colors">Songs</a>
            <a href="#albums" className="hover:text-white transition-colors">Albums</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 max-w-5xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-red-500 font-semibold mb-5 animate-fade-up">
            <span className="h-px w-8 bg-red-500" /> Nu Metal · Alternative Rock
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-balance animate-fade-up">
            LINKIN<br />PARK
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-300 leading-relaxed animate-fade-up">
            The definitive collection of tracks from the band that defined a generation —
            from <span className="text-white font-medium">Hybrid Theory</span> to{' '}
            <span className="text-white font-medium">Minutes to Midnight</span>.
          </p>
          <div className="mt-8 flex items-center gap-3 animate-fade-up">
            <button
              onClick={() => play(TRACKS[0].id)}
              className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-red-500 transition-all hover:scale-[1.03] active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              Play Greatest Hits
            </button>
            <a
              href="#songs"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-700 px-7 py-3.5 text-sm font-semibold text-neutral-200 hover:border-neutral-500 hover:text-white transition-colors"
            >
              Browse Tracks
            </a>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative z-10 border-y border-neutral-800/60 bg-neutral-950/40 backdrop-blur-sm py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 px-3 text-sm font-medium text-neutral-400">
                {TRACKS.map((t) => (
                  <span key={`${i}-${t.id}`} className="flex items-center gap-6">
                    <span className="uppercase tracking-wider">{t.title}</span>
                    <span className="text-red-600">●</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* TRACKS */}
      <section id="songs" className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-5xl md:text-6xl">Track Listing</h2>
            <p className="mt-2 text-neutral-400">Eight essentials, hand-picked from the catalogue.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs or albums…"
              className="w-full rounded-full bg-neutral-900 border border-neutral-800 pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-red-600/60 focus:ring-2 focus:ring-red-600/20 transition"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 overflow-hidden">
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[3rem_1fr_1fr_4rem_3rem] gap-4 px-6 py-3 text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-800/60">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time</span>
            <span />
          </div>

          <ul className="divide-y divide-neutral-800/50">
            {filtered.map((track, idx) => {
              const active = track.id === currentId;
              return (
                <li
                  key={track.id}
                  onDoubleClick={() => play(track.id)}
                  className={`group grid grid-cols-[3rem_1fr_4rem] md:grid-cols-[3rem_1fr_1fr_4rem_3rem] gap-4 px-4 md:px-6 py-3 items-center cursor-pointer transition-colors ${
                    active ? 'bg-red-600/10' : 'hover:bg-neutral-800/40'
                  }`}
                  onClick={() => play(track.id)}
                >
                  {/* Index / play */}
                  <div className="flex items-center justify-center">
                    {active && isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-0.5 bg-red-500 animate-[pulse-glow_0.8s_ease-in-out_infinite] h-full" style={{ animationDelay: '0ms' }} />
                        <span className="w-0.5 bg-red-500 h-2/3" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 bg-red-500 h-4/5" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      <>
                        <span className={`text-sm group-hover:hidden ${active ? 'text-red-500' : 'text-neutral-500'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <Play className="hidden group-hover:block h-4 w-4 text-white fill-current" />
                      </>
                    )}
                  </div>

                  {/* Title + cover */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.cover}
                      alt={track.album}
                      className="h-11 w-11 rounded-md object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className={`truncate font-medium ${active ? 'text-red-500' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="truncate text-xs text-neutral-500 md:hidden">{track.album} · {track.year}</p>
                    </div>
                  </div>

                  {/* Album (desktop) */}
                  <div className="hidden md:block min-w-0">
                    <p className="truncate text-sm text-neutral-400">{track.album}</p>
                    <p className="text-xs text-neutral-600">{track.year}</p>
                  </div>

                  {/* Duration (desktop) */}
                  <div className="hidden md:block text-sm text-neutral-400 tabular-nums">
                    {formatTime(track.duration)}
                  </div>

                  {/* Favorite (desktop) */}
                  <div className="hidden md:flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                      className="text-neutral-500 hover:text-red-500 transition-colors"
                      aria-label="Favorite"
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(track.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-6 py-16 text-center text-neutral-500">
                No tracks match "{query}".
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* ALBUMS */}
      <section id="albums" className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="font-display text-5xl md:text-6xl mb-10">Studio Albums</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Hybrid Theory', year: 2000, cover: 'https://images.pexels.com/photos/2020432/pexels-photo-2020432.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Meteora', year: 2003, cover: 'https://images.pexels.com/photos/22857353/pexels-photo-22857353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
            { name: 'Minutes to Midnight', year: 2007, cover: 'https://images.pexels.com/photos/30215615/pexels-photo-30215615.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
          ].map((album) => (
            <article
              key={album.name}
              className="group relative rounded-xl overflow-hidden border border-neutral-800/60 bg-neutral-900/40 hover:border-neutral-700 transition-all hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={album.cover}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl">{album.name}</h3>
                <p className="text-sm text-neutral-400">{album.year}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <button
                  onClick={() => play(TRACKS.find((t) => t.album === album.name)?.id ?? TRACKS[0].id)}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition"
                >
                  <Play className="h-4 w-4 fill-current" /> Play
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 md:px-12 py-20 max-w-4xl mx-auto">
        <h2 className="font-display text-5xl md:text-6xl mb-8">About the Band</h2>
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <img
            src="https://images.pexels.com/photos/248963/pexels-photo-248963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Band performing live"
            className="rounded-xl object-cover w-full aspect-[4/5] border border-neutral-800"
            loading="lazy"
          />
          <div className="space-y-4 text-neutral-300 leading-relaxed">
            <p>
              Formed in Agoura Hills, California in 1996, Linkin Park became one of the
              best-selling music acts of all time, blending nu-metal, alternative rock, and
              electronic elements into a sound that defined the early 2000s.
            </p>
            <p>
              Their debut <span className="text-white font-medium">Hybrid Theory</span> (2000)
              was a global phenomenon, followed by the equally massive{' '}
              <span className="text-white font-medium">Meteora</span> (2003). With Chester
              Bennington's searing vocals and Mike Shinoda's rap-rock duality, the band built
              a catalogue that still resonates with millions.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <Stat label="Albums" value="7+" />
              <Stat label="Records sold" value="100M+" />
              <Stat label="Grammys" value="2" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800/60 px-6 md:px-12 py-10 text-center text-sm text-neutral-500">
        <p className="font-display text-xl tracking-wider text-neutral-300 mb-2">LINKIN PARK</p>
        <p>A fan-made tribute page. All music and imagery belong to their respective owners.</p>
      </footer>

      {/* STICKY PLAYER */}
      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-lg">
        {/* Progress bar (clickable) */}
        <div
          className="group h-1.5 bg-neutral-800 cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            setProgress(Math.min(Math.max(pct * totalSeconds, 0), totalSeconds));
          }}
        >
          <div
            className="h-full bg-red-600 group-hover:bg-red-500 transition-colors"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="px-4 md:px-6 py-3 flex items-center gap-3 md:gap-6">
          {/* Track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-72">
            <img src={currentTrack.cover} alt={currentTrack.album} className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentTrack.title}</p>
              <p className="truncate text-xs text-neutral-500">{currentTrack.album}</p>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="ml-auto md:ml-2 text-neutral-500 hover:text-red-500 transition-colors flex-shrink-0"
              aria-label="Favorite"
            >
              <Heart className={`h-4 w-4 ${favorites.has(currentTrack.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={prev} className="text-neutral-400 hover:text-white transition-colors" aria-label="Previous">
                <SkipBack className="h-5 w-5 fill-current" />
              </button>
              <button
                onClick={toggle}
                className="h-10 w-10 rounded-full bg-white text-neutral-950 grid place-items-center hover:scale-105 active:scale-95 transition-transform"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>
              <button onClick={next} className="text-neutral-400 hover:text-white transition-colors" aria-label="Next">
                <SkipForward className="h-5 w-5 fill-current" />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 w-full max-w-md text-xs text-neutral-500 tabular-nums">
              <span className="w-10 text-right">{elapsedStr}</span>
              <div
                className="flex-1 h-1 bg-neutral-800 rounded-full cursor-pointer group relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setProgress(Math.min(Math.max(pct * totalSeconds, 0), totalSeconds));
                }}
              >
                <div className="h-full bg-red-600 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="w-10">{currentTrack.duration}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 w-40">
            <button
              onClick={() => setMuted((m) => !m)}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Mute"
            >
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(false);
              }}
              className="w-full accent-red-600 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind sticky player */}
      <div className="h-28" />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-neutral-800 pt-3">
      <p className="font-display text-3xl text-white">{value}</p>
      <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

