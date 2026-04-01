# CloudOS — Cloud Operating System

A full Windows 11-style operating system that runs entirely in your browser.

## Architecture

**Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS  
**Backend:** Next.js API Routes (server-side, Node.js runtime)  
**Database:** SQLite via `better-sqlite3`  
**Auth:** JWT + bcryptjs (30-day sessions, 1-hour guest sessions)  
**AI (CLOUDIA):** Dual-layer architecture: (1) Client-side local command parser (instant, zero network) handles "open [app]", time, date, greetings, help — covers ~90% of commands; (2) Direct browser-to-Pollinations calls (bypasses Replit server IP rate limit) for complex queries; server API fallback as last resort  
**Voice:** ElevenLabs TTS (streaming) with `window.speechSynthesis` fallback  
**State:** Zustand with localStorage persistence

## Environment Variables Required

- `JWT_SECRET` — JWT signing secret (required)
- `ELEVENLABS_API_KEY` — ElevenLabs API Key (required for voice)
- `CF_ACCOUNT_ID` — Cloudflare Account ID (for Cloudflare Workers AI — primary AI provider)
- `CF_API_TOKEN` — Cloudflare API Token (for Cloudflare Workers AI — primary AI provider)
- `GOOGLE_CLIENT_ID` — Google OAuth client ID (enables Google Sign-In)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (enables Google Sign-In)
- `RESEND_API_KEY` — Resend API key (enables email verification emails)
- `NEXT_PUBLIC_APP_URL` — Full public URL of the app (for email verification links)

## File Structure

```
app/
  page.tsx              — Landing page
  auth/page.tsx         — Sign up / Sign in / Guest login
  desktop/page.tsx      — Main OS desktop (auth protected, includes AccentColorSync)
  api/
    auth/               — signup, signin, guest, me, signout, settings
    ai/                 — chat (CLOUDIA), code, write, translate, models
    voice/              — speak (TTS), voices
    files/              — files, folders, notepad, sticky, calendar, bookmarks
    weather/            — real weather via Open-Meteo geocoding + forecast (no key)
    health/             — health check endpoint

lib/
  db.ts                 — SQLite singleton + schema + default data creator
  auth-utils.ts         — JWT sign/verify/extract helpers
  api-client.ts         — Client-side fetch wrappers for all API endpoints
  stores/
    authStore.ts        — Zustand auth store (persisted to localStorage, key: 'cloudos-auth')
    wallpaperStore.ts   — Zustand wallpaper+accent color store (key: 'cloudos-wallpaper')
  apps.tsx              — App registry for the OS
  desktop-context.tsx   — Desktop window management state
  types.ts              — TypeScript types

components/
  accent-color-sync.tsx — Syncs accentColor store to CSS --accent variable on :root
  apps/                 — All OS app components (30+ apps)
    cloudia.tsx         — CLOUDIA AI assistant (Pollinations AI + browser TTS fallback)
    notepad.tsx         — Text editor with DB persistence, auto-save, file sidebar
    weather.tsx         — Real weather using Open-Meteo, 7-day forecast, city search
    calendar.tsx        — Calendar with events, accent color support
    music.tsx           — Music player with accent color theming
    settings.tsx        — Full settings: Personalization, Accounts, AI & CLOUDIA
    ... (30+ more apps)
  desktop/
    taskbar.tsx         — Taskbar with accent color indicators
    start-menu.tsx      — Start menu with accent color support
    action-center.tsx   — Action center with accent color sliders/toggles
    window.tsx          — Draggable/resizable windows
    desktop-icons.tsx   — Desktop icon grid
  aurora-background.tsx — Animated wallpaper background (responds to wallpaper store)
```

## Accent Color System

The `AccentColorSync` component (mounted in desktop/page.tsx) syncs the `accentColor`
from the Zustand wallpaper store to CSS custom properties on `:root`:
- `--accent`: the current accent color hex (default `#0078D4`)  
- `--accent-rgb`: the R, G, B channels for use in rgba()

All app components use `var(--accent)` in their inline styles and Tailwind brackets
(`bg-[var(--accent)]`, `text-[var(--accent)]`) so they automatically update when the
user changes accent color in Settings → Personalization.

## Key Features

- **Real authentication** — JWT + bcrypt, signup/signin/guest sessions + Google OAuth
- **SQLite database** — Users, files, folders, notes, calendar, bookmarks; auto-migrated google_id column
- **CLOUDIA AI** — Powered by Pollinations.ai; sidebar with chat history (localStorage), new chat, session delete
- **30+ apps** — File Explorer, Notepad, Calculator, Terminal, Weather, and more
- **Voice support** — ElevenLabs TTS with browser SpeechSynthesis fallback
- **Accent color theming** — 8 accent colors, 8 wallpapers, all apps respect the theme
- **Real weather** — Open-Meteo API (no key needed), city search, 7-day forecast
- **Notepad with DB** — Auto-save (1.5s debounce), file list sidebar, Ctrl+S support
- **Taskbar pinned apps** — File Explorer, Edge, Notepad, Word, WhatsApp, CLOUDIA always pinned
- **Date/Time panel** — Windows 11-style calendar + clock when clicking the taskbar clock
- **Fast browser** — Searches use Bing (www.bing.com) as default search engine
- **Google OAuth** — /api/auth/google → Google → /api/auth/google/callback → /auth/google-success → /desktop

## Development

```bash
pnpm run dev    # Runs on http://localhost:5000
```

Test health check: `GET /api/health`

## Notes

- `better-sqlite3` requires native compilation. Python + make + gcc are installed via Nix.
- The database file `cloudos.db` is created automatically at project root on first use.
- All passwords are hashed with bcrypt (12 salt rounds).
- Guest sessions last 1 hour; regular sessions last 30 days.
- Pollinations.ai endpoint: `POST https://text.pollinations.ai/openai`, model `openai-fast`
- All API routes need `export const runtime = 'nodejs'` (Turbopack Next.js 16 requirement)
- Auth store key: `cloudos-auth` (localStorage); token key: `cloudos_token`
- Wallpaper store key: `cloudos-wallpaper` (localStorage)
- `getUserFromRequest` reads from Authorization header; `/api/proxy` also reads from `?token=` query param
