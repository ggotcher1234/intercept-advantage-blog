# Setup — Insights Blog (Supabase + Netlify Functions)

One-time setup, roughly 20 minutes, no coding, no CLI, no build pipeline. After this, publishing a post is instant (no rebuild wait).

## Part 1 — Create a free Supabase project
1. Go to **supabase.com** → sign up (free tier is plenty).
2. Click **New Project**. Name it anything (e.g. `intercept-advantage-blog`). Pick any region. Set a database password (save it somewhere, you won't need it day-to-day).
3. Wait ~2 minutes for it to finish provisioning.

## Part 2 — Create the table
1. In your Supabase project, click **SQL Editor** (left sidebar) → **New query**.
2. Paste this in and click **Run**:

```sql
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  meta_description text,
  canonical_url text,
  published_date date,
  status text default 'draft' check (status in ('draft','published')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table blog_posts enable row level security;

create policy "public can read published posts"
on blog_posts for select
using (status = 'published');
```

That's it — the table only allows public *reading* of published posts. Writing happens through a password-protected function (Part 4), never directly from the browser.

## Part 3 — Get your keys
1. In Supabase, click **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL**.
3. Copy the **anon public** key.
4. Copy the **service_role** key (click "Reveal" — keep this one secret, never put it in any front-end file).

## Part 4 — Add files to GitHub
In your `intercept-advantage-blog` repo on github.com: delete everything currently in the repo, then upload every file in this `design_handoff_blog` folder (drag the contents into GitHub's "upload files" page), preserving the folder structure (`netlify/functions/...`, `public/blog-editor/...`). Commit to `main`.

## Part 5 — Set environment variables in Netlify
Site configuration → Environment variables → add these four:
- `SUPABASE_URL` — the Project URL from Part 3
- `SUPABASE_ANON_KEY` — the anon public key
- `SUPABASE_SERVICE_ROLE_KEY` — the service_role key
- `EDITOR_PASSWORD` — any password you choose, this locks your `/blog-editor`

Then **Deploys → Trigger deploy → Deploy site**. There's no build step to fail this time — the site just serves pages on demand from Supabase.

## Part 6 — Write your first post
1. Visit `yoursite.../blog-editor`, enter your `EDITOR_PASSWORD`.
2. Fill in the form, set Status to **Published**, click **Save**.
3. Visit `yoursite.../insights` — it's there immediately, no waiting.

## Notes
- Dropbox image links: use the **share link**, but change `www.dropbox.com` to `dl.dropboxusercontent.com` in the URL, or just paste the normal share link — the editor/pages do this rewrite automatically.
- To feature an article at the top of the magazine grid, check **Featured Article** — only one post is ever featured at a time (checking it on a new post un-features the old one).
- Nothing here requires touching your main `interceptadvantage.com` site — just add a "Blog" or "Insights" nav link pointing at this blog's URL, same as before.
