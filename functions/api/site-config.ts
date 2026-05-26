import { jsonResponse, type Env } from "../_lib/flow";

function normalizeExternalUrl(value: string | undefined): string {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export const onRequestGet = async ({
  env,
}: {
  env: Env;
}): Promise<Response> => {
  return jsonResponse({
    demoBookingUrl: normalizeExternalUrl(env.DEMO_BOOKING_URL),
    paypal: {
      clientId: env.PAYPAL_CLIENT_ID || "",
      environment: env.PAYPAL_ENVIRONMENT === "live" ? "live" : "sandbox",
      planIds: {
        boutique: env.PAYPAL_PLAN_BOUTIQUE || "",
        premier: env.PAYPAL_PLAN_PREMIER || "",
        concierge: env.PAYPAL_PLAN_CONCIERGE || "",
      },
    },
  });
};
