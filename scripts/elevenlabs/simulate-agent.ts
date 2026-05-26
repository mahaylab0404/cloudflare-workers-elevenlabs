import {
  ElevenLabsClient,
  FIRST_MESSAGE,
  getOptionalEnv,
  resolveAgentId,
} from "./shared.ts";

const forbiddenResponsePatterns = [
  { label: "$399", pattern: /\$399\b/i },
  { label: "$499", pattern: /\$499\b/i },
  {
    label: "old short-pilot wording",
    pattern: new RegExp(
      String.raw`\b${3}[-\s]?day|${3} days|${72} hours|three[-\s]?day|seventy[-\s]?two hours\b`,
      "i",
    ),
  },
  { label: "K's Desk", pattern: /K['’]s Desk/i },
  { label: "commodity self-label", pattern: /\bbot\b/i },
  { label: "chat commodity label", pattern: /\bchatbots?\b/i },
  { label: "automated answering service", pattern: /automated answering service/i },
  { label: "Growth-level", pattern: /Growth-level/i },
  { label: "spoken bracketed tag", pattern: /\[[^\]]+\]/i },
];

const cases = [
  {
    name: "pricing",
    firstMessage: "How much does CayesDesk cost?",
    requiredPatterns: [
      /\$ ?599|five hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?999|nine hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?1,?499\+?|one thousand four hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?1,?500|one thousand five hundred/i,
      /\$ ?2,?500|two thousand five hundred/i,
      /\$ ?497|four hundred (and )?ninety\s*[- ]?\s*seven/i,
      /7\s*[- ]\s*day|7 days|seven\s*[- ]\s*day|live pilot/i,
    ],
    maxFirstAgentTurnWords: 85,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "pricing natural",
    firstMessage: "Can you just give me the pricing?",
    requiredPatterns: [
      /\$ ?599|five hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?999|nine hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?1,?499\+?|one thousand four hundred (and )?ninety\s*[- ]?\s*nine/i,
      /\$ ?497|four hundred (and )?ninety\s*[- ]?\s*seven/i,
      /7\s*[- ]\s*day|7 days|seven\s*[- ]\s*day|live pilot/i,
    ],
    forbiddenPatterns: [/Use only the current/i, /pricing below/i, /Do not guarantee/i],
    maxFirstAgentTurnWords: 80,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "direct caller",
    firstMessage: "I just need to know if this can answer missed calls after hours and what it costs.",
    requiredPatterns: [/missed|after[- ]hours/i, /\$ ?599|five hundred (and )?ninety\s*[- ]?\s*nine/i],
    maxFirstAgentTurnWords: 90,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "ready to move forward",
    firstMessage: "We are a med spa with three providers and we want to start. What is the next step?",
    requiredPatterns: [/workflow review|7[- ]?day|seven[- ]?day|pilot|next step/i],
    maxFirstAgentTurnWords: 65,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "book demo",
    firstMessage: "I found this number on the website and want to book a demo.",
    requiredPatterns: [/demo|workflow review|next step/i],
    maxFirstAgentTurnWords: 60,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "busy operator",
    firstMessage: "I only have 30 seconds. Can this handle missed calls, and what do I do next?",
    requiredPatterns: [/missed calls/i, /workflow review|7[- ]?day|seven[- ]?day|pilot|next step/i],
    maxFirstAgentTurnWords: 70,
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "context already provided",
    firstMessage: "We are a med spa with three providers missing after-hours calls. What plan fits?",
    requiredPatterns: [/Premier/i],
    forbiddenPatterns: [/what type of clinic/i, /how many providers/i, /are you missing/i, /do you miss/i],
    maxQuestionMarksPerTurn: 1,
  },
  {
    name: "stale price correction",
    firstMessage: "I thought this was $399.",
    requiredPatterns: [/\$ ?599|five hundred (and )?ninety\s*[- ]?\s*nine/i, /current/i],
    maxFirstAgentTurnWords: 70,
  },
  {
    name: "identity",
    firstMessage: "Are you a bot?",
    requiredPatterns: [/Cay\s*esDesk|CayesDesk/i, /conc\s*ierge advisor|Patient Concierge|Intelligent Concierge/i],
    forbiddenPatterns: [/AI Patient Concierge|AI conc\s*ierge advisor/i],
    maxFirstAgentTurnWords: 60,
  },
  {
    name: "answering service objection",
    firstMessage: "We already have an answering service.",
    requiredPatterns: [/Cay\s*esDesk|CayesDesk/i, /script|handoff|routing|intake|clinic/i],
  },
  {
    name: "h-i-p-a-a pronunciation",
    firstMessage: "Is CayesDesk HIPAA compliant?",
    requiredPatterns: [/H\s*[- ]\s*I\s*[- ]\s*P\s*[- ]\s*A\s*[- ]\s*A/i, /BAA|Business Associate Agreement|workflow review|configuration/i],
    forbiddenPatterns: [/\bHIPAA\b/],
    maxFirstAgentTurnWords: 85,
  },
  {
    name: "clinical handoff",
    firstMessage: "Can it answer clinical questions from patients?",
    requiredPatterns: [/staff|clinic team|handoff|route/i],
    maxFirstAgentTurnWords: 70,
  },
  {
    name: "med spa plan fit",
    firstMessage: "We are a med spa with two providers; what plan fits?",
    requiredPatterns: [/Premier|Boutique/i],
    maxFirstAgentTurnWords: 80,
  },
  {
    name: "ehr integration",
    firstMessage: "Do you integrate with our EHR?",
    requiredPatterns: [/scope|workflow review|integration/i],
  },
];

type SimulatedTurn = {
  role?: string;
  message?: string;
  rag_retrieval_info?: {
    chunks?: Array<{ document_id?: string; chunk_id?: string; vector_distance?: number }>;
    used_chunk_ids?: string[];
  };
};

type SimulationResponse = {
  simulated_conversation?: SimulatedTurn[];
};

type AgentConfig = {
  conversation_config?: {
    agent?: {
      first_message?: string;
    };
  };
};

type SimulationCase = (typeof cases)[number] & {
  forbiddenPatterns?: RegExp[];
  maxFirstAgentTurnWords?: number;
  maxQuestionMarksPerTurn?: number;
};

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countQuestionMarks(text: string) {
  return (text.match(/\?/g) ?? []).length;
}

async function main() {
  const client = new ElevenLabsClient();
  const agentId = await resolveAgentId(client);
  const branchId = getOptionalEnv("ELEVENLABS_BRANCH_ID");
  let failures = 0;

  const agentConfig = await client.request<AgentConfig>(`/convai/agents/${agentId}`);
  const firstMessage = agentConfig.conversation_config?.agent?.first_message;

  if (firstMessage !== FIRST_MESSAGE) {
    failures += 1;
    console.error("FAIL configured first message");
    console.error(`Expected: ${FIRST_MESSAGE}`);
    console.error(`Actual: ${firstMessage ?? "[missing]"}`);
  } else {
    console.log("PASS configured first message");
  }

  for (const testCase of cases as SimulationCase[]) {
    const simulatedUserPrompt = [
      "You are a prospective CayesDesk buyer.",
      "Keep the conversation focused on the exact scenario already provided in the partial conversation history.",
      "Do not interrupt the agent while it answers your initial question.",
      "Do not invent unrelated practice details unless the agent asks a necessary follow-up.",
      "Keep each user reply short and realistic.",
    ].join(" ");

    const response = await client.request<SimulationResponse>(
      `/convai/agents/${agentId}/simulate-conversation`,
      {
        method: "POST",
        query: { branch_id: branchId },
        body: {
          simulation_specification: {
            simulated_user_config: {
              language: "en",
              disable_first_message_interruptions: false,
              prompt: {
                prompt: simulatedUserPrompt,
                llm: "gpt-4o",
                temperature: 0.2,
              },
            },
            partial_conversation_history: [
              {
                role: "agent",
                message: FIRST_MESSAGE,
                time_in_call_secs: 0,
              },
              {
                role: "user",
                message: testCase.firstMessage,
                time_in_call_secs: 2,
              },
            ],
          },
          new_turns_limit: 4,
        },
      },
    );

    const transcript = response.simulated_conversation ?? [];
    const agentTurns = transcript
      .filter((turn) => turn.role === "agent")
      .map((turn) => turn.message ?? "")
      .filter((message) => message.trim() !== FIRST_MESSAGE);
    const agentMessages = agentTurns.join("\n");
    const searchableAgentMessages = agentMessages.replace(/\s+/g, " ");

    const forbiddenHits = forbiddenResponsePatterns.filter(({ pattern }) => pattern.test(searchableAgentMessages));
    const caseForbiddenHits = (testCase.forbiddenPatterns ?? []).filter((pattern) =>
      pattern.test(searchableAgentMessages),
    );
    const missingRequired = testCase.requiredPatterns.filter((pattern) => !pattern.test(searchableAgentMessages));
    const firstTurnWordCount = countWords(agentTurns[0] ?? "");
    const maxTurnQuestionMarks = Math.max(0, ...agentTurns.map(countQuestionMarks));
    const metricFailures: string[] = [];

    if (testCase.maxFirstAgentTurnWords && firstTurnWordCount > testCase.maxFirstAgentTurnWords) {
      metricFailures.push(
        `first agent turn too long: ${firstTurnWordCount} words > ${testCase.maxFirstAgentTurnWords}`,
      );
    }

    if (testCase.maxQuestionMarksPerTurn !== undefined && maxTurnQuestionMarks > testCase.maxQuestionMarksPerTurn) {
      metricFailures.push(
        `too many questions in one agent turn: ${maxTurnQuestionMarks} > ${testCase.maxQuestionMarksPerTurn}`,
      );
    }

    const ragChunkCount = transcript.reduce(
      (count, turn) => count + (turn.rag_retrieval_info?.chunks?.length ?? 0),
      0,
    );

    if (forbiddenHits.length || caseForbiddenHits.length || missingRequired.length || metricFailures.length) {
      failures += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(`User: ${testCase.firstMessage}`);
      console.error(`Agent: ${agentMessages || "[no agent response captured]"}`);

      if (forbiddenHits.length) {
        console.error(`Forbidden terms: ${forbiddenHits.map((hit) => hit.label).join(", ")}`);
      }

      if (caseForbiddenHits.length) {
        console.error(`Case-forbidden patterns: ${caseForbiddenHits.map(String).join(", ")}`);
      }

      if (missingRequired.length) {
        console.error(`Missing required response patterns: ${missingRequired.map(String).join(", ")}`);
      }

      if (metricFailures.length) {
        console.error(`Metric failures: ${metricFailures.join("; ")}`);
      }
    } else {
      console.log(`PASS ${testCase.name} (${ragChunkCount} RAG chunks)`);
    }
  }

  if (failures) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
