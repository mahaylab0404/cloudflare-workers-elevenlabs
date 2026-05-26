import {
  ArrowRight,
  CalendarCheck,
  MessageSquareText,
  PhoneIncoming,
  UserRoundCheck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { trackEvent } from "../lib/customerio";
import {
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
} from "../lib/flow";

type Moment = {
  answer: string;
  caller: string;
  handoff: string;
  label: string;
  risk: string;
  time: string;
  title: string;
  value: string;
};

const baseMoments: Moment[] = [
  {
    time: "12:18 PM",
    label: "Implant lead",
    title: "Full-arch consult during procedures",
    value: "$15K+",
    risk: "Would have hit voicemail",
    caller: "Implant case value and financing questions",
    answer: "Approved front-desk script, calm tone, no clinical advice",
    handoff: "Name, phone, consult intent, and urgency sent to staff",
  },
  {
    time: "7:46 PM",
    label: "Med spa ad",
    title: "Aesthetic lead after the campaign clicks",
    value: "$4K+",
    risk: "Lead cooling after hours",
    caller: "Laser, injectable, and package inquiry",
    answer: "English or Spanish response without waiting for staff",
    handoff: "Booking link, summary, and next step routed to workflow",
  },
  {
    time: "CURRENT_DAY",
    label: "Surgery inquiry",
    title: "Procedure inquiry outside office capacity",
    value: "Five figures",
    risk: "Competitor call next",
    caller: "Procedure, financing, location, and consult questions",
    answer: "Clear boundaries: no triage, no advice, staff escalation",
    handoff: "Staff sees a clean next step before the lead goes cold",
  },
];

function getCurrentDayLabel(): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(new Date())
    .toUpperCase();
}

export function LiveRecoverySlider() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentDay = useMemo(() => getCurrentDayLabel(), []);
  const moments = useMemo(
    () =>
      baseMoments.map((moment) => ({
        ...moment,
        time: moment.time === "CURRENT_DAY" ? currentDay : moment.time,
      })),
    [currentDay],
  );
  const activeMoment = moments[activeIndex];

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % moments.length);
    }, 5600);

    return () => window.clearInterval(interval);
  }, [moments.length, reduceMotion]);

  return (
    <section
      aria-label="Live missed consult recovery examples"
      className="bg-[#071325] px-5 py-10 text-white sm:px-6 md:px-8 md:py-12"
    >
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.68fr_1.32fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
            What CayesDesk protects
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Paid leads should not wait for a callback.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-blue-100">
            When ads are live and staff is busy, CayesDesk gives high-value callers an immediate, approved first response.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-blue-50"
              href={sitePhoneHref}
              onClick={() => trackEvent("cta_call_clicked", { page: "/", source: "recovery_slider" })}
            >
              <PhoneIncoming className="h-5 w-5" />
              Hear it live
            </a>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10"
              to={startPilotPath}
            >
              Start pilot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-wrap gap-2 border-b border-white/10 p-4">
            {moments.map((moment, index) => (
              <button
                aria-pressed={activeIndex === index}
                className={`rounded-full border px-3 py-2 text-left text-xs font-extrabold uppercase tracking-[0.12em] transition ${
                  activeIndex === index
                    ? "border-tertiary-fixed bg-tertiary-fixed text-on-tertiary-fixed"
                    : "border-white/12 bg-white/5 text-blue-100 hover:border-white/28 hover:bg-white/10"
                }`}
                key={moment.title}
                onClick={() => setActiveIndex(index)}
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
                className="flex flex-col"
                exit={reduceMotion ? undefined : { opacity: 0, x: -22 }}
                initial={reduceMotion ? false : { opacity: 1, x: 22 }}
                key={activeMoment.title}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
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
                        Case value
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
                    ["Caller", activeMoment.caller, PhoneIncoming],
                    ["Answer", activeMoment.answer, MessageSquareText],
                    ["Handoff", activeMoment.handoff, CalendarCheck],
                  ].map(([label, copy, Icon]) => (
                    <motion.div
                      className="rounded-md border border-white/10 bg-white/[0.055] p-4 transition hover:-translate-y-1 hover:border-tertiary-fixed/50 hover:bg-white/[0.075]"
                      key={label as string}
                      whileHover={reduceMotion ? undefined : { y: -4 }}
                    >
                      <Icon className="h-5 w-5 text-tertiary-fixed" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-100/60">
                        {label as string}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-blue-50">
                        {copy as string}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100">
                      <UserRoundCheck className="h-4 w-4 text-tertiary-fixed" />
                      The patient feels answered. Staff gets context.
                    </p>
                    <p className="text-sm font-semibold text-blue-100">
                      Demo line: {sitePhoneDisplay}
                    </p>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={reduceMotion ? undefined : { width: "100%" }}
                      className="h-full rounded-full bg-tertiary-fixed"
                      initial={{ width: "0%" }}
                      key={`${activeMoment.title}-progress`}
                      transition={{ duration: 5.45, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
