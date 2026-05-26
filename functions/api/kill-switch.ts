import {
  executeKillSwitch,
  jsonResponse,
  validateKillSwitch,
  type Env,
} from "../_lib/flow";

export const onRequestPost = async ({
  request,
  env,
  ctx,
}: {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
}): Promise<Response> => {
  const payload = await request.json().catch(() => null);

  // Return 200 immediately — ElevenLabs must not be kept waiting or the agent freezes on the call
  ctx.waitUntil(
    (async () => {
      const validation = validateKillSwitch(payload);
      if (!validation.ok) {
        console.error("Kill switch payload invalid:", validation.message);
        return;
      }

      try {
        await executeKillSwitch(env, validation.data);
      } catch (error) {
        console.error("Failed to execute kill switch", error);
      }
    })(),
  );

  return jsonResponse({ ok: true });
};
