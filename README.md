# Indo Study

A personal Next.js app to learn and test beginner Indonesian — flashcards,
multiple-choice, type-the-answer, fill-in-the-blank, listening, speaking,
word-order, confusable-pairs, word-building, FSRS spaced repetition, a one-tap
daily session, stats, and a pronunciation guide. Local-first: progress is
stored in the browser (`localStorage`), no backend or account.

Content is a curated beginner (A1–A2) curriculum of ~17 themed units in
`lib/data/unit-*.ts`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` then `npm run start` for a production build.

## Deploy (Vercel)

The app is zero-config for Vercel (static + client only).

- **Dashboard:** import the GitHub repo at vercel.com → deploy. No settings
  needed.
- **CLI:** `npx vercel` (preview) / `npx vercel --prod` (production).
- Set env var **`NEXT_PUBLIC_SITE_URL`** to the deployed origin (e.g.
  `https://indo-study.vercel.app`) so manifest/icon URLs are absolute.

It's an installable PWA: open the deployed site on a phone → "Add to Home
Screen". It works offline after the first visit; progress stays on that device.

### Moving progress between devices

Progress is per-browser. On **Stats → Backup & move devices**: *Export* a JSON
file on one device and *Import* it on another.

## Pronunciation audio

Listening/Speaking and the speaker buttons use bundled audio when available,
falling back to the browser's Web Speech voice.

```bash
npm run gen:audio
```

Generates `public/audio/*.mp3` + `manifest.json` for every phrase (default:
keyless Google Translate TTS — unofficial, may rate-limit; incremental, so
re-run after adding a lesson). Commit the generated files so Vercel serves
them. The app works without this step (Web Speech fallback).

## Adding or extending content

Add a `lib/data/unit-NN-topic.ts` file (copy an existing unit's shape — sections
of `vocab`/`sentence` items; tag affixed forms with `root` to feed the
word-building trainer) and register it in `lib/data/index.ts`. Then optionally
`npm run gen:audio`. Item ids are position-based, so don't reorder existing
sections/items (it resets spaced-repetition progress for moved items).
