const { publicClient } = require("./_lib/supabase");
const { esc, formatDate, dropboxImg, shell } = require("./_lib/theme");

exports.handler = async function (event) {
  const slug = event.queryStringParameters && event.queryStringParameters.slug;
  const supabase = publicClient();

  if (!slug) return { statusCode: 404, body: "Not found" };

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: shell({
        title: "Article not found | Intercept Advantage",
        bodyHtml: `<div class="wrap" style="padding:80px 24px;text-align:center"><h1>Article not found</h1><p><a href="/insights">&larr; Back to Insights</a></p></div>`,
      }),
    };
  }

  const img = dropboxImg(post.image_url);
  const url = post.canonical_url || `https://interceptadvantage.com/insights/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description || "",
    image: img || undefined,
    datePublished: post.published_date,
    dateModified: post.updated_at || post.published_date,
    author: { "@type": "Organization", name: "Intercept Advantage" },
  };

  const articleCss = `
.article-wrap{max-width:760px;margin:0 auto;padding:0 24px 100px;}
.back-link{display:inline-block;margin:32px 0 24px;font-size:13px;font-weight:600;}
.article-date{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--coral);margin-bottom:12px;}
.article-title{font-size:clamp(32px,4.5vw,48px);line-height:1.1;margin-bottom:28px;}
.article-hero{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px;margin-bottom:40px;background:#eee;}
.article-body{font-size:18px;line-height:1.75;color:#2a2a2a;}
.article-body p{margin:0 0 24px;}
.article-body ul,.article-body ol{margin:0 0 24px;padding-left:28px;}
.article-body li{margin-bottom:8px;}
.article-body blockquote{margin:0 0 24px;padding:8px 24px;border-left:3px solid var(--coral);font-style:italic;color:#555;}
.article-body h2,.article-body h3{margin:40px 0 16px;}
.article-body a{text-decoration:underline;}
.cta-box{margin:56px 0;padding:32px;background:var(--dark);border-radius:8px;text-align:center;}
.cta-box h3{color:#fff;font-size:24px;margin-bottom:16px;}
.cta-box a{display:inline-block;background:linear-gradient(135deg,var(--coral),var(--gold));color:var(--dark);font-weight:700;text-decoration:none;padding:14px 32px;border-radius:4px;letter-spacing:.05em;text-transform:uppercase;font-size:13px;}
`;

  // content is rich HTML from the editor's formatting toolbar (bold, lists, etc.)
  const contentHtml = String(post.content || "");

  const bodyHtml = `<div class="article-wrap">
<a class="back-link" href="/insights">&larr; Back to Insights</a>
<div class="article-date">${formatDate(post.published_date)}</div>
<h1 class="article-title">${esc(post.title)}</h1>
${img ? `<img class="article-hero" src="${esc(img)}" alt="${esc(post.title)}"/>` : ""}
<div class="article-body">${contentHtml}</div>
<div class="cta-box">
<h3>See how Intercept Advantage can help your team.</h3>
<a href="https://interceptadvantage.com/#demo">Request a Live Demonstration</a>
</div>
</div>`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: shell({
      title: `${post.title} | Intercept Advantage`,
      description: post.meta_description || post.excerpt || "",
      canonical: url,
      ogImage: img,
      jsonLd,
      bodyHtml,
      extraCss: articleCss,
    }),
  };
};
