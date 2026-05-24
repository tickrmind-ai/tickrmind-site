type SendEmailInput = {
  html: string;
  replyTo?: string;
  subject: string;
  text: string;
  to: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

export const emailRoutes = {
  beta: process.env.BETA_EMAIL || "beta@tickrmind.com",
  hello: process.env.HELLO_EMAIL || "hello@tickrmind.com",
  support: process.env.SUPPORT_EMAIL || "support@tickrmind.com"
};

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendEmail({ html, replyTo, subject, text, to }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "TickrMind <hello@tickrmind.com>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const response = await fetch(RESEND_API_URL, {
    body: JSON.stringify({
      from,
      html,
      reply_to: replyTo,
      subject,
      text,
      to
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email provider failed: ${response.status} ${errorText}`);
  }
}
