import {
  jsonResponse,
  missingEnv,
  type Env,
} from "../_lib/flow";

/* ------------------------------------------------------------------ */
/*  ElevenLabs Post-Call Webhook Receiver                             */
/*  Receives post_call_transcription events, formats the transcript,  */
/*  and emails it to admin@caytral.com via Resend.                    */
/* ------------------------------------------------------------------ */

const DEFAULT_FROM_EMAIL = "CayesDesk <onboarding@resend.dev>";

/* ---------- HMAC signature verification (ElevenLabs format) ------- */

function parseElevenLabsSignature(
  header: string,
): { timestamp: number; signatures: string[] } | null {
  const chunks = header.split(",").map((part) => part.trim());
  const timestampChunk = chunks.find((part) => part.startsWith("t="));
  const signatureChunks = chunks
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
    .filter(Boolean);

  if (!timestampChunk || signatureChunks.length === 0) {
    return null;
  }

  const timestamp = Number.parseInt(timestampChunk.slice(2), 10);
  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return { timestamp, signatures: signatureChunks };
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

async function verifyElevenLabsSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string | undefined,
): Promise<{ ok: boolean; message?: string }> {
  if (!secret) {
    console.warn("ELEVENLABS_WEBHOOK_SECRET not configured — skipping HMAC verification.");
    return { ok: true };
  }

  if (!signatureHeader) {
    return { ok: false, message: "Missing ElevenLabs-Signature header." };
  }

  const parsed = parseElevenLabsSignature(signatureHeader);
  if (!parsed) {
    return { ok: false, message: "Invalid ElevenLabs-Signature header." };
  }

  const maxSkewInSeconds = 300;
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - parsed.timestamp) > maxSkewInSeconds) {
    return { ok: false, message: "Signature timestamp outside allowed window." };
  }

  const message = `${parsed.timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  const expected = toHex(digest);
  const isValid = parsed.signatures.some((sig) => timingSafeEqual(sig, expected));

  return isValid
    ? { ok: true }
    : { ok: false, message: "HMAC signature verification failed." };
}

/* ---------- HTML email formatting --------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface TranscriptEntry {
  role: string;
  message: string;
  time_in_call_secs?: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function formatTranscriptHtml(transcript: TranscriptEntry[]): string {
  if (!transcript || transcript.length === 0) {
    return "<p><em>No transcript available.</em></p>";
  }

  return transcript
    .map((entry) => {
      const isAgent = entry.role === "agent";
      const label = isAgent ? "CayesDesk Concierge" : "Caller";
      const bgColor = isAgent ? "#f0f4ff" : "#f9fafb";
      const borderColor = isAgent ? "#4f6ef7" : "#d1d5db";
      const timestamp = entry.time_in_call_secs !== undefined
        ? `<span style="color:#6b7280;font-size:12px;margin-left:8px;">[${formatDuration(entry.time_in_call_secs)}]</span>`
        : "";

      return `
        <div style="padding:12px 16px;margin-bottom:8px;border-left:4px solid ${borderColor};background:${bgColor};border-radius:0 8px 8px 0;">
          <div style="font-weight:700;font-size:13px;color:#374151;margin-bottom:4px;">${label}${timestamp}</div>
          <div style="font-size:14px;color:#1f2937;line-height:1.6;">${escapeHtml(entry.message)}</div>
        </div>`;
    })
    .join("");
}

function buildWebhookEmail(
  callerPhone: string,
  callSummary: string,
  transcript: TranscriptEntry[],
  conversationId: string,
  callDuration: number | null,
  collectedData: Record<string, string>,
): { subject: string; html: string; text: string } {
  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const durationStr = callDuration ? formatDuration(callDuration) : "Unknown";

  // Collected data rows
  const collectedRows = Object.entries(collectedData).length > 0
    ? Object.entries(collectedData)
        .map(
          ([key, value]) =>
            `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:160px;text-transform:capitalize;">${escapeHtml(key.replace(/_/g, " "))}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`,
        )
        .join("")
    : "";

  const subject = `[CayesDesk Call] ${callerPhone || "Unknown Caller"} - ${now}`;

  const html = `
    <div style="font-family:'Inter','Segoe UI',Arial,sans-serif;color:#191c1d;max-width:680px;margin:0 auto;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#002147 0%,#1a3a6b 100%);padding:28px 32px;border-radius:16px 16px 0 0;">
        <h1 style="color:#ffffff;font-size:22px;margin:0;font-family:'Manrope','Inter',Arial,sans-serif;">New Call Transcript</h1>
        <p style="color:#94b3d7;font-size:14px;margin:8px 0 0 0;">CayesDesk Intelligent Patient Concierge - cayesdesk.com</p>
      </div>

      <!-- Call Details Card -->
      <div style="background:#ffffff;border:1px solid #e5e7eb;padding:24px 32px;">
        <h2 style="font-size:16px;color:#002147;margin:0 0 16px 0;font-family:'Manrope','Inter',Arial,sans-serif;">Call Details</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tbody>
            <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:160px;">Caller Phone</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:16px;font-weight:700;color:#002147;">${escapeHtml(callerPhone || "Unknown")}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:160px;">Date & Time</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(now)}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:160px;">Duration</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(durationStr)}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:160px;">Conversation ID</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;font-family:monospace;color:#6b7280;">${escapeHtml(conversationId)}</td></tr>
          </tbody>
        </table>
      </div>

      ${collectedRows ? `
      <!-- Collected Data -->
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px 32px;">
        <h2 style="font-size:16px;color:#002147;margin:0 0 16px 0;font-family:'Manrope','Inter',Arial,sans-serif;">Collected Information</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tbody>${collectedRows}</tbody>
        </table>
      </div>
      ` : ""}

      <!-- Call Summary -->
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px 32px;">
        <h2 style="font-size:16px;color:#002147;margin:0 0 12px 0;font-family:'Manrope','Inter',Arial,sans-serif;">Call Summary</h2>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;line-height:1.7;color:#334155;">
          ${escapeHtml(callSummary || "No summary generated.")}
        </div>
      </div>

      <!-- Full Transcript -->
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px 32px;border-radius:0 0 16px 16px;">
        <h2 style="font-size:16px;color:#002147;margin:0 0 16px 0;font-family:'Manrope','Inter',Arial,sans-serif;">Full Transcript</h2>
        ${formatTranscriptHtml(transcript)}
      </div>

      <!-- Footer -->
      <div style="text-align:center;padding:20px;color:#9ca3af;font-size:12px;">
        Powered by CayesDesk. This email was generated by the post-call webhook.
      </div>
    </div>
  `;

  // Plain text fallback
  const textTranscript = transcript
    .map((entry) => `[${entry.role === "agent" ? "CayesDesk" : "Caller"}] ${entry.message}`)
    .join("\n");

  const text = [
    "New Call Transcript - CayesDesk",
    "",
    `Caller: ${callerPhone || "Unknown"}`,
    `Date: ${now}`,
    `Duration: ${durationStr}`,
    `Conversation ID: ${conversationId}`,
    "",
    "--- SUMMARY ---",
    callSummary || "No summary generated.",
    "",
    "--- TRANSCRIPT ---",
    textTranscript || "No transcript available.",
  ].join("\n");

  return { subject, html, text };
}

/* ---------- Webhook handler --------------------------------------- */

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env & {
    ELEVENLABS_WEBHOOK_SECRET?: string;
    WEBHOOK_NOTIFICATION_EMAIL?: string;
  };
}): Promise<Response> => {
  // 1. Validate required env vars
  const missing = missingEnv(env, ["RESEND_API_KEY"]);
  if (missing.length > 0) {
    console.error("Webhook email delivery not configured", { missing });
    return jsonResponse({ error: "Server misconfigured" }, 503);
  }

  const notifyEmail = env.WEBHOOK_NOTIFICATION_EMAIL || "admin@caytral.com";

  // 2. Read raw body for HMAC verification
  const rawBody = await request.text();

  // 3. Verify HMAC signature
  const signatureHeader = request.headers.get("elevenlabs-signature");
  const verification = await verifyElevenLabsSignature(
    rawBody,
    signatureHeader,
    env.ELEVENLABS_WEBHOOK_SECRET,
  );

  if (!verification.ok) {
    console.error("ElevenLabs HMAC verification failed:", verification.message);
    return jsonResponse({ error: verification.message }, 401);
  }

  // 4. Parse the webhook payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const eventType = payload.type as string | undefined;

  // Only process post_call_transcription events
  if (eventType !== "post_call_transcription") {
    console.log(`Ignoring event type: ${eventType}`);
    return jsonResponse({ ok: true, message: `Ignored event type: ${eventType}` });
  }

  // 5. Extract data from the payload
  const data = (payload.data || {}) as Record<string, unknown>;
  const conversationId = (data.conversation_id || payload.conversation_id || "unknown") as string;

  // Transcript
  const transcript = (data.transcript || []) as TranscriptEntry[];

  // Analysis
  const analysis = (data.analysis || {}) as Record<string, unknown>;
  const callSummary = (analysis.transcript_summary || analysis.summary || "") as string;
  const collectedData = (analysis.data_collection || analysis.collected_data || {}) as Record<string, string>;
  const callSuccessful = analysis.call_successful as string | undefined;

  // Caller phone number
  const metadata = (data.metadata || {}) as Record<string, unknown>;
  const phoneInfo = (data.phone_call || metadata.phone_call || {}) as Record<string, unknown>;
  const callerPhone = (phoneInfo.external_number ||
    phoneInfo.caller_number ||
    data.external_number ||
    metadata.caller_phone ||
    "Unknown") as string;

  // Call duration
  const callDuration = (data.call_duration_secs || data.duration || null) as number | null;

  // Add call_successful to collected data for email context
  const enrichedCollectedData = { ...collectedData };
  if (callSuccessful !== undefined) {
    enrichedCollectedData["Call Outcome"] = callSuccessful;
  }

  // 6. Build and send the email
  const { subject, html, text } = buildWebhookEmail(
    callerPhone,
    callSummary,
    transcript,
    conversationId,
    callDuration,
    enrichedCollectedData,
  );

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: [notifyEmail],
        subject,
        html,
        text,
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error("Resend API error:", errorBody);
      return jsonResponse({ error: "Failed to send email notification" }, 502);
    }

    console.log(`Call transcript emailed to ${notifyEmail} for conversation ${conversationId}`);
    return jsonResponse({ ok: true, conversation_id: conversationId });
  } catch (error) {
    console.error("Failed to send webhook email:", error);
    return jsonResponse({ error: "Email delivery failed" }, 502);
  }
};
