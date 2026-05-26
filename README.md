# CayesDesk

CayesDesk is a React + Tailwind site for premium missed consult revenue recovery serving cosmetic dentistry, implant dentistry, med spas, and cash-pay private clinics.

The site is written around administrative call handling: missed-call recovery, after-hours coverage, intake capture, routing, multilingual patient communication, and staff support. It keeps the product positioned as non-clinical support with staff escalation for care-related, emergency, or study-specific questions.

## Run Locally

Prerequisite: Node.js

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000/`.

## Verify

```bash
npm run verify
```

This runs TypeScript checks, the production Vite build, and the ElevenLabs pricing/brand static check. If the ElevenLabs knowledge base lives outside this repo, set `ELEVENLABS_KB_DIR=/absolute/path/to/elevenlabs-kb` before running verification.

## Cloudflare Pages

Local Pages smoke test:

```bash
npm run preview:pages
```

Manual production deploy:

```bash
npm run deploy:cloudflare
```

Cloudflare production must provide the PayPal live client ID, client secret, webhook ID, and the three live plan IDs as environment variables. The browser only receives the public client ID and plan IDs through `/api/site-config`.
