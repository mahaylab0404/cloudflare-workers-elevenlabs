# CayesDesk ElevenLabs Agent Tooling

This directory contains local tooling for maintaining the CayesDesk ElevenLabs sales agent. It is designed for local operator use only.

## Secrets

Store ElevenLabs credentials in either:

- global local file: `~/.codex/secrets/elevenlabs.env`
- project local file: `.env.elevenlabs.local`

Use `elevenlabs/example.env` as the placeholder template. Do not commit real secrets.

Required environment variables:

- `ELEVENLABS_API_KEY`: ElevenLabs API key for local update and simulation commands.
- `ELEVENLABS_AGENT_ID` or `ELEVENLABS_AGENT_NAME`: identifies the target ElevenLabs agent.

Optional environment variables:

- `ELEVENLABS_BRANCH_ID`: targets a specific ElevenLabs branch when working with branched agent versions.
- `ELEVENLABS_ENABLE_VERSIONING=true`: enables versioning behavior for update tooling when supported by the local script.

These secrets do not belong in Cloudflare Pages settings, Vite client env, or any `VITE_*` variable. The ElevenLabs commands are local maintenance tools, not browser-executed application code.

The global file is useful when working from a new folder. Keep it outside repositories and locked to the local user with `chmod 600 ~/.codex/secrets/elevenlabs.env`.

## Commands

Run these commands from `/Users/stevecharles/Desktop/CayesDesk/CayesDeskThisOne`:

```bash
npm run elevenlabs:check
npm run elevenlabs:update
npm run elevenlabs:simulate
```

`npm run elevenlabs:check` scans the ElevenLabs knowledge base and sales prompt for stale pricing, off-brand language, and missing canonical pilot/pricing literals.

`npm run elevenlabs:update` publishes the local CayesDesk sales agent configuration to ElevenLabs using your local credentials.

The update command also forces ElevenLabs Expressive Mode by setting the agent TTS model to `eleven_v3_conversational`, setting `expressive_mode=true`, and sending CayesDesk-specific suggested audio tags for warm, measured, reassuring, direct, and confident delivery.

It also tunes live-call pacing by setting `tts.speed=1.08`, `tts.stability=0.45`, `tts.similarity_boost=0.75`, `turn.turn_eagerness=eager`, `turn.turn_timeout=5`, `turn.initial_wait_time=2.5`, and a 3-second soft timeout filler. The update clears `suggested_audio_tags` so delivery tags like `[warm]` are not spoken. The `initial_wait_time` creates a short pause before the agent speaks after pickup; a true "let the phone ring three or four times before answering" delay must be configured in the upstream phone provider or routing layer, not in the ElevenLabs agent prompt.

The update command caps agent generation at `max_tokens=200` and uses `temperature=0.45` to keep answers succinct while sounding less scripted. The default voice is `Vega - Warm English Female, Spanish Accent` (`pTX8uGyVgHCWLj6IkcbC`), chosen from the available ElevenLabs voices because it is female, Spanish-accented, calm, natural, warm, and trust-oriented. To test another voice without changing code, set `ELEVENLABS_VOICE_ID` in the global or local env file before running `npm run elevenlabs:update`.

`npm run elevenlabs:simulate` runs a local simulation against the prompt and knowledge base so agent behavior can be reviewed before updating ElevenLabs.

## Source Corpus

The local corpus is split across:

- `/Users/stevecharles/Desktop/CayesDesk/elevenlabs-kb/*.md`
- `/Users/stevecharles/Desktop/CayesDesk/CayesDeskThisOne/elevenlabs/cayesdesk-sales-prompt.md`

Keep pricing and pilot language consistent with the canonical CayesDesk offer:

- `$497`
- `$599`
- `$999`
- `$1,499+`
- `$1,500-$2,500`
- `7 days`
- `7-day live pilot`
- `Missed Revenue Report`
