import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Headphones,
  PhoneCall,
  PhoneIncoming,
  ShieldCheck,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import heroClinicImage from "../assets/redesign/hero-clinic-concierge.jpg";
import {
  liveDemoLinePath,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
} from "../lib/flow";

type Icon = ComponentType<{ className?: string }>;

type FlowStep = {
  eyebrow: string;
  title: string;
  copy: string;
  Icon: Icon;
};

type SetupStep = {
  label: string;
  title: string;
  copy: string;
};

type Boundary = {
  title: string;
  copy: string;
  Icon: Icon;
};

const flowSteps: FlowStep[] = [
  {
    eyebrow: "Missed or overflow call",
    title: "Caller reaches CayesDesk",
    copy: "After hours, during procedures, or when the desk is busy, the caller hears your approved concierge voice instead of voicemail.",
    Icon: PhoneIncoming,
  },
  {
    eyebrow: "Approved conversation",
    title: "Intent is captured",
    copy: "CayesDesk collects service interest, location, timing, language needs, and callback details without giving clinical guidance.",
    Icon: Headphones,
  },
  {
    eyebrow: "Staff handoff",
    title: "Team receives the brief",
    copy: "Your staff gets a concise summary with the consult context they need to follow up quickly and professionally.",
    Icon: FileText,
  },
  {
    eyebrow: "Revenue visibility",
    title: "Recovered demand is reported",
    copy: "The pilot closes with a Missed Revenue Report so owners can see what was captured and where coverage matters most.",
    Icon: BarChart3,
  },
];

const setupSteps: SetupStep[] = [
  {
    label: "01",
    title: "Hear the line",
    copy: "Call the live demo before committing to a pilot.",
  },
  {
    label: "02",
    title: "Approve the rules",
    copy: "Set scripts, escalation language, staff routing, and handoff preferences.",
  },
  {
    label: "03",
    title: "Go live",
    copy: "Launch missed-call coverage with staff-ready summaries and QA review.",
  },
];

const handoffItems = [
  "Caller name and callback details",
  "Service or consult interest",
  "Preferred timing and location",
  "Escalation flags for staff review",
];

const boundaries: Boundary[] = [
  {
    title: "Approved language only",
    copy: "Scripts, FAQs, offers, and routing rules are configured with your clinic before coverage starts.",
    Icon: ClipboardCheck,
  },
  {
    title: "No medical or dental advice",
    copy: "CayesDesk can capture intent and route questions, but treatment decisions stay with licensed staff.",
    Icon: ShieldCheck,
  },
  {
    title: "Emergency escalation",
    copy: "Emergency-related language directs callers to call 911 and follows your clinic's escalation rules.",
    Icon: PhoneCall,
  },
];

export default function HowItWorks() {
  return (
    <>
      <section className="bg-[#F8F9FA] px-6 py-16 md:px-8 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal className="max-w-3xl">
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
              How it works
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl lg:text-7xl">
              Missed consult calls become staff-ready follow-ups.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant md:text-xl">
              CayesDesk protects demand for premium cosmetic, implant, and med
              spa practices with an approved concierge call flow your team still
              controls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={sitePhoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container"
              >
                <PhoneCall className="h-5 w-5" />
                Call {sitePhoneDisplay}
              </a>
              <Link
                to={startPilotPath}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/15 bg-white px-6 py-3 font-bold text-primary transition hover:bg-surface-container-low"
              >
                Start the pilot
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.08} className="relative overflow-hidden rounded-lg bg-surface-container-low">
              <img
                alt="Modern cosmetic dental suite showing the environment CayesDesk supports"
                className="aspect-[16/10] h-full w-full object-cover"
                src={heroClinicImage}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/82 to-transparent p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary-fixed">
                  Staff handoff ready
                </p>
                <p className="mt-2 max-w-md font-display text-2xl font-extrabold leading-tight">
                  The clinic stays focused while missed-call demand is captured.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.14} className="border-y border-primary/10 bg-white">
              {setupSteps.map((step) => (
                <article
                  key={step.title}
                  className="grid gap-3 border-b border-primary/10 px-0 py-5 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:items-baseline"
                >
                  <span className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
                    {step.label}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-primary">
                      {step.title}
                    </h2>
                    <p className="mt-2 max-w-lg leading-7 text-on-surface-variant">
                      {step.copy}
                    </p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
            <Reveal>
              <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
                Operating flow
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
                A simple path from unanswered call to revenue signal.
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="max-w-2xl text-lg leading-8 text-on-surface-variant lg:justify-self-end">
              The goal is not to replace your front desk. It is to give the team
              a cleaner starting point when a high-intent caller would otherwise
              disappear.
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-4">
            {flowSteps.map((step, index) => {
              const Icon = step.Icon;

              return (
                <Reveal delay={index * 0.05} key={step.title}>
                <article
                  key={step.title}
                  className="relative border border-primary/10 bg-[#F8F9FA] p-6"
                >
                  {index < flowSteps.length - 1 && (
                    <div className="absolute right-[-1.15rem] top-10 z-10 hidden h-9 w-9 items-center justify-center rounded-full border border-primary/10 bg-white text-primary-container lg:flex">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/10 bg-white text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-6 font-label text-[0.72rem] font-bold uppercase tracking-[0.18em] text-primary-container">
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-7 text-on-surface-variant">
                    {step.copy}
                  </p>
                </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:px-8 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
              What staff receives
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
              A brief, not another inbox chore.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-on-surface-variant">
              Every handoff is designed for quick follow-up by a treatment
              coordinator, manager, or front desk lead.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {handoffItems.map((item) => (
              <div
                key={item}
                className="flex min-h-24 items-start gap-3 border border-primary/10 bg-white p-5"
              >
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-on-tertiary-container" />
                <p className="font-display text-xl font-extrabold leading-snug text-primary">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-10 border-y border-primary/10 py-10 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
                Guardrails
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary md:text-4xl">
                Clear boundaries before the first caller.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {boundaries.map((boundary) => {
                const Icon = boundary.Icon;

                return (
                  <article key={boundary.title}>
                    <Icon className="h-6 w-6 text-primary-container" />
                    <h3 className="mt-4 font-display text-xl font-extrabold text-primary">
                      {boundary.title}
                    </h3>
                    <p className="mt-3 leading-7 text-on-surface-variant">
                      {boundary.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary-container px-6 py-14 text-white md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Next step
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-5xl">
              Hear the concierge flow live.
            </h2>
          </div>
          <a
            href={sitePhoneHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
          >
            <PhoneCall className="h-5 w-5" />
            Call {sitePhoneDisplay}
          </a>
          <Link
            to={liveDemoLinePath}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Demo line details
          </Link>
        </div>
      </section>
    </>
  );
}
