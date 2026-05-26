import { ArrowRight, PhoneCall, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { sitePhoneDisplay, sitePhoneHref } from "../lib/flow";

export default function RequestDemo() {
  return (
    <section className="flex-1 bg-white">
      <div className="bg-[#030b18] px-6 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              Skip the form
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Hear the patient concierge before you schedule anything.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              CayesDesk is built to prove itself in the first call. Tap the live
              line and test the concierge with the kind of high-ticket questions
              your Cosmetic & Implant Dentistry practice, med spa, or cash-pay
              clinic receives after hours.
            </p>
            <a
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-md bg-white px-7 py-4 font-display text-xl font-extrabold text-primary transition hover:bg-blue-50"
              href={sitePhoneHref}
            >
              <PhoneCall className="h-6 w-6" />
              Call {sitePhoneDisplay}
            </a>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-6 shadow-[0_20px_60px_rgba(0,10,30,0.2)] backdrop-blur md:p-8">
            <h2 className="font-display text-2xl font-extrabold">
              What to test on the call
            </h2>
            <div className="mt-6 space-y-5">
              {[
                "Ask about Morpheus8, implants, veneers, GLP-1, or another high-ticket consult.",
                "Switch between English, Spanish, and French.",
                "Listen for the premium tone, concise answers, and appointment-focused next step.",
                "Confirm the concierge stays aligned with approved clinic language and escalates when staff should take over.",
              ].map((item) => (
                <div className="flex gap-3" key={item}>
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <p className="leading-7 text-blue-100">{item}</p>
                </div>
              ))}
            </div>
            <Link
              className="mt-8 inline-flex items-center gap-2 font-bold text-tertiary-fixed transition hover:translate-x-1"
              to="/pricing"
            >
              Review predictable flat-rate pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
