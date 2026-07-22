function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00Z");
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).toUpperCase();
}

// Rewrites a Dropbox share link into a directly-embeddable image URL.
function dropboxImg(url) {
  if (!url) return "";
  if (url.includes("dropbox.com")) {
    const rewritten = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
    return rewritten.includes("rlkey=") ? rewritten.replace(/([?&])dl=0/, "$1dl=1") : rewritten.split("?")[0];
  }
  return url;
}

const BASE_CSS = `
:root{--coral:#E8614A;--gold:#F0B942;--ink:#1c1c1c;--cream:#F4F1EC;--dark:#111111;}
*{box-sizing:border-box;}
body{margin:0;font-family:'Barlow',sans-serif;background:var(--cream);color:var(--ink);}
a{color:var(--coral);}
a:hover{color:var(--gold);}
.site-header{background:var(--dark);padding:20px 24px;display:flex;align-items:center;justify-content:space-between;}
.site-header .brand{font-family:'Fraunces',serif;font-size:19px;font-weight:800;color:#F4F1EC;text-decoration:none;}
.site-header .brand span{background:linear-gradient(120deg,var(--coral),var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent;}
.site-header nav a{color:#F4F1EC;font-size:13px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;margin-left:28px;}
.site-header nav a:hover{color:var(--gold);}
.site-footer{background:var(--dark);color:rgba(244,241,236,0.6);text-align:center;padding:40px 24px;font-size:13px;margin-top:80px;}
.wrap{max-width:1160px;margin:0 auto;padding:0 24px;}
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--coral);display:flex;align-items:center;gap:12px;margin:48px 0 16px;}
.eyebrow::before{content:'';display:block;width:36px;height:1px;background:var(--coral);}
h1,h2,h3{font-family:'Fraunces',serif;font-weight:700;margin:0;}
`;

function shell({ title, description, canonical, ogImage, jsonLd, bodyHtml, extraCss }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description || "")}"/>
${canonical ? `<link rel="canonical" href="${esc(canonical)}"/>` : ""}
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description || "")}"/>
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}"/>` : ""}
<meta property="og:type" content="article"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>${BASE_CSS}${extraCss || ""}</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head><body>
<header class="site-header">
<a class="brand" href="/insights">Intercept<span> Advantage</span></a>
<nav><a href="https://interceptadvantage.com">Home</a><a href="/insights">Insights</a></nav>
</header>
${bodyHtml}
<footer class="site-footer">&copy; ${new Date().getFullYear()} Intercept Advantage. All rights reserved.</footer>
</body></html>`;
}

module.exports = { esc, formatDate, dropboxImg, shell };
