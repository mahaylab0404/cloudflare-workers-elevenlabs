import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  CalendarClock,
  Check,
  ClipboardCheck,
  FileText,
  Languages,
  MapPin,
  Mic,
  Microscope,
  PhoneCall,
  PlugZap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LiveRecoverySlider } from "../components/LiveRecoverySlider";
import heroClinicImage from "../assets/redesign/hero-clinic-concierge.jpg";
import dentalSuiteImage from "../assets/redesign/specialty-dental-suite.jpg";
import medSpaImage from "../assets/redesign/day-spa-suite.jpg";
import plasticSurgeryImage from "../assets/redesign/specialty-plastic-surgery.jpg";
import researchContextImage from "../assets/redesign/research-context.jpg";
import { trackEvent } from "../lib/customerio";
import {
  livePilotPriceLabel,
  pilotPlans,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
} from "../lib/flow";

const specialtyTiles = [
  {
    title: "Cosmetic & Implant Dentistry",
    economics: "Full-arch, implants, veneers, smile design",
    copy: "CayesDesk captures urgency, treatment interest, financing questions, and preferred consult windows before the patient calls another office.",
    details: [
      "Approved implant and cosmetic FAQ language",
      "Financing and consultation-interest capture",
      "Staff-ready summary for rapid follow-up",
    ],
    image: dentalSuiteImage,
    alt: "Modern cosmetic and implant dental suite",
  },
  {
    title: "Med Spas & Aesthetics",
    economics: "Injectables, lasers, body contouring, memberships",
    copy: "Campaign traffic gets answered after hours, in Spanish or English, with a clean handoff for booking or staff review.",
    details: [
      "After-hours ad response before leads cool",
      "Treatment-package and membership interest capture",
      "Booking link or CRM routing for follow-up",
    ],
    image: medSpaImage,
    alt: "Upscale med spa treatment room",
  },
  {
    title: "Plastic Surgery",
    economics: "Consults, procedures, financing, pre-screening",
    copy: "Procedure inquiries receive a premium first response while clinical questions and sensitive decisions stay with your staff.",
    details: [
      "Procedure-interest and financing context",
      "Clear escalation for clinical questions",
      "Warm summary before the lead goes cold",
    ],
    image: plasticSurgeryImage,
    alt: "Upscale private practice reception with warm wood and polished stone",
  },
  {
    title: "Clinical Research (SMO)",
    economics: "Study calls, participant interest, site operations",
    copy: "CayesDesk can support research-site workflows with careful intake, sponsor/site routing, and privacy-conscious handling of participant inquiries.",
    details: [
      "Protocol-aware intake boundaries",
      "Participant contact and study-interest capture",
      "Coordinator-ready routing and documentation support",
    ],
    image: researchContextImage,
    alt: "Clinical research laboratory context with sample vials",
  },
];

const callSteps = [
  {
    number: "01",
    title: "Patient calls",
    copy: "CayesDesk answers with your approved concierge script when staff is in treatment, at lunch, or your practice is closed.",
  },
  {
    number: "02",
    title: "Concierge qualifies",
    copy: "Name, contact, language, consult interest, and urgency are captured without clinical advice or triage.",
  },
  {
    number: "03",
    title: "Workflow updates",
    copy: "Your team receives the handoff inside the systems they already use: CRM, PMS/EHR, scheduling, email, SMS, or automation tools.",
  },
];

const workflowTiles = [
  {
    icon: PlugZap,
    title: "Connects to the stack",
    copy: "CRM, PMS/EHR, scheduling links, email, SMS, and automation workflows can receive the right handoff.",
  },
  {
    icon: CalendarClock,
    title: "Covers the gaps",
    copy: "After-hours, lunch, procedures, weekend ads, and front desk overflow get the same approved first touch.",
  },
  {
    icon: Languages,
    title: "Multilingual by default",
    copy: "English, Spanish, and French callers can be handled without waiting for the right staff member to be free.",
  },
];


export default function Home() {
  const finalCtaRef = useRef<HTMLElement>(null);
  const stickyStartRef = useRef<HTMLDivElement>(null);
  const [stickyCtaEligible, setStickyCtaEligible] = useState(false);
  const [finalCtaInView, setFinalCtaInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const finalCta = finalCtaRef.current;
    const footer = document.querySelector("footer");

    if (!finalCta) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === finalCta) {
            setFinalCtaInView(entry.isIntersecting);
          }

          if (entry.target === footer) {
            setFooterInView(entry.isIntersecting);
          }
        });
      },
      {
        rootMargin: "0px 0px -16% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(finalCta);
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateStickyEligibility = () => {
      const stickyStart = stickyStartRef.current;
      if (!stickyStart) {
        setStickyCtaEligible(false);
        return;
      }

      setStickyCtaEligible(stickyStart.getBoundingClientRect().top <= 160);
    };

    updateStickyEligibility();
    window.addEventListener("scroll", updateStickyEligibility, { passive: true });
    window.addEventListener("resize", updateStickyEligibility);

    return () => {
      window.removeEventListener("scroll", updateStickyEligibility);
      window.removeEventListener("resize", updateStickyEligibility);
    };
  }, []);

  const showLiveCallChip = stickyCtaEligible && !finalCtaInView && !footerInView;

  return (
    <>
      {showLiveCallChip && (
        <a
          aria-label={`Call the CayesDesk live demo line at ${sitePhoneDisplay}`}
          className="fixed bottom-3 right-3 z-40 inline-flex max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-full border border-primary/15 bg-white/96 px-3 py-2.5 text-primary shadow-[0_16px_42px_rgba(0,33,71,0.18)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_52px_rgba(0,33,71,0.24)] focus:outline-none focus:ring-4 focus:ring-tertiary-fixed/60 md:bottom-5 md:right-5"
          data-testid="live-call-chip"
          href={sitePhoneHref}
          onClick={() => trackEvent("cta_call_clicked", { page: "/", source: "sticky_chip" })}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            <PhoneCall className="h-4 w-4" />
          </span>
          <span className="min-w-0 pr-2 text-left">
            <span className="block text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-primary-container">
              Live demo line
            </span>
            <span className="block truncate font-display text-base font-extrabold leading-tight md:text-lg">
              {sitePhoneDisplay}
            </span>
          </span>
        </a>
      )}

      <section className="relative isolate min-h-[calc(88svh-4rem)] overflow-hidden bg-[#08101b] text-white lg:min-h-[calc(88svh-5rem)]">
        <img
          alt="Bright modern cosmetic dental suite prepared for a premium consult"
          className="absolute inset-0 h-full w-full object-cover object-[58%_50%]"
          src={heroClinicImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,24,0.82)_0%,rgba(3,11,24,0.60)_40%,rgba(3,11,24,0.18)_72%,rgba(3,11,24,0.06)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#08101b] to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(88svh-4rem)] max-w-[92rem] items-center px-5 py-10 sm:px-6 md:px-8 lg:min-h-[calc(88svh-5rem)] lg:py-12">
          <div className="max-w-3xl animate-[cd-rise_700ms_ease-out_both]">
            <p className="mb-5 block text-xs font-bold uppercase tracking-[0.22em] text-[#c7fffb] sm:text-sm">
              For premium clinics, med spas, surgery teams, and SMOs
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(3rem,7vw,5.9rem)] font-extrabold leading-[0.98] tracking-normal">
              Paid leads are calling while your team is busy.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 md:text-xl">
              CayesDesk answers missed consult calls like a trained front desk, captures intent, and routes a staff-ready handoff.
            </p>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#c7fffb]">
              Built for high-value cosmetic, implant, med spa, surgery, and clinical research inquiries that cannot sit in voicemail.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={sitePhoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-[#eef8ff] focus:outline-none focus:ring-4 focus:ring-white/35"
                onClick={() => trackEvent("cta_call_clicked", { page: "/", source: "hero_primary" })}
              >
                <PhoneCall className="h-5 w-5" />
                Hear the concierge live
              </a>
              <Link
                to={startPilotPath}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/35 bg-white/8 px-6 py-3 font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/14 focus:outline-none focus:ring-4 focus:ring-white/25"
              >
                Start a 7-day pilot for {livePilotPriceLabel}
              </Link>
            </div>
            <p className="mt-3 text-sm font-medium text-white/72">
              Credited fully toward Month 1.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full border-b border-primary/8 bg-white">
        <div className="mx-auto flex max-w-[92rem] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 py-3.5 sm:px-6 md:px-8">
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary-container" />
            HIPAA-Ready
          </span>
          <span className="text-primary/20" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <FileText className="h-3.5 w-3.5 shrink-0 text-primary-container" />
            BAA Included
          </span>
          <span className="text-primary/20" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <Languages className="h-3.5 w-3.5 shrink-0 text-primary-container" />
            English · Spanish · French
          </span>
          <span className="text-primary/20" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary-container" />
            South Florida &amp; Remote
          </span>
          <span className="text-primary/20" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            <Mic className="h-3.5 w-3.5 shrink-0 text-primary-container" />
            ElevenLabs Voice AI
          </span>
        </div>
      </div>

      <LiveRecoverySlider />

      <section className="bg-white px-5 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-[92rem] border-y border-primary/10 py-10 md:py-12">
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
                Revenue math owners actually feel
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.03] text-primary md:text-6xl">
                Hiring coverage is expensive. Missing consults is worse.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
                A receptionist salary is only the starting point. Benefits, PTO, recruiting, training, language coverage, and after-hours gaps still remain.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ["$44,640+", "annual medical front-office salary benchmark before benefits"],
                ["$11,988", "annual CayesDesk core Practice plan at $999/month"],
                ["24/7", "always-on coverage with English, Spanish, and French support"],
              ].map(([value, label]) => (
                <div
                  className="grid gap-2 border-b border-primary/10 py-5 last:border-b-0 md:grid-cols-[13rem_1fr] md:items-center md:gap-6 xl:grid-cols-[15rem_1fr]"
                  key={label}
                >
                  <p className="font-display text-[clamp(2.65rem,9vw,3.65rem)] font-extrabold leading-none text-primary md:text-5xl">
                    {value}
                  </p>
                  <p className="max-w-xl text-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant sm:tracking-[0.14em]">
                    {label}
                  </p>
                </div>
              ))}
              <p className="pt-2 text-sm leading-6 text-on-surface-variant">
                Salary benchmark references the latest BLS medical secretary / administrative assistant wage data; CayesDesk pricing reflects the core Practice plan. Plans start at $599/month.
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-primary/10 bg-[#071325] p-6 text-white shadow-[0_28px_90px_rgba(0,33,71,0.14)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-tertiary-fixed">
                  <BarChart3 className="h-4 w-4" />
                  Missed revenue tool
                </p>
                <h3 className="mt-5 max-w-2xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
                  See what missed calls are costing your practice.
                </h3>
                <p className="mt-4 max-w-2xl leading-7 text-blue-100">
                  Use the full calculator to model missed calls, case value, close rate, salary benchmark, and CayesDesk coverage cost.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["4", "missed calls / week"],
                  ["$8K", "average case"],
                  ["$27,712", "monthly consult value"],
                ].map(([value, label]) => (
                  <div className="rounded-md border border-white/10 bg-white/[0.06] p-4" key={label}>
                    <p className="font-display text-3xl font-extrabold text-white">
                      {value}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-100/65">
                      {label}
                    </p>
                  </div>
                ))}
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-blue-50 sm:col-span-3"
                  to="/missed-revenue-calculator"
                >
                  Open the missed-revenue calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        ref={stickyStartRef}
        aria-hidden="true"
        data-testid="sticky-start-sentinel"
      />

      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[92rem]">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
                Built for your specialty
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl">
                Different practices lose calls in different ways.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-on-surface-variant lg:justify-self-end">
              CayesDesk is configured around what your practice actually sells, how your staff routes inquiries, and which questions must be escalated instead of answered.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {specialtyTiles.map((tile, index) => (
              <article
                className="group grid overflow-hidden rounded-lg border border-primary/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,33,71,0.12)] active:translate-y-0 md:grid-cols-[0.92fr_1.08fr]"
                key={tile.title}
              >
                <div className="relative min-h-72 overflow-hidden bg-surface-container-low">
                  <img
                    alt={tile.alt}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    src={tile.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/64 via-primary/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-primary shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
                    {index === 0 && <><Sparkles className="h-4 w-4 shrink-0" />Implant &amp; Cosmetic</>}
                    {index === 1 && <><Sparkles className="h-4 w-4 shrink-0" />Aesthetics &amp; Spa</>}
                    {index === 2 && <><Sparkles className="h-4 w-4 shrink-0" />Surgical Consults</>}
                    {index === 3 && <><Microscope className="h-4 w-4 shrink-0" />SMO</>}
                  </div>
                </div>
                <div className="flex flex-col p-6 md:p-7">
                  <p className="text-sm font-extrabold text-primary-container">
                    {tile.economics}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-extrabold text-primary">
                    {tile.title}
                  </h3>
                  <p className="mt-3 leading-7 text-on-surface-variant">
                    {tile.copy}
                  </p>
                  <div className="mt-5 grid gap-3 border-t border-primary/10 pt-5">
                    {tile.details.map((detail) => (
                      <div className="flex items-start gap-3 text-sm font-semibold leading-6 text-on-surface-variant" key={detail}>
                        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-container" />
                        {detail}
                      </div>
                    ))}
                  </div>
                  <Link
                    className="mt-6 inline-flex items-center gap-2 font-bold text-primary transition hover:translate-x-1"
                    to={startPilotPath}
                  >
                    Try this workflow
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-primary/10 bg-surface-container-low p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                  Not a generic AI receptionist
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold text-primary md:text-4xl">
                  Your script, your escalation rules, your workflow.
                </h3>
              </div>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-container"
                href={sitePhoneHref}
              >
                <PhoneCall className="h-5 w-5" />
                Hear the concierge live
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f8] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
              Workflow fit
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl">
              It fits the systems your staff already uses.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-on-surface-variant">
              A patient concierge should feel like extra capacity, not another inbox your staff has to babysit.
            </p>
          </div>
          <div>
            <div className="border-y border-primary/10">
            {callSteps.map((step) => (
              <article
                className="grid gap-5 border-b border-primary/10 py-8 last:border-b-0 md:grid-cols-[7rem_1fr]"
                key={step.title}
              >
                <div className="font-display text-5xl font-extrabold leading-none text-primary/20 md:text-6xl">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-2xl leading-7 text-on-surface-variant">
                    {step.copy}
                  </p>
                </div>
              </article>
            ))}
            <p className="py-6 text-sm leading-6 text-on-surface-variant">
              CayesDesk does not provide medical or dental advice, triage, or emergency handling. All clinical questions route to your staff.
            </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {workflowTiles.map((tile) => {
                const Icon = tile.icon;

                return (
                  <article
                    className="rounded-lg border border-primary/10 bg-white p-5 shadow-[0_16px_45px_rgba(0,33,71,0.05)]"
                    key={tile.title}
                  >
                    <Icon className="h-6 w-6 text-primary-container" />
                    <h3 className="mt-5 font-display text-xl font-extrabold text-primary">
                      {tile.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                      {tile.copy}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary px-5 py-16 text-white sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#91e5df]">
              Pilot and pricing
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] md:text-6xl">
              Start with 7 days on real calls.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              {livePilotPriceLabel} credited fully toward Month 1. Plans start at $599/month; the core Practice plan is $999/month.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={startPilotPath}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
              >
                Start a 7-day pilot for {livePilotPriceLabel}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={sitePhoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                <PhoneCall className="h-5 w-5" />
                Hear the concierge live
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-white/14 bg-white p-6 text-primary shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8">
            <div className="grid divide-y divide-primary/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {(["boutique", "premier", "concierge"] as const).map((planId) => {
                const plan = pilotPlans[planId];
                const featured = planId === "premier";
                return (
                  <div
                    key={planId}
                    className={`relative flex flex-col gap-3 px-5 py-5 first:pl-0 last:pr-0 ${featured ? "sm:rounded-md sm:-my-5 sm:bg-surface-container-low sm:py-6 sm:shadow-[0_8px_28px_rgba(0,33,71,0.08)]" : ""}`}
                  >
                    {featured && (
                      <div className="mb-1 inline-flex items-center gap-1.5 self-start rounded-full bg-primary px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-white">
                        <Sparkles className="h-3 w-3 shrink-0" />
                        Popular
                      </div>
                    )}
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-container">
                      {plan.title}
                    </p>
                    <p className="font-display text-3xl font-extrabold leading-none text-primary">
                      {plan.priceLabel}
                      <span className="ml-1 text-sm font-semibold text-on-surface-variant">{plan.monthlyLabel}</span>
                    </p>
                    <p className="text-xs leading-5 text-on-surface-variant">
                      {planId === "boutique" && "Smaller or single-focus practices"}
                      {planId === "premier" && "The recommended post-pilot fit"}
                      {planId === "concierge" && "Multi-location or enterprise"}
                    </p>
                    {featured && (
                      <ul className="mt-1 grid gap-2">
                        {pilotPlans.premier.features.slice(1).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs leading-5 text-on-surface-variant">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-container" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-5">
              <p className="text-sm font-semibold text-on-surface-variant">
                All plans start with a {livePilotPriceLabel} 7-day live pilot, credited toward Month 1.
              </p>
              <Link
                to="/pricing"
                className="inline-flex shrink-0 items-center gap-1.5 font-bold text-primary-container transition hover:translate-x-0.5"
              >
                Full pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={finalCtaRef}
        className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24"
      >
        <div className="mx-auto grid max-w-[92rem] gap-8 border-y border-primary/10 py-10 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-container">
              Next step
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
              Hear the concierge before the next paid lead goes to voicemail.
            </h2>
          </div>
          <a
            href={sitePhoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container"
          >
            <PhoneCall className="h-5 w-5" />
            {sitePhoneDisplay}
          </a>
          <Link
            to={startPilotPath}
            className="inline-flex items-center justify-center rounded-md border border-primary/15 px-6 py-3 font-bold text-primary transition hover:bg-surface-container-low"
          >
            Start pilot
          </Link>
        </div>
      </section>
    </>
  );
}
