import {
  AGENT_MAX_TOKENS,
  AGENT_TEMPERATURE,
  ElevenLabsClient,
  CONVERSATIONAL_TTS_SIMILARITY_BOOST,
  CONVERSATIONAL_TTS_STABILITY,
  CONVERSATIONAL_TTS_SPEED,
  CONVERSATIONAL_TURN_CONFIG,
  EXPRESSIVE_MODE_API_FIELD,
  EXPRESSIVE_MODE_ENABLED,
  EXPRESSIVE_TTS_MODEL_ID,
  FIRST_MESSAGE,
  KnowledgeBaseReference,
  RAG_CONFIG,
  RECOMMENDED_VOICE_ID,
  RECOMMENDED_VOICE_NAME,
  backupAgentConfig,
  getOptionalEnv,
  listAllKnowledgeBaseDocuments,
  readAgentPrompt,
  readKnowledgeBaseSources,
  promptPath,
  relativeFromApp,
  resolveAgentId,
} from "./shared.ts";

type AgentConfig = {
  name?: string;
  conversation_config?: {
    agent?: {
      first_message?: string;
      language?: string;
      prompt?: Record<string, unknown>;
      [key: string]: unknown;
    };
    conversation?: {
      client_events?: string[];
      [key: string]: unknown;
    };
    turn?: Record<string, unknown>;
    tts?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function mergeClientEvents(existingEvents: string[] | undefined) {
  return Array.from(new Set([...(existingEvents ?? []), "audio", "interruption"]));
}

async function main() {
  const client = new ElevenLabsClient();
  const agentId = await resolveAgentId(client);

  console.log(`Fetching ElevenLabs agent ${agentId}...`);
  const currentAgent = await client.request<AgentConfig>(`/convai/agents/${agentId}`);

  const backupPath = await backupAgentConfig(agentId, currentAgent);
  console.log(`Backed up current agent config to ${relativeFromApp(backupPath)}.`);

  const prompt = await readAgentPrompt();
  const sources = await readKnowledgeBaseSources();
  const existingDocuments = await listAllKnowledgeBaseDocuments(client);
  const refs: KnowledgeBaseReference[] = [];

  console.log(`Publishing ${sources.length} CayesDesk knowledge base documents...`);

  for (const source of sources) {
    const matchingDocuments = existingDocuments.filter((document) => document.name === source.name);

    for (const document of matchingDocuments) {
      await client.request(`/convai/knowledge-base/${document.id}`, {
        method: "DELETE",
        query: { force: true },
      });
    }

    const created = await client.request<{ id: string; name?: string }>("/convai/knowledge-base/text", {
      method: "POST",
      body: {
        name: source.name,
        text: source.text,
      },
    });

    refs.push({
      type: "text",
      id: created.id,
      name: created.name ?? source.name,
      usage_mode: source.usageMode,
    });

    console.log(
      `- ${source.fileName} -> ${created.id} (${source.usageMode === "prompt" ? "prompt" : "RAG auto"})`,
    );
  }

  const conversationConfig = {
    ...(currentAgent.conversation_config ?? {}),
    turn: {
      ...(currentAgent.conversation_config?.turn ?? {}),
      ...CONVERSATIONAL_TURN_CONFIG,
    },
    tts: {
      ...(currentAgent.conversation_config?.tts ?? {}),
      model_id: EXPRESSIVE_TTS_MODEL_ID,
      voice_id: getOptionalEnv("ELEVENLABS_VOICE_ID") ?? RECOMMENDED_VOICE_ID,
      [EXPRESSIVE_MODE_API_FIELD]: EXPRESSIVE_MODE_ENABLED,
      speed: CONVERSATIONAL_TTS_SPEED,
      stability: CONVERSATIONAL_TTS_STABILITY,
      similarity_boost: CONVERSATIONAL_TTS_SIMILARITY_BOOST,
      suggested_audio_tags: [],
    },
    conversation: {
      ...(currentAgent.conversation_config?.conversation ?? {}),
      client_events: mergeClientEvents(currentAgent.conversation_config?.conversation?.client_events),
    },
    agent: {
      ...(currentAgent.conversation_config?.agent ?? {}),
      first_message: FIRST_MESSAGE,
      language: currentAgent.conversation_config?.agent?.language ?? "en",
      prompt: {
        ...(currentAgent.conversation_config?.agent?.prompt ?? {}),
        prompt,
        max_tokens: AGENT_MAX_TOKENS,
        temperature: AGENT_TEMPERATURE,
        knowledge_base: refs,
        rag: RAG_CONFIG,
      },
    },
  };

  const query: Record<string, string | boolean | undefined> = {};
  const branchId = getOptionalEnv("ELEVENLABS_BRANCH_ID");

  if (branchId) {
    query.branch_id = branchId;
  }

  if (getOptionalEnv("ELEVENLABS_ENABLE_VERSIONING") === "true") {
    query.enable_versioning_if_not_enabled = true;
  }

  await client.request(`/convai/agents/${agentId}`, {
    method: "PATCH",
    query,
      body: {
        name: currentAgent.name,
        conversation_config: conversationConfig,
        version_description:
        "CayesDesk natural concierge-advisor prompt, 200-token cap, H-I-P-A-A pronunciation, balanced GLM temperature, Spanish-accent female voice, and refreshed knowledge base.",
      },
    });

  console.log("Updated ElevenLabs agent.");
  console.log(`First message: ${FIRST_MESSAGE}`);
  console.log(`TTS model: ${EXPRESSIVE_TTS_MODEL_ID} with ${EXPRESSIVE_MODE_API_FIELD}=true`);
  console.log(`Voice: ${getOptionalEnv("ELEVENLABS_VOICE_ID") ? "custom env override" : RECOMMENDED_VOICE_NAME}`);
  console.log(`Agent generation: max_tokens=${AGENT_MAX_TOKENS}, temperature=${AGENT_TEMPERATURE}`);
  console.log(
    `TTS settings: speed=${CONVERSATIONAL_TTS_SPEED}, stability=${CONVERSATIONAL_TTS_STABILITY}, similarity_boost=${CONVERSATIONAL_TTS_SIMILARITY_BOOST}`,
  );
  console.log(
    `Turn config: eagerness=${CONVERSATIONAL_TURN_CONFIG.turn_eagerness}, initial_wait_time=${CONVERSATIONAL_TURN_CONFIG.initial_wait_time}s, turn_timeout=${CONVERSATIONAL_TURN_CONFIG.turn_timeout}s, soft_timeout=${CONVERSATIONAL_TURN_CONFIG.soft_timeout_config.timeout_seconds}s`,
  );
  console.log(`Prompt: ${relativeFromApp(promptPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
