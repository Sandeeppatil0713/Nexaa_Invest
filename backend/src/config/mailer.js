import { MailtrapClient } from "mailtrap";

/**
 * Mailtrap Sending API client.
 * SDK defaults to https://send.api.mailtrap.io — no endpoint config needed.
 *
 * From address must be a verified domain OR use demomailtrap.co (pre-verified).
 * To verify your own domain: Mailtrap → Sending → Domains → Add Domain.
 */
const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

export const FROM = {
  name:  process.env.MAIL_FROM_NAME    ?? "NexaInvest",
  email: process.env.MAIL_FROM_ADDRESS ?? "hello@demomailtrap.co",
};

/**
 * Send an email via Mailtrap Sending API.
 * Fire-and-forget — never throws so a mail failure never blocks the response.
 */
export async function sendEmail({ to, name, subject, html }) {
  try {
    const result = await client.send({
      from:    FROM,
      to:      [{ email: to, name: name ?? to }],
      subject,
      html,
    });
    console.log(`📧  Email sent → ${to} [${subject}] id:${result.message_ids?.[0] ?? "?"}`);
  } catch (err) {
    console.error(`❌  Email failed → ${to} [${subject}]:`, err?.message ?? JSON.stringify(err));
  }
}
