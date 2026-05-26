import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { solutionRouteMeta } from "../lib/solutionLandingPages";

const scriptId = "cayesdesk-softwareapplication-jsonld";
const siteUrl = "https://cayesdesk.com";

const defaultMeta = {
  title: "CayesDesk | 24/7 Patient Concierge for Premium Clinics",
  description:
    "CayesDesk answers missed consult calls 24/7 for cosmetic dentistry, implant dentistry, med spas, and plastic surgery practices before paid leads call the next clinic.",
};

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": defaultMeta,
  "/about": {
    title: "About CayesDesk | Healthcare-Minded Patient Concierge",
    description:
      "Meet the healthcare-minded team behind CayesDesk, built for private practices that cannot afford to lose high-value consult calls.",
  },
  "/how-it-works": {
    title: "How CayesDesk Works | From Missed Call to Staff Handoff",
    description:
      "See how CayesDesk answers missed consult calls, follows approved clinic scripts, captures patient intent, and routes staff-ready summaries.",
  },
  "/pricing": {
    title: "Pricing | CayesDesk",
    description:
      "Review CayesDesk pricing for the $497 7-day live pilot, $599 Boutique plan, $999 Practice plan, and multi-location concierge coverage.",
  },
  "/start-pilot": {
    title: "Start Your 7-Day Live Pilot | CayesDesk",
    description:
      "Start a $497 7-day CayesDesk live pilot for premium clinic missed-call recovery, consult capture, and after-hours concierge coverage.",
  },
  "/demo-line": {
    title: "Live Demo Line | CayesDesk",
    description:
      "Call the CayesDesk live demo line to hear the Intelligent Patient Concierge in English, Spanish, or French.",
  },
  "/solutions": {
    title: "Solutions | Patient Concierge for Cosmetic Clinics",
    description:
      "See how CayesDesk supports cosmetic and implant dentistry, med spas, plastic surgery, and cash-pay clinics with 24/7 consult capture.",
  },
  "/platform": {
    title: "Call Flow Platform | CayesDesk",
    description:
      "Review the CayesDesk patient-concierge workflow for approved scripts, escalation rules, staff handoffs, and missed-revenue reporting.",
  },
  "/call-flow": {
    title: "Call Flow | CayesDesk Patient Concierge",
    description:
      "Review how CayesDesk handles caller intent, approved language, escalation rules, and staff-ready consult summaries.",
  },
  "/clinical-workflow": {
    title: "Clinical Workflow Guardrails | CayesDesk",
    description:
      "See how CayesDesk separates business-side consult capture from clinical advice, triage, and emergency handling.",
  },
  "/security": {
    title: "Security & BAA | CayesDesk",
    description:
      "Review CayesDesk HIPAA-compliant workflows, Business Associate Agreement process, patient safety guardrails, and integration controls for premium clinic call coverage.",
  },
  "/baa": {
    title: "Business Associate Agreement | CayesDesk",
    description:
      "Review CayesDesk Business Associate Agreement context for HIPAA-compliant patient-call workflows before live PHI handling.",
  },
  "/hipaa-workflows": {
    title: "HIPAA Workflows | CayesDesk",
    description:
      "Review CayesDesk privacy-conscious workflows, BAA process, approved scripts, escalation rules, and patient safety guardrails.",
  },
  "/faq": {
    title: "FAQ | CayesDesk Patient Concierge",
    description:
      "Answers to common questions about CayesDesk for dental, med spa, plastic surgery, pricing, security, BAA, and consult capture workflows.",
  },
  "/resources": {
    title: "Resources | CayesDesk",
    description:
      "Guides and resources for reducing missed consult calls, improving front-desk coverage, and protecting paid lead spend.",
  },
  "/missed-revenue-calculator": {
    title: "Missed Revenue Calculator | CayesDesk",
    description:
      "Estimate how much missed consult calls may be costing your cosmetic dental, med spa, surgery, or clinical research practice.",
  },
  "/request-demo": {
    title: "Request a CayesDesk Demo",
    description:
      "Call or request a CayesDesk demo to hear the 24/7 patient concierge for premium cosmetic, implant, med spa, and surgery consults.",
  },
  "/book-demo": {
    title: "Book a CayesDesk Demo",
    description:
      "Schedule a CayesDesk demo for 24/7 missed-call coverage, patient concierge workflows, and consult recovery planning.",
  },
  "/privacy": {
    title: "Privacy Policy | CayesDesk",
    description:
      "Review the CayesDesk privacy policy for business-side website, contact, and patient-concierge workflow information.",
  },
  "/terms": {
    title: "Terms of Service | CayesDesk",
    description:
      "Review CayesDesk terms of service for the website, live pilot, patient concierge workflows, and practice agreements.",
  },
  ...solutionRouteMeta,
};

const schema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  "@id": "https://cayesdesk.com/#software",
  name: "CayesDesk",
  alternateName: "CayesDesk Missed Consult Revenue Recovery",
  url: "https://cayesdesk.com/",
  applicationCategory: "BusinessApplication, HealthcareApplication",
  applicationSubCategory: "High-ticket healthcare missed-call recovery and consult capture",
  operatingSystem: "Web, Cloud, Telephony",
  browserRequirements: "Requires JavaScript",
  inLanguage: ["en-US", "es", "fr"],
  description:
    "CayesDesk is a 24/7 patient concierge and missed consult revenue recovery system for cosmetic dentistry, implant dentistry, med spas, plastic surgery, and cash-pay clinics. It answers missed and after-hours calls, follows approved scripts, captures consult intent, and routes staff-ready handoffs in English, Spanish, and French.",
  publisher: {
    "@type": "Organization",
    name: "Oncova Clinical Research LLC",
    url: "https://cayesdesk.com/",
  },
  brand: {
    "@type": "Brand",
    name: "CayesDesk",
  },
  audience: {
    "@type": "MedicalAudience",
    audienceType:
      "Cosmetic and implant dentists, medical spas, plastic surgery practices, clinical research SMOs, GLP-1 weight loss clinics, and cash-pay private clinics",
  },
  areaServed: {
    "@type": "Place",
    name: "South Florida",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "599",
    highPrice: "1499",
    offerCount: "3",
    url: "https://cayesdesk.com/pricing",
    description:
      "Start with a $497 7-day live pilot credited toward Month 1 if the practice continues. Plans start at $599 per month.",
  },
  featureList: [
    "24/7 patient concierge for high-ticket consult calls",
    "Missed-call recovery and consult capture",
    "$497 7-day live pilot with Missed Revenue Report",
    "English, Spanish, and French caller support",
    "Clinic-tailored concierge scripts and staff handoff summaries",
    "CRM, PMS/EHR, scheduling, email, SMS, and automation handoffs",
    "BAA-ready onboarding and HIPAA-conscious workflows before live PHI handling",
    "Predictable flat-rate pricing with zero per-minute meter anxiety",
  ],
  keywords:
    "patient concierge, healthcare answering service, missed-call recovery, consult capture, implant dentistry call coverage, cosmetic dentistry voice concierge, med spa answering service, plastic surgery call answering, South Florida medical scheduling concierge, multilingual healthcare voice concierge, private clinic missed revenue recovery",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://cayesdesk.com/#service",
  name: "CayesDesk 24/7 Patient Concierge",
  serviceType: "Missed consult call answering, patient concierge, and revenue recovery",
  provider: {
    "@type": "Organization",
    name: "Oncova Clinical Research LLC",
    url: "https://cayesdesk.com/",
  },
  areaServed: {
    "@type": "Place",
    name: "South Florida",
  },
  audience: {
    "@type": "MedicalAudience",
    audienceType:
      "Cosmetic dentists, implant dentists, med spa owners, plastic surgeons, clinical research SMOs, and high-ticket cash-pay private clinics",
  },
  description:
    "CayesDesk answers missed and after-hours consult calls for premium private clinics, captures caller intent through approved scripts, and routes staff-ready summaries into clinic workflows.",
  offers: {
    "@type": "OfferCatalog",
    name: "CayesDesk patient concierge plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "$497 7-day live pilot",
        price: "497",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Practice patient concierge plan",
        price: "999",
        priceCurrency: "USD",
      },
    ],
  },
};

function shouldShowSchema(pathname: string): boolean {
  return pathname === "/" || pathname === "/pricing";
}

function canonicalForPath(pathname: string): string {
  return `${siteUrl}${pathname === "/" ? "/" : pathname}`;
}

function upsertMetaByName(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function SoftwareApplicationJsonLd() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = routeMeta[pathname] ?? defaultMeta;
    const canonical = canonicalForPath(pathname);

    document.title = meta.title;
    upsertMetaByName("description", meta.description);
    upsertCanonical(canonical);
    upsertMetaByProperty("og:title", meta.title);
    upsertMetaByProperty("og:description", meta.description);
    upsertMetaByProperty("og:url", canonical);
    upsertMetaByName("twitter:title", meta.title);
    upsertMetaByName("twitter:description", meta.description);
  }, [pathname]);

  useEffect(() => {
    const existing = document.getElementById(scriptId);
    existing?.remove();

    if (!shouldShowSchema(pathname)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify([schema, serviceSchema]);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [pathname]);

  return null;
}
