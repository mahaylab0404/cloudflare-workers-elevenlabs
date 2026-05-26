import {
  ChevronDown,
  CircleDollarSign,
  PhoneCall,
  ShieldCheck,
  SmilePlus,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal";
import dentalSuiteImage from "../assets/redesign/specialty-dental-suite.jpg";
import medSpaImage from "../assets/redesign/day-spa-suite.jpg";
import plasticSurgeryImage from "../assets/redesign/specialty-plastic-surgery.jpg";
import {
  livePilotPriceLabel,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
  trialDurationDays,
} from "../lib/flow";

type Icon = ComponentType<{ className?: string }>;

type FaqItem = {
  q: string;
  a: string;
};

type FaqGroup = {
  topic: string;
  label: string;
  intro: string;
  Icon: Icon;
  items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
  {
    topic: "Dental",
    label: "Cosmetic and implant dentistry",
    intro: "For practices where a missed implant, veneer, or smile-design consult can materially affect the month.",
    Icon: SmilePlus,
    items: [
      {
        q: "Will CayesDesk sound right for a cosmetic or implant dental practice?",
        a: "Yes. The call flow is configured around your approved language for consults, fees, financing cues, locations, and staff routing. CayesDesk captures intent; your licensed team handles clinical judgment.",
      },
      {
        q: "Does it replace our treatment coordinator or front desk?",
        a: "No. CayesDesk is a missed-call and overflow layer. It gives your staff a cleaner brief so they can follow up with the caller, answer clinical questions, and guide the next step.",
      },
      {
        q: "Can it handle calls during procedures or consult-heavy days?",
        a: "That is the core use case. Calls that would hit voicemail can be answered, summarized, and routed while your team stays focused on the patient in front of them.",
      },
    ],
  },
  {
    topic: "Med Spa",
    label: "Aesthetics and wellness",
    intro: "Built for high-intent inquiries around injectables, lasers, memberships, packages, and consult requests.",
    Icon: Sparkles,
    items: [
      {
        q: "Can CayesDesk answer Botox, filler, laser, or body-contouring inquiries?",
        a: "It can capture service interest, preferred timing, new or returning client status, and callback details using your approved script. It does not recommend treatments, dosing, contraindications, or aftercare.",
      },
      {
        q: "Can it mention promos, deposits, or membership details?",
        a: "Yes, when those details are approved by your practice. CayesDesk can share defined offer language and route anything nuanced back to staff.",
      },
      {
        q: "Does it work if we already use Zenoti, Boulevard, Podium, or Birdeye?",
        a: "Yes. Those tools remain useful for booking, reviews, texting, and client communication. CayesDesk focuses on live inbound voice coverage and staff-ready consult summaries.",
      },
    ],
  },
  {
    topic: "Compliance",
    label: "Boundaries and trust",
    intro: "Privacy-conscious call handling with clear limits on medical, dental, and emergency conversations.",
    Icon: ShieldCheck,
    items: [
      {
        q: "Is CayesDesk HIPAA compliant?",
        a: "CayesDesk supports HIPAA-compliant workflows, encrypted data handling, and BAA-ready deployments for covered practices. Patient data is not used for public model training.",
      },
      {
        q: "What if a caller asks for medical or dental advice?",
        a: "CayesDesk states that it cannot provide medical or dental guidance, captures the concern for staff review, and routes the message according to your clinic's rules.",
      },
      {
        q: "What happens if a caller describes an emergency?",
        a: "Emergency-related language directs the caller to call 911 and triggers the escalation path you approved during setup.",
      },
    ],
  },
  {
    topic: "Pricing",
    label: "Pilot and plans",
    intro: "A short live pilot first, then continuation only if the recovered-call economics make sense.",
    Icon: CircleDollarSign,
    items: [
      {
        q: `What does the ${trialDurationDays}-day live pilot prove?`,
        a: `The ${livePilotPriceLabel} pilot shows real call handling, after-hours or overflow capture, staff summaries, QA review, and a Missed Revenue Report. The pilot is credited toward Month 1 if your practice continues.`,
      },
      {
        q: "Are there contracts or overage charges during the pilot?",
        a: "No. The live pilot is designed to be a low-friction proof period with no contract and no overage charges.",
      },
      {
        q: "What happens after the pilot?",
        a: "Most busy cosmetic, implant, and aesthetic practices continue on a monthly plan matched to call volume, routing needs, and integration scope. The Premier plan is currently the clearest $999/month fit for many practices.",
      },
    ],
  },
];

const specialtyAnchors = [
  "Implants and veneers",
  "Injectables and lasers",
  "After-hours consults",
  "Staff-ready summaries",
];

const faqImages = [
  {
    title: "Cosmetic dental demand",
    image: dentalSuiteImage,
    alt: "Modern cosmetic dental suite",
  },
  {
    title: "Aesthetic client inquiries",
    image: medSpaImage,
    alt: "Upscale med spa treatment room",
  },
  {
    title: "Procedure consults",
    image: plasticSurgeryImage,
    alt: "Private practice reception for premium consults",
  },
];

export default function Faq() {
  return (
    <>
      <section className="bg-[#F8F9FA] px-6 py-16 md:px-8 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <Reveal className="max-w-3xl">
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
              FAQ
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] text-primary md:text-6xl lg:text-7xl">
              Answers for premium clinics before the first call.
            </h1>
          </Reveal>
          <Reveal delay={0.08} className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-8 text-on-surface-variant md:text-xl">
              Short, practical answers for cosmetic dental, implant, and med spa
              teams evaluating missed-call revenue recovery.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {specialtyAnchors.map((anchor) => (
                <span
                  key={anchor}
                  className="rounded-full border border-primary/10 bg-white px-4 py-2 text-sm font-bold text-primary"
                >
                  {anchor}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-white px-5 py-7 sm:px-6 md:px-8">
        <div className="mx-auto grid max-w-[92rem] grid-cols-3 gap-3 md:gap-4">
            {faqImages.map((item, index) => (
              <Reveal delay={index * 0.05} key={item.title}>
                <article className="group relative overflow-hidden rounded-lg bg-surface-container-low">
                  <img
                    alt={item.alt}
                    className="aspect-square h-full w-full object-cover transition duration-700 group-hover:scale-[1.03] md:aspect-[16/7]"
                    src={item.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/62 to-transparent" />
                  <p className="absolute bottom-2 left-2 right-2 font-display text-xs font-extrabold leading-tight text-white sm:bottom-4 sm:left-4 sm:right-4 sm:text-xl">
                    {item.title}
                  </p>
                </article>
              </Reveal>
            ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-8 lg:grid-cols-[0.3fr_0.7fr]">
          <Reveal className="lg:sticky lg:top-36 lg:self-start">
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
              Questions by topic
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
              Find the objection your team is asking.
            </h2>
            <a
              href={sitePhoneHref}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container"
            >
              <PhoneCall className="h-5 w-5" />
              Call {sitePhoneDisplay}
            </a>
          </Reveal>

          <div className="space-y-8">
            {faqGroups.map((group, groupIndex) => {
              const Icon = group.Icon;

              return (
                <Reveal delay={groupIndex * 0.04} key={group.topic}>
                <section
                  key={group.topic}
                  aria-labelledby={`${group.topic.toLowerCase().replaceAll(" ", "-")}-faq`}
                  className="border-y border-primary/10 py-7"
                >
                  <div className="grid gap-5 md:grid-cols-[14rem_1fr] md:items-start">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/10 bg-[#F8F9FA] text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3
                        id={`${group.topic.toLowerCase().replaceAll(" ", "-")}-faq`}
                        className="mt-4 font-display text-2xl font-extrabold text-primary"
                      >
                        {group.topic}
                      </h3>
                      <p className="mt-2 font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-container">
                        {group.label}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-on-surface-variant">
                        {group.intro}
                      </p>
                    </div>

                    <div className="border-t border-primary/10 md:border-t-0">
                      {group.items.map((faq) => (
                        <details
                          key={faq.q}
                          className="group border-b border-primary/10 py-5 last:border-b-0"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                            <span className="font-display text-xl font-extrabold leading-snug text-primary md:text-2xl">
                              {faq.q}
                            </span>
                            <ChevronDown className="h-5 w-5 shrink-0 text-primary-container transition group-open:rotate-180" />
                          </summary>
                          <p className="mt-4 max-w-3xl leading-7 text-on-surface-variant">
                            {faq.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>
                </section>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-14 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1fr_auto_auto] md:items-center md:px-8">
          <div>
            <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-primary-container">
              Next step
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-primary md:text-4xl">
              Hear the line, then decide if the pilot is worth it.
            </h2>
          </div>
          <a
            href={sitePhoneHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-white transition hover:bg-primary-container"
          >
            <PhoneCall className="h-5 w-5" />
            Call {sitePhoneDisplay}
          </a>
          <Link
            to={startPilotPath}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary/15 bg-white px-6 py-3 font-bold text-primary transition hover:bg-white/70"
          >
            Start pilot
          </Link>
        </div>
      </section>
    </>
  );
}
