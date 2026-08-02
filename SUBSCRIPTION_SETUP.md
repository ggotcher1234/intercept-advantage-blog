# Setup — Email Subscriptions for Insights

Adds an email capture form to `/insights` and every article, plus automatic
"new post" emails whenever you publish from `/blog-editor`. Same no-CLI, no
build-pipeline approach as the original blog setup — new files, one SQL
paste, a few env vars.

Uses **Resend** for sending. Double opt-in: subscribers confirm their email
before they're added to the send list, which keeps your sender reputation
clean and filters out bots/typos.

## Part 1 — Create a Resend account
1. Go to **resend.com** → sign up (free tier covers 3,000 emails/month, 100/day).
2. **Domains** → add `interceptadvantage.com` (or whatever domain you'll send from) and add the DNS records they give you (SPF/DKIM). This step matters — without a verified domain, most inboxes will spam-folder your emails.
3. **API Keys** → create a key with "Sending access." Copy it.

If you don't want to touch DNS on your main domain yet, Resend also lets you
send from a subdomain like `mail.interceptadvantage.com` — same records, just
scoped to that subdomain, and it doesn't touch your main site's email deliverability.

## Part 2 — Add the subscribers table
In Supabase → **SQL Editor** → **New query**, paste and run:

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  token uuid default gen_random_uuid() not null,
  created_at timestamptz default now(),
  confirmed_at timestamptz
);

alter table subscribers enable row level security;
-- No public policies on purpose: only the server-side functions (using the
-- service_role key, same as admin-posts.js) can read or write this table.
-- Nobody can query the subscriber list from the browser.
```

## Part 3 — Add the new files to GitHub
Upload/overwrite these in your `intercept-advantage-blog` repo, preserving folders:

**New files:**
- `netlify/functions/subscribe.js`
- `netlify/functions/confirm.js`
- `netlify/functions/unsubscribe.js`
- `netlify/functions/_lib/resend.js`

**Updated files (replace the existing ones):**
- `netlify/functions/_lib/theme.js` — adds the subscribe form component
- `netlify/functions/insights.js` — adds the form to the magazine page
- `netlify/functions/article.js` — adds the form to the bottom of every article
- `netlify/functions/admin-posts.js` — sends the "new post" email on publish
- `public/blog-editor/index.html` — editor now shows "Emailed N subscribers" after you publish
- `netlify.toml` — pins Node 18 (needed for built-in `fetch`, used to call Resend)

Commit to `main`.

## Part 4 — Add three more environment variables
Netlify → Site configuration → Environment variables, add:
- `RESEND_API_KEY` — the API key from Part 1
- `FROM_EMAIL` — e.g. `Intercept Advantage <insights@interceptadvantage.com>` (must be on the domain you verified in Resend)
- `SITE_URL` — `https://interceptadvantage.com` (or your Netlify URL if you're not on the custom domain yet) — used to build confirm/unsubscribe links

Optional, for CAN-SPAM compliance (US law requires a physical mailing address in marketing emails):
- `COMPANY_ADDRESS` — e.g. `Intercept Advantage, 123 Main St, City, ST 00000`

Then **Deploys → Trigger deploy → Deploy site**.

## Part 5 — Test it
1. Visit `/insights`, subscribe with an email you control.
2. Check your inbox for the confirmation email, click confirm.
3. Go to `/blog-editor`, publish a test post (or re-publish an existing draft).
4. You should get the "New on Insights" email within a few seconds, and the editor should show "Emailed 1 subscriber."
5. Click the unsubscribe link at the bottom of that email to confirm it works too.

## How the send works
- Publishing only fires an email the *first* time a post's status flips from
  draft → published — editing an already-published post again won't re-notify
  everyone.
- Sends go out via Resend's batch endpoint (up to 100 per call, auto-chunked),
  so it scales fine as your list grows past a few hundred.
- If a send fails (bad API key, unverified domain, etc.) the post still saves
  successfully — you'll just see the error in the editor's status message
  instead of a subscriber count, so you never risk losing an article because
  of an email problem.

## Bootstrapping your first subscribers
If you already have a list of contacts who'd want this (clients, LinkedIn
connections, past leads), you can seed them directly as already-confirmed
subscribers instead of making them opt in again — in Supabase SQL Editor:

```sql
insert into subscribers (email, status, confirmed_at)
values
  ('someone@example.com', 'confirmed', now()),
  ('someone.else@example.com', 'confirmed', now());
```

Just make sure anyone you add this way actually expects to hear from you —
CAN-SPAM allows this for existing business relationships, but blasting a cold
purchased list will hurt deliverability fast.
