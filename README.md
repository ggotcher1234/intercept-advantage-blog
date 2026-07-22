# Intercept Advantage — Insights Blog

Magazine-style blog: Supabase (storage) + Netlify Functions (rendering) + a password-gated static editor. No static-site build step — every page is generated on request from live Supabase data, so publishing is instant.

## Pages
- `/insights` — magazine grid (featured article + card grid), served by `netlify/functions/insights.js`
- `/insights/<slug>` — individual article, served by `netlify/functions/article.js` (full server-rendered HTML incl. meta tags + JSON-LD, so LinkedIn/Google previews work correctly)
- `/blog-editor` — password-gated editor (`public/blog-editor/index.html`), writes via `netlify/functions/admin-posts.js`

## Security model
- Public pages read Supabase directly with the restricted `anon` key (Row Level Security only exposes `status = 'published'` rows).
- All writes (and reading drafts) go through `admin-posts.js`, which checks a password header against `EDITOR_PASSWORD` and uses the secret `service_role` key server-side only — that key is never sent to the browser.

## First-time setup
See `SETUP.md` — Supabase project + one SQL paste + 4 Netlify env vars + upload these files. No CLI, no build pipeline, no lockfiles.

## Editing content going forward
Just use `/blog-editor`. No git, no rebuilds, no CMS admin quirks.
