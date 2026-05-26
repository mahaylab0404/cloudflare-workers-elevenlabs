import {
  buildDemoEmail,
  jsonResponse,
  missingEnv,
  sendInternalEmail,
  validateDemoRequest,
  type Env,
} from "../_lib/flow";

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const missing = missingEnv(env, ["DEMO_INBOX_TO", "RESEND_API_KEY"]);
  if (missing.length > 0) {
    console.warn("Demo request routing is not configured", { missing });
    return jsonResponse(
      {
        message:
          "Demo request routing is being finalized. Please call the live demo line or try again shortly.",
      },
      503,
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateDemoRequest(payload);

  if (validation.ok === false) {
    return jsonResponse({ message: validation.message }, 400);
  }

  try {
    await sendInternalEmail(env, buildDemoEmail(validation.data));
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Failed to send demo request email", error);
    return jsonResponse(
      { message: "Unable to route your request right now. Please try again shortly." },
      503,
    );
  }
};
