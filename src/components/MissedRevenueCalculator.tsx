import {
  ArrowRight,
  BarChart3,
  Mail,
  PhoneCall,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { identifyLead, trackEvent } from "../lib/customerio";
import {
  practiceTypeOptions,
  sitePhoneDisplay,
  sitePhoneHref,
  type MissedRevenueReportPayload,
  type PracticeType,
} from "../lib/flow";

const WEEKS_PER_MONTH = 4.33;
const ANNUAL_CAYESDESK_COST = 11988;
const RECEPTIONIST_SALARY_BENCHMARK = 44640;

const fieldClassName =
  "w-full rounded-md border border-primary/12 bg-white px-3 py-3 text-sm font-semibold text-primary outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary-container focus:ring-4 focus:ring-primary-fixed/45";

const rangeClassName =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-primary-fixed accent-primary outline-none";

const presets = [
  {
    averageCaseValue: 8000,
    closeRatePercent: 20,
    label: "Lunch gap",
    missedCallsPerWeek: 4,
  },
  {
    averageCaseValue: 15000,
    closeRatePercent: 18,
    label: "Implant ads",
    missedCallsPerWeek: 6,
  },
  {
    averageCaseValue: 4000,
    closeRatePercent: 24,
    label: "Med spa weekends",
    missedCallsPerWeek: 8,
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function MissedRevenueCalculator() {
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(4);
  const [averageCaseValue, setAverageCaseValue] = useState(8000);
  const [closeRatePercent, setCloseRatePercent] = useState(20);
  const [practiceName, setPracticeName] = useState("");
  const [practiceType, setPracticeType] = useState<PracticeType | "">("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const monthlyOpportunity = useMemo(
    () =>
      Math.round(
        missedCallsPerWeek *
          WEEKS_PER_MONTH *
          averageCaseValue *
          (closeRatePercent / 100),
      ),
    [averageCaseValue, closeRatePercent, missedCallsPerWeek],
  );

  const annualOpportunity = monthlyOpportunity * 12;
  const salarySavings = RECEPTIONIST_SALARY_BENCHMARK - ANNUAL_CAYESDESK_COST;
  const reportReady = Boolean(practiceName && practiceType && workEmail);

  const trackCalculation = (data?: Record<string, unknown>) => {
    trackEvent("missed_revenue_calculated", {
      average_case_value: averageCaseValue,
      close_rate_percent: closeRatePercent,
      missed_calls_per_week: missedCallsPerWeek,
      monthly_opportunity: monthlyOpportunity,
      ...data,
    });
  };

  const applyPreset = (preset: (typeof presets)[number]) => {
    setMissedCallsPerWeek(preset.missedCallsPerWeek);
    setAverageCaseValue(preset.averageCaseValue);
    setCloseRatePercent(preset.closeRatePercent);
    trackCalculation({ preset: preset.label });
  };

  const payload: MissedRevenueReportPayload = {
    annualCayesDeskCost: ANNUAL_CAYESDESK_COST,
    annualReceptionistSalaryBenchmark: RECEPTIONIST_SALARY_BENCHMARK,
    averageCaseValue,
    closeRatePercent,
    missedCallsPerWeek,
    monthlyOpportunity,
    notes,
    phone,
    practiceName,
    practiceType,
    workEmail,
  };

  const submitReport = async () => {
    if (!captureOpen) {
      setCaptureOpen(true);
      return;
    }

    if (!reportReady || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setError("");
    identifyLead({
      clinic_name: practiceName,
      email: workEmail,
      lead_source: "missed-revenue-calculator",
      phone,
      practice_type: practiceType,
    });
    trackEvent("missed_revenue_report_requested", {
      average_case_value: averageCaseValue,
      close_rate_percent: closeRatePercent,
      missed_calls_per_week: missedCallsPerWeek,
      monthly_opportunity: monthlyOpportunity,
      practice_type: practiceType,
    });

    try {
      const response = await fetch("/api/missed-revenue-report", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const isLocalPreview =
          response.status === 404 &&
          ["localhost", "127.0.0.1"].includes(window.location.hostname);

        if (!isLocalPreview) {
          const result = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(result?.message || "Unable to route the report right now.");
        }
      }

      setStatus("success");
    } catch (reportError) {
      setError(
        reportError instanceof Error
          ? reportError.message
          : "Unable to route the report right now.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-[0_28px_90px_rgba(0,33,71,0.12)]"
      data-testid="missed-revenue-calculator"
    >
      <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative bg-[#071325] p-6 text-white md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 bg-tertiary-fixed/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-tertiary-fixed">
              <BarChart3 className="h-4 w-4" />
              Missed revenue tool
            </div>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-100/70">
              Estimated monthly consult value
            </p>
            <div className="mt-3 font-display text-[clamp(4rem,11vw,8rem)] font-extrabold leading-none tracking-normal">
              {formatCurrency(monthlyOpportunity)}
            </div>
            <p className="mt-5 max-w-lg text-lg leading-8 text-blue-100">
              Four missed calls a week can be a full month of CayesDesk coverage before the first recovered case closes.
            </p>
          </div>

          <div className="relative mt-8 grid gap-3 border-t border-white/10 pt-6">
            {[
              ["Yearly opportunity", formatCurrency(annualOpportunity)],
              ["CayesDesk core plan", `${formatCurrency(ANNUAL_CAYESDESK_COST)} / year`],
              ["Front-office salary benchmark", `${formatCurrency(RECEPTIONIST_SALARY_BENCHMARK)}+`],
            ].map(([label, value]) => (
              <div className="flex items-center justify-between gap-5" key={label}>
                <span className="text-sm font-semibold text-blue-100/78">
                  {label}
                </span>
                <span className="text-right font-display text-lg font-extrabold sm:text-xl">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f6f9fc] p-5 md:p-8">
          <div className="flex flex-col gap-4 border-b border-primary/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary-container">
                <SlidersHorizontal className="h-4 w-4" />
                Adjust the scenario
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold text-primary md:text-3xl">
                What happens when your front desk is busy?
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  className="rounded-full border border-primary/12 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-primary transition hover:-translate-y-0.5 hover:border-primary-container hover:bg-primary hover:text-white"
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-7">
            <label className="block">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-primary">Missed consult calls / week</span>
                <span className="rounded-full bg-white px-3 py-1 font-display text-xl font-extrabold text-primary shadow-[0_8px_22px_rgba(0,33,71,0.06)]">
                  {missedCallsPerWeek}
                </span>
              </div>
              <input
                className={rangeClassName}
                max={20}
                min={1}
                onChange={(event) => {
                  setMissedCallsPerWeek(clampNumber(Number(event.target.value), 1, 20));
                  trackCalculation();
                }}
                type="range"
                value={missedCallsPerWeek}
              />
            </label>

            <label className="block">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-primary">Average consult value</span>
                <span className="rounded-full bg-white px-3 py-1 font-display text-xl font-extrabold text-primary shadow-[0_8px_22px_rgba(0,33,71,0.06)]">
                  {formatCurrency(averageCaseValue)}
                </span>
              </div>
              <input
                className={rangeClassName}
                max={30000}
                min={1000}
                onChange={(event) => {
                  setAverageCaseValue(clampNumber(Number(event.target.value), 1000, 30000));
                  trackCalculation();
                }}
                step={500}
                type="range"
                value={averageCaseValue}
              />
            </label>

            <label className="block">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-primary">Normal close rate</span>
                <span className="rounded-full bg-white px-3 py-1 font-display text-xl font-extrabold text-primary shadow-[0_8px_22px_rgba(0,33,71,0.06)]">
                  {closeRatePercent}%
                </span>
              </div>
              <input
                className={rangeClassName}
                max={60}
                min={5}
                onChange={(event) => {
                  setCloseRatePercent(clampNumber(Number(event.target.value), 5, 60));
                  trackCalculation();
                }}
                step={1}
                type="range"
                value={closeRatePercent}
              />
            </label>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {[
              ["24/7", "coverage"],
              ["3", "languages"],
              [formatCurrency(salarySavings), "below benchmark salary"],
            ].map(([value, label]) => (
              <div className="rounded-md bg-white px-4 py-4 shadow-[0_10px_30px_rgba(0,33,71,0.05)]" key={label}>
                <p className="font-display text-2xl font-extrabold text-primary">
                  {value}
                </p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {captureOpen && (
            <div className="mt-7 rounded-lg border border-primary/10 bg-white p-4 shadow-[0_14px_40px_rgba(0,33,71,0.06)] md:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-bold text-primary">
                  Practice
                  <input
                    className={fieldClassName}
                    onChange={(event) => setPracticeName(event.target.value)}
                    placeholder="Practice name"
                    value={practiceName}
                  />
                </label>
                <label className="space-y-2 text-sm font-bold text-primary">
                  Specialty
                  <select
                    className={fieldClassName}
                    onChange={(event) => setPracticeType(event.target.value as PracticeType | "")}
                    value={practiceType}
                  >
                    <option value="">Select specialty</option>
                    {practiceTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-bold text-primary">
                  Work email
                  <input
                    className={fieldClassName}
                    onChange={(event) => setWorkEmail(event.target.value)}
                    placeholder="owner@clinic.com"
                    type="email"
                    value={workEmail}
                  />
                </label>
                <label className="space-y-2 text-sm font-bold text-primary">
                  Phone
                  <input
                    className={fieldClassName}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="(561) 300-3697"
                    value={phone}
                  />
                </label>
              </div>
              <label className="mt-4 block space-y-2 text-sm font-bold text-primary">
                Where do missed calls happen?
                <textarea
                  className={`${fieldClassName} min-h-20 resize-y`}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Lunch hour, procedures, after-hours ads, front desk overload..."
                  value={notes}
                />
              </label>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-error bg-error-container/55 px-4 py-3 text-sm font-semibold text-on-error-container">
              {error}
            </div>
          )}
          {status === "success" && (
            <div className="mt-4 rounded-md border border-primary/10 bg-white px-4 py-3 text-sm font-semibold text-primary">
              Report request received. We will send the missed-revenue summary and next-step options.
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
              disabled={captureOpen && (!reportReady || status === "submitting")}
              onClick={submitReport}
              type="button"
            >
              <Mail className="h-5 w-5" />
              {!captureOpen
                ? "Email this analysis"
                : status === "submitting"
                  ? "Sending report..."
                  : "Send my missed-revenue report"}
            </button>
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/15 bg-white px-5 py-3 font-bold text-primary transition hover:bg-surface-container-low"
              href={sitePhoneHref}
            >
              <PhoneCall className="h-5 w-5" />
              Call {sitePhoneDisplay}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-4 text-xs leading-5 text-on-surface-variant">
            Salary benchmark uses BLS medical secretary / administrative assistant wage data. Benefits, recruiting, training, and after-hours coverage gaps are not included.
          </p>
        </div>
      </div>
    </section>
  );
}
