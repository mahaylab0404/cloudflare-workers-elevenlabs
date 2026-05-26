import { ArrowLeft, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { MissedRevenueCalculator } from "../components/MissedRevenueCalculator";
import { sitePhoneDisplay, sitePhoneHref, startPilotPath } from "../lib/flow";

export default function MissedRevenueTool() {
  return (
    <section className="flex-1 bg-white">
      <div className="bg-[#071325] px-5 py-14 text-white sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-[92rem]">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-tertiary-fixed transition hover:translate-x-[-2px]"
            to="/"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
                Missed revenue calculator
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
                Put a number on the consults your phone is losing.
              </h1>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-blue-100 lg:justify-self-end">
              Model missed calls, case value, normal close rate, salary benchmark, and CayesDesk coverage cost before you start a pilot.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[92rem] px-5 py-10 sm:px-6 md:px-8 md:py-14">
        <MissedRevenueCalculator />

        <div className="mt-10 grid gap-5 rounded-lg border border-primary/10 bg-surface-container-low p-6 md:grid-cols-[1fr_auto_auto] md:items-center md:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-container">
              Next step
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-primary md:text-4xl">
              Try it against real missed calls for 7 days.
            </h2>
          </div>
          <a
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-container"
            href={sitePhoneHref}
          >
            <PhoneCall className="h-5 w-5" />
            {sitePhoneDisplay}
          </a>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/15 px-5 py-3 font-bold text-primary transition hover:bg-white"
            to={startPilotPath}
          >
            Start pilot
          </Link>
        </div>
      </div>
    </section>
  );
}
