import { useEffect, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileSignature,
  LockKeyhole,
  PhoneCall,
  Route,
  ShieldCheck,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import researchContextImage from "../assets/redesign/research-context.jpg";
import surgeryPracticeImage from "../assets/redesign/specialty-plastic-surgery.jpg";
import { trackEvent } from "../lib/customerio";
import {
  baaReviewMailto,
  cancellationMailto,
  livePilotPriceLabel,
  pilotOfferSummary,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
  supportMailto,
  trialCtaLabel,
  trialDurationDays,
} from "../lib/flow";

type Section = {
  title: string;
  body?: ReactNode[];
  bullets?: ReactNode[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  intro: ReactNode;
  trustPoints?: string[];
  sections: Section[];
  ctaLabel?: string;
};

function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  trustPoints = [],
  sections,
  ctaLabel = "Call Now",
}: LegalPageProps) {
  return (
    <section className="flex-1 bg-surface">
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {title}
            </h1>
            {lastUpdated && (
              <p className="mt-5 text-sm font-semibold text-blue-100">
                Last Updated: {lastUpdated}
              </p>
            )}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
              {intro}
            </p>
          </div>
          {trustPoints.length > 0 && (
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur"
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <span className="text-sm font-bold text-blue-50">{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14 md:px-8 md:py-20">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(0,33,71,0.06)] md:p-10">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className="border-b border-surface-variant/60 pb-8 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-sm font-extrabold text-primary-container">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl font-extrabold text-primary">
                      {section.title}
                    </h2>
                    {section.body && (
                      <div className="mt-4 space-y-4 text-base leading-8 text-on-surface-variant">
                        {section.body.map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                    {section.bullets && (
                      <ul className="mt-5 space-y-3 text-on-surface-variant">
                        {section.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-3 leading-7">
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary-container" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-primary-container p-6 text-white md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-tertiary-fixed">
                Next step
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                Review CayesDesk with your team.
              </h2>
              <p className="mt-2 max-w-2xl leading-7 text-blue-100">
                These pages are designed to support buyer review before a live
                call, pilot, or onboarding conversation.
              </p>
            </div>
            <a
              href={sitePhoneHref}
              className="inline-flex shrink-0 justify-center rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustPage({
  title,
  body,
  bullets,
}: {
  title: string;
  body: string;
  bullets: string[];
}) {
  return (
    <LegalPage
      eyebrow="Product"
      title={title}
      intro={body}
      trustPoints={["100% HIPAA Compliant", "BAA Included", "Approved scripts"]}
      sections={[
        {
          title: "What this covers",
          bullets,
        },
      ]}
    />
  );
}

export function HipaaWorkflows() {
  return (
    <TrustPage
      title="100% HIPAA Compliant workflows"
      body="CayesDesk is designed for secure high-ticket patient concierge coverage with approved scripts, encrypted handling, and human escalation rules."
      bullets={[
        "BAA Included before patient-facing deployment when CayesDesk handles protected health information.",
        "Approved scripts keep CayesDesk away from clinical evaluation, care recommendations, and medical guidance.",
        "Caller handling can be configured around clinic-approved conversion, scheduling, and escalation rules.",
      ]}
    />
  );
}

const securityHeroPoints = [
  "BAA signed before patient-facing PHI handling",
  "Approved scripts and SOPs before launch",
  "No medical, dental, or emergency advice",
  "Staff keeps every clinical decision",
];

const baaFlow = [
  {
    title: "Business review",
    copy: "Demo forms, pricing conversations, and pilot requests stay business-side. Please do not enter patient information in public forms.",
  },
  {
    title: "Secure BAA signature",
    copy: "We send the Business Associate Agreement by DocuSign-style secure e-signature, or provide portal-based signing if that is the cleaner path for your practice.",
  },
  {
    title: "SOP approval",
    copy: "Scripts, emergency language, escalation rules, staff recipients, and integration destinations are approved before live calls begin.",
  },
  {
    title: "Live PHI handling",
    copy: "Patient-facing coverage starts only after BAA and SOP signoff. Friction should never be the reason patients are less protected.",
  },
];

const complianceLayers = [
  {
    title: "Signed BAA",
    copy: "A BAA defines how CayesDesk may create, receive, maintain, transmit, safeguard, and return or delete PHI for your practice.",
    Icon: FileSignature,
  },
  {
    title: "Minimum necessary",
    copy: "The concierge captures only what staff needs for follow-up: caller identity, contact, consult interest, language, timing, and routing context.",
    Icon: UserCheck,
  },
  {
    title: "Patient safety boundaries",
    copy: "Clinical, diagnostic, treatment, medication, aftercare, and emergency questions are routed to your team or 911 using approved language.",
    Icon: Stethoscope,
  },
  {
    title: "Controlled access",
    copy: "Call summaries and workflow destinations are configured around approved staff recipients, access expectations, and escalation contacts.",
    Icon: LockKeyhole,
  },
];

const dataFlowSteps = [
  "Patient call",
  "Approved concierge script",
  "Staff-ready handoff",
];

const integrationDestinations = [
  "Dentrix, Open Dental, Eaglesoft, Weave, NexHealth, RevenueWell",
  "Zenoti, Boulevard, Aesthetic Record, PatientNow, Podium, Birdeye",
  "Scheduling links, secure staff notifications, webhooks, and API handoffs where supported",
];

const safeguards = [
  "Approved script library and change control",
  "Emergency phrase handling and 911 language",
  "Clinical question refusal language",
  "Escalation matrix by location, service, urgency, and staff role",
  "Subprocessor, legal, and BAA review before launch",
  "Retention, deletion, and incident-contact expectations",
  "No patient-call data used to train public AI models",
  "No patient-facing launch before BAA and SOP approval",
];

export function SecurityOverview() {
  return (
    <>
      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Security &amp; BAA
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.01] text-primary md:text-7xl">
              Patient safety before the first live call.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant md:text-xl">
              CayesDesk is built for HIPAA-compliant patient-call workflows under a signed BAA, with clear clinical boundaries and controlled staff handoffs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container active:scale-[0.98]"
                href={baaReviewMailto}
              >
                Request BAA review
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/15 bg-white px-6 py-3 font-bold text-primary transition hover:bg-surface-container-low active:scale-[0.98]"
                to={startPilotPath}
              >
                Start pilot
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="overflow-hidden rounded-lg bg-surface-container-low">
            <img
              alt="Clinical research handling detail showing controlled sample preparation"
              className="aspect-[4/3] h-full w-full object-cover"
              src={researchContextImage}
            />
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mx-auto mt-12 grid max-w-[92rem] gap-3 md:grid-cols-4">
          {securityHeroPoints.map((point) => (
            <div
              className="border-t border-primary/10 py-5 last:border-b md:border-l md:border-t-0 md:border-b-0 md:pl-5 md:first:border-l-0 md:first:pl-0"
              key={point}
            >
              <BadgeCheck className="h-5 w-5 text-on-tertiary-container" />
              <p className="mt-3 text-sm font-extrabold leading-6 text-primary">
                {point}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-[#f7f8f8] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.42fr_0.58fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Why the BAA matters
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl">
              A phone call can become protected health information in seconds.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="space-y-6 text-lg leading-8 text-on-surface-variant">
            <p>
              A Business Associate Agreement is the written contract your practice uses when a vendor may create, receive, maintain, or transmit PHI on your behalf. For CayesDesk, that can include live call audio, transcripts, caller ID, appointment requests, consult interest, summaries, and routing details.
            </p>
            <p>
              HIPAA is not just paperwork here. It determines what CayesDesk may collect, where it may send information, who may access it, how it is safeguarded, and when the caller must be routed back to licensed staff.
            </p>
            <p className="font-semibold text-primary">
              We value HIPAA because the people behind CayesDesk have worked inside oncology clinical research, where respect for persons, protocol discipline, and careful patient-data handling are daily operating requirements.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[92rem]">
          <Reveal className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
                Compliance layers
              </p>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-5xl">
                Compliance is a workflow, not a badge.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-on-surface-variant lg:justify-self-end">
              CayesDesk combines signed agreements, controlled scripts, staff routing, data safeguards, and safety boundaries before a practice goes live.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {complianceLayers.map((layer, index) => {
              const Icon = layer.Icon;

              return (
                <Reveal delay={index * 0.05} key={layer.title}>
                  <article className="h-full border-y border-primary/10 py-7">
                    <Icon className="h-7 w-7 text-primary-container" />
                    <h3 className="mt-5 font-display text-2xl font-extrabold text-primary">
                      {layer.title}
                    </h3>
                    <p className="mt-4 leading-7 text-on-surface-variant">
                      {layer.copy}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary px-5 py-16 text-white sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.46fr_0.54fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#91e5df]">
              Minimum necessary data flow
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] md:text-6xl">
              Collect what staff needs. Route the rest.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              CayesDesk is configured to capture the least practical information needed for follow-up: name, phone, service interest, location, preferred timing, language, and callback context.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-lg border border-white/12 bg-white/7 p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-3">
              {dataFlowSteps.map((step) => (
                <div
                  className="rounded-md border border-white/14 bg-white/8 p-5"
                  key={step}
                >
                  <p className="font-display text-xl font-extrabold">{step}</p>
                </div>
              ))}
            </div>
            <div className="cd-flow-track mt-7 h-px bg-white/22" />
            <p className="mt-7 text-sm leading-6 text-blue-100">
              It should not solicit diagnosis, Social Security numbers, card data, treatment decisions, or sensitive clinical detail unless your practice has explicitly approved that workflow.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-36">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Signing and launch
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl">
              Friction should never be the reason patients are less protected.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
              We make the compliance path simple: DocuSign-style secure e-signature, or portal-based signing if your team prefers. No live patient-facing coverage begins until the right documents and workflows are approved.
            </p>
          </Reveal>

          <div className="border-y border-primary/10">
            {baaFlow.map((step, index) => (
              <Reveal delay={index * 0.04} key={step.title}>
                <article className="grid gap-5 border-b border-primary/10 py-8 last:border-b-0 md:grid-cols-[5rem_1fr]">
                  <p className="font-display text-4xl font-extrabold leading-none text-primary/25">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-7 text-on-surface-variant">
                      {step.copy}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f8] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.48fr_0.52fr] lg:items-center">
          <Reveal className="overflow-hidden rounded-lg bg-surface-container-low">
            <img
              alt="Premium private practice reception showing controlled professional handoff environment"
              className="aspect-[4/3] h-full w-full object-cover"
              src={surgeryPracticeImage}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              CRM, PMS, EHR, and messaging systems
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-5xl">
              Your stack stays your stack. CayesDesk routes into it cleanly.
            </h2>
            <p className="mt-5 text-lg leading-8 text-on-surface-variant">
              CayesDesk can send structured summaries into approved destinations such as practice-management systems, aesthetic CRMs, scheduling tools, secure staff notifications, webhooks, or API handoffs where supported. The compliance work is deciding what fields are allowed, which staff receive them, where they land, how long they are retained, and what happens if a destination is unavailable.
            </p>
            <div className="mt-8 grid gap-3">
              {integrationDestinations.map((destination) => (
                <div
                  className="flex items-start gap-3 border-t border-primary/10 py-4"
                  key={destination}
                >
                  <Route className="mt-1 h-5 w-5 shrink-0 text-primary-container" />
                  <p className="font-semibold leading-7 text-primary">
                    {destination}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.36fr_0.64fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              SOP and legal safeguards
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-5xl">
              The guardrails are written before the phone rings.
            </h2>
          </Reveal>
          <div className="grid gap-x-8 gap-y-0 md:grid-cols-2">
            {safeguards.map((item, index) => (
              <Reveal delay={index * 0.025} key={item}>
                <div className="flex gap-3 border-t border-primary/10 py-5">
                  <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-container" />
                  <p className="font-semibold leading-7 text-on-surface-variant">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-container px-5 py-16 text-white sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[92rem] gap-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Legal packet
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Give your compliance team the review path they expect.
            </h2>
          </div>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
            href={baaReviewMailto}
          >
            Request BAA copy
            <FileSignature className="h-5 w-5" />
          </a>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
            href={supportMailto}
          >
            Book security review
            <DatabaseZap className="h-5 w-5" />
          </a>
        </div>
      </section>
    </>
  );
}

export function LiveDemoLine() {
  useEffect(() => {
    trackEvent("demo_line_viewed");
  }, []);

  return (
    <LegalPage
      eyebrow="Live Demo"
      title="Live demo line"
      intro={
        <span>
          Hear how CayesDesk handles a real high-ticket caller experience before
          you start a pilot. Call{" "}
          <a
            className="font-extrabold text-white underline decoration-tertiary-fixed decoration-2 underline-offset-4"
            href={sitePhoneHref}
            onClick={() => trackEvent("cta_call_clicked", { page: "/demo-line" })}
          >
            {sitePhoneDisplay}
          </a>
          .
        </span>
      }
      trustPoints={["English, Spanish, and French", "Approved scripts", "Staff handoff"]}
      sections={[
        {
          title: "Call the demo line",
          body: [
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 font-bold text-white transition hover:bg-primary-container"
              href={sitePhoneHref}
              onClick={() => trackEvent("cta_call_clicked", { page: "/demo-line", source: "cta_button" })}
            >
              <PhoneCall className="h-5 w-5" />
              {sitePhoneDisplay}
            </a>,
          ],
          bullets: [
            "Review English, Spanish, and French call handling.",
            "Test appointment request capture and staff summary formatting.",
            "Confirm escalation language before any patient-facing launch.",
          ],
        },
      ]}
    />
  );
}

export function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      lastUpdated="April 26, 2026"
      intro="CayesDesk, operated by Oncova Clinical Research LLC, takes the privacy and security of healthcare data with the utmost seriousness. This Privacy Policy explains how we collect, use, and protect data when you use our website and B2B software services."
      trustPoints={[
        "100% HIPAA Compliant",
        "BAA Included",
        "No public AI model training",
      ]}
      sections={[
        {
          title: "Our Commitment to Privacy",
          body: [
            "CayesDesk is built for high-ticket private clinics that need missed-call and after-hours concierge coverage without weakening patient privacy. We treat clinic communication, caller details, and conversion rules as sensitive information.",
          ],
        },
        {
          title: "Distinction Between Business Data and Patient Data (PHI)",
          bullets: [
            <>
              <strong>Business Data:</strong> When clinics visit our website or
              sign up, we collect B2B contact details, billing information
              processed securely through PayPal Business, and
              operational FAQs used to configure the concierge.
            </>,
            <>
              <strong>Patient Data (PHI):</strong> As an inbound Intelligent
              Patient Concierge, CayesDesk temporarily processes audio
              recordings, transcripts, caller ID, and appointment requests
              provided by patients. This data is classified as Protected Health
              Information (PHI).{" "}
              <strong>This Privacy Policy does NOT govern PHI.</strong>{" "}
              All PHI is governed by HIPAA and the specific Business Associate
              Agreement (BAA) we execute with your healthcare provider.
            </>,
          ],
        },
        {
          title: "Zero-Retention AI Training Policy",
          body: [
            <>
              CayesDesk explicitly guarantees that{" "}
              <strong>
                no patient data, call audio, or transcripts are ever used to
                train public Large Language Models (LLMs)
              </strong>{" "}
              or foundational AI models such as OpenAI, Gemini, or ElevenLabs.
              Patient data processed through CayesDesk is securely siloed,
              processed momentarily to provide the immediate service, such as
              routing a summary SMS to your staff, and handled in strict
              accordance with HIPAA.
            </>,
          ],
        },
        {
          title: "Data Security & Sub-processors",
          body: [
            "We implement enterprise-grade security, including AES-256 encryption for data at rest and TLS 1.2+ for data in transit. We strictly utilize HIPAA-eligible infrastructure and sub-processors, including secure telecom providers and encrypted cloud hosts. We maintain downstream Business Associate Agreements (BAAs) with all critical sub-processors.",
          ],
        },
        {
          title: "TCPA and Communications",
          body: [
            "CayesDesk acts as an inbound routing and response system. By providing CayesDesk with staff phone numbers for SMS summaries, the Clinic consents to receive automated text messages from CayesDesk related to patient inquiries and system alerts.",
          ],
        },
      ]}
      ctaLabel="Contact Support"
    />
  );
}

export function TermsOfService() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="April 26, 2026"
      intro='By accessing or using CayesDesk ("Service"), you agree to these Terms of Service for healthcare concierge call support.'
      trustPoints={["Approved scripts", "BAA Included", "No clinical advice"]}
      sections={[
        {
          title: "Acceptance of Terms",
          body: [
            'By accessing or using CayesDesk ("Service"), you ("Client", "Practice", or "Covered Entity") agree to be bound by these Terms of Service. CayesDesk is a B2B software service operated by Oncova Clinical Research LLC ("Company", "we", "us", or "our"), designed to provide concierge call support for high-ticket private healthcare practices.',
          ],
        },
        {
          title: "No Medical Advice, Diagnosis, or Triage",
          body: [
            <>
              CayesDesk is strictly a concierge communication tool.{" "}
              <strong>
                The Service is NOT a medical device, nor does it provide
                clinical triage, diagnostic advice, or medical guidance.
              </strong>{" "}
              The AI is programmed to expressly decline giving medical advice
              and will direct patients experiencing medical emergencies to hang
              up and dial 911. The Client assumes full responsibility for all
              clinical care, medical decisions, and patient outcomes. CayesDesk
              assumes no liability for medical outcomes, delayed treatment, or
              clinical errors.
            </>,
          ],
        },
        {
          title: "Fair Use Policy & Minute Thresholds",
          body: [
            "To ensure high-quality, ultra-low latency voice generation for all clients, and to prevent system abuse by outbound call centers, our flat-rate subscription tiers are governed by a Fair Use Policy.",
          ],
          bullets: [
            <>
              <strong>The Threshold:</strong> Boutique ($599/mo), Premier
              ($999/mo), and Concierge / Enterprise ($1,499+/mo) plans include
              usage thresholds aligned to the subscription selected in PayPal
              Business, including up to <strong>1,500 minutes</strong> of AI
              conversational voice per billing cycle. This comfortably covers
              the overflow and after-hours volume of a standard single-location
              private practice.
            </>,
            <>
              <strong>Overages:</strong> If a Client's usage consistently
              exceeds 1,500 minutes in a single billing cycle, CayesDesk reserves
              the right to charge standard overage rates of $0.15 per additional
              minute, or transition the Client to Concierge / Enterprise. We
              will provide written notice prior to applying overage charges.
            </>,
            <>
              <strong>Prohibited Use:</strong> The Service is strictly for
              inbound call handling, missed-call interception, and authorized
              clinic-approved follow-ups. Using CayesDesk as a high-volume
              outbound auto-dialer or telemarketing system is strictly
              prohibited.
            </>,
          ],
        },
        {
          title: "7-Day Live Pilot & Billing",
          body: [
            <>
              If participating in a {trialDurationDays}-day live pilot, the
              Client authorizes the {livePilotPriceLabel} pilot structure shown
              at checkout. {pilotOfferSummary} Monthly renewals continue under
              the selected plan if the practice continues. To stop before
              continuing,{" "}
              <a className="font-bold text-primary underline decoration-primary-fixed underline-offset-4" href={cancellationMailto}>
                email support before the pilot ends
              </a>
              . Bespoke Concierge Configuration &amp; Integration Fees of $1,500 -
              $2,500 are non-refundable once custom voice mapping and system
              integrations have commenced, unless expressly waived in writing.
            </>,
          ],
        },
        {
          title: "Limitation of Liability and Indemnification",
          body: [
            "To the maximum extent permitted by law, Oncova Clinical Research LLC shall not be liable for any indirect, incidental, or consequential damages, including lost revenue, lost patients, or medical malpractice claims arising from the use or inability to use the Service. The Client agrees to indemnify and hold harmless the Company from any claims arising from the Client's medical practice.",
          ],
        },
      ]}
    />
  );
}

export function BusinessAssociateAgreement() {
  return (
    <LegalPage
      eyebrow="HIPAA & BAA"
      title="CayesDesk HIPAA Compliance & Business Associate Agreement (BAA)"
      intro="At CayesDesk, operated by Oncova Clinical Research LLC, we understand that trust is the foundation of healthcare. We do not treat HIPAA compliance as an afterthought; it is built into the core architecture of our Intelligent Patient Concierge."
      trustPoints={[
        "100% HIPAA Compliant",
        "BAA Included",
        "Signed before live calls",
      ]}
      sections={[
        {
          title: "What is a BAA?",
          body: [
            'Under the Health Insurance Portability and Accountability Act (HIPAA), a "Covered Entity" such as your medical practice, Med Spa, or dental clinic must have a written Business Associate Agreement (BAA) with any "Business Associate" such as CayesDesk that handles Protected Health Information (PHI) on its behalf.',
          ],
        },
        {
          title: "Our HIPAA Posture & Commitment to You",
          bullets: [
            <>
              <strong>Strict PHI Safeguards:</strong> All Protected Health
              Information (PHI), including call transcripts, audio recordings,
              and SMS summaries routed to your staff, is encrypted both in
              transit (TLS 1.2+) and at rest (AES-256).
            </>,
            <>
              <strong>No Public AI Model Training:</strong> We utilize
              enterprise-tier infrastructure for our AI models. Your patients'
              data is strictly siloed. It is never used to train public AI
              models or shared with public LLM databases.
            </>,
            <>
              <strong>Minimum Necessary Rule:</strong> Our AI is programmed to
              collect only the minimum necessary information required to route
              the patient's request to your staff, such as name, phone number,
              and reason for visit.
            </>,
            <>
              <strong>Compliant Subprocessors:</strong> Our telecommunications
              and cloud infrastructure providers operate under enterprise-grade
              BAAs.
            </>,
            <>
              <strong>Clinical Guardrails:</strong> Our system is hardcoded with
              approved communication guardrails. It redirects clinical, diagnostic, or
              emergency inquiries to your human staff or 911, reducing clinical
              risk exposure for your practice.
            </>,
          ],
        },
        {
          title: "Executing Your BAA",
          body: [
            "A Business Associate Agreement is legally required before we can activate your Intelligent Patient Concierge to handle live patient calls.",
            `Once you select your plan and initiate ${trialCtaLabel}, our onboarding team will automatically send our standard, legally vetted BAA via secure e-signature, such as DocuSign. Your live pilot will only commence after this document is signed by an authorized representative of your practice.`,
            "If your legal or compliance team requires a copy of our standard BAA for review prior to booking a demo, please use Contact Support to request a copy.",
          ],
        },
      ]}
      ctaLabel="Contact Support"
    />
  );
}
