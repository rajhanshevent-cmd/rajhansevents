import { Resend } from "resend";

/**
 * Lazy-initialized Resend client singleton
 */
let resendInstance = null;

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || apiKey === "re_123456789_abcdef") {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export const EMAIL_CONFIG = {
  get fromEmail() {
    return (
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Raj Hansh Events <onboarding@resend.dev>"
    );
  },
  get adminEmail() {
    return (
      process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
      process.env.ADMIN_EMAIL?.trim() ||
      "rajhanshevent@gmail.com"
    );
  },
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    process.env.CALENDLY_URL ||
    "https://calendly.com/rajhanshevent/30min",
  phone: "+91 90060 89331",
  cleanPhone: "919006089331",
  whatsappPhone: "+91 99050 02293",
  whatsappCleanPhone: "919905002293",
  address: "Maa Aamdmai Nagar, Kathitand, Ratu, Ranchi, Jharkhand 835222",
  websiteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://rajhanshevent.com",
};

/**
 * Format date nicely for email display
 */
function formatEmailDate(dateStr) {
  if (!dateStr) return "To be finalized";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Luxury HTML Template: Admin Notification Email
 */
function renderAdminNotificationHtml({
  name,
  email,
  phone,
  eventType,
  eventDate,
  guests,
  budget,
  message,
  id,
}) {
  const cleanClientPhone = phone ? phone.replace(/\D/g, "") : "";
  const whatsappLink = cleanClientPhone
    ? `https://wa.me/${cleanClientPhone.length === 10 ? "91" + cleanClientPhone : cleanClientPhone}?text=${encodeURIComponent(
        `Hello ${name}, thank you for reaching out to Raj Hansh Events regarding your ${eventType || "upcoming event"}. We are delighted to assist you!`
      )}`
    : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event Enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A202C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F5F4F0;padding:30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);border:1px solid #E2D9CC;">
          
          <!-- Royal Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0B192C 0%, #1B2B44 100%);padding:36px 30px;text-align:center;border-bottom:3px solid #D4AF37;">
              <div style="color:#D4AF37;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:6px;">Royal Inquiries Desk</div>
              <h1 style="color:#FFFFFF;margin:0;font-size:24px;font-weight:700;letter-spacing:1px;">RAJ HANSH EVENTS</h1>
              <p style="color:#D4AF37;margin:6px 0 0 0;font-size:13px;font-style:italic;">New Client Celebration Enquiry Received</p>
            </td>
          </tr>

          <!-- High-Priority Badge -->
          <tr>
            <td style="padding:24px 30px 0 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FFF9E6;border-left:4px solid #D4AF37;border-radius:6px;padding:12px 16px;">
                <tr>
                  <td>
                    <span style="font-size:14px;color:#7B1A28;font-weight:700;">🌟 Event Type:</span>
                    <strong style="font-size:15px;color:#0B192C;margin-left:6px;">${eventType || "Celebration"}</strong>
                    ${id ? `<span style="float:right;font-size:12px;color:#718096;font-family:monospace;">#ENQ-${id}</span>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client Details Grid -->
          <tr>
            <td style="padding:20px 30px;">
              <h3 style="margin:0 0 14px 0;font-size:15px;color:#7B1A28;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #E2E8F0;padding-bottom:6px;">
                Client Information
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="font-size:14px;color:#2D3748;">
                <tr>
                  <td width="32%" style="font-weight:600;color:#718096;">Client Name:</td>
                  <td style="font-weight:700;color:#0B192C;">${name}</td>
                </tr>
                <tr style="background:#FBFBF9;">
                  <td style="font-weight:600;color:#718096;">Email Address:</td>
                  <td>
                    <a href="mailto:${email}" style="color:#0B192C;text-decoration:none;font-weight:600;">
                      ✉️ ${email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:#718096;">Phone Number:</td>
                  <td>
                    ${
                      phone
                        ? `<a href="tel:${phone.replace(/\s+/g, "")}" style="color:#0B192C;text-decoration:none;font-weight:600;">📞 ${phone}</a>`
                        : `<span style="color:#A0AEC0;">Not provided</span>`
                    }
                  </td>
                </tr>
              </table>

              <h3 style="margin:24px 0 14px 0;font-size:15px;color:#7B1A28;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #E2E8F0;padding-bottom:6px;">
                Celebration Details
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="font-size:14px;color:#2D3748;">
                <tr>
                  <td width="32%" style="font-weight:600;color:#718096;">Target Event Date:</td>
                  <td style="font-weight:700;color:#0B192C;">📅 ${formatEmailDate(eventDate)}</td>
                </tr>
                <tr style="background:#FBFBF9;">
                  <td style="font-weight:600;color:#718096;">Approx. Guests:</td>
                  <td style="color:#0B192C;">👥 ${guests || "To be discussed"}</td>
                </tr>
                <tr>
                  <td style="font-weight:600;color:#718096;">Budget Range:</td>
                  <td style="color:#0B192C;font-weight:600;">💰 ${budget || "Flexible"}</td>
                </tr>
              </table>

              <!-- Client Message / Vision -->
              <h3 style="margin:24px 0 10px 0;font-size:15px;color:#7B1A28;text-transform:uppercase;letter-spacing:1px;">
                Client Vision & Notes
              </h3>
              <div style="background:#FAF8F5;border:1px solid #E6DFD5;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#2D3748;white-space:pre-wrap;">${
                message ? message.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No additional notes provided."
              }</div>

              <!-- Quick Action Callouts -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        ${
                          whatsappLink
                            ? `<td style="padding:0 6px;">
                                <a href="${whatsappLink}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.5px;box-shadow:0 2px 6px rgba(37,211,102,0.3);">
                                  💬 Chat on WhatsApp
                                </a>
                              </td>`
                            : ""
                        }
                        <td style="padding:0 6px;">
                          <a href="mailto:${email}?subject=${encodeURIComponent(
                            `Raj Hansh Events — Your Enquiry for ${eventType || "Celebration"}`
                          )}" style="display:inline-block;background:#0B192C;color:#D4AF37;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.5px;border:1px solid #D4AF37;">
                            ✉️ Reply to Client
                          </a>
                        </td>
                        ${
                          phone
                            ? `<td style="padding:0 6px;">
                                <a href="tel:${phone.replace(/\s+/g, "")}" style="display:inline-block;background:#7B1A28;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:0.5px;">
                                  📞 Call Client
                                </a>
                              </td>`
                            : ""
                        }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0B192C;color:#A0AEC0;padding:20px 30px;font-size:12px;text-align:center;border-top:1px solid rgba(212,175,55,0.3);">
              <p style="margin:0 0 6px 0;color:#D4AF37;font-weight:600;">Raj Hansh Events Inquiries Management</p>
              <p style="margin:0 0 4px 0;">This enquiry was submitted directly through the official website.</p>
              <p style="margin:0;">Manage leads at <a href="${EMAIL_CONFIG.websiteUrl}/Manage" style="color:#D4AF37;text-decoration:underline;">CMS Dashboard</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Luxury HTML Template: Client Acknowledgement / Confirmation Email
 */
function renderClientAcknowledgementHtml({
  name,
  eventType,
  eventDate,
  guests,
  budget,
  message,
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Have Received Your Enquiry - Raj Hansh Events</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A202C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F5F4F0;padding:30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);border:1px solid #E2D9CC;">
          
          <!-- Royal Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0B192C 0%, #1B2B44 100%);padding:40px 30px;text-align:center;border-bottom:3px solid #D4AF37;">
              <div style="color:#D4AF37;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:8px;">Bespoke Celebrations & Luxury Decor</div>
              <h1 style="color:#FFFFFF;margin:0;font-size:26px;font-weight:700;letter-spacing:1.5px;">RAJ HANSH EVENTS</h1>
              <p style="color:#E2D9CC;margin:8px 0 0 0;font-size:13px;font-style:italic;">Creating royal experiences that linger for a lifetime.</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding:32px 32px 20px 32px;">
              <h2 style="color:#0B192C;margin:0 0 14px 0;font-size:20px;font-weight:700;">
                Dear ${name || "Esteemed Client"},
              </h2>
              <p style="font-size:15px;line-height:1.6;color:#4A5568;margin:0 0 16px 0;">
                Thank you for considering <strong>Raj Hansh Events</strong> for your upcoming <strong>${eventType || "celebration"}</strong>. We have received your consultation request, and our senior event design team is already reviewing your requirements.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#4A5568;margin:0 0 24px 0;">
                Every celebration we curate is treated with royal distinction, meticulous planning, and bespoke craftsmanship tailored to your unique taste.
              </p>

              <!-- Summary Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF8F5;border:1px solid #EADDC9;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <div style="color:#7B1A28;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;border-bottom:1px solid #E6DFD5;padding-bottom:6px;">
                      Your Celebration Summary
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="5" style="font-size:14px;color:#2D3748;">
                      <tr>
                        <td width="38%" style="color:#718096;font-weight:600;">Event Type:</td>
                        <td style="font-weight:700;color:#0B192C;">${eventType || "Celebration"}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:600;">Requested Date:</td>
                        <td style="color:#0B192C;">${formatEmailDate(eventDate)}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:600;">Approx. Guests:</td>
                        <td style="color:#0B192C;">${guests || "To be discussed"}</td>
                      </tr>
                      <tr>
                        <td style="color:#718096;font-weight:600;">Budget Range:</td>
                        <td style="color:#0B192C;">${budget || "Flexible"}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FFF9E6;border-left:4px solid #D4AF37;border-radius:6px;padding:16px;margin-bottom:28px;">
                <tr>
                  <td>
                    <div style="font-weight:700;color:#7B1A28;font-size:14px;margin-bottom:4px;">
                      ⏳ What happens next?
                    </div>
                    <p style="margin:0;font-size:13.5px;line-height:1.5;color:#4A5568;">
                      A dedicated senior event curator will contact you within <strong>24 hours</strong> to discuss your thematic vision, share relevant portfolios, and schedule your personalized consultation.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <div style="text-align:center;margin-bottom:28px;">
                <p style="font-size:13px;color:#718096;margin:0 0 12px 0;">Need immediate assistance or wish to reserve a priority consultation slot?</p>
                <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    <td style="padding:0 6px;">
                      <a href="https://wa.me/${EMAIL_CONFIG.whatsappCleanPhone}?text=${encodeURIComponent(
                        `Hello Raj Hansh Events, I recently submitted an enquiry for my ${eventType || "event"}. My name is ${name}.`
                      )}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:13.5px;font-weight:700;">
                        💬 WhatsApp Us Directly
                      </a>
                    </td>
                    <td style="padding:0 6px;">
                      <a href="${EMAIL_CONFIG.calendlyUrl}" target="_blank" style="display:inline-block;background:#0B192C;color:#D4AF37;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:13.5px;font-weight:700;border:1px solid #D4AF37;">
                        📅 Pick Slot on Calendar
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="font-size:14px;color:#4A5568;line-height:1.6;margin:0 0 4px 0;">
                Warm regards,
              </p>
              <p style="font-size:15px;color:#0B192C;font-weight:700;margin:0;">
                The Raj Hansh Events Team
              </p>
              <p style="font-size:13px;color:#718096;margin:2px 0 0 0;">
                Creating royal memories since 2018
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0B192C;color:#A0AEC0;padding:24px 30px;font-size:12px;text-align:center;border-top:1px solid rgba(212,175,55,0.3);">
              <p style="margin:0 0 6px 0;color:#D4AF37;font-weight:700;letter-spacing:1px;">RAJ HANSH EVENTS</p>
              <p style="margin:0 0 6px 0;">${EMAIL_CONFIG.address}</p>
              <p style="margin:0 0 6px 0;">
                Direct Call: <a href="tel:${EMAIL_CONFIG.cleanPhone}" style="color:#ffffff;text-decoration:none;">${EMAIL_CONFIG.phone}</a> | 
                WhatsApp: <a href="https://wa.me/${EMAIL_CONFIG.whatsappCleanPhone}" style="color:#25D366;text-decoration:none;">${EMAIL_CONFIG.whatsappPhone}</a> | 
                Email: <a href="mailto:${EMAIL_CONFIG.adminEmail}" style="color:#ffffff;text-decoration:none;">${EMAIL_CONFIG.adminEmail}</a>
              </p>
              <p style="margin:10px 0 0 0;font-size:11px;color:#718096;">
                <a href="${EMAIL_CONFIG.websiteUrl}" style="color:#D4AF37;text-decoration:underline;">Visit Official Website</a> &bull; 
                <a href="${EMAIL_CONFIG.websiteUrl}/privacy-policy" style="color:#A0AEC0;text-decoration:none;">Privacy Policy</a> &bull; 
                <a href="${EMAIL_CONFIG.websiteUrl}/terms-and-conditions" style="color:#A0AEC0;text-decoration:none;">Terms</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Luxury HTML Template: Resend Connection Test Email
 */
function renderTestEmailHtml({ timestamp }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Resend API Test</title></head>
<body style="margin:0;padding:0;background-color:#F5F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:550px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #E2D9CC;">
          <tr>
            <td style="background:#0B192C;padding:26px;text-align:center;border-bottom:3px solid #D4AF37;">
              <h2 style="color:#ffffff;margin:0;font-size:20px;">Resend API Integration Active</h2>
              <p style="color:#D4AF37;margin:6px 0 0 0;font-size:12px;">Raj Hansh Events Notification System</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;font-size:14px;color:#2D3748;line-height:1.6;">
              <p>✅ <strong>Congratulations!</strong> Your Resend API key is configured correctly and transactional emails are firing successfully.</p>
              <table role="presentation" width="100%" style="background:#FAF8F5;border:1px solid #E6DFD5;border-radius:6px;padding:12px;margin:16px 0;font-size:13px;">
                <tr><td><strong>Sender:</strong> ${EMAIL_CONFIG.fromEmail}</td></tr>
                <tr><td><strong>Recipient:</strong> ${EMAIL_CONFIG.adminEmail}</td></tr>
                <tr><td><strong>Dispatched At:</strong> ${timestamp}</td></tr>
              </table>
              <p style="color:#718096;font-size:12px;margin:0;">All client website inquiries will now automatically alert your team here.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send notification email to Admin desk
 */
export async function sendEnquiryNotificationEmail(enquiryData) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "[Resend Service]: RESEND_API_KEY is not configured. Skipping admin email dispatch."
    );
    return { success: false, skipped: true, reason: "NO_API_KEY" };
  }

  const { name, eventType } = enquiryData;
  const subject = `👑 New Event Enquiry: ${eventType || "Celebration"} — ${name || "Client"}`;

  try {
    const response = await resend.emails.send({
      from: EMAIL_CONFIG.fromEmail,
      to: EMAIL_CONFIG.adminEmail,
      subject,
      html: renderAdminNotificationHtml(enquiryData),
    });

    if (response.error) {
      console.error("[Resend Admin Email Error]:", response.error);
      return { success: false, error: response.error };
    }

    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error("[Resend Admin Email Exception]:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send acknowledgement email to the inquiring Client
 */
export async function sendClientAcknowledgementEmail(enquiryData) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "[Resend Service]: RESEND_API_KEY is not configured. Skipping client confirmation email."
    );
    return { success: false, skipped: true, reason: "NO_API_KEY" };
  }

  const { email, name } = enquiryData;
  if (!email) {
    return { success: false, skipped: true, reason: "NO_CLIENT_EMAIL" };
  }

  const subject = `✨ Thank you for choosing Raj Hansh Events — We've received your enquiry`;

  try {
    const response = await resend.emails.send({
      from: EMAIL_CONFIG.fromEmail,
      to: email,
      subject,
      html: renderClientAcknowledgementHtml(enquiryData),
    });

    if (response.error) {
      console.error("[Resend Client Email Error]:", response.error);
      return { success: false, error: response.error };
    }

    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error("[Resend Client Email Exception]:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches both Admin and Client emails concurrently.
 * Uses Promise.allSettled so that failures in one (e.g. unverified test domain)
 * do NOT prevent the other or fail the client inquiry.
 */
export async function sendEnquiryEmails(enquiryData) {
  const resend = getResendClient();
  if (!resend) {
    return {
      status: "mocked",
      message: "RESEND_API_KEY not configured. Mocking email delivery.",
      admin: { success: false, skipped: true },
      client: { success: false, skipped: true },
    };
  }

  const [adminResult, clientResult] = await Promise.allSettled([
    sendEnquiryNotificationEmail(enquiryData),
    sendClientAcknowledgementEmail(enquiryData),
  ]);

  const adminOutcome =
    adminResult.status === "fulfilled"
      ? adminResult.value
      : { success: false, error: adminResult.reason?.message };

  const clientOutcome =
    clientResult.status === "fulfilled"
      ? clientResult.value
      : { success: false, error: clientResult.reason?.message };

  return {
    status: "dispatched",
    admin: adminOutcome,
    client: clientOutcome,
  };
}

/**
 * Send a test email to verify Resend setup
 */
export async function sendTestEmail({ to = null } = {}) {
  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      error: "RESEND_API_KEY is not set or invalid in environment variables.",
    };
  }

  const recipient = to || EMAIL_CONFIG.adminEmail;
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  try {
    const response = await resend.emails.send({
      from: EMAIL_CONFIG.fromEmail,
      to: recipient,
      subject: `👑 Test Email: Raj Hansh Events Email Service (${now})`,
      html: renderTestEmailHtml({ timestamp: now }),
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    return { success: true, id: response.data?.id, to: recipient };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
