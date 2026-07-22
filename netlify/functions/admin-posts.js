const { adminClient } = require("./_lib/supabase");

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
    return { statusCode: 200, body: JSON.stringify({ post: data }) };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
