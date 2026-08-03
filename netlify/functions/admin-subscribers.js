const { adminClient } = require("./_lib/supabase");

// Password-protected, same pattern as admin-posts.js. Lists and deletes
// subscribers for the blog-editor's "Subscribers" panel.
exports.handler = async function (event) {
  const password = event.headers["x-editor-password"] || "";
  if (password !== process.env.EDITOR_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
  }

  const supabase = adminClient();

  if (event.httpMethod === "GET") {
    const { data, error } = await supabase
      .from("subscribers")
      .select("email, status, created_at, confirmed_at")
      .order("created_at", { ascending: false });

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ subscribers: data || [] }) };
  }

  if (event.httpMethod === "DELETE") {
    let email = "";
    try {
      email = String(JSON.parse(event.body || "{}").email || "").trim().toLowerCase();
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
    }
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email is required." }) };

    const { error } = await supabase.from("subscribers").delete().eq("email", email);
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
