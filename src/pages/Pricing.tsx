import { Check, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PayPalSubscriptionButton } from "../components/PayPalSubscriptionButton";
import { trackEvent } from "../lib/customerio";
import {
  livePilotPriceLabel,
  onlineArchitectingFeeLabel,
  pilotOfferSummary,
  pilotPlans,
  requestDemoPath,
  sitePhoneDisplay,
  sitePhoneHref,
  startPilotPath,
  trialCtaLabel,
  type PilotPlanId,
} from "../lib/flow";
import { useSiteConfig } from "../lib/useSiteConfig";

const tierOrder: PilotPlanId[] = ["boutique", "premier", "concierge"];

const planEyebrows: Record<PilotPlanId, string> = {
  boutique: "Solo provider",
  premier: "Recommended post-pilot",
  concierge: "Enterprise concierge",
};

export default function Pricing() {
  const { config } = useSiteConfig();

  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);

  return (
    <section className="w-full flex-1 bg-surface">
      <div className="border-b border-primary/10 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
              CayesDesk Pricing
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Predictable missed consult revenue recovery.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Start with a {livePilotPriceLabel} live pilot, then continue with
              flat-rate concierge coverage built for implant, cosmetic, and
              aesthetic practices.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={sitePhoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-primary transition hover:bg-blue-50"
                onClick={() => trackEvent("cta_call_clicked", { page: "/pricing" })}
              >
                <PhoneCall className="h-5 w-5" />
                Call {sitePhoneDisplay}
              </a>
              <Link
                className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 font-bold text-white transition hover:bg-white/10"
                to={startPilotPath}
              >
                {trialCtaLabel}
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-y border-white/12 py-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-tertiary-fixed">
                7-day live pilot
              </p>
              <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
                {livePilotPriceLabel} to prove real consult capture.
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-blue-100">
                {pilotOfferSummary}
              </p>
            </div>
            <ShieldCheck className="hidden h-12 w-12 text-tertiary-fixed md:block" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {tierOrder.map((planId) => {
            const plan = pilotPlans[planId];
            const featured = planId === "premier";
            const paypalPlanId = config.paypal.planIds[planId];
            const visibleFeatures =
              planId === "boutique" ? plan.features.slice(1) : plan.features;

            return (
              <div
                key={planId}
                className={`relative flex min-h-full flex-col rounded-lg border p-6 md:p-7 ${
                  featured
                    ? "border-primary bg-primary text-white shadow-[0_22px_70px_rgba(0,10,30,0.2)]"
                    : "border-primary/10 bg-white text-primary shadow-[0_18px_50px_rgba(0,33,71,0.05)]"
                }`}
              >
                <div>
                  <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-3">
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.16em] ${
                        featured ? "text-tertiary-fixed" : "text-primary-container"
                      }`}
                    >
                      {planEyebrows[planId]}
                    </p>
                    {featured && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        <Sparkles className="h-3.5 w-3.5" />
                        Most Popular
                      </div>
                    )}
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold">
                    {plan.title}
                  </h3>
                  <p
                    className={`mt-3 min-h-[56px] text-sm leading-7 ${
                      featured ? "text-blue-100" : "text-on-surface-variant"
                    }`}
                  >
                    {plan.headline}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-headline text-5xl font-extrabold">
                    {plan.priceLabel}
                  </span>
                  <span
                    className={featured ? "text-blue-100" : "text-on-surface-variant"}
                  >
                    {plan.monthlyLabel}
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <p
                    className={`text-sm font-bold ${
                      featured ? "text-blue-50" : "text-primary"
                    }`}
                  >
                    {livePilotPriceLabel} 7-day live pilot, {plan.postTrialPaymentLabel}
                  </p>
                  <p
                    className={`text-sm leading-6 ${
                      featured ? "text-blue-100" : "text-on-surface-variant"
                    }`}
                  >
                    {plan.postTrialPaymentSummary} Custom scopes above{" "}
                    {onlineArchitectingFeeLabel} are finalized by agreement.
                  </p>
                </div>

                <div
                  className={`my-7 h-px ${
                    featured ? "bg-white/15" : "bg-primary/10"
                  }`}
                />

                <ul className="mb-8 flex-grow space-y-4">
                  {visibleFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          featured ? "text-tertiary-fixed" : "text-primary-container"
                        }`}
                      />
                      <span
                        className={`text-sm leading-6 ${
                          featured ? "text-blue-50" : "text-on-surface-variant"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto space-y-3">
                  <PayPalSubscriptionButton
                    clientId={config.paypal.clientId}
                    disabledMessage={`Add ${plan.paypalPlanEnvKey} and PAYPAL_CLIENT_ID to enable PayPal subscriptions.`}
                    planId={paypalPlanId}
                    planKey={planId}
                  />
                  <Link
                    className={`inline-flex w-full items-center justify-center rounded-md border px-4 py-3 text-center text-sm font-bold transition ${
                      featured
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-primary/15 text-primary hover:bg-surface-container-low"
                    }`}
                    to={`${startPilotPath}?plan=${planId}`}
                  >
                    {trialCtaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 border-t border-primary/10 pt-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">
              Need guided procurement or multi-location rollout planning?
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-on-surface-variant">
              Concierge and franchise deployments can begin with PayPal Business
              or a consultative agreement depending on procurement needs.
            </p>
          </div>
          <a
            href={sitePhoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-container"
          >
            <PhoneCall className="h-5 w-5" />
            Call {sitePhoneDisplay}
          </a>
          <Link
            to={`${requestDemoPath}?interest=Concierge%20Enterprise`}
            className="inline-flex items-center justify-center rounded-md border border-primary/15 px-5 py-3 font-bold text-primary transition hover:bg-surface-container-low"
          >
            Request consult
          </Link>
        </div>
      </div>
    </section>
  );
}
