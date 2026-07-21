# Handoff: Blog for Intercept Advantage

## Overview
Adds a simple, SEO-controlled blog to interceptadvantage.com: a browser-based visual/rich-text editor (no code, no file-editing) for writing posts, and static, fast-loading blog pages that match the site's existing brand (coral/gold, Fraunces + Barlow).

## Recommended stack (matches your setup: Netlify, git-connected, static HTML)
- **Decap CMS** (formerly Netlify CMS) — free, open-source, git-based admin UI at `/admin`. Editors log in (via Netlify Identity), get a rich-text editor + structured fields, and every save is a commit to your repo — no database, no separate CMS hosting.
- **Eleventy (11ty)** — a zero-config static site generator that turns the markdown posts Decap CMS writes into real static HTML pages at build time (via `netlify.toml`'s build command), each with its own URL, full SEO meta tags, and JSON-LD structured data. This is why blog pages will actually be crawlable/indexable, unlike a client-side-only render.

This is the standard, well-supported combination for "static site + easy CMS" on Netlify and requires no ongoing hosting cost beyond your existing Netlify plan.

## About the files in this bundle
Everything here is a **working scaffold**, not a mockup — `src/_includes/*.njk` and `src/styles/blog.css` are real templates styled to match the current site (colors/fonts pulled directly from `uploads/index.html`), and `admin/config.yml` is a real Decap CMS config. A developer needs to:
1. Drop this into (or merge into) your site's git repo.
2. Run `npm install`.
3. Enable **Netlify Identity + Git Gateway** in the Netlify dashboard (Site settings → Identity) — this is what lets Decap CMS authenticate editors without a separate backend.
4. Push to `main` — Netlify runs `npm run build` (Eleventy) automatically per `netlify.toml`.
5. Editors go to `yoursite.com/admin` to write posts.

## SEO controls included (per post, editable in the CMS UI)
- Title & URL slug (independent — slug controls `/blog/<slug>/`)
- Meta description
- Canonical URL (optional override)
- Social/cover image (used for `og:image`/Twitter card)
- Publish date
- Auto-generated `schema.org` `Article` JSON-LD (title, description, image, datePublished, author) — no manual entry needed, built from the other fields in `src/_includes/post.njk`

## File structure
```
design_handoff_blog/
  README.md            (this file)
  netlify.toml          build command + publish dir
  package.json          Eleventy dependency + build/serve scripts
  .eleventy.js           Eleventy config (collections, passthroughs)
  admin/
    index.html            Decap CMS loader (mounts at /admin)
    config.yml             CMS field/collection definitions
  src/
    _includes/
      base.njk              shared HTML shell: nav, footer, SEO <head> block, brand CSS vars
      post.njk               single blog post layout + JSON-LD schema
    blog/
      index.njk              blog listing page (loops all posts, paginated-ready)
      posts/
        welcome-to-the-blog.md   sample post so you can see the pipeline work end-to-end
    styles/
      blog.css                blog-specific styles, same coral/gold/Fraunces/Barlow tokens as the main site
```

## Design tokens used (matches interceptadvantage.com)
- Colors: coral `#E8614A`, gold `#F0B942`, near-black `#111`–`#1c1c1c`, cream `#F4F1EC`
- Fonts: Fraunces (headlines/serif), Barlow (body), Barlow Condensed (labels) — same Google Fonts `@import` as the main site
- Buttons: 2px radius (not pill), uppercase Barlow
- Cards: 4–10px radius, 1px hairline border, coral→gold top accent

## Next steps / what's NOT included
- Actually merging this into your live repo (I don't have write access to it)
- Enabling Netlify Identity/Git Gateway (one checkbox in your Netlify dashboard, can't be done from here)
- Visual polish pass once real posts exist — the sample post is intentionally short

Ask if you want this wired into the existing single-page `index.html` nav (add a "Blog" link) — that's a one-line addition once this is deployed.
