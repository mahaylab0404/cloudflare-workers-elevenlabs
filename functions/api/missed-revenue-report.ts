import {
  buildMissedRevenueReportEmail,
  jsonResponse,
  missingEnv,
  sendInternalEmail,
  validateMissedRevenueReport,
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
    console.warn("Missed-revenue report routing is not configured", { missing });
    return jsonResponse(
      {
        message:
          "Report routing is being finalized. Please call the live demo line or try again shortly.",
      },
      503,
    );
  }

  const payload = await request.json().catch(() => null);
  const validation = validateMissedRevenueReport(payload);

  if (validation.ok === false) {
    return jsonResponse({ message: validation.message }, 400);
  }

  try {
    await sendInternalEmail(env, buildMissedRevenueReportEmail(validation.data));
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Failed to send missed-revenue report email", error);
    return jsonResponse(
      { message: "Unable to route your report right now. Please try again shortly." },
      503,
    );
  }
};
