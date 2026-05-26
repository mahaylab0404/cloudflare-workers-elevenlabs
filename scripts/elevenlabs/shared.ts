import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FIRST_MESSAGE =
  "Hello, thank you for reaching out to CayesDesk. How can I help you today?";

export const DEFAULT_AGENT_NAME = "CayesDesk.com__v2__Marketing Lead Capture Agent";

export const EXPRESSIVE_TTS_MODEL_ID = "eleven_v3_conversational";

export const EXPRESSIVE_MODE_API_FIELD = "expressive_mode";

export const EXPRESSIVE_MODE_ENABLED = true;

export const RECOMMENDED_VOICE_ID = "pTX8uGyVgHCWLj6IkcbC";

export const RECOMMENDED_VOICE_NAME = "Vega - Warm English Female, Spanish Accent";

export const AGENT_MAX_TOKENS = 200;

export const AGENT_TEMPERATURE = 0.45;

export const CONVERSATIONAL_TTS_SPEED = 1.08;

export const CONVERSATIONAL_TTS_STABILITY = 0.45;

export const CONVERSATIONAL_TTS_SIMILARITY_BOOST = 0.75;

export const CONVERSATIONAL_TURN_CONFIG = {
  initial_wait_time: 2.5,
  turn_eagerness: "eager",
  turn_timeout: 5,
  soft_timeout_config: {
    timeout_seconds: 3,
    message: "Hmm...",
    use_llm_generated_message: true,
  },
};

export const SUGGESTED_AUDIO_TAGS = [
  {
    tag: "warm",
    description: "Use for welcoming openings, positive acknowledgement, and friendly next-step guidance.",
  },
  {
    tag: "measured",
    description: "Use when explaining pricing, compliance boundaries, or implementation details.",
  },
  {
    tag: "reassuring",
    description: "Use when a caller sounds worried about risk, H-I-P-A-A, or brand fit.",
  },
  {
    tag: "direct",
    description: "Use when correcting stale pricing, clarifying next steps, or answering a specific operational question.",
  },
  {
    tag: "confident",
    description: "Use when positioning CayesDesk as a premium revenue protection system.",
  },
];

export const RAG_CONFIG = {
  enabled: true,
  embedding_model: "e5_mistral_7b_instruct",
  max_documents_length: 10000,
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

export const appRoot = path.resolve(scriptDir, "../..");
export const workspaceRoot = path.resolve(appRoot, "..");
export const promptPath = path.join(appRoot, "elevenlabs", "cayesdesk-sales-prompt.md");
const kbDirCandidates = [
  process.env.ELEVENLABS_KB_DIR,
  path.join(appRoot, "elevenlabs-kb"),
  path.join(workspaceRoot, "elevenlabs-kb"),
].filter((value): value is string => Boolean(value));
export const kbDir =
  kbDirCandidates.find((candidate) => existsSync(candidate)) || kbDirCandidates[0];
export const localEnvPath = path.join(appRoot, ".env.elevenlabs.local");
export const globalEnvPath = path.join(process.env.HOME ?? "", ".codex", "secrets", "elevenlabs.env");
export const backupDir = path.join(appRoot, ".agent-backups");

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
};

export type AgentSummary = {
  agent_id: string;
  name: string;
  archived?: boolean;
};

type AgentListResponse = {
  agents?: AgentSummary[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export type KnowledgeBaseDocument = {
  id: string;
  name: string;
  type?: string;
};

type KnowledgeBaseListResponse = {
  documents?: KnowledgeBaseDocument[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export type KnowledgeBaseSource = {
  fileName: string;
  filePath: string;
  name: string;
  text: string;
  usageMode: "prompt" | "auto";
};

export type KnowledgeBaseReference = {
  type: "text";
  id: string;
  name: string;
  usage_mode: "prompt" | "auto";
};

export function loadLocalElevenLabsEnv() {
  loadEnvFile(globalEnvPath);
  loadEnvFile(localEnvPath);
}

function loadEnvFile(filePath: string) {
  if (!filePath || !existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = unquote(rawValue);
  }
}

function unquote(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function getOptionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function getRequiredEnv(name: string) {
  const value = getOptionalEnv(name);

  if (!value) {
    const localPath = path.relative(appRoot, localEnvPath);
    throw new Error(
      `Missing ${name}. Export it in your shell, add it to ${localPath}, or add it to ${globalEnvPath}.`,
    );
  }

  return value;
}

export class ElevenLabsClient {
  private apiBase: string;
  private apiKey: string;

  constructor() {
    loadLocalElevenLabsEnv();
    this.apiBase = getOptionalEnv("ELEVENLABS_API_BASE") ?? "https://api.elevenlabs.io/v1";
    this.apiKey = getRequiredEnv("ELEVENLABS_API_KEY");
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.apiBase}${endpoint}`);

    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": this.apiKey,
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `${options.method ?? "GET"} ${url.pathname} failed with ${response.status}: ${text || response.statusText}`,
      );
    }

    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }
}

export async function resolveAgentId(client: ElevenLabsClient) {
  const explicitAgentId = getOptionalEnv("ELEVENLABS_AGENT_ID");

  if (explicitAgentId) {
    return explicitAgentId;
  }

  const agentName = getOptionalEnv("ELEVENLABS_AGENT_NAME") ?? DEFAULT_AGENT_NAME;
  const response = await client.request<AgentListResponse>("/convai/agents", {
    query: { search: agentName, page_size: 100, archived: false },
  });

  const agents = response.agents ?? [];
  const exactMatches = agents.filter((agent) => agent.name === agentName);

  if (exactMatches.length === 1) {
    return exactMatches[0].agent_id;
  }

  if (agents.length === 1) {
    return agents[0].agent_id;
  }

  if (exactMatches.length > 1) {
    throw new Error(
      `Found multiple ElevenLabs agents named ${agentName}. Set ELEVENLABS_AGENT_ID explicitly.`,
    );
  }

  throw new Error(
    `Could not resolve ElevenLabs agent named ${agentName}. Set ELEVENLABS_AGENT_ID explicitly.`,
  );
}

export async function listAllKnowledgeBaseDocuments(client: ElevenLabsClient) {
  const documents: KnowledgeBaseDocument[] = [];
  let cursor: string | undefined;

  do {
    const response = await client.request<KnowledgeBaseListResponse>("/convai/knowledge-base", {
      query: { page_size: 100, cursor },
    });

    documents.push(...(response.documents ?? []));
    cursor = response.next_cursor ?? undefined;

    if (!response.has_more) {
      cursor = undefined;
    }
  } while (cursor);

  return documents;
}

export async function readAgentPrompt() {
  return readFile(promptPath, "utf8");
}

export async function readKnowledgeBaseSources() {
  const fileNames = (await readdir(kbDir))
    .filter((fileName) => fileName.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b));

  const sources: KnowledgeBaseSource[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(kbDir, fileName);
    const text = await readFile(filePath, "utf8");
    const baseName = fileName.replace(/\.md$/, "");

    sources.push({
      fileName,
      filePath,
      name: `CayesDesk KB - ${baseName}`,
      text,
      usageMode: fileName.startsWith("00-") ? "prompt" : "auto",
    });
  }

  return sources;
}

export async function backupAgentConfig(agentId: string, config: unknown) {
  await mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `elevenlabs-agent-${agentId}-${timestamp}.json`);

  await writeFile(backupPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  return backupPath;
}

export function relativeFromApp(filePath: string) {
  return path.relative(appRoot, filePath);
}
