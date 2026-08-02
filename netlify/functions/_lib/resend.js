// Thin wrapper around the Resend HTTP API (no SDK dependency — Netlify's
// Node 18 runtime has global fetch, so this needs nothing added to package.json).

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";

async function sendEmail({ to, subject, html }) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// emails: [{ to, subject, html }, ...]. Resend's batch endpoint caps at 100
// messages per call, so this chunks automatically for larger lists.
async function sendBatch(emails) {
  const results = [];
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100).map((e) => ({
      from: process.env.FROM_EMAIL,
      to: e.to,
      subject: e.subject,
      html: e.html,
    }));
    const res = await fetch(RESEND_BATCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      throw new Error(`Resend batch error ${res.status}: ${await res.text()}`);
    }
    results.push(await res.json());
  }
  return results;
}

module.exports = { sendEmail, sendBatch };
