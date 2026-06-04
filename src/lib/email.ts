import nodemailer, { type Transporter } from "nodemailer";

// SMTP-configuratie komt uit environment variables (zie .env.example / Vercel).
// Niet geconfigureerd? Dan wordt de mail overgeslagen en blijft de aanmelding
// gewoon in de database staan (zichtbaar in /admin).

export interface IntakeEmailData {
  name: string;
  phone: string;
  email?: string;
  postcode: string;
  careType: string;
  forWhom: string;
  situation?: string;
  preferredDays: string[];
  preferredTime: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null; // SMTP niet (volledig) geconfigureerd

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
    });
  }
  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendIntakeNotification(
  data: IntakeEmailData
): Promise<{ sent: boolean; reason?: string }> {
  const tx = getTransporter();
  if (!tx) {
    console.warn(
      "[email] SMTP niet geconfigureerd — aanmeldmail overgeslagen (aanmelding wel opgeslagen)."
    );
    return { sent: false, reason: "not_configured" };
  }

  const to = process.env.SMTP_TO || "info@parkstadthuiszorg.nl";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const rows: Array<[string, string]> = [
    ["Naam", data.name],
    ["Telefoon", data.phone],
    ["E-mail", data.email || "—"],
    ["Postcode", data.postcode],
    ["Soort zorg", data.careType],
    ["Voor wie", data.forWhom],
    ["Voorkeursdagen", data.preferredDays.join(", ") || "—"],
    ["Voorkeurstijd", data.preferredTime || "—"],
    ["Situatie", data.situation || "—"],
  ];

  const text =
    `Nieuwe aanmelding via de website:\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nBel deze aanmelder binnen 1 werkdag terug.`;

  const html = `
    <div style="font-family: Arial, sans-serif; color:#1f3a34; max-width:600px;">
      <h2 style="color:#064a54; margin-bottom:4px;">Nieuwe aanmelding via de website</h2>
      <p style="color:#4f6b6f; margin-top:0;">Bel deze aanmelder bij voorkeur binnen 1 werkdag terug.</p>
      <table style="border-collapse:collapse; width:100%; margin-top:12px;">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 10px; border:1px solid #dce8de; background:#f2f7f3; font-weight:bold; width:160px; vertical-align:top;">${escapeHtml(
              k
            )}</td>
            <td style="padding:8px 10px; border:1px solid #dce8de;">${escapeHtml(
              v
            )}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="color:#9aa; font-size:12px; margin-top:16px;">Automatisch verzonden door parkstadthuiszorg.nl</p>
    </div>`;

  await tx.sendMail({
    from,
    to,
    replyTo: data.email || undefined,
    subject: `Nieuwe aanmelding — ${data.name}`,
    text,
    html,
  });

  return { sent: true };
}
