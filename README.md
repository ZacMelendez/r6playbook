# R6 Playbook

A community site for sharing **Rainbow Six Siege** strategies. Players pick a map and bomb site, write up a setup with a rich-text editor that supports pinning markers on the map, and the community votes and favorites the plays that work.

**Live:** [r6playbook.com](https://r6playbook.com)

## Screenshots

<!-- Add images to docs/screenshots/ and uncomment:
![Home](docs/screenshots/home.png)
![Strategy editor](docs/screenshots/editor.png)
![Map site view](docs/screenshots/site.png)
-->

## Features

- **Browse by map and site.** Every map has its own pages, down to individual bomb sites, each listing community strategies.
- **Rich strategy editor.** A custom Tiptap editor with headings, code blocks, images, YouTube embeds, and an interactive map-marker extension for dropping draggable pins on a site layout.
- **Voting and favorites.** Upvote and downvote plays (via Postgres functions) and save favorites to your profile.
- **Profiles.** Public profile pages with auto-generated usernames, plus account settings.
- **Explore and operators.** Discover new and top strategies, and browse the operator roster.
- **Abuse protection.** reCAPTCHA on submissions and an Upstash sliding-window rate limit (10 req/min per IP) on writes.
- **Fast pages.** Server-rendered with ISR, tag-based cache invalidation (`revalidateTag`) when a play changes, and a sitemap-driven cache warm-up script.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js (App Router, Server Actions), React, TypeScript |
| Data and auth | Supabase (Postgres, Auth with Google OAuth, row-level security) |
| UI | Tailwind CSS, Radix UI, shadcn/ui, Motion, next-view-transitions |
| Editor | Tiptap, lowlight |
| State | Jotai with SSR hydration (`jotai-ssr`) |
| Infra | Vercel, Upstash Redis, Cloudinary, reCAPTCHA |

## Getting started

**Prerequisites:** Node.js 20+, pnpm, Docker (for the local Supabase stack), and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
pnpm install
cp .env.example .env

# Start local Supabase and apply the schema in supabase/migrations
supabase start
supabase db reset
```

Copy the API URL and anon key printed by `supabase start` into `.env`, fill in the remaining keys, then run:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  maps/[mapName]/sites/[siteName]/[playId]/   Strategy pages
  create/                                     New-strategy flow (editor, reCAPTCHA)
  explore/  operators/  profile/  settings/   Other routes
components/ui/minimal-tiptap/                 Custom editor and extensions (map markers, images, YouTube)
lib/actions/                                  Server actions (strategies, votes, favorites, cache, rate limit)
lib/supabase/                                 Server, browser, and middleware Supabase clients
supabase/migrations/                          Database schema, functions, and RLS policies
```

## Database

The core tables are `strategies`, `votes`, `favorites`, `comments`, `tags`/`strategytags`, `users`, and `feedback`. Vote counts are updated by the `addvote`/`removevote` Postgres functions. A trigger (`sync_auth_to_public`) mirrors Supabase Auth users into `public.users`.
