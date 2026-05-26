import {
  jsonResponse,
  sendDemoCallFollowUpEmail,
  validateDemoCallFollowUp,
  type Env,
} from "../_lib/flow";

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  if (!env.RESEND_API_KEY) {
    console.warn("Resend is not configured — demo call follow-up email cannot be sent");
    return jsonResponse(
      { message: "Follow-up email delivery is not configured." },
      503,
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateDemoCallFollowUp(payload);

  if (validation.ok === false) {
    return jsonResponse({ message: validation.message }, 400);
  }

  try {
    await sendDemoCallFollowUpEmail(env, validation.data);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Failed to send demo call follow-up email", error);
    return jsonResponse(
      { message: "Unable to send follow-up email right now." },
      503,
    );
  }
};
