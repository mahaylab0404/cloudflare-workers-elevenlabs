import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  cancellationMailto,
  livePilotPriceLabel,
  onlineArchitectingFeeLabel,
  requestDemoPath,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
  trialDurationDays,
} from "../lib/flow";

export default function PilotSuccess() {
  const [searchParams] = useSearchParams();
  const subscriptionId = searchParams.get("subscription_id");

  return (
    <section className="flex-1 bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_55px_rgba(0,33,71,0.06)] md:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary-fixed p-3 text-primary-container">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-container">
                Pilot started
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-primary md:text-5xl">
                Your {trialDurationDays}-day live pilot is in motion.
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-on-surface-variant">
                PayPal Business approved the subscription. Your clinic details
                are ready for onboarding follow-up. The {livePilotPriceLabel}{" "}
                pilot is fully credited toward Month 1 if your practice
                continues.
              </p>
              {subscriptionId && (
                <p className="mt-4 text-sm font-medium text-on-surface-variant">
                  Subscription reference: <span className="font-mono text-primary">{subscriptionId}</span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "We review clinic details and confirm the workflow fit.",
              `The ${livePilotPriceLabel} live pilot leads to a Missed Revenue Report at the end of 7 days.`,
              `Implementation work above the pilot can include the ${onlineArchitectingFeeLabel} architecting fee if your practice continues.`,
              "No clinical workflow goes live without approved scripts and escalation rules.",
            ].map((point) => (
              <div
                key={point}
                className="rounded-2xl bg-surface-container-low px-4 py-4 text-sm leading-7 text-on-surface-variant"
              >
                <ShieldCheck className="mb-3 h-5 w-5 text-primary-container" />
                {point}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-4 font-semibold text-white transition hover:bg-primary-container"
              href={cancellationMailto}
            >
              Email support to cancel
            </a>
            <Link
              to={requestDemoPath}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-surface-variant px-6 py-4 font-semibold text-primary transition hover:bg-surface-container-low"
            >
              Send another request
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={sitePhoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-surface-variant px-6 py-4 font-semibold text-primary transition hover:bg-surface-container-low"
            >
              Call {sitePhoneDisplay}
              <PhoneCall className="h-5 w-5" />
            </a>
            <Link
              to={startPilotPath}
              className="inline-flex items-center justify-center rounded-md border border-surface-variant px-6 py-4 font-semibold text-primary transition hover:bg-surface-container-low"
            >
              Review pilot page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
