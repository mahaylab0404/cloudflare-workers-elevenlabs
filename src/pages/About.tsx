import { ArrowRight, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import researchContextImage from "../assets/redesign/research-context.jpg";
import {
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
} from "../lib/flow";

const credentials = [
  {
    label: "Clinical research discipline",
    copy: "Oncology research experience, University of Florida roots, and healthcare operations judgment shape the product.",
  },
  {
    label: "Operator perspective",
    copy: "The team includes nonprofit leadership and small-business software engineering experience, not generic AI tooling.",
  },
  {
    label: "Research and operations support",
    copy: "Florida Atlantic University students support research and operations while applying what they are currently learning.",
  },
];

export default function About() {
  return (
    <>
      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Behind CayesDesk
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] text-primary md:text-7xl">
              Built by healthcare-minded operators.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant md:text-xl">
              CayesDesk was built for private practices that cannot afford to lose a single consult call.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="overflow-hidden rounded-lg bg-surface-container-low">
            <img
              alt="Clinical research lab detail with prepared sample wells"
              className="aspect-[4/3] h-full w-full object-cover"
              src={researchContextImage}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f8f8] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[92rem]">
          <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
                Company context
              </p>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-primary md:text-5xl">
                Healthcare credibility without corporate posturing.
              </h2>
            </Reveal>
            <div className="border-y border-primary/10">
              {credentials.map((item, index) => (
                <Reveal delay={index * 0.05} key={item.label}>
                <article
                  className="grid gap-4 border-b border-primary/10 py-8 last:border-b-0 md:grid-cols-[14rem_1fr]"
                  key={item.label}
                >
                  <h3 className="font-display text-xl font-extrabold text-primary">
                    {item.label}
                  </h3>
                  <p className="max-w-3xl leading-7 text-on-surface-variant">
                    {item.copy}
                  </p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[92rem] gap-10 border-y border-primary/10 py-10 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
              Oncova Clinical Research LLC
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] text-primary md:text-5xl">
              A healthcare-rooted parent company for a focused concierge product.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">
              CayesDesk is operated by Oncova Clinical Research LLC with a narrow mandate: help high-ticket private clinics recover consult demand that already exists.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={sitePhoneHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container active:scale-[0.98]"
              >
                <PhoneCall className="h-5 w-5" />
                Call {sitePhoneDisplay}
              </a>
              <Link
                to={startPilotPath}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/15 bg-white px-6 py-3 font-bold text-primary transition hover:bg-surface-container-low active:scale-[0.98]"
              >
                Start pilot
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
