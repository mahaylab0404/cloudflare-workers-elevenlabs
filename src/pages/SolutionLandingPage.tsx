import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronRight,
  Languages,
  LockKeyhole,
  PhoneCall,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import { trackEvent } from "../lib/customerio";
import {
  livePilotPriceLabel,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
} from "../lib/flow";
import type { SolutionLandingPage as SolutionLandingPageData } from "../lib/solutionLandingPages";

type SolutionLandingPageProps = {
  page: SolutionLandingPageData;
};

export default function SolutionLandingPage({ page }: SolutionLandingPageProps) {
  const reduceMotion = useReducedMotion();
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);
  const activeMoment = page.moments[activeMomentIndex];
  const structuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "CayesDesk",
            item: "https://cayesdesk.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.navLabel,
            item: `https://cayesdesk.com${page.path}`,
          },
        ],
      },
    ],
    [page],
  );

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />

      <section className="relative isolate min-h-[calc(88svh-7rem)] overflow-hidden bg-[#071325] text-white lg:min-h-[calc(88svh-8rem)]">
        <img
          alt={page.heroAlt}
          className="absolute inset-0 h-full w-full object-cover object-[58%_50%]"
          src={page.heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,24,0.92)_0%,rgba(3,11,24,0.78)_42%,rgba(3,11,24,0.28)_78%,rgba(3,11,24,0.16)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071325] to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(88svh-7rem)] max-w-[92rem] items-center px-5 py-10 sm:px-6 md:px-8 lg:min-h-[calc(88svh-8rem)] lg:py-12">
          <div className="max-w-4xl animate-[cd-rise_700ms_ease-out_both]">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-tertiary-fixed sm:text-sm">
              {page.eyebrow}
            </p>
            <h1 className="max-w-5xl font-display text-[clamp(2.9rem,6.6vw,5.8rem)] font-extrabold leading-[0.98] tracking-normal">
              {page.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 md:text-xl">
              {page.heroSubhead}
            </p>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[#c7fffb]">
              {page.heroProof}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-[#eef8ff] focus:outline-none focus:ring-4 focus:ring-white/35"
                href={sitePhoneHref}
                onClick={() =>
                  trackEvent("cta_call_clicked", {
                    page: page.path,
                    source: "solution_hero",
                  })
                }
              >
                <PhoneCall className="h-5 w-5" />
                Hear the concierge live
              </a>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/24 px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/20"
                to={startPilotPath}
                onClick={() =>
                  trackEvent("cta_start_pilot_clicked", {
                    page: page.path,
                    source: "solution_hero",
                  })
                }
              >
                Start a 7-day pilot for {livePilotPriceLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-sm font-semibold text-white/68">
              Credited fully toward Month 1.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#071325] px-5 pb-14 pt-4 text-white sm:px-6 md:px-8 md:pb-20">
        <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-tertiary-fixed">
              Where calls are lost
            </p>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
              {page.painHeadline}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-blue-100">
              {page.painCopy}
            </p>
          </Reveal>

          <Reveal className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="flex flex-wrap gap-2 border-b border-white/10 p-4">
              {page.moments.map((moment, index) => (
                <button
                  aria-pressed={activeMomentIndex === index}
                  className={`rounded-full border px-3 py-2 text-left text-xs font-extrabold uppercase tracking-[0.12em] transition ${
                    activeMomentIndex === index
                      ? "border-tertiary-fixed bg-tertiary-fixed text-on-tertiary-fixed"
                      : "border-white/12 bg-white/5 text-blue-100 hover:border-white/28 hover:bg-white/10"
                  }`}
                  key={moment.title}
                  onClick={() => setActiveMomentIndex(index)}
                  type="button"
                >
                  {moment.time}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-7">
              <AnimatePresence mode="wait">
                <motion.article
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                  initial={reduceMotion ? false : { opacity: 1, x: 18 }}
                  key={activeMoment.title}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-tertiary-fixed">
                        {activeMoment.label}
                      </p>
                      <h3 className="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight md:text-[2.55rem]">
                        {activeMoment.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                      <div className="rounded-md border border-tertiary-fixed/35 bg-tertiary-fixed px-4 py-3 text-primary">
                        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em]">
                          Value
                        </p>
                        <p className="mt-1 font-display text-3xl font-extrabold leading-none">
                          {activeMoment.value}
                        </p>
                      </div>
                      <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3">
                        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-blue-100/62">
                          Risk
                        </p>
                        <p className="mt-1 text-sm font-extrabold leading-5 text-white">
                          {activeMoment.risk}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 md:grid-cols-3">
                    {[
                      ["Caller", activeMoment.caller],
                      ["Answer", activeMoment.answer],
                      ["Handoff", activeMoment.handoff],
                    ].map(([label, copy]) => (
                      <div
                        className="rounded-md border border-white/10 bg-white/[0.055] p-4 transition hover:-translate-y-1 hover:border-tertiary-fixed/50 hover:bg-white/[0.075]"
                        key={label}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100/60">
                          {label}
                        </p>
                        <p className="mt-3 text-sm font-semibold leading-6 text-blue-50">
                          {copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[92rem] gap-10 border-y border-primary/10 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary-container">
              {page.revenue.eyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              {page.revenue.headline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              {page.revenue.copy}
            </p>
          </Reveal>

          <Reveal className="rounded-lg border border-primary/10 bg-surface-container-low p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-[0.78fr_1fr] sm:items-end">
              <div>
                <p className="font-display text-[clamp(4rem,10vw,7.2rem)] font-extrabold leading-none text-primary">
                  {page.revenue.value}
                </p>
                <p className="mt-3 text-sm font-extrabold uppercase tracking-[0.2em] text-primary-container">
                  {page.revenue.label}
                </p>
              </div>
              <div className="grid gap-3">
                {page.revenue.supporting.map((item) => (
                  <div
                    className="flex gap-3 rounded-md border border-primary/8 bg-white p-4"
                    key={item}
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-on-tertiary-container" />
                    <p className="font-semibold leading-6 text-primary">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary-container">
              Capture
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              {page.captureHeadline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              {page.captureCopy}
            </p>
          </Reveal>
          <div className="grid gap-3">
            {page.captureItems.map((item, index) => (
              <Reveal
                className="grid gap-4 border-t border-primary/10 py-5 sm:grid-cols-[4rem_1fr] sm:items-start"
                delay={index * 0.04}
                key={item}
              >
                <span className="font-display text-4xl font-extrabold text-primary/18">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-lg font-semibold leading-8 text-primary">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-[92rem]">
          <Reveal className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary-container">
              Workflow fit
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              {page.workflowHeadline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              {page.workflowCopy}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {page.workflowItems.map((item, index) => {
              const Icon = [Workflow, Languages, CalendarCheck][index] ?? Workflow;
              return (
                <Reveal
                  className="rounded-lg border border-primary/10 bg-surface-container-low p-6 transition hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,33,71,0.08)]"
                  delay={index * 0.06}
                  key={item}
                >
                  <Icon className="h-6 w-6 text-on-tertiary-container" />
                  <p className="mt-5 text-lg font-extrabold leading-7 text-primary">
                    {item}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#071325] px-5 py-14 text-white sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[92rem] gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-tertiary-fixed">
              Compliance comfort
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {page.guardrailHeadline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              {page.guardrailCopy}
            </p>
            <Link
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-md border border-white/18 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              to="/security"
            >
              Review Security & BAA
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-3">
            {page.guardrailItems.map((item, index) => {
              const Icon = [ShieldCheck, LockKeyhole, BadgeCheck][index] ?? ShieldCheck;
              return (
                <Reveal
                  className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.055] p-5"
                  delay={index * 0.05}
                  key={item}
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <p className="text-lg font-semibold leading-7 text-blue-50">{item}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-[92rem]">
          <Reveal className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-primary-container">
              FAQ
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary md:text-6xl">
              Questions buyers ask before they trust a concierge.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {page.faqs.map((faq, index) => (
              <Reveal
                className="rounded-lg border border-primary/10 bg-surface-container-low p-6"
                delay={index * 0.04}
                key={faq.question}
              >
                <h3 className="font-display text-xl font-extrabold text-primary">
                  {faq.question}
                </h3>
                <p className="mt-3 leading-7 text-on-surface-variant">{faq.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-5 py-14 text-white sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-tertiary-fixed">
              Start with real calls
            </p>
            <h2 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {page.finalHeadline}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              {page.finalCopy}
            </p>
          </Reveal>
          <Reveal className="grid gap-3 sm:min-w-80">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-blue-50"
              href={sitePhoneHref}
              onClick={() =>
                trackEvent("cta_call_clicked", {
                  page: page.path,
                  source: "solution_final",
                })
              }
            >
              <PhoneCall className="h-5 w-5" />
              {sitePhoneDisplay}
            </a>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              to={startPilotPath}
              onClick={() =>
                trackEvent("cta_start_pilot_clicked", {
                  page: page.path,
                  source: "solution_final",
                })
              }
            >
              Start 7-day pilot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
