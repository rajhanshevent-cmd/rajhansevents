import { NextResponse } from "next/server";
import crypto from "crypto";

// 1. WEBHOOK VERIFICATION (GET)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_VERIFY_TOKEN;

  if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
    // Meta requires the raw challenge string
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// 2. RECEIVE MESSAGES & REPLY (POST)
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const appSecret = process.env.WA_APP_SECRET;

    // Cryptographic signature verification if secret is configured
    if (appSecret) {
      const signature = request.headers.get("x-hub-signature-256");
      if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }

      const expectedSignature = `sha256=${crypto
        .createHmac("sha256", appSecret)
        .update(rawBody)
        .digest("hex")}`;

      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        sigBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.warn(
        "[Security Warning] WA_APP_SECRET is not configured. Webhook payloads cannot be verified."
      );
    }

    const body = JSON.parse(rawBody);

    // Verify this is a WhatsApp event
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages && value?.messages[0]) {
        const message = value.messages[0];
        const from = message.from; 
        const msg_body = message.text?.body; 

        if (from && msg_body && process.env.WA_PHONE_NUMBER_ID && process.env.WA_ACCESS_TOKEN) {
          await sendWhatsAppMessage(from, `Thank you for contacting Raj Hansh Events. We received your message: "${msg_body}". Our team will assist you shortly.`);
        }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 3. HELPER FUNCTION TO SEND REPLIES
async function sendWhatsAppMessage(phoneNumber, messageText) {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const accessToken = process.env.WA_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return;
  }

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "text",
    text: {
      preview_url: false,
      body: messageText
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send WhatsApp message:", errorData);
    }
  } catch (err) {
    console.error("WhatsApp Cloud API Network Error:", err);
  }
}
