const { adminClient } = require("./_lib/supabase");
const { sendEmail } = require("./_lib/resend");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let email = "";
  try {
    email = String(JSON.parse(event.body || "{}").email || "").trim().toLowerCase();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request." }) };
  }

  if (!EMAIL_RE.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Enter a valid email address." }) };
  }

  const supabase = adminClient();
  const site = process.env.SITE_URL || "https://interceptadvantage.com";

  const { data: existing, error: lookupError } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return { statusCode: 500, body: JSON.stringify({ error: lookupError.message }) };
  }

  if (existing && existing.status === "confirmed") {
    return { statusCode: 200, body: JSON.stringify({ ok: true, message: "You're already subscribed — nothing more to do." }) };
  }

  let subscriber = existing;
  if (existing) {
    // was pending or unsubscribed — reuse the row and its token, just reset status
    const { data, error } = await supabase
      .from("subscribers")
      .update({ status: "pending" })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    subscriber = data;
  } else {
    const { data, error } = await supabase
      .from("subscribers")
      .insert({ email, status: "pending" })
      .select()
      .single();
    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    subscriber = data;
  }

  const confirmUrl = `${site}/.netlify/functions/confirm?token=${subscriber.token}`;

  try {
    await sendEmail({
      to: email,
      subject: "Confirm your subscription to Intercept Advantage Insights",
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1c1c1c">
<div style="background:#111111;padding:20px 24px"><span style="font-family:Georgia,serif;font-size:19px;font-weight:800;color:#F4F1EC">Intercept Advantage</span></div>
<div style="padding:32px 24px">
<h1 style="font-size:20px;margin:0 0 16px">Confirm your subscription</h1>
<p style="font-size:15px;line-height:1.6;color:#444;margin:0 0 24px">Click below to confirm you'd like to receive new articles from Insights by email. If you didn't request this, you can ignore this message.</p>
<a href="${confirmUrl}" style="display:inline-block;background:#E8614A;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:4px;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Confirm Subscription</a>
</div>
</div>`,
    });
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: "Could not send confirmation email. Try again shortly." }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true, message: "Almost there — check your inbox to confirm your subscription." }) };
};
