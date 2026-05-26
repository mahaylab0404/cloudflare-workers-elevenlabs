import {
  AlertCircle,
  ArrowRight,
  Check,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PayPalSubscriptionButton } from "../components/PayPalSubscriptionButton";
import { identifyLead, trackEvent } from "../lib/customerio";
import {
  callVolumeOptions,
  cancellationMailto,
  livePilotPriceLabel,
  pilotOfferSummary,
  pilotPlanIds,
  pilotPlans,
  practiceTypeOptions,
  requestDemoPath,
  sitePhoneDisplay,
  sitePhoneHref,
  supportMailto,
  trialCtaLabel,
  trialDurationDays,
  type PilotCheckoutPayload,
  type PilotPlanId,
} from "../lib/flow";
import { useSiteConfig } from "../lib/useSiteConfig";

const inputClassName =
  "w-full rounded-xl border border-surface-variant bg-white px-4 py-3 text-sm text-primary outline-none transition placeholder:text-outline focus:border-primary-container focus:ring-4 focus:ring-primary-fixed/50";

function resolvePlanId(value: string | null): PilotPlanId {
  return pilotPlanIds.includes(value as PilotPlanId)
    ? (value as PilotPlanId)
    : "premier";
}

function isFormReady(form: PilotCheckoutPayload): boolean {
  return Boolean(
    form.practiceName &&
      form.practiceType &&
      form.cityRegion &&
      form.contactName &&
      form.role &&
      form.workEmail &&
      form.phone &&
      form.callVolumeBand,
  );
}

export default function StartPilot() {
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";
  const { config } = useSiteConfig();
  const defaultPlan = useMemo(
    () => resolvePlanId(searchParams.get("plan")),
    [searchParams],
  );

  const [selectedPlan, setSelectedPlan] = useState<PilotPlanId>(defaultPlan);
  const [form, setForm] = useState<PilotCheckoutPayload>({
    planId: defaultPlan,
    practiceName: "",
    practiceType: "",
    cityRegion: "",
    contactName: "",
    role: "",
    workEmail: "",
    phone: "",
    callVolumeBand: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    trackEvent("start_pilot_viewed", { plan: defaultPlan });
  }, [defaultPlan]);

  const selectedPlanDetails = pilotPlans[selectedPlan];
  const selectedPayPalPlanId = config.paypal.planIds[selectedPlan];
  const readyForCheckout = isFormReady(form);

  const updateField = <K extends keyof PilotCheckoutPayload>(
    field: K,
    value: PilotCheckoutPayload[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const choosePlan = (planId: PilotPlanId) => {
    setSelectedPlan(planId);
    setForm((current) => ({
      ...current,
      planId,
    }));
    trackEvent("plan_selected", { plan: planId });
  };

  const handlePayPalApprove = useCallback(
    async (data: { orderID?: string; subscriptionID?: string }) => {
      if (!data.subscriptionID) {
        throw new Error("PayPal did not return a subscription ID.");
      }

      setSubmitting(true);
      setError("");

      identifyLead({
        email: form.workEmail,
        clinic_name: form.practiceName,
        practice_type: form.practiceType,
        selected_plan: selectedPlan,
        phone: form.phone,
        city_region: form.cityRegion,
        contact_name: form.contactName,
        role: form.role,
        lead_source: "start-pilot",
      });
      trackEvent("paypal_subscription_approved", {
        plan: selectedPlan,
        subscription_id: data.subscriptionID,
      });

      try {
        const response = await fetch("/api/paypal/subscription-approved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            orderId: data.orderID || "",
            planId: selectedPlan,
            subscriptionId: data.subscriptionID,
          }),
        });

        const result = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            result?.message || "PayPal approved the subscription, but onboarding routing failed.",
          );
        }

        const query = new URLSearchParams({
          plan: selectedPlan,
          subscription_id: data.subscriptionID,
        });
        window.location.assign(`/pilot/success?${query.toString()}`);
      } catch (approvalError) {
        setError(
          approvalError instanceof Error
            ? approvalError.message
            : "Unable to finalize PayPal subscription approval right now.",
        );
        setSubmitting(false);
      }
    },
    [form, selectedPlan],
  );

  return (
    <section className="flex-1 bg-surface">
      <div className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-tertiary-fixed">
                {trialCtaLabel}
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
                Start a {trialDurationDays}-day CayesDesk live pilot.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Choose the right clinic plan, approve the PayPal Business
                checkout, and prove missed consult revenue recovery with real
                calls.
              </p>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {[
                  `${livePilotPriceLabel} credited toward Month 1 if you continue`,
                  "No contract and no overage charges",
                  "Missed Revenue Report delivered at day 7",
                ].map((point) => (
                  <div
                    key={point}
                    className="rounded-lg border border-white/10 bg-white/8 px-4 py-4 text-sm font-semibold text-blue-50 backdrop-blur"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/8 p-6 shadow-[0_20px_60px_rgba(0,10,30,0.2)] backdrop-blur md:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-white/10 p-3 text-tertiary-fixed">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold">What you&apos;re approving</h2>
                  <p className="mt-2 text-sm leading-7 text-blue-100">
                    PayPal Business securely approves the selected plan and
                    routes your clinic details for the {trialDurationDays}-day
                    live pilot. {pilotOfferSummary}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm leading-7 text-blue-50">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <span>Approved concierge scripts only. No clinical decision-making or triage.</span>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <span>BAA Included and onboarding review before patient-facing use.</span>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <span>
                    Implementation scope above the live pilot is finalized by
                    agreement if your practice continues.
                  </span>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-tertiary-fixed" />
                  <span>
                    To stop before continuing,{" "}
                    <a className="font-bold text-white underline decoration-tertiary-fixed underline-offset-4" href={cancellationMailto}>
                      email support before the pilot ends
                    </a>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
        {canceled && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-surface-variant bg-white px-4 py-4 text-sm text-on-surface-variant shadow-[0_12px_32px_rgba(25,28,29,0.04)]">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-container" />
            <span>
              PayPal checkout was canceled. Your clinic details were not routed,
              and you can start again whenever you&apos;re ready.
            </span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(0,33,71,0.06)] md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
                    Choose your plan
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-on-surface-variant">
                    Boutique, Premier, and Concierge plans use PayPal Business
                    checkout with a {livePilotPriceLabel} {trialDurationDays}-day
                    live pilot credited toward Month 1 if the practice continues.
                  </p>
                </div>
                <Link
                  to={`${requestDemoPath}?interest=Concierge%20Enterprise`}
                  className="hidden rounded-md border border-surface-variant px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface-container-low md:inline-flex"
                >
                  Guided setup?
                </Link>
              </div>

              <div className="mt-8 grid gap-4">
                {(Object.entries(pilotPlans) as Array<[PilotPlanId, typeof pilotPlans[PilotPlanId]]>).map(
                  ([planId, plan]) => {
                    const selected = planId === selectedPlan;

                    return (
                      <button
                        key={planId}
                        className={`w-full rounded-lg border p-5 text-left transition ${
                          selected
                            ? "border-primary-container bg-primary text-white shadow-[0_18px_55px_rgba(0,33,71,0.18)]"
                            : "border-surface-variant bg-surface-container-lowest text-primary hover:border-primary-fixed"
                        }`}
                        onClick={() => choosePlan(planId)}
                        type="button"
                      >
                        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                          <div className="min-w-0">
                            <p className={`text-xs font-bold uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.18em] ${selected ? "text-tertiary-fixed" : "text-primary-container"}`}>
                              {planId === "premier" ? "Most Popular" : "PayPal Subscription"}
                            </p>
                            <h3 className="mt-2 text-2xl font-extrabold">{plan.title}</h3>
                            <p className={`mt-2 max-w-2xl leading-7 ${selected ? "text-blue-100" : "text-on-surface-variant"}`}>
                              {plan.headline}
                            </p>
                          </div>
                          <div className="min-w-0 xl:min-w-[180px] xl:text-right">
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold">{plan.priceLabel}</span>
                              <span className={selected ? "text-blue-200" : "text-on-surface-variant"}>
                                {plan.monthlyLabel}
                              </span>
                            </div>
                            <p className={`mt-2 text-sm ${selected ? "text-blue-100" : "text-on-surface-variant"}`}>
                              {plan.postTrialPaymentLabel}
                            </p>
                            <p className={`mt-1 text-xs leading-5 ${selected ? "text-blue-100" : "text-on-surface-variant"}`}>
                              {plan.postTrialPaymentSummary}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {plan.features.map((feature) => (
                            <div key={feature} className="flex gap-3 text-sm leading-7">
                              <Check className={`mt-1 h-4 w-4 shrink-0 ${selected ? "text-tertiary-fixed" : "text-primary-container"}`} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="rounded-lg border border-surface-variant bg-surface-container-lowest p-6 md:p-8">
              <h3 className="text-xl font-extrabold text-primary">
                Bespoke Concierge Configuration &amp; Integration Fee
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-on-surface-variant">
                $1,500 - $2,500 one-time, covering custom clinic mapping, EHR
                integration, HIPAA BAA execution, and luxury voice tuning for
                practices that continue after the live pilot.
              </p>
              <a
                href={sitePhoneHref}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-primary"
              >
                Call {sitePhoneDisplay}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-[0_18px_55px_rgba(0,33,71,0.06)] md:p-8">
            <h2 className="text-2xl font-extrabold text-primary md:text-3xl">
              Approve your PayPal subscription
            </h2>
            <p className="mt-3 leading-7 text-on-surface-variant">
              These business details stay on the business side and are attached
              to the PayPal approval so onboarding starts with the right clinic
              context.
            </p>
            <div className="mt-6 rounded-lg bg-surface-container-low px-4 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                Selected plan
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-primary">
                {selectedPlanDetails.title}
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                {selectedPlanDetails.description}
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
              <label className="space-y-2 text-sm font-semibold text-primary">
                Practice name
                <input
                  className={inputClassName}
                  onChange={(event) => updateField("practiceName", event.target.value)}
                  placeholder="Cayes Dental Studio"
                  required
                  value={form.practiceName}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-primary">
                Practice type
                <select
                  className={inputClassName}
                  onChange={(event) => updateField("practiceType", event.target.value as PilotCheckoutPayload["practiceType"])}
                  required
                  value={form.practiceType}
                >
                  <option value="">Select practice type</option>
                  {practiceTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-primary">
                City / region
                <input
                  className={inputClassName}
                  onChange={(event) => updateField("cityRegion", event.target.value)}
                  placeholder="Miami, South Florida"
                  required
                  value={form.cityRegion}
                />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-primary">
                  Contact name
                  <input
                    className={inputClassName}
                    onChange={(event) => updateField("contactName", event.target.value)}
                    placeholder="Jordan Martinez"
                    required
                    value={form.contactName}
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-primary">
                  Role
                  <input
                    className={inputClassName}
                    onChange={(event) => updateField("role", event.target.value)}
                    placeholder="Practice owner"
                    required
                    value={form.role}
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-primary">
                  Work email
                  <input
                    className={inputClassName}
                    onChange={(event) => updateField("workEmail", event.target.value)}
                    placeholder="owner@clinic.com"
                    required
                    type="email"
                    value={form.workEmail}
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-primary">
                  Phone
                  <input
                    className={inputClassName}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="(305) 555-0123"
                    required
                    value={form.phone}
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm font-semibold text-primary">
                Call volume
                <select
                  className={inputClassName}
                  onChange={(event) => updateField("callVolumeBand", event.target.value as PilotCheckoutPayload["callVolumeBand"])}
                  required
                  value={form.callVolumeBand}
                >
                  <option value="">Select call volume</option>
                  {callVolumeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold text-primary">
                Notes for onboarding
                <textarea
                  className={`${inputClassName} min-h-28 resize-y`}
                  maxLength={1200}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Anything useful for pilot setup, staff routing, or clinic context."
                  value={form.notes}
                />
              </label>
              {error && (
                <div className="rounded-lg border border-error bg-error-container/55 px-4 py-3 text-sm font-medium text-on-error-container">
                  {error}
                </div>
              )}
              <div className="rounded-lg bg-surface-container-low px-4 py-4 text-sm leading-6 text-on-surface-variant">
                PayPal Business controls checkout, the {trialDurationDays}-day
                live pilot, and any monthly renewals under the selected plan. To
                stop before continuing,{" "}
                <a className="font-bold text-primary underline decoration-primary-fixed underline-offset-4" href={cancellationMailto}>
                  email support before the pilot ends
                </a>
                .
              </div>

              {!readyForCheckout ? (
                <div className="rounded-md border border-surface-variant bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface-variant">
                  Complete the required clinic details to load PayPal checkout.
                </div>
              ) : submitting ? (
                <div className="rounded-md bg-primary px-6 py-4 text-center font-semibold text-white">
                  Finalizing PayPal approval...
                </div>
              ) : (
                <PayPalSubscriptionButton
                  clientId={config.paypal.clientId}
                  disabledMessage={`Add ${selectedPlanDetails.paypalPlanEnvKey} and PAYPAL_CLIENT_ID to enable PayPal subscriptions.`}
                  onApprove={handlePayPalApprove}
                  planId={selectedPayPalPlanId}
                  planKey={selectedPlan}
                />
              )}

              <p className="text-sm leading-6 text-on-surface-variant">
                By continuing, you agree to the {livePilotPriceLabel}{" "}
                {trialDurationDays}-day live pilot structure shown above. The
                pilot is fully credited toward Month 1 if your practice
                continues. For billing or cancellation questions,{" "}
                <a className="font-bold text-primary underline decoration-primary-fixed underline-offset-4" href={supportMailto}>
                  email support
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
