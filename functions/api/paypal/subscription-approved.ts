import {
  buildPayPalSubscriptionApprovedEmail,
  cioIdentify,
  cioTrackEvent,
  jsonResponse,
  sendInternalEmail,
  trialDurationDays,
  validatePayPalSubscriptionApproval,
  verifyPayPalSubscriptionApproval,
  type Env,
} from "../../_lib/flow";

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const payload = await request.json().catch(() => null);
  const validation = validatePayPalSubscriptionApproval(payload);

  if (validation.ok === false) {
    return jsonResponse({ message: validation.message }, 400);
  }

  try {
    const verification = await verifyPayPalSubscriptionApproval(env, validation.data);
    if (verification.ok === false) {
      const status = verification.message.includes("configured") ? 503 : 400;
      return jsonResponse({ message: verification.message }, status);
    }

    console.info("PayPal subscription verified", {
      planId: validation.data.planId,
      status: verification.data.status,
      subscriptionId: validation.data.subscriptionId,
    });

    const d = validation.data;
    const pilotEnds = new Date(
      Date.now() + trialDurationDays * 24 * 60 * 60 * 1000,
    ).toISOString();
    await cioIdentify(env, d.workEmail, {
      email: d.workEmail,
      clinic_name: d.practiceName,
      practice_type: d.practiceType,
      selected_plan: d.planId,
      phone: d.phone,
      city_region: d.cityRegion,
      contact_name: d.contactName,
      role: d.role,
      subscription_status: "pilot",
      paypal_subscription_id: d.subscriptionId,
      pilot_started_at: new Date().toISOString(),
      pilot_ends_at: pilotEnds,
      lead_source: "start-pilot",
    });
    await cioTrackEvent(env, d.workEmail, "pilot_started", {
      plan: d.planId,
      subscription_id: d.subscriptionId,
      pilot_ends_at: pilotEnds,
    });
  } catch (error) {
    console.error("Failed to verify PayPal subscription approval", error);
    return jsonResponse(
      { message: "Unable to verify PayPal subscription approval." },
      502,
    );
  }

  if (!env.DEMO_INBOX_TO || !env.RESEND_API_KEY) {
    console.info("PayPal subscription approved", {
      planId: validation.data.planId,
      practiceName: validation.data.practiceName,
      subscriptionId: validation.data.subscriptionId,
    });
    return jsonResponse({ ok: true });
  }

  try {
    await sendInternalEmail(env, buildPayPalSubscriptionApprovedEmail(validation.data));
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Failed to route PayPal subscription approval", error);
    return jsonResponse(
      { message: "The subscription was approved, but onboarding routing failed." },
      202,
    );
  }
};
