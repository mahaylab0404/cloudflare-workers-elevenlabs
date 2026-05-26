import { ArrowRight, BadgeCheck, PhoneCall, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { sitePhoneDisplay, sitePhoneHref } from "../lib/flow";

export default function BookDemo() {
  return (
    <section className="flex-1 bg-surface">
      <div className="bg-primary text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 md:py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Live concierge line
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Call the concierge. Hear the conversion path live.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              The fastest way to understand CayesDesk is to call it. Test the
              human-sounding concierge in English, Spanish, or French and hear
              how a high-ticket cash-pay inquiry is handled before voicemail
              costs you the appointment.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-3 rounded-md bg-white px-7 py-4 font-display text-xl font-extrabold text-primary transition hover:bg-blue-50"
                href={sitePhoneHref}
              >
                <PhoneCall className="h-6 w-6" />
                {sitePhoneDisplay}
              </a>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                to="/pricing"
              >
                View flat-rate pricing
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-6 shadow-[0_20px_60px_rgba(0,10,30,0.2)] backdrop-blur md:p-8">
            <div className="space-y-4">
              {[
                [
                  "Enterprise-Grade Security",
                  "100% HIPAA Compliant. BAA Included on Day One.",
                ],
                [
                  "Predictable Flat-Rate Pricing",
                  "Zero per-minute meter anxiety for premium call coverage.",
                ],
                [
                  "Cash-Pay Conversion Focus",
                  "Built for Cosmetic & Implant Dentistry, med spas, plastic surgery, and high-ticket private clinics.",
                ],
              ].map(([title, copy]) => (
                <div
                  className="rounded-lg border border-white/10 bg-white/8 p-4"
                  key={title}
                >
                  <div className="flex gap-3">
                    {title === "Enterprise-Grade Security" ? (
                      <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                    ) : (
                      <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                    )}
                    <div>
                      <h2 className="font-display text-lg font-extrabold text-white">
                        {title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-blue-100">
                        {copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
