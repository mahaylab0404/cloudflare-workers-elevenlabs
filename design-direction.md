<!-- FOUNDER REVIEW NEEDED -->

# CayesDesk Premium Redesign Direction

Brand file check: no `BRAND.md` was found in this repo or the immediate parent workspace, so there are no documented brand-file conflicts to flag. This document should be treated as the temporary brand/design baseline until a formal `BRAND.md` exists.

## Taste Readout

Product identity: CayesDesk is a premium missed-consult recovery concierge for high-ticket private clinics where one missed call can equal a five-figure lost case.

Strongest existing visual cue: the CayesDesk logo and navy/blue trust palette already feel healthcare-adjacent and credible.

Weakest current UI problem: the site relies on text, cards, and dashboard overlays where the buyer needs immediate visual proof that this belongs inside an upscale clinic.

Recommended taste direction: photo-led luxury clinical minimalism, borrowing Tesla's radical subtraction, SpaceX's full-scene confidence, and Apple's product-section restraint without copying any brand.

Direction to avoid: dark SaaS cockpit, gradient tech AI, icon-grid feature marketing, or a dense compliance-first healthcare site.

Why this is more useful: the buyer can decide "this fits my practice" before reading deeply, then the copy and CTAs confirm revenue recovery, call handling, and pilot terms.

Visual thesis: South Florida luxury clinic calm, surgical precision, and one unmistakable revenue-protection action.

Founder review update: the homepage is now reduced to hero proof, revenue exposure, specialty economics, call handoff, pilot pricing, and final CTA. Founder/company context moves to `/about`; compliance depth stays on existing trust pages.

Content plan: hero proof, missed-revenue exposure, specialty economics, call flow, pilot offer, final CTA, with supporting company context separated from the homepage.

Interaction thesis: restrained hero entrance, subtle scroll reveals for math and flow, and quiet hover states that make tiles feel tactile without looking playful.

## 1. Color System

Use mostly neutrals. One primary accent carries action; one secondary accent is reserved for live/verified states only. Do not show both accents heavily in the same viewport.

```css
:root {
  --cd-bg: oklch(0.985 0.004 250);        /* porcelain background */
  --cd-surface: oklch(1 0 0);              /* clean white surface */
  --cd-surface-soft: oklch(0.955 0.006 250);
  --cd-text: oklch(0.16 0.025 255);        /* deep clinical ink */
  --cd-muted: oklch(0.48 0.018 255);       /* steel body text */
  --cd-line: oklch(0.89 0.008 255);        /* quiet dividers */
  --cd-accent: oklch(0.55 0.17 255);       /* CayesDesk blue, primary CTA only */
  --cd-accent-ink: oklch(0.23 0.075 255);
  --cd-live: oklch(0.78 0.105 185);        /* concierge aqua, live/answered only */
}
```

Usage rules:
- Backgrounds: white/porcelain first, deep ink only for one or two cinematic contrast sections.
- Primary CTA: CayesDesk blue.
- Live/answered chips: concierge aqua.
- No gradient blobs, no glowing orbs, no neon, no decorative color washes.
- Dividers and layout should rely on spacing and hairlines, not card shadows.

## 2. Typography

Keep maximum two typefaces and use the existing import unless the founder wants a larger typographic reset.

Typefaces:
- Display: `Manrope`, used for hero and section headlines.
- Body/UI: `Inter`, used for paragraphs, navigation, buttons, labels, and form text.

Scale:
- Hero headline: `clamp(3rem, 8vw, 6.75rem)`, 0.98-1.02 line-height, weight 800.
- Section headline: `clamp(2rem, 4.5vw, 4.25rem)`, 1.02-1.08 line-height, weight 800.
- Tile headline: 1.25-1.75rem, weight 800.
- Body: 1rem-1.125rem, 1.55-1.7 line-height.
- Labels: 0.72-0.8rem, uppercase, positive tracking only for small metadata.

Rules:
- Display type is reserved for major conversion moments.
- Body copy stays short: one or two sentences per visual block.
- No negative letter-spacing.
- No centered paragraphs longer than two lines.

## 3. Spacing Rhythm

Section strategy:
- Hero: `min-height: calc(100svh - header-height)` with text and primary CTA visible on mobile.
- Major sections: `clamp(4.5rem, 9vw, 8rem)` vertical padding.
- Compact trust/footer bands: `clamp(2.5rem, 5vw, 4rem)` vertical padding.

Width strategy:
- Full-bleed media for hero and select proof sections.
- Inner content max width: 1180-1280px.
- Text column max width: 560-680px.
- Reading content max width: 760px.
- Use 8px base rhythm, but keep large section gaps deliberate and calm.

Layout rules:
- No nested cards.
- Cards only for repeated specialty/panel items where each item is a discrete object.
- Prefer full-width bands, dividers, split image/text sections, and large number blocks.
- Border radius stays 4-8px for UI; 12px maximum for image tiles.

## 4. Homepage Section Order

1. Hero: full-bleed premium clinic image with headline, short subhead, and two CTAs; first impression says "built for my practice."
2. The leak: oversized missed-revenue math block; the dominant visual is the equation, not copy.
3. Built for your specialty: three visual tiles for Cosmetic & Implant Dentistry, Med Spas & Aesthetics, and Plastic Surgery, each with an economic anchor.
4. What actually happens on a call: three-step flow from caller to concierge to staff summary/revenue report, with a quiet disclaimer.
5. Pilot and pricing: one clear $497 pilot offer and one Practice plan overview at $999/month.
6. Final CTA: one direct call/demo action and one pilot action.
7. Footer: preserve current footer structure and add "South Florida's Intelligent Patient Concierge."

Separate page:
- About CayesDesk: founder/company credibility, Oncova Clinical Research LLC note, research/operations support, and the low-key healthcare credibility story.

## 5. Image Plan

Hard rule: every implemented image must either be a real file reference or a clearly labeled placeholder with exact dimensions and description. No broken image tags.

Needed assets:
- `src/assets/redesign/hero-clinic-concierge.jpg` - 2400x1600. Upscale South Florida cosmetic dental or med spa reception/treatment setting, warm daylight, no visible logos, no stethoscope cliche, no clip-art teeth. Used in hero.
- `src/assets/redesign/specialty-dental.jpg` - 1200x900. Modern implant/cosmetic dental suite detail, premium materials, no cliche tooth graphics.
- `src/assets/redesign/specialty-medspa.jpg` - 1200x900. Calm med spa treatment room or consultation setting, bright and refined.
- `src/assets/redesign/specialty-plastic-surgery.jpg` - 1200x900. Upscale consultation room or surgical practice reception detail, not operating-room graphic.
- `src/assets/redesign/research-context.jpg` - 1600x1067. Abstract-but-real clinical research detail for the About page.

If final photography is not ready during implementation:
- Use styled placeholder blocks with `aspect-ratio`, exact intended dimensions in visible/admin-facing labels, and descriptive `aria-label`s.
- Keep placeholders visually restrained: light gray field, thin border, small label. Do not use fake AI photos as if final.

Existing asset treatment:
- `src/assets/clinic-front-desk-dashboard.png` is only 512x512 and should not carry the new hero.
- It may be retired or used only as a small temporary placeholder if no better asset exists.

## 6. What Gets Removed Or Collapsed

- Remove the current long hero paragraph and duplicate phone-number treatments.
- Remove the dark gradient/radial hero treatment.
- Remove dashboard-style hero overlay as the main proof visual.
- Collapse the current "Hear the aha moment live" band into the hero CTA strategy.
- Replace the marquee signal strip with deliberate proof sections.
- Remove the homepage daypart panel section after founder review. The point is valid, but the first page needs less copy and fewer generic icons.
- Collapse repeated "front-desk gap," "service highlights," and "from missed calls to covered" sections into the specialty, call-flow, and pilot sections.
- Remove generic 3-icon card patterns from solutions-style content.
- Remove homepage multi-tier pricing references; homepage gets one pilot offer and one Practice plan overview.
- Move founder/company credibility off the homepage and onto `/about`.
- Remove the homepage compliance comfort strip after founder review; keep compliance detail in dedicated trust pages and the call-flow disclaimer.
- Reduce repeated "100% HIPAA Compliant" marketing emphasis; use precise phrases such as "HIPAA-compliant workflows," "BAA-ready deployments," and "no medical or dental advice."
- Remove non-functional resource download affordances unless the PDF exists.
