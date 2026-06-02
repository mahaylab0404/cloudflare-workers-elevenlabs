/**
 * Cloudflare Worker — CayesDesk Voice Agent Backend
 *
 * Tool endpoints for the ElevenLabs voice agent (Aria):
 *   /capture-lead        — emails lead summary to owners via SendGrid
 *   /send-booking-link   — emails Calendly link to prospect + notifies owners
 *   /api/kill-switch     — scrubs phone from outbound campaign (KV + email alert)
 *
 * Required secrets:
 *   SENDGRID_API_KEY   — SendGrid API key
 *   FROM_EMAIL         — verified SendGrid sender address
 *
 * KV binding:
 *   eleven_labs_agent_tools — do-not-call list
 */

const OWNER_EMAILS = ['hello@cayesdesk.com', 'admin@caytral.com'];
const LEAD_TO_EMAIL = 'admin@caytral.com';
const FROM_EMAIL = 'hello@cayesdesk.com';
const BOOKING_LINK = 'https://calendar.app.google/G4e2xwxJSjt4bt8p6';
const BOOKING_TEMPLATE_ID = 'd-97cf691457bf4eb2910dc6736d3c449c';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const isApiRoute =
      path === '/capture-lead' ||
      path === '/send-booking-link' ||
      path === '/api/kill-switch';

    if (isApiRoute) {
      console.log(`[${path}] SENDGRID_API_KEY set: ${!!env.SENDGRID_API_KEY}, FROM_EMAIL set: ${!!env.FROM_EMAIL}`);
    }

    if (!isApiRoute) {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON', 400);
    }

    if (path === '/capture-lead') return handleCaptureLead(body, env);
    if (path === '/send-booking-link') return handleSendBookingLink(body, env);
    if (path === '/api/kill-switch') return handleKillSwitch(body, env, ctx);
  },
};

// ─── Tool Handlers ────────────────────────────────────────────────────────────

async function handleCaptureLead(body, env) {
  const { name, email, phone, service_interest } = body?.parameters || body;

  if (!name || !email || !phone) {
    return jsonError('Missing required fields: name, email, phone', 400);
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const tier = service_interest || 'Not specified';

  const emailBody = `
New Lead from Aria (CayesDesk Voice Agent)
-------------------------------------------
Name:             ${name}
Email:            ${email}
Phone:            ${phone}
Service Interest: ${tier}
Captured At:      ${timestamp} ET
-------------------------------------------
Follow up within 1 business day.
`.trim();

  try {
    await sendEmail(env, {
      to: [LEAD_TO_EMAIL],
      subject: `New CayesDesk Lead — ${name}`,
      text: emailBody,
    });

    return jsonOk({ success: true, message: 'Lead captured' });
  } catch (err) {
    console.error('capture_lead error:', err);
    return jsonError(`Failed to capture lead: ${err.message}`, 500);
  }
}

async function handleSendBookingLink(body, env) {
  const { name, email } = body?.parameters || body;

  if (!email) {
    return jsonError('Missing required field: email', 400);
  }

  const displayName = name && name !== 'there' ? name : 'there';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const ownerEmailBody = `
Booking Link Sent via Aria
-------------------------------------------
Prospect Name:  ${displayName}
Prospect Email: ${email}
Sent At:        ${timestamp} ET
Calendly Link:  ${BOOKING_LINK}
-------------------------------------------
`.trim();

  try {
    await Promise.all([
      sendTemplateEmail(env, {
        to: email,
        subject: 'Your CayesDesk Discovery Call Link',
        templateId: BOOKING_TEMPLATE_ID,
        dynamicData: {
          display_name: displayName,
          booking_link: BOOKING_LINK,
        },
      }),
      sendEmail(env, {
        to: OWNER_EMAILS,
        subject: `Booking Link Sent — ${displayName} (${email})`,
        text: ownerEmailBody,
      }),
    ]);

    return jsonOk({ success: true, message: 'Booking link sent' });
  } catch (err) {
    console.error('send_booking_link error:', err);
    return jsonError(`Failed to send booking link: ${err.message}`, 500);
  }
}

async function handleKillSwitch(body, env, ctx) {
  const params = body?.parameters || body;
  const phone_number = params?.phone_number;
  const reason = params?.reason;

  if (!phone_number) {
    return jsonError('Missing required field: phone_number', 400);
  }

  // Return 200 immediately — ElevenLabs must not be kept waiting or the agent freezes on the call
  ctx.waitUntil(
    (async () => {
      const scrubbed = phone_number.replace(/\D/g, '');
      const timestamp = new Date().toISOString();

      // Write to KV do-not-call list
      if (env.eleven_labs_agent_tools) {
        await env.eleven_labs_agent_tools.put(
          scrubbed,
          JSON.stringify({ phone_number, reason: reason || 'Not provided', scrubbed_at: timestamp }),
        );
      } else {
        console.warn('eleven_labs_agent_tools KV binding not configured');
      }

      // Notify the team
      try {
        await sendEmail(env, {
          to: OWNER_EMAILS,
          subject: `[Kill Switch] ${phone_number} removed from outbound campaign`,
          text: `
Kill Switch Triggered
-------------------------------------------
Phone:     ${phone_number}
Reason:    ${reason || 'Not provided'}
Timestamp: ${timestamp}
-------------------------------------------
This number has been added to the do-not-call list.
          `.trim(),
        });
      } catch (err) {
        console.error('Kill switch email failed:', err);
      }
    })(),
  );

  return jsonOk({ success: true, message: 'Number scrubbed' });
}

// ─── SendGrid Helper ──────────────────────────────────────────────────────────

async function sendEmail(env, { to, subject, text }) {
  const recipients = Array.isArray(to) ? to : [to];

  const payload = {
    personalizations: recipients.map((email) => ({ to: [{ email }] })),
    from: { email: FROM_EMAIL, name: 'Aria at CayesDesk' },
    subject,
    content: [{ type: 'text/plain', value: text }],
    tracking_settings: {
      click_tracking: { enable: false },
      open_tracking: { enable: false },
    },
  };

  const response = await fetchWithTimeout(
    'https://api.sendgrid.com/v3/mail/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(payload),
    },
    8000
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SendGrid error ${response.status}: ${err}`);
  }
}

async function sendTemplateEmail(env, { to, subject, templateId, dynamicData }) {
  const payload = {
    personalizations: [{ to: [{ email: to }], dynamic_template_data: dynamicData }],
    from: { email: FROM_EMAIL, name: 'Aria at CayesDesk' },
    subject,
    template_id: templateId,
    tracking_settings: {
      click_tracking: { enable: false },
      open_tracking: { enable: false },
    },
  };

  const response = await fetchWithTimeout(
    'https://api.sendgrid.com/v3/mail/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(payload),
    },
    8000
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SendGrid error ${response.status}: ${err}`);
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function jsonOk(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message, status = 400) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}
