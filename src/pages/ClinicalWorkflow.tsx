import { PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import {
  sitePhoneDisplay,
  sitePhoneHref,
} from "../lib/flow";

const workflowSteps = [
  {
    step: "01",
    title: "Patient calls",
    copy: "Overflow and after-hours calls route into a scripted front desk experience.",
  },
  {
    step: "02",
    title: "CayesDesk answers",
    copy: "The concierge greets callers naturally in English, Spanish, or French.",
  },
  {
    step: "03",
    title: "Request captured",
    copy: "Intent, contact details, and preferred next steps are collected.",
  },
  {
    step: "04",
    title: "Summary sent",
    copy: "Staff receives a concise concierge handoff.",
  },
  {
    step: "05",
    title: "Staff follows up",
    copy: "Your team keeps control of scheduling and clinical decisions.",
  },
];

const operatingRules = [
  {
    title: "Approved language only",
    copy: "CayesDesk launches from your clinic's scripts, not generic medical advice.",
  },
  {
    title: "Approved boundaries",
    copy: "Scheduling, hours, parking, pricing language, and consult intent stay in scope. Care questions route to staff.",
  },
  {
    title: "Clear escalation",
    copy: "Emergency language and uncertainty follow your handoff rules immediately.",
  },
];

export default function ClinicalWorkflow() {
  return (
    <>
      <section className="bg-[#030b18] px-6 py-20 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Call flow
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] md:text-7xl">
              A simple plan your front desk can trust.
            </h1>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-blue-100 md:text-xl">
              Patients want to be answered. Your team needs a handoff that is
              useful, secure, and clearly inside your approved concierge rules.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={sitePhoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
              >
                <PhoneCall className="h-5 w-5" />
                Call {sitePhoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Simple plan
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-primary md:text-5xl">
              A call flow your front desk can trust.
            </h2>
            <p className="mt-5 text-lg leading-8 text-on-surface-variant">
              Start with approved language, define exactly where handoffs
              belong, and keep the experience calm for high-value patient
              inquiries.
            </p>
          </div>
          <div className="border-y border-primary/12">
            {workflowSteps.map((step) => (
              <article
                key={step.title}
                className="grid gap-3 border-b border-primary/10 py-6 last:border-b-0 md:grid-cols-[5rem_0.85fr_1.15fr] md:items-baseline"
              >
                <span className="font-label text-xs font-bold uppercase tracking-[0.24em] text-primary-container">
                  {step.step}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
                  {step.title}
                </h3>
                <p className="max-w-xl leading-7 text-on-surface-variant">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Guardrails
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-primary md:text-5xl">
              The experience is scripted before calls go live.
            </h2>
          </div>
          <div className="border-y border-primary/10">
            {operatingRules.map((rule) => (
              <article
                key={rule.title}
                className="grid gap-3 border-b border-primary/10 py-6 last:border-b-0 md:grid-cols-[0.55fr_1fr]"
              >
                <h3 className="font-display text-2xl font-extrabold text-primary">
                  {rule.title}
                </h3>
                <p className="leading-7 text-on-surface-variant">{rule.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-container px-6 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Next step
            </p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
              Approve the flow, then stop missing calls.
            </h2>
          </div>
          <a
            href={sitePhoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
          >
            <PhoneCall className="h-5 w-5" />
            Call {sitePhoneDisplay}
          </a>
          <Link
            to="/faq"
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Read FAQ
          </Link>
        </div>
      </section>
    </>
  );
}
