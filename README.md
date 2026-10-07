# Growtion

ADHD-friendly reward journal. Static PWA (no build step) served by GitHub Pages; data in Supabase.

- `index.html` — the whole app
- `config.js` — Supabase project URL + anon key (public by design; RLS protects data)
- `schema.sql` — run once in the Supabase SQL editor
- `sw.js`, `manifest.webmanifest` — offline shell and home-screen install
