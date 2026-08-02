const { adminClient } = require("./_lib/supabase");
const { sendBatch } = require("./_lib/resend");
const { esc, formatDate, dropboxImg } = require("./_lib/theme");

exports.handler = async function (event) {
  const password = event.headers["x-editor-password"] || "";
  if (password !== process.env.EDITOR_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
  }

  const supabase = adminClient();

  if (event.httpMethod === "GET") {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ posts: data }) };
  }

  if (event.httpMethod === "POST") {
    const payload = JSON.parse(event.body || "{}");
    if (!payload.slug || !payload.title) {
      return { statusCode: 400, body: JSON.stringify({ error: "Title and slug are required" }) };
    }

    // Figure out whether this save is the moment the post goes live, so we
    // only email subscribers once — not on every subsequent edit.
    let previousStatus = null;
    if (payload.id) {
      const { data: existingPost } = await supabase.from("blog_posts").select("status").eq("id", payload.id).single();
      previousStatus = existingPost ? existingPost.status : null;
    }

    if (payload.featured) {
      await supabase.from("blog_posts").update({ featured: false }).neq("id", payload.id || "00000000-0000-0000-0000-000000000000");
    }
    const row = {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt || null,
      content: payload.content || null,
      image_url: payload.image_url || null,
      meta_description: payload.meta_description || null,
      canonical_url: payload.canonical_url || null,
      published_date: payload.published_date || null,
      status: payload.status || "draft",
      featured: !!payload.featured,
      updated_at: new Date().toISOString(),
    };
    let query;
    if (payload.id) {
      query = supabase.from("blog_posts").update(row).eq("id", payload.id).select().single();
    } else {
      query = supabase.from("blog_posts").insert(row).select().single();
    }
    const { data, error } = await query;
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

    const justPublished = row.status === "published" && previousStatus !== "published";
    const notify = { attempted: false };
    if (justPublished) {
      notify.attempted = true;
      try {
        notify.sent = await notifySubscribers(supabase, data);
        notify.ok = true;
      } catch (e) {
        notify.ok = false;
        notify.error = e.message;
      }
    }

    return { statusCode: 200, body: JSON.stringify({ post: data, notify }) };
  }

  return { statusCode: 405, body: "Method not allowed" };
};

async function notifySubscribers(supabase, post) {
  const { data: subs, error } = await supabase.from("subscribers").select("email, token").eq("status", "confirmed");
  if (error) throw new Error(error.message);
  if (!subs || !subs.length) return 0;

  const site = process.env.SITE_URL || "https://interceptadvantage.com";
  const url = `${site}/insights/${post.slug}`;
  const img = dropboxImg(post.image_url);

  const emails = subs.map((s) => ({
    to: s.email,
    subject: `New on Insights: ${post.title}`,
    html: postEmailHtml(post, url, img, `${site}/.netlify/functions/unsubscribe?token=${s.token}`),
  }));

  await sendBatch(emails);
  return emails.length;
}

function postEmailHtml(post, url, img, unsubscribeUrl) {
  const address = process.env.COMPANY_ADDRESS || "";
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1c1c1c">
<div style="background:#111111;padding:20px 24px"><span style="font-family:Georgia,serif;font-size:19px;font-weight:800;color:#F4F1EC">Intercept Advantage</span></div>
${img ? `<img src="${esc(img)}" alt="" style="width:100%;display:block"/>` : ""}
<div style="padding:32px 24px">
<div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#E8614A;margin-bottom:8px">${formatDate(post.published_date)}</div>
<h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.25;margin:0 0 16px">${esc(post.title)}</h1>
<p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">${esc(post.excerpt || "")}</p>
<a href="${esc(url)}" style="display:inline-block;background:#E8614A;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:4px;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Read the Article</a>
</div>
<div style="padding:20px 24px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center">
You're receiving this because you subscribed at interceptadvantage.com/insights.${address ? `<br/>${esc(address)}` : ""}<br/>
<a href="${esc(unsubscribeUrl)}" style="color:#999">Unsubscribe</a>
</div>
</div>`;
}
