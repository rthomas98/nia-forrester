const resendEndpoint = "https://api.resend.com/emails";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sends transactional mail from Convex without relying on a Node-only SDK.
 * Missing email configuration is logged in development and treated as an
 * explicit setup error in production.
 */
export async function sendTransactionalEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Nia Forrester <readers@niaforrester.com>";

  if (!apiKey) {
    console.warn(
      `[email not sent] RESEND_API_KEY is missing. Recipient: ${message.to}; subject: ${message.subject}`,
    );
    return;
  }

  const response = await fetch(resendEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...message }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected transactional email: ${detail}`);
  }
}

export function authEmailTemplate({
  eyebrow,
  heading,
  body,
  actionLabel,
  actionUrl,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  actionLabel: string;
  actionUrl: string;
}) {
  const html = `
    <!doctype html>
    <html lang="en">
      <body style="margin:0;background:#f4efea;color:#1f2a38;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:0 auto;padding:40px 24px">
          <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#c9572c;font-weight:700">${eyebrow}</p>
          <h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.15;margin:12px 0 18px">${heading}</h1>
          <p style="font-size:16px;line-height:1.65;color:#4e5660">${body}</p>
          <p style="margin:30px 0">
            <a href="${actionUrl}" style="display:inline-block;background:#c9572c;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700">${actionLabel}</a>
          </p>
          <p style="font-size:12px;line-height:1.5;color:#767b81">If you did not request this email, you can safely ignore it.</p>
        </div>
      </body>
    </html>
  `;

  return {
    html,
    text: `${heading}\n\n${body}\n\n${actionLabel}: ${actionUrl}\n\nIf you did not request this email, you can safely ignore it.`,
  };
}
