const { publicClient } = require("./_lib/supabase");
const { esc, formatDate, dropboxImg, shell } = require("./_lib/theme");

exports.handler = async function () {
  const supabase = publicClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (error) {
    return { statusCode: 500, body: "Error loading posts: " + error.message };
  }

  const list = posts || [];
  const featured = list.find((p) => p.featured) || list[0];
  const rest = list.filter((p) => p.id !== featured?.id);

  const cardCss = `
.grid-css{max-width:1160px;margin:0 auto;padding:0 24px 80px;}
.featured-row{display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:40px;}
.card{background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:6px;overflow:hidden;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;transition:transform .15s,box-shadow .15s;}
.card:hover{transform:translateY(-3px);box-shadow:0 12px 24px rgba(0,0,0,0.08);}
.card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#eee;}
.card .body{padding:20px 22px;display:flex;flex-direction:column;gap:8px;flex:1;}
.card .date{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--coral);}
.card h3{font-size:20px;line-height:1.25;}
.card p{margin:0;font-size:14px;line-height:1.5;color:#555;flex:1;}
.card .read{font-size:13px;font-weight:600;color:var(--coral);}
.featured-row .card h3{font-size:30px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
@media (min-width:1400px){.grid-3{grid-template-columns:repeat(4,1fr);}}
@media (max-width:900px){.featured-row{grid-template-columns:1fr;}.grid-3{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.grid-3{grid-template-columns:1fr;}}
`;

  const cardHtml = (p, big) => `<a class="card" href="/insights/${esc(p.slug)}">
${p.image_url ? `<img src="${esc(dropboxImg(p.image_url))}" alt="${esc(p.title)}"/>` : ""}
<div class="body">
<div class="date">${formatDate(p.published_date)}</div>
<h3>${esc(p.title)}</h3>
<p>${esc(p.excerpt || "")}</p>
<span class="read">Read Article &rarr;</span>
</div></a>`;

  const bodyHtml = `<div class="wrap"><div class="eyebrow" style="margin-top:48px">Insights</div>
<h1 style="font-size:clamp(32px,4vw,48px);margin-bottom:32px">Ideas for revenue leaders</h1></div>
<div class="grid-css">
${featured ? `<div class="featured-row">${cardHtml(featured, true)}${rest[0] ? cardHtml(rest[0]) : ""}</div>` : ""}
<div class="grid-3">${rest.slice(featured ? 1 : 0).map((p) => cardHtml(p)).join("")}</div>
${!list.length ? '<p style="padding:40px 0;color:#777">No articles published yet.</p>' : ""}
</div>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: shell({
      title: "Insights | Intercept Advantage",
      description: "Ideas on revenue growth, sales process, and pipeline strategy from Intercept Advantage.",
      canonical: "https://interceptadvantage.com/insights",
      bodyHtml,
      extraCss: cardCss,
    }),
  };
};
