import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

type Finding = {
  file: string;
  line?: number;
  column?: number;
  message: string;
};

const appRoot = process.cwd();
const kbDirCandidates = [
  process.env.ELEVENLABS_KB_DIR,
  join(appRoot, "elevenlabs-kb"),
  join(appRoot, "..", "elevenlabs-kb"),
].filter((value): value is string => Boolean(value));
const kbDir =
  kbDirCandidates.find((candidate) => {
    try {
      return statSync(candidate).isDirectory();
    } catch {
      return false;
    }
  }) || kbDirCandidates[0];
const promptPath = join(appRoot, "elevenlabs", "cayesdesk-sales-prompt.md");
const sharedScriptPath = join(appRoot, "scripts", "elevenlabs", "shared.ts");

const forbiddenTerms: Array<{ label: string; pattern: RegExp }> = [
  { label: "$399", pattern: /\$399/g },
  { label: "$499", pattern: /\$499/g },
  { label: "old short-duration pilot wording", pattern: new RegExp(String.raw`\b${3}[\s-]day\b|${3} days\b`, "gi") },
  { label: "old hour-count pilot wording", pattern: new RegExp(String.raw`\b${72} hours\b`, "gi") },
  { label: "old free-pilot wording", pattern: new RegExp(String.raw`\bfree\s+trial\b`, "gi") },
  { label: "K's Desk / K\\u2019s Desk", pattern: /\bK['\u2019]s Desk\b/g },
  { label: "Kays Desk", pattern: /\bKays Desk\b/g },
  { label: "AI Patient Concierge", pattern: /\bAI Patient Concierge\b/g },
  { label: "Bespoke AI", pattern: /\bBespoke AI\b/g },
  { label: "H-I-P-A-A-conscious", pattern: /\bH-I-P-A-A-conscious\b/gi },
  { label: "HIPAA-conscious", pattern: /\bHIPAA-conscious\b/gi },
  { label: "BAA available", pattern: /\bBAA available\b/gi },
  { label: "bot", pattern: /\bbot\b/gi },
  { label: "chatbot / chatbots", pattern: /\bchatbots?\b/gi },
  {
    label: "automated answering service",
    pattern: /\bautomated answering service\b/gi,
  },
  { label: "Growth-level", pattern: /\bGrowth-level\b/g },
];

const requiredLiterals = [
  "$497",
  "$599",
  "$999",
  "$1,499+",
  "$1,500-$2,500",
  "7 days",
  "7-day live pilot",
  "Missed Revenue Report",
];

const requiredExpressiveModeLiterals = [
  "eleven_v3_conversational",
  "SUGGESTED_AUDIO_TAGS",
  "expressive_mode",
  "CONVERSATIONAL_TTS_SPEED",
  "CONVERSATIONAL_TTS_STABILITY",
  "CONVERSATIONAL_TTS_SIMILARITY_BOOST",
  "CONVERSATIONAL_TURN_CONFIG",
  "AGENT_MAX_TOKENS",
  "RECOMMENDED_VOICE_ID",
];

function lineAndColumn(text: string, index: number): { line: number; column: number } {
  const prefix = text.slice(0, index);
  const lines = prefix.split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function collectMarkdownFiles(): string[] {
  if (!existsSync(kbDir)) {
    return [promptPath];
  }

  const kbFiles = readdirSync(kbDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => join(kbDir, file));

  return [...kbFiles, promptPath];
}

function scanForbiddenTerms(file: string, text: string): Finding[] {
  const findings: Finding[] = [];

  for (const term of forbiddenTerms) {
    term.pattern.lastIndex = 0;

    for (let match = term.pattern.exec(text); match; match = term.pattern.exec(text)) {
      const location = lineAndColumn(text, match.index);
      findings.push({
        file,
        ...location,
        message: `Forbidden stale/off-brand term found: ${term.label}`,
      });
    }
  }

  return findings;
}

function main(): void {
  const files = collectMarkdownFiles();
  const findings: Finding[] = [];
  const corpusParts: string[] = [];

  if (!existsSync(kbDir)) {
    findings.push({
      file: resolve(kbDir),
      message:
        "ElevenLabs KB directory was not found. Set ELEVENLABS_KB_DIR or add elevenlabs-kb next to this app.",
    });
  }

  for (const file of files) {
    try {
      const text = readFileSync(file, "utf8");
      corpusParts.push(text);
      findings.push(...scanForbiddenTerms(file, text));
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push({
        file,
        message: `Unable to read required ElevenLabs corpus file: ${detail}`,
      });
    }
  }

  const corpus = corpusParts.join("\n");
  for (const literal of requiredLiterals) {
    if (!corpus.includes(literal)) {
      findings.push({
        file: `${kbDir}/*.md and ${promptPath}`,
        message: `Missing required canonical literal in ElevenLabs corpus: ${literal}`,
      });
    }
  }

  try {
    const sharedScript = readFileSync(sharedScriptPath, "utf8");

    for (const literal of requiredExpressiveModeLiterals) {
      if (!sharedScript.includes(literal)) {
        findings.push({
          file: sharedScriptPath,
          message: `Missing required Expressive Mode configuration literal: ${literal}`,
        });
      }
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    findings.push({
      file: sharedScriptPath,
      message: `Unable to read Expressive Mode config file: ${detail}`,
    });
  }

  if (findings.length > 0) {
    console.error("ElevenLabs static check failed:");
    for (const finding of findings) {
      const location =
        finding.line && finding.column ? `:${finding.line}:${finding.column}` : "";
      console.error(`- ${finding.file}${location} - ${finding.message}`);
    }
    process.exit(1);
  }

  console.log(`ElevenLabs static check passed (${files.length} files scanned).`);
}

main();
