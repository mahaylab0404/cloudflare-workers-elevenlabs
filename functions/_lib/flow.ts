import {
  callVolumeOptions,
  followUpWindowOptions,
  isOneOf,
  livePilotPriceLabel,
  painPointOptions,
  pilotPlanIds,
  pilotPlans,
  practiceTypeOptions,
  trialDurationDays,
  type DemoRequestPayload,
  type MissedRevenueReportPayload,
  type PilotCheckoutPayload,
  type PilotPlanId,
  type PayPalSubscriptionApprovalPayload,
} from "../../src/lib/flow";

const DEFAULT_FROM_EMAIL = "CayesDesk <onboarding@resend.dev>";
const WEEKS_PER_MONTH = 4.33;
const ANNUAL_CAYESDESK_COST = 11988;
const RECEPTIONIST_SALARY_BENCHMARK = 44640;
export { pilotPlans, trialDurationDays };

export type Env = {
  DEMO_BOOKING_URL?: string;
  DEMO_INBOX_TO?: string;
  eleven_labs_agent_tools?: KVNamespace;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_ENVIRONMENT?: string;
  PAYPAL_PLAN_BOUTIQUE?: string;
  PAYPAL_PLAN_PREMIER?: string;
  PAYPAL_PLAN_CONCIERGE?: string;
  PAYPAL_WEBHOOK_ID?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ELEVENLABS_WEBHOOK_SECRET?: string;
  WEBHOOK_NOTIFICATION_EMAIL?: string;
  CUSTOMERIO_SITE_ID?: string;
  CUSTOMERIO_API_KEY?: string;
};

export type DemoCallFollowUpPayload = {
  callId: string;
  callerPhone: string;
  callEndedAt: string;
  transcriptSummary: string;
};

type Result<T> = { ok: true; data: T } | { ok: false; message: string };

function fail<T>(message: string): Result<T> {
  return { ok: false, message };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\u0000/g, "")
    .slice(0, maxLength);
}

function requireString(
  record: Record<string, unknown>,
  field: string,
  label: string,
  maxLength: number,
): Result<string> {
  const value = cleanText(record[field], maxLength);

  if (!value) {
    return { ok: false, message: `${label} is required.` };
  }

  return { ok: true, data: value };
}

function optionalString(
  record: Record<string, unknown>,
  field: string,
  maxLength: number,
): string {
  return cleanText(record[field], maxLength);
}

function requireEmail(
  record: Record<string, unknown>,
  field: string,
  label: string,
): Result<string> {
  const value = cleanText(record[field], 160).toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (!isValid) {
    return { ok: false, message: `${label} must be a valid email address.` };
  }

  return { ok: true, data: value };
}

function requirePhone(
  record: Record<string, unknown>,
  field: string,
  label: string,
): Result<string> {
  const value = cleanText(record[field], 40);
  const digits = value.replace(/\D/g, "");

  if (digits.length < 7) {
    return { ok: false, message: `${label} must be a valid phone number.` };
  }

  return { ok: true, data: value };
}

function optionalPhone(
  record: Record<string, unknown>,
  field: string,
  label: string,
): Result<string> {
  const value = cleanText(record[field], 40);

  if (!value) {
    return { ok: true, data: "" };
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length < 7) {
    return { ok: false, message: `${label} must be a valid phone number.` };
  }

  return { ok: true, data: value };
}

function requireNumber(
  record: Record<string, unknown>,
  field: string,
  label: string,
  min: number,
  max: number,
): Result<number> {
  const value = Number(record[field]);

  if (!Number.isFinite(value) || value < min || value > max) {
    return { ok: false, message: `${label} must be between ${min} and ${max}.` };
  }

  return { ok: true, data: value };
}

function requireOption<T extends readonly string[]>(
  record: Record<string, unknown>,
  field: string,
  label: string,
  options: T,
): Result<T[number]> {
  const value = cleanText(record[field], 120);

  if (!isOneOf(value, options)) {
    return { ok: false, message: `${label} must be selected from the available options.` };
  }

  return { ok: true, data: value };
}

function requirePlanId(
  record: Record<string, unknown>,
): Result<PilotPlanId> {
  const value = cleanText(record.planId, 40);

  if (!isOneOf(value, pilotPlanIds)) {
    return { ok: false, message: "Plan must be Boutique, Premier, or Concierge." };
  }

  return { ok: true, data: value };
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function parseRecipients(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validateDemoRequest(payload: unknown): Result<DemoRequestPayload> {
  if (!isRecord(payload)) {
    return { ok: false, message: "Invalid request payload." };
  }

  const practiceName = requireString(payload, "practiceName", "Practice name", 160);
  if (practiceName.ok === false) return fail(practiceName.message);

  const practiceType = requireOption(payload, "practiceType", "Practice type", practiceTypeOptions);
  if (practiceType.ok === false) return fail(practiceType.message);

  const cityRegion = requireString(payload, "cityRegion", "City / region", 120);
  if (cityRegion.ok === false) return fail(cityRegion.message);

  const contactName = requireString(payload, "contactName", "Contact name", 120);
  if (contactName.ok === false) return fail(contactName.message);

  const role = requireString(payload, "role", "Role", 120);
  if (role.ok === false) return fail(role.message);

  const workEmail = requireEmail(payload, "workEmail", "Work email");
  if (workEmail.ok === false) return fail(workEmail.message);

  const phone = requirePhone(payload, "phone", "Phone");
  if (phone.ok === false) return fail(phone.message);

  const callVolumeBand = requireOption(
    payload,
    "callVolumeBand",
    "Call volume",
    callVolumeOptions,
  );
  if (callVolumeBand.ok === false) return fail(callVolumeBand.message);

  const primaryPainPoint = requireOption(
    payload,
    "primaryPainPoint",
    "Primary front desk pain point",
    painPointOptions,
  );
  if (primaryPainPoint.ok === false) return fail(primaryPainPoint.message);

  const preferredFollowUpWindow = requireOption(
    payload,
    "preferredFollowUpWindow",
    "Preferred follow-up window",
    followUpWindowOptions,
  );
  if (preferredFollowUpWindow.ok === false) return fail(preferredFollowUpWindow.message);

  return {
    ok: true,
    data: {
      practiceName: practiceName.data,
      practiceType: practiceType.data,
      cityRegion: cityRegion.data,
      contactName: contactName.data,
      role: role.data,
      workEmail: workEmail.data,
      phone: phone.data,
      callVolumeBand: callVolumeBand.data,
      primaryPainPoint: primaryPainPoint.data,
      preferredFollowUpWindow: preferredFollowUpWindow.data,
      notes: optionalString(payload, "notes", 1200),
    },
  };
}

export function validateMissedRevenueReport(
  payload: unknown,
): Result<MissedRevenueReportPayload> {
  if (!isRecord(payload)) {
    return { ok: false, message: "Invalid request payload." };
  }

  const practiceName = requireString(payload, "practiceName", "Practice name", 160);
  if (practiceName.ok === false) return fail(practiceName.message);

  const practiceType = requireOption(payload, "practiceType", "Practice type", practiceTypeOptions);
  if (practiceType.ok === false) return fail(practiceType.message);

  const workEmail = requireEmail(payload, "workEmail", "Work email");
  if (workEmail.ok === false) return fail(workEmail.message);

  const phone = optionalPhone(payload, "phone", "Phone");
  if (phone.ok === false) return fail(phone.message);

  const missedCallsPerWeek = requireNumber(
    payload,
    "missedCallsPerWeek",
    "Missed calls per week",
    1,
    50,
  );
  if (missedCallsPerWeek.ok === false) return fail(missedCallsPerWeek.message);

  const averageCaseValue = requireNumber(
    payload,
    "averageCaseValue",
    "Average case value",
    500,
    100000,
  );
  if (averageCaseValue.ok === false) return fail(averageCaseValue.message);

  const closeRatePercent = requireNumber(
    payload,
    "closeRatePercent",
    "Close rate",
    1,
    90,
  );
  if (closeRatePercent.ok === false) return fail(closeRatePercent.message);

  const monthlyOpportunity = Math.round(
    missedCallsPerWeek.data *
      WEEKS_PER_MONTH *
      averageCaseValue.data *
      (closeRatePercent.data / 100),
  );

  return {
    ok: true,
    data: {
      annualCayesDeskCost: ANNUAL_CAYESDESK_COST,
      annualReceptionistSalaryBenchmark: RECEPTIONIST_SALARY_BENCHMARK,
      averageCaseValue: averageCaseValue.data,
      closeRatePercent: closeRatePercent.data,
      missedCallsPerWeek: missedCallsPerWeek.data,
      monthlyOpportunity,
      notes: optionalString(payload, "notes", 1200),
      phone: phone.data,
      practiceName: practiceName.data,
      practiceType: practiceType.data,
      workEmail: workEmail.data,
    },
  };
}

export function validateDemoCallFollowUp(
  payload: unknown,
): Result<DemoCallFollowUpPayload> {
  if (!isRecord(payload)) {
    return { ok: false, message: "Invalid request payload." };
  }

  const callerPhone = requirePhone(payload, "callerPhone", "Caller phone");
  if (callerPhone.ok === false) return fail(callerPhone.message);

  return {
    ok: true,
    data: {
      callId: optionalString(payload, "callId", 120) || "unknown",
      callerPhone: callerPhone.data,
      callEndedAt:
        optionalString(payload, "callEndedAt", 80) || new Date().toISOString(),
      transcriptSummary: optionalString(payload, "transcriptSummary", 600),
    },
  };
}

export async function sendDemoCallFollowUpEmail(
  env: Env,
  payload: DemoCallFollowUpPayload,
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error("Email delivery is not configured.");
  }

  const subject = "Thanks for speaking with CayesDesk";
  const text = [
    "Hi there,",
    "",
    "Thanks for your time on the call today. We'd love to help your practice stop missing high-value calls.",
    "",
    "View our flat-rate plans: https://cayesdesk.com/pricing",
    "",
    payload.transcriptSummary ? `Call summary: ${payload.transcriptSummary}` : "",
    "",
    "— The CayesDesk Team",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#191c1d;max-width:600px;">
      <h1 style="font-family:Manrope,Inter,Arial,sans-serif;color:#002147;font-size:22px;">Thanks for speaking with CayesDesk</h1>
      <p style="line-height:1.6;">We'd love to help your practice stop missing high-value calls.</p>
      <p style="margin:24px 0;">
        <a href="https://cayesdesk.com/pricing" style="background:#002147;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">View Our Plans</a>
      </p>
      ${payload.transcriptSummary ? `<p style="color:#44474e;font-size:14px;line-height:1.6;"><strong>Call summary:</strong> ${escapeHtml(payload.transcriptSummary)}</p>` : ""}
      <p style="color:#44474e;line-height:1.6;">— The CayesDesk Team</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: [payload.callerPhone],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${body}`);
  }
}

export function validatePilotCheckout(payload: unknown): Result<PilotCheckoutPayload> {
  if (!isRecord(payload)) {
    return { ok: false, message: "Invalid request payload." };
  }

  const planId = requirePlanId(payload);
  if (planId.ok === false) return fail(planId.message);

  const practiceName = requireString(payload, "practiceName", "Practice name", 160);
  if (practiceName.ok === false) return fail(practiceName.message);

  const practiceType = requireOption(payload, "practiceType", "Practice type", practiceTypeOptions);
  if (practiceType.ok === false) return fail(practiceType.message);

  const cityRegion = requireString(payload, "cityRegion", "City / region", 120);
  if (cityRegion.ok === false) return fail(cityRegion.message);

  const contactName = requireString(payload, "contactName", "Contact name", 120);
  if (contactName.ok === false) return fail(contactName.message);

  const role = requireString(payload, "role", "Role", 120);
  if (role.ok === false) return fail(role.message);

  const workEmail = requireEmail(payload, "workEmail", "Work email");
  if (workEmail.ok === false) return fail(workEmail.message);

  const phone = requirePhone(payload, "phone", "Phone");
  if (phone.ok === false) return fail(phone.message);

  const callVolumeBand = requireOption(
    payload,
    "callVolumeBand",
    "Call volume",
    callVolumeOptions,
  );
  if (callVolumeBand.ok === false) return fail(callVolumeBand.message);

  return {
    ok: true,
    data: {
      planId: planId.data,
      practiceName: practiceName.data,
      practiceType: practiceType.data,
      cityRegion: cityRegion.data,
      contactName: contactName.data,
      role: role.data,
      workEmail: workEmail.data,
      phone: phone.data,
      callVolumeBand: callVolumeBand.data,
      notes: optionalString(payload, "notes", 1200),
    },
  };
}

export function validatePayPalSubscriptionApproval(
  payload: unknown,
): Result<PayPalSubscriptionApprovalPayload> {
  if (!isRecord(payload)) {
    return { ok: false, message: "Invalid request payload." };
  }

  const checkout = validatePilotCheckout(payload);
  if (checkout.ok === false) return fail(checkout.message);

  const subscriptionId = requireString(
    payload,
    "subscriptionId",
    "PayPal subscription ID",
    120,
  );
  if (subscriptionId.ok === false) return fail(subscriptionId.message);

  return {
    ok: true,
    data: {
      ...checkout.data,
      subscriptionId: subscriptionId.data,
      orderId: optionalString(payload, "orderId", 120),
    },
  };
}

export function missingEnv(env: Env, keys: Array<keyof Env>): string[] {
  return keys.filter((key) => !env[key]);
}

export async function sendInternalEmail(
  env: Env,
  {
    subject,
    heading,
    rows,
    footer,
  }: {
    subject: string;
    heading: string;
    rows: Array<[label: string, value: string]>;
    footer?: string;
  },
): Promise<void> {
  const recipients = parseRecipients(env.DEMO_INBOX_TO);

  if (!env.RESEND_API_KEY || recipients.length === 0) {
    throw new Error("Email delivery is not configured.");
  }

  const text = [heading, "", ...rows.map(([label, value]) => `${label}: ${value}`)]
    .concat(footer ? ["", footer] : [])
    .join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 12px;font-weight:700;border-bottom:1px solid #e5e7eb;width:190px;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#191c1d;">
      <h1 style="font-family:Manrope,Inter,Arial,sans-serif;color:#002147;font-size:24px;margin-bottom:16px;">${escapeHtml(
        heading,
      )}</h1>
      <table style="border-collapse:collapse;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
        <tbody>${htmlRows}</tbody>
      </table>
      ${
        footer
          ? `<p style="margin-top:16px;color:#44474e;line-height:1.6;">${escapeHtml(footer)}</p>`
          : ""
      }
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: recipients,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${body}`);
  }
}

export function buildDemoEmail(data: DemoRequestPayload): {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  footer: string;
} {
  return {
    subject: `[CayesDesk Demo Request] ${data.practiceName}`,
    heading: "New CayesDesk demo request",
    rows: [
      ["Practice name", data.practiceName],
      ["Practice type", data.practiceType],
      ["City / region", data.cityRegion],
      ["Contact name", data.contactName],
      ["Role", data.role],
      ["Work email", data.workEmail],
      ["Phone", data.phone],
      ["Call volume", data.callVolumeBand],
      ["Primary pain point", data.primaryPainPoint],
      ["Preferred follow-up", data.preferredFollowUpWindow],
      ["Notes", data.notes || "None provided"],
    ],
    footer:
      "This form is intended for business-side workflow planning only. It should not contain PHI.",
  };
}

export function buildMissedRevenueReportEmail(
  data: MissedRevenueReportPayload,
): {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  footer: string;
} {
  return {
    subject: `[CayesDesk Missed Revenue Report] ${data.practiceName}`,
    heading: "New missed-revenue calculator lead",
    rows: [
      ["Practice name", data.practiceName],
      ["Practice type", data.practiceType],
      ["Work email", data.workEmail],
      ["Phone", data.phone || "Not provided"],
      ["Missed calls per week", String(data.missedCallsPerWeek)],
      ["Average case value", `$${data.averageCaseValue.toLocaleString("en-US")}`],
      ["Close rate", `${data.closeRatePercent}%`],
      ["Monthly opportunity", `$${data.monthlyOpportunity.toLocaleString("en-US")}`],
      ["Annual CayesDesk cost", `$${data.annualCayesDeskCost.toLocaleString("en-US")}`],
      [
        "Receptionist salary benchmark",
        `$${data.annualReceptionistSalaryBenchmark.toLocaleString("en-US")}+ before benefits`,
      ],
      ["Notes", data.notes || "None provided"],
    ],
    footer:
      "This calculator is intended for business-side revenue planning only. It should not contain PHI.",
  };
}

export function buildPilotStartedEmail(
  payload: Record<string, string>,
): {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  footer: string;
} {
  const planId = payload.plan_id as PilotPlanId | undefined;
  const planTitle = planId && planId in pilotPlans ? pilotPlans[planId].title : payload.plan_name || "Pilot plan";

  return {
    subject: `[CayesDesk Pilot Started] ${payload.practice_name || "Unknown clinic"}`,
    heading: "New PayPal subscription approved",
    rows: [
      ["Plan", planTitle],
      ["Practice name", payload.practice_name || "Unknown"],
      ["Practice type", payload.practice_type || "Unknown"],
      ["City / region", payload.city_region || "Unknown"],
      ["Contact name", payload.contact_name || "Unknown"],
      ["Role", payload.role || "Unknown"],
      ["Work email", payload.work_email || "Unknown"],
      ["Phone", payload.phone || "Unknown"],
      ["Call volume", payload.call_volume_band || "Unknown"],
      ["Notes", payload.notes || "None provided"],
      ["Source", payload.source || "start-pilot"],
    ],
    footer:
      `PayPal approved the subscription. The plan should include the ${livePilotPriceLabel} ${trialDurationDays}-day live pilot, Month 1 credit if the practice continues, and monthly renewal billing configured in PayPal Business.`,
  };
}

export function buildPayPalSubscriptionApprovedEmail(
  data: PayPalSubscriptionApprovalPayload,
): {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  footer: string;
} {
  const plan = pilotPlans[data.planId];

  return {
    subject: `[CayesDesk PayPal Subscription] ${data.practiceName}`,
    heading: "New PayPal subscription approved",
    rows: [
      ["Subscription", data.subscriptionId],
      ["PayPal order", data.orderId || "Not provided"],
      ["Plan", plan.title],
      ["Practice name", data.practiceName],
      ["Practice type", data.practiceType],
      ["City / region", data.cityRegion],
      ["Contact name", data.contactName],
      ["Role", data.role],
      ["Work email", data.workEmail],
      ["Phone", data.phone],
      ["Call volume", data.callVolumeBand],
      ["Notes", data.notes || "None provided"],
    ],
    footer:
      `The PayPal plan owns billing, the ${livePilotPriceLabel} ${trialDurationDays}-day live pilot, Month 1 credit if the practice continues, and monthly renewal billing.`,
  };
}

export type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  summary?: string;
  create_time?: string;
  resource?: Record<string, unknown>;
};

type PayPalSubscriptionDetails = {
  id?: string;
  plan_id?: string;
  status?: string;
  custom_id?: string;
};

type PayPalAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type PayPalVerificationResponse = {
  verification_status?: string;
};

export function getPayPalApiBase(env: Env): string {
  return env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function getConfiguredPayPalPlanIds(env: Env): Record<PilotPlanId, string> {
  return {
    boutique: env.PAYPAL_PLAN_BOUTIQUE || "",
    premier: env.PAYPAL_PLAN_PREMIER || "",
    concierge: env.PAYPAL_PLAN_CONCIERGE || "",
  };
}

export function getExpectedPayPalPlanId(
  env: Env,
  planId: PilotPlanId,
): string {
  return getConfiguredPayPalPlanIds(env)[planId];
}

export function getPayPalPlanKeyById(
  env: Env,
  paypalPlanId: string,
): PilotPlanId | "" {
  const normalized = paypalPlanId.trim();
  const configured = getConfiguredPayPalPlanIds(env);

  return (
    (Object.entries(configured).find(
      ([, configuredPlanId]) => configuredPlanId === normalized,
    )?.[0] as PilotPlanId | undefined) || ""
  );
}

export async function getPayPalAccessToken(env: Env): Promise<string> {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal API credentials are not configured.");
  }

  const response = await fetch(`${getPayPalApiBase(env)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const json = (await response.json().catch(() => null)) as PayPalAccessTokenResponse | null;

  if (!response.ok || !json?.access_token) {
    throw new Error(json?.error_description || json?.error || "PayPal authentication failed.");
  }

  return json.access_token;
}

export async function paypalApiRequest<T>(
  env: Env,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = await getPayPalAccessToken(env);
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${getPayPalApiBase(env)}${path}`, {
    ...init,
    headers,
  });
  const json = (await response.json().catch(() => null)) as T | { message?: string; name?: string } | null;

  if (!response.ok) {
    const maybeError = json as { message?: string; name?: string } | null;
    throw new Error(maybeError?.message || maybeError?.name || "PayPal request failed.");
  }

  return json as T;
}

export async function verifyPayPalSubscriptionApproval(
  env: Env,
  data: PayPalSubscriptionApprovalPayload,
): Promise<Result<PayPalSubscriptionDetails>> {
  const missing = missingEnv(env, ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"]);
  if (missing.length > 0) {
    return {
      ok: false,
      message: `PayPal subscription verification is not configured: ${missing.join(", ")}.`,
    };
  }

  const expectedPlanId = getExpectedPayPalPlanId(env, data.planId);
  if (!expectedPlanId) {
    return {
      ok: false,
      message: `${pilotPlans[data.planId].paypalPlanEnvKey} is not configured.`,
    };
  }

  const subscription = await paypalApiRequest<PayPalSubscriptionDetails>(
    env,
    `/v1/billing/subscriptions/${encodeURIComponent(data.subscriptionId)}`,
  );

  if (subscription.id && subscription.id !== data.subscriptionId) {
    return { ok: false, message: "PayPal subscription ID mismatch." };
  }

  if (subscription.plan_id !== expectedPlanId) {
    return { ok: false, message: "PayPal subscription plan mismatch." };
  }

  const expectedCustomId = `cayesdesk-${data.planId}`;
  if (subscription.custom_id && subscription.custom_id !== expectedCustomId) {
    return { ok: false, message: "PayPal subscription custom ID mismatch." };
  }

  const allowedApprovalStatuses = new Set(["APPROVAL_PENDING", "APPROVED", "ACTIVE"]);
  if (!subscription.status || !allowedApprovalStatuses.has(subscription.status)) {
    return {
      ok: false,
      message: `PayPal subscription status is ${subscription.status || "unknown"}.`,
    };
  }

  return { ok: true, data: subscription };
}

export async function verifyPayPalWebhookSignature(
  env: Env,
  headers: Headers,
  event: PayPalWebhookEvent,
): Promise<Result<true>> {
  if (!env.PAYPAL_WEBHOOK_ID) {
    return { ok: false, message: "PayPal webhook ID is not configured." };
  }

  const verificationPayload = {
    auth_algo: headers.get("paypal-auth-algo") || "",
    cert_url: headers.get("paypal-cert-url") || "",
    transmission_id: headers.get("paypal-transmission-id") || "",
    transmission_sig: headers.get("paypal-transmission-sig") || "",
    transmission_time: headers.get("paypal-transmission-time") || "",
    webhook_id: env.PAYPAL_WEBHOOK_ID,
    webhook_event: event,
  };

  const missing = Object.entries(verificationPayload)
    .filter(([key, value]) => key !== "webhook_event" && !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    return { ok: false, message: `Missing PayPal webhook headers: ${missing.join(", ")}.` };
  }

  const verification = await paypalApiRequest<PayPalVerificationResponse>(
    env,
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify(verificationPayload),
    },
  );

  return verification.verification_status === "SUCCESS"
    ? { ok: true, data: true }
    : { ok: false, message: "PayPal webhook signature verification failed." };
}

export function buildPayPalWebhookEmail(event: PayPalWebhookEvent): {
  subject: string;
  heading: string;
  rows: Array<[string, string]>;
  footer: string;
} {
  const resource = isRecord(event.resource) ? event.resource : {};
  const subscriber = isRecord(resource.subscriber) ? resource.subscriber : {};
  const amount = isRecord(resource.amount) ? resource.amount : {};

  return {
    subject: `[CayesDesk PayPal Webhook] ${event.event_type || "Unknown event"}`,
    heading: "PayPal billing event received",
    rows: [
      ["Event", event.event_type || "Unknown"],
      ["Event ID", event.id || "Unknown"],
      ["Summary", event.summary || "None provided"],
      ["Resource ID", recordString(resource, "id")],
      ["Status", recordString(resource, "status")],
      ["Plan ID", recordString(resource, "plan_id")],
      ["Custom ID", recordString(resource, "custom_id")],
      ["Subscriber email", recordString(subscriber, "email_address")],
      ["Amount", formatPayPalAmount(amount)],
    ],
    footer:
      "Use this event to reconcile the user or clinic database status for PayPal subscriptions and completed subscription payments.",
  };
}

function recordString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" && value ? value : "Unknown";
}

function formatPayPalAmount(amount: Record<string, unknown>): string {
  const value = typeof amount.value === "string" ? amount.value : "";
  const currency = typeof amount.currency_code === "string" ? amount.currency_code : "";

  return value && currency ? `${currency} ${value}` : "Unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const CIO_TRACK_BASE = "https://track.customer.io/api/v1";

function cioAuthHeader(env: Env): string {
  return "Basic " + btoa(`${env.CUSTOMERIO_SITE_ID}:${env.CUSTOMERIO_API_KEY}`);
}

export async function cioIdentify(
  env: Env,
  identifier: string,
  attributes: Record<string, unknown>,
): Promise<void> {
  if (!env.CUSTOMERIO_SITE_ID || !env.CUSTOMERIO_API_KEY) return;

  await fetch(`${CIO_TRACK_BASE}/customers/${encodeURIComponent(identifier)}`, {
    method: "PUT",
    headers: {
      Authorization: cioAuthHeader(env),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(attributes),
  });
}

export type KillSwitchPayload = {
  phone_number: string;
  reason: string;
};

export function validateKillSwitch(payload: unknown): Result<KillSwitchPayload> {
  if (!isRecord(payload)) return fail("Invalid request payload.");

  const phone = requirePhone(payload, "phone_number", "Phone number");
  if (!phone.ok) return fail(phone.message);

  const reason = requireString(payload, "reason", "Reason", 500);
  if (!reason.ok) return fail(reason.message);

  return { ok: true, data: { phone_number: phone.data, reason: reason.data } };
}

export async function executeKillSwitch(
  env: Env,
  payload: KillSwitchPayload,
): Promise<void> {
  const scrubbed = payload.phone_number.replace(/\D/g, "");

  // Write to KV do-not-call list
  if (env.eleven_labs_agent_tools) {
    await env.eleven_labs_agent_tools.put(
      scrubbed,
      JSON.stringify({
        phone_number: payload.phone_number,
        reason: payload.reason,
        scrubbed_at: new Date().toISOString(),
      }),
    );
  } else {
    console.warn("DO_NOT_CALL_LIST KV binding is not configured — number not stored.");
  }

  // Notify the team via email
  if (env.RESEND_API_KEY && env.DEMO_INBOX_TO) {
    const recipients = parseRecipients(env.DEMO_INBOX_TO);
    if (recipients.length > 0) {
      const subject = `[Kill Switch] ${payload.phone_number} removed from outbound campaign`;
      const text = [
        "A prospect triggered the kill switch during an outbound call.",
        "",
        `Phone: ${payload.phone_number}`,
        `Reason: ${payload.reason}`,
        `Timestamp: ${new Date().toISOString()}`,
      ].join("\n");

      const html = `
        <div style="font-family:Inter,Arial,sans-serif;color:#191c1d;">
          <h1 style="font-family:Manrope,Inter,Arial,sans-serif;color:#9b0000;font-size:22px;">Kill Switch Triggered</h1>
          <p style="line-height:1.6;">A prospect has been removed from the outbound campaign.</p>
          <table style="border-collapse:collapse;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tbody>
              <tr><td style="padding:10px 12px;font-weight:700;border-bottom:1px solid #e5e7eb;width:140px;">Phone</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(payload.phone_number)}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:700;border-bottom:1px solid #e5e7eb;">Reason</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(payload.reason)}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:700;">Timestamp</td><td style="padding:10px 12px;">${new Date().toISOString()}</td></tr>
            </tbody>
          </table>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
          to: recipients,
          subject,
          text,
          html,
        }),
      });
    }
  }
}

export async function cioTrackEvent(
  env: Env,
  identifier: string,
  eventName: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!env.CUSTOMERIO_SITE_ID || !env.CUSTOMERIO_API_KEY) return;

  await fetch(
    `${CIO_TRACK_BASE}/customers/${encodeURIComponent(identifier)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: cioAuthHeader(env),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: eventName, data }),
    },
  );
}
