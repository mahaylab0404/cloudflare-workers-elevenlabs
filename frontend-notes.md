# CayesDesk Frontend Notes

## Framework Detected

- App stack: React 19, Vite 6, TypeScript, React Router 7, Tailwind CSS 4 via `@tailwindcss/vite`.
- UI helpers in use: `lucide-react` for icons, `clsx` / `tailwind-merge` available, `motion` installed.
- Primary scripts: `npm run dev` serves Vite on port 3000, `npm run lint` runs `tsc --noEmit`, `npm run build` runs the production build, and `npm run verify` runs lint, build, and the ElevenLabs static check.

## Design Tokens Setup

- Current global styling lives in `src/index.css`.
- Tailwind v4 tokens are defined in `@theme`, including `--color-primary`, `--color-primary-container`, `--color-tertiary-fixed`, surface colors, outline colors, and font tokens.
- Fonts are imported globally from Google Fonts: `Manrope` for display/headline and `Inter` for body/label.
- Current pages mostly use Tailwind utility classes directly, with token-backed classes such as `bg-primary`, `text-primary`, `bg-primary-container`, `text-tertiary-fixed`, and `bg-surface-container-low`.
- Redesign `--cd-*` tokens from `design-direction.md` have been added to `src/index.css` for future consolidation. Current pages still use a mix of existing Tailwind theme tokens and a few section-specific arbitrary values where the visual system needs precise contrast.
- Intended palette: porcelain/white surfaces, deep clinical ink text, CayesDesk blue for primary CTAs, aqua only for live/answered states, quiet dividers, minimal shadows, no gradient blobs or neon treatments.
- `src/components/Reveal.tsx` provides scroll reveal motion using `motion/react`; `prefers-reduced-motion` disables reveal/connector motion and shortens transitions globally.
- `src/index.css` includes `cd-flow-track`, an animated minimum-necessary data-flow indicator used on the Security & BAA page.

## Image Placement Guide

Implemented redesign assets:

- `src/assets/redesign/hero-clinic-concierge.jpg` - 2400x1600 JPEG. New hero photography asset now present.
- `src/assets/redesign/specialty-dental-suite.jpg` - 1800x1203 JPEG. Used for the Cosmetic & Implant Dentistry specialty tile.
- `src/assets/redesign/day-spa-suite.jpg` - 1800x1200 JPEG. Used for the Med Spas & Aesthetics specialty tile.
- `src/assets/redesign/specialty-plastic-surgery.jpg` - 1800x1200 JPEG. Used for the Plastic Surgery specialty tile as an upscale private-practice reception proxy.
- `src/assets/redesign/research-context.jpg` - 1600x1067 JPEG. Used on the dedicated About page for founder/company credibility.

Existing legacy assets:

- `src/assets/clinic-front-desk-dashboard.png` - 512x512 PNG. Legacy dashboard-style image; too small to carry the redesign hero. Use only as a temporary small proof/dashboard asset if needed.
- `src/assets/cayesdesk-logo-render.svg` - 316x72 SVG. Brand/logo asset.
- `src/assets/cayesdesk-live-call-qr.svg` - 210x210 SVG. QR asset for the live call line.
- `public/favicon.svg` - 64x64 SVG. Browser icon.
- Static public files also present: `public/_headers`, `public/_redirects`, `public/robots.txt`, `public/sitemap.xml`.

Future photography upgrades recommended, per `design-direction.md`:

- Additional specialty photography can replace the current local assets if a clinic-specific shoot becomes available.
- A founder portrait is intentionally not required; the current About page uses clinical research context to keep the team story low-key.

Placement expectations:

- Hero image should be a real file reference or an intentional placeholder with fixed aspect ratio and an exact label for needed dimensions.
- Specialty and About imagery should use stable `aspect-ratio` constraints so content does not shift while images load.
- Do not ship broken image imports. If final photography is unavailable, use restrained placeholders with descriptive `aria-label`s.

## Local Verification Expectations

- Run `npm run lint` and `npm run build` after frontend edits; run `npm run verify` when changes could affect ElevenLabs/static configuration.
- Use `npm run dev` and verify the local site at `http://localhost:3000`.
- Check `/`, `/about`, `/how-it-works`, and `/faq` at desktop and mobile widths.
- Home verification should confirm the hero CTA remains visible on mobile, no horizontal scroll appears, image/placeholder assets render, sticky call chip behavior is sane, and pricing/pilot copy matches the intended direction.
- How It Works verification should confirm the flow is visually clear, not only copy-heavy, and compliance boundaries remain visible without dominating the page.
- FAQ verification should confirm `details` / `summary` accordion behavior, short readable answers, and no layout overlap from long question text.
- Accessibility pass: meaningful image alt text, focus states on links/buttons, no text hidden by overlays, and no color-only state communication.

## Implementation Notes

- Home now imports only local image files; no remote `img` URLs are used.
- The homepage has been reduced after founder review: daypart panels, homepage founder copy, and the homepage compliance strip were removed.
- Founder/company credibility now lives on `/about`; footer Company & Legal links to that page.
- How It Works and FAQ use visual flow, topic grouping, and accordions without image dependencies.
- Security & BAA now uses `research-context.jpg` and `specialty-plastic-surgery.jpg` for the detailed compliance narrative.
- How It Works now uses `hero-clinic-concierge.jpg` in the hero/setup area.
- FAQ now uses a compact specialty image rail with the dental, med spa, and plastic surgery assets.
- Footer copy now includes "South Florida's Intelligent Patient Concierge."
