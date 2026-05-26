export const requestDemoPath = "/request-demo";
export const bookDemoPath = "/book-demo";
export const startPilotPath = "/start-pilot";
export const liveDemoLinePath = "/demo-line";
export const sitePhoneDisplay = "+1 (561) 300-3697";
export const sitePhoneE164 = "+15613003697";
export const sitePhoneHref = `tel:${sitePhoneE164}`;
export const supportEmail = "hello@cayesdesk.com";
export const supportMailto = `mailto:${supportEmail}?subject=CayesDesk%20Support`;
export const baaReviewMailto = `mailto:${supportEmail}?subject=CayesDesk%20BAA%20%26%20Security%20Review`;
export const trialDurationDays = 7;
export const livePilotPriceLabel = "$497";
export const trialCtaLabel = "Start your 7-Day Live Pilot";
export const pilotOfferSummary =
  "$497 for a 7-day live pilot - fully credited toward Month 1 if the practice continues. No contract. No overage charges. A Missed Revenue Report is delivered at the end of 7 days.";
export const cancellationMailto = `mailto:${supportEmail}?subject=Cancel%20CayesDesk%207-Day%20Live%20Pilot`;
export const onlineArchitectingFeeLabel = "$1,500";

export const practiceTypeOptions = [
  "Cosmetic & Implant Dentistry",
  "Med spa",
  "Plastic surgery",
  "Clinical Research (SMO)",
  "GLP-1 or weight loss clinic",
  "Ketamine or wellness clinic",
  "Multi-location cash-pay group",
  "Other high-ticket private clinic",
] as const;

export const callVolumeOptions = [
  "Under 20 calls per day",
  "20 to 50 calls per day",
  "50 to 100 calls per day",
  "100+ calls per day",
] as const;

export const painPointOptions = [
  "Missed calls during clinic hours",
  "After-hours coverage",
  "Overflow for front desk staff",
  "English, Spanish, and French caller support",
  "High-ticket consult capture",
  "Appointment booking conversion",
  "Multi-location routing",
  "Pricing and objection handling",
] as const;

export const followUpWindowOptions = [
  "Morning",
  "Afternoon",
  "Late afternoon",
  "Any time this week",
] as const;

export const pilotPlanIds = ["boutique", "premier", "concierge"] as const;

export type PracticeType = (typeof practiceTypeOptions)[number];
export type CallVolumeOption = (typeof callVolumeOptions)[number];
export type PainPointOption = (typeof painPointOptions)[number];
export type FollowUpWindowOption = (typeof followUpWindowOptions)[number];
export type PilotPlanId = (typeof pilotPlanIds)[number];

export type DemoRequestPayload = {
  practiceName: string;
  practiceType: PracticeType | "";
  cityRegion: string;
  contactName: string;
  role: string;
  workEmail: string;
  phone: string;
  callVolumeBand: CallVolumeOption | "";
  primaryPainPoint: PainPointOption | "";
  preferredFollowUpWindow: FollowUpWindowOption | "";
  notes: string;
};

export type PilotCheckoutPayload = {
  planId: PilotPlanId;
  practiceName: string;
  practiceType: PracticeType | "";
  cityRegion: string;
  contactName: string;
  role: string;
  workEmail: string;
  phone: string;
  callVolumeBand: CallVolumeOption | "";
  notes: string;
};

export type MissedRevenueReportPayload = {
  practiceName: string;
  practiceType: PracticeType | "";
  workEmail: string;
  phone: string;
  missedCallsPerWeek: number;
  averageCaseValue: number;
  closeRatePercent: number;
  monthlyOpportunity: number;
  annualCayesDeskCost: number;
  annualReceptionistSalaryBenchmark: number;
  notes: string;
};

export const pilotPlans: Record<
  PilotPlanId,
  {
    title: string;
    headline: string;
    priceLabel: string;
    monthlyLabel: string;
    description: string;
    postTrialPaymentLabel: string;
    postTrialPaymentSummary: string;
    paypalPlanEnvKey: string;
    features: string[];
  }
> = {
  boutique: {
    title: "Boutique",
    headline: "Missed-call recovery for solo providers and boutique aesthetic practices.",
    priceLabel: "$599",
    monthlyLabel: "/ month",
    description: "Luxury after-hours coverage and consult capture for smaller clinics that cannot afford missed demand.",
    postTrialPaymentLabel: "then $599/month if continued",
    postTrialPaymentSummary: "The $497 live pilot is fully credited toward Month 1 when the practice continues.",
    paypalPlanEnvKey: "PAYPAL_PLAN_BOUTIQUE",
    features: [
      "$497 7-day live pilot, credited toward Month 1",
      "Missed Revenue Report delivered at the end of 7 days",
      "24/7 or after-hours luxury voice answering",
      "Approved FAQ handling for pricing ranges, recovery times, and location",
      "HIPAA-compliant consult capture",
      "SMS scheduling link",
    ],
  },
  premier: {
    title: "Premier",
    headline: "Core missed consult revenue recovery for implant, cosmetic, and aesthetic practices.",
    priceLabel: "$999",
    monthlyLabel: "/ month",
    description: "The clearest post-pilot fit for busy practices that need consult capture, routing, and conversion protocols.",
    postTrialPaymentLabel: "then $999/month if continued",
    postTrialPaymentSummary: "The $497 live pilot is fully credited toward Month 1 when the practice continues.",
    paypalPlanEnvKey: "PAYPAL_PLAN_PREMIER",
    features: [
      "Everything in Boutique, plus:",
      "Direct EHR/PMS integration for availability checks and booking",
      "Intelligent multi-department routing",
      "Warm live-transfers to staff during business hours",
      "Active objection-handling protocols",
    ],
  },
  concierge: {
    title: "Concierge / Enterprise",
    headline: "Revenue Protection Engine for DSOs and franchises.",
    priceLabel: "$1,499+",
    monthlyLabel: "/ month",
    description: "Multi-location revenue protection with deeper protocol logic and dedicated account stewardship.",
    postTrialPaymentLabel: "then $1,499+/month if continued",
    postTrialPaymentSummary: "The $497 live pilot is fully credited toward Month 1 when the practice continues.",
    paypalPlanEnvKey: "PAYPAL_PLAN_CONCIERGE",
    features: [
      "Everything in Premier, plus:",
      "Multi-location routing",
      "Protocol-specific pre-screening, including financing qualification",
      "Outbound recall and reactivation campaigns",
      "Dedicated Account Manager",
    ],
  },
};

export type PayPalPlanIds = Record<PilotPlanId, string>;

export type PayPalSubscriptionApprovalPayload = PilotCheckoutPayload & {
  subscriptionId: string;
  orderId?: string;
};

export function isOneOf<T extends readonly string[]>(
  value: string,
  options: T,
): value is T[number] {
  return (options as readonly string[]).includes(value);
}
