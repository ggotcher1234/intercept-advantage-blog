const { adminClient } = require("./_lib/supabase");
const { shell } = require("./_lib/theme");

function page(title, message) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: shell({
      title: `${title} | Intercept Advantage`,
      bodyHtml: `<div class="wrap" style="padding:100px 24px;text-align:center;max-width:560px;margin:0 auto"><h1 style="margin-bottom:16px">${title}</h1><p style="color:#555;margin-bottom:32px">${message}</p><a href="/insights" style="font-weight:600">&larr; Back to Insights</a></div>`,
    }),
  };
}

exports.handler = async function (event) {
  const token = (event.queryStringParameters && event.queryStringParameters.token) || "";
  if (!token) return page("Invalid link", "This unsubscribe link is missing its token.");

  const supabase = adminClient();
  const { data: subscriber } = await supabase.from("subscribers").select("*").eq("token", token).maybeSingle();

  if (!subscriber) return page("Invalid link", "We couldn't find a subscription matching this link.");

  await supabase.from("subscribers").update({ status: "unsubscribed" }).eq("id", subscriber.id);

  return page("You're unsubscribed", "You won't receive any more emails from Insights. Sorry to see you go.");
};
