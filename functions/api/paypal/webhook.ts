import {
  buildPayPalWebhookEmail,
  cioTrackEvent,
  getPayPalPlanKeyById,
  jsonResponse,
  missingEnv,
  sendInternalEmail,
  verifyPayPalWebhookSignature,
  type Env,
  type PayPalWebhookEvent,
} from "../../_lib/flow";

const handledEvents = new Set([
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "PAYMENT.SALE.COMPLETED",
]);

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const missing = missingEnv(env, [
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_WEBHOOK_ID",
  ]);

  if (missing.length > 0) {
    console.warn("PayPal webhook verification is not configured", { missing });
    return jsonResponse({ message: "PayPal webhook is not configured." }, 503);
  }

  const event = (await request.json().catch(() => null)) as PayPalWebhookEvent | null;

  if (!event?.event_type) {
    return jsonResponse({ message: "Invalid PayPal webhook payload." }, 400);
  }

  const verification = await verifyPayPalWebhookSignature(env, request.headers, event);
  if (verification.ok === false) {
    return jsonResponse({ message: verification.message }, 400);
  }

  if (!handledEvents.has(event.event_type)) {
    console.info("PayPal webhook ignored", {
      eventId: event.id,
      type: event.event_type,
    });
    return jsonResponse({ received: true, type: event.event_type });
  }

  try {
    await reconcilePayPalEvent(env, event);
  } catch (error) {
    console.error("PayPal webhook handler error", error);
    return jsonResponse({ message: "PayPal webhook handling failed." }, 500);
  }

  return jsonResponse({ received: true, type: event.event_type });
};

async function reconcilePayPalEvent(
  env: Env,
  event: PayPalWebhookEvent,
): Promise<void> {
  const resource = event.resource || {};
  const resourceId = stringValue(resource.id);
  const paypalPlanId = stringValue(resource.plan_id);
  const planKey = paypalPlanId ? getPayPalPlanKeyById(env, paypalPlanId) : "";
  const subscriptionId =
    stringValue(resource.billing_agreement_id) || resourceId || "unknown";

  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      if (paypalPlanId && !planKey) {
        console.warn("PayPal subscription event ignored for unknown plan", {
          eventId: event.id,
          paypalPlanId,
          subscriptionId,
        });
        return;
      }

      await updateSubscriptionStatus(env, {
        subscriptionId,
        status: stringValue(resource.status),
        event,
      });
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
      if (paypalPlanId && !planKey) {
        console.warn("PayPal subscription event ignored for unknown plan", {
          eventId: event.id,
          paypalPlanId,
          subscriptionId,
        });
        return;
      }

      await updateSubscriptionStatus(env, {
        subscriptionId,
        status: stringValue(resource.status),
        event,
      });
      break;
    case "PAYMENT.SALE.COMPLETED":
      await recordCompletedPayment(env, {
        event,
        saleId: resourceId,
        subscriptionId,
      });
      break;
  }

  if (env.DEMO_INBOX_TO && env.RESEND_API_KEY) {
    await sendInternalEmail(env, buildPayPalWebhookEmail(event));
  }
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

async function updateSubscriptionStatus(
  env: Env,
  {
    event,
    status,
    subscriptionId,
  }: {
    event: PayPalWebhookEvent;
    status: string;
    subscriptionId: string;
  },
): Promise<void> {
  console.info("PayPal subscription status update", {
    eventId: event.id,
    status,
    subscriptionId,
  });

  const subscriber = event.resource && typeof event.resource === "object"
    ? event.resource.subscriber
    : undefined;
  const email =
    subscriber && typeof subscriber === "object"
      ? (subscriber as Record<string, unknown>).email_address
      : undefined;

  if (typeof email === "string" && email) {
    const cioEvent =
      event.event_type === "BILLING.SUBSCRIPTION.ACTIVATED"
        ? "subscription_activated"
        : "subscription_cancelled";
    await cioTrackEvent(env, email, cioEvent, {
      subscription_id: subscriptionId,
      status,
    });
  }
}

async function recordCompletedPayment(
  env: Env,
  {
    event,
    saleId,
    subscriptionId,
  }: {
    event: PayPalWebhookEvent;
    saleId: string;
    subscriptionId: string;
  },
): Promise<void> {
  console.info("PayPal subscription payment completed", {
    eventId: event.id,
    saleId,
    subscriptionId,
  });

  const subscriber = event.resource && typeof event.resource === "object"
    ? event.resource.subscriber
    : undefined;
  const email =
    subscriber && typeof subscriber === "object"
      ? (subscriber as Record<string, unknown>).email_address
      : undefined;

  if (typeof email === "string" && email) {
    await cioTrackEvent(env, email, "payment_completed", {
      subscription_id: subscriptionId,
      sale_id: saleId,
    });
  }
}
