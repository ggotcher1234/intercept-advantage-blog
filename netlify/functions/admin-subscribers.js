const { adminClient } = require("./_lib/supabase");

// Password-protected, same pattern as admin-posts.js. Read-only — lists
// subscribers for the blog-editor's "Subscribers" panel.
exports.handler = async function (event) {
  const password = event.headers["x-editor-password"] || "";
  if (password !== process.env.EDITOR_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const supabase = adminClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("email, status, created_at, confirmed_at")
    .order("created_at", { ascending: false });

  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, body: JSON.stringify({ subscribers: data || [] }) };
};
