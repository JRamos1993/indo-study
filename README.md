# Lilt

A personal language-learning app for beginner **Indonesian and Japanese** —
flashcards, multiple-choice, type-the-answer, fill-in-the-blank, listening,
speaking, word-order, confusable-pairs, word-building, plus Japanese **kana**
(hiragana/katakana) and **kanji** drills. FSRS-5 spaced repetition, a one-tap
daily smart-mix, a course/syllabus with unit gating, a glossary, a progress
page, and a per-language pronunciation guide.

It has **accounts** (email + password): you register to use the app, and your
streak, mastery and settings **sync across devices**. There's also a small
non-competitive **Circle** — invite friends by code, set a weekly group goal,
and see who studied today (only aggregate counts are ever shared).

Switch the study language from the sidebar (or the mobile top bar). Each
language is a curated beginner curriculum of themed units under
`lib/data/<lang>/unit-*.ts` (`id` = Indonesian, `ja` = Japanese), registered in
`lib/languages.ts`.

## Architecture

- **Frontend:** Next.js 15 (App Router), fully client-rendered, built as a
  **static export** (`output: "export"` → `./out`). Tailwind v4, the "Lilt"
  Pop-Sticker design system.
- **Backend:** a single **Cloudflare Worker** (`src/worker.ts`, Hono) that serves
  the static export as Workers Static Assets **and** handles `/api/*`, bound to a
  **D1** database (`lilt`). Auth/sync/Circle live in `src/auth.ts`,
  `src/sync.ts`, `src/circle.ts`. No Next.js server / OpenNext — there is nothing
  to SSR.
- **Offline-first:** progress is cached in `localStorage` and works offline; when
  signed in it reconciles with D1 (last-write-wins). The signed-in user is cached
  so a returning PWA visit isn't bounced while the network is unreachable.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000 — UI only (no /api, no D1)
```

For the **full stack** (Worker + local D1):

```bash
npm run build                       # static export → ./out
npm run db:migrate:local            # apply migrations to the local D1
npm run preview                     # wrangler dev → http://localhost:8787
```

## Deploy (Cloudflare Workers)

1. Connect the GitHub repo in **Workers & Pages → Create → Workers → Connect to
   Git**, **Framework preset = None**, build `npm run build`, deploy
   `npx wrangler deploy`. (Do **not** let it pick the Next.js/OpenNext preset —
   this is a static export, not an SSR app.)
2. **Set the password pepper secret before any real signups** (see below).
3. Apply D1 migrations to prod once: `npx wrangler d1 migrations apply lilt --remote`
   (needs a token), or run the migration SQL via the dashboard/API.

`NEXT_PUBLIC_SITE_URL` should be set to the production origin at build time so
manifest/OG URLs are absolute.

### `SESSION_PEPPER` (required)

Passwords are hashed with PBKDF2-SHA256 + a per-user salt **and** a server-side
pepper read from `env.SESSION_PEPPER`. Set it as a Worker secret:

```bash
npx wrangler secret put SESSION_PEPPER     # paste 32+ bytes, e.g. `openssl rand -base64 32`
```

⚠️ The pepper is a global input to every hash and is **not** versioned per row,
so set it **before the first real account is created**. Setting or changing it
after users exist invalidates their stored hashes (they'd need to reset via their
recovery key). For local dev, put it in `.dev.vars` (gitignored).

## Pronunciation audio

Listening/Speaking and the speaker buttons use bundled audio when available,
falling back to the browser's Web Speech voice.

```bash
npm run gen:audio   # public/audio/*.mp3 + manifest.json (incremental)
```

The app works without this step (Web Speech fallback). Commit the generated
files so the deploy serves them.

## Adding or extending content

Add a `lib/data/<lang>/unit-NN-topic.ts` exporting `lesson: RawLesson` (items
have `target` + `en` + `kind`; Japanese items also carry a `reading` romaji; tag
affixed forms with `root` to feed the word-building trainer), and register it in
that language's `units` array in `lib/languages.ts`. To add a whole new language,
add a `LanguageConfig` there. Item ids are position-based — don't reorder
existing sections/items (it resets spaced-repetition progress for moved items).
