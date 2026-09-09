import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

// 1. WEBHOOK VERIFICATION (GET)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    // Meta requires the raw challenge string, not JSON
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// 2. RECEIVE MESSAGES & REPLY (POST)
export async function POST(request) {
  try {
    const signatureHeader = request.headers.get("x-hub-signature-256");
    const appSecret = process.env.WA_APP_SECRET;

    if (!appSecret) {
      console.error("Webhook rejected: WA_APP_SECRET is not configured");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!signatureHeader) {
      console.error("Webhook rejected: missing signature header");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.text();
    if (!isValidWhatsAppSignature(rawBody, signatureHeader, appSecret)) {
      console.error("Webhook rejected: invalid signature");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);

    // Verify this is a WhatsApp event
    if (body.object === "whatsapp_business_account") {
      
      // The payload is deeply nested
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // Ensure it is an actual incoming message
      if (value?.messages && value?.messages[0]) {
        const message = value.messages[0];
        
        // Extract the phone number and the message text from the webhook payload
        const from = message.from; 
        const msg_body = message.text?.body; 

        if (msg_body) {
          // Process the message and send a reply
          await sendWhatsAppMessage(from, `I received your message: "${msg_body}"`);
        }
      }
    }

    // Always return 200 OK immediately
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error", {
      message: error?.message,
      name: error?.name,
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function isValidWhatsAppSignature(rawBody, signatureHeader, appSecret) {
  if (!signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = `sha256=${createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex")}`;

  const signatureBuffer = Buffer.from(signatureHeader, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

// 3. HELPER FUNCTION TO SEND REPLIES
async function sendWhatsAppMessage(phoneNumber, messageText) {
  // Use the Cloud API endpoint
  const url = `https://graph.facebook.com/v21.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;

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

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.WA_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorMessage;
    let errorCode;
    try {
      const errorData = await response.json();
      errorMessage = errorData?.error?.message;
      errorCode = errorData?.error?.code;
    } catch {
      errorMessage = "Unable to parse API error response";
    }

    console.error("Failed to send WhatsApp message", {
      status: response.status,
      errorMessage,
      errorCode,
    });
  }
}