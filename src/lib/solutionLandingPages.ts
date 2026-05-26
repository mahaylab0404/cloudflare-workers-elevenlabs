import clinicalResearchImage from "../assets/seo/clinical-research-smo-call-coverage.jpg";
import cosmeticDentalImage from "../assets/seo/cosmetic-dental-answering-service.jpg";
import implantDentistImage from "../assets/seo/implant-dentist-call-answering.jpg";
import medSpaImage from "../assets/seo/medical-spa-answering-service.jpg";
import plasticSurgeryImage from "../assets/seo/plastic-surgery-patient-concierge.jpg";
import southFloridaImage from "../assets/seo/south-florida-patient-concierge.jpg";

export type SolutionMoment = {
  label: string;
  time: string;
  title: string;
  value: string;
  risk: string;
  caller: string;
  answer: string;
  handoff: string;
};

export type SolutionFaq = {
  question: string;
  answer: string;
};

export type SolutionLandingPage = {
  path: string;
  navLabel: string;
  menuDescription: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  heroAlt: string;
  eyebrow: string;
  heroTitle: string;
  heroSubhead: string;
  heroProof: string;
  painHeadline: string;
  painCopy: string;
  moments: SolutionMoment[];
  revenue: {
    eyebrow: string;
    headline: string;
    value: string;
    label: string;
    copy: string;
    supporting: string[];
  };
  captureHeadline: string;
  captureCopy: string;
  captureItems: string[];
  workflowHeadline: string;
  workflowCopy: string;
  workflowItems: string[];
  guardrailHeadline: string;
  guardrailCopy: string;
  guardrailItems: string[];
  faqs: SolutionFaq[];
  finalHeadline: string;
  finalCopy: string;
};

export const solutionLandingPages: SolutionLandingPage[] = [
  {
    path: "/medical-spa-answering-service",
    navLabel: "Medical Spas",
    menuDescription: "After-hours ad leads, injectables, lasers, memberships",
    metaTitle: "Medical Spa Answering Service | CayesDesk",
    metaDescription:
      "CayesDesk is a 24/7 medical spa answering service and patient concierge for aesthetic leads, injectables, lasers, body contouring, and membership inquiries.",
    heroImage: medSpaImage,
    heroAlt: "Upscale med spa treatment room prepared for a premium aesthetic consultation",
    eyebrow: "Medical spa answering service",
    heroTitle: "Answer med spa leads before campaign clicks cool off.",
    heroSubhead:
      "CayesDesk gives aesthetic callers a polished first response when your injectors, coordinators, or front desk are unavailable.",
    heroProof:
      "Built for injectables, lasers, body contouring, memberships, and high-intent after-hours ad traffic.",
    painHeadline: "The lead is warm for minutes, not days.",
    painCopy:
      "Aesthetic buyers often click after work, during weekends, or between appointments. If they hit voicemail, the next med spa is one search result away.",
    moments: [
      {
        label: "After-hours ad",
        time: "7:46 PM",
        title: "A laser package inquiry lands after closing",
        value: "$4K+",
        risk: "Lead cools before morning",
        caller: "Treatment package, financing, and availability questions",
        answer: "Warm brand-aligned response in English or Spanish",
        handoff: "Summary and booking next step routed to staff",
      },
      {
        label: "Injector day",
        time: "12:14 PM",
        title: "Botox caller rings while staff is rooming patients",
        value: "Repeat buyer",
        risk: "No one wants to leave a voicemail",
        caller: "New patient asking about consultation and price ranges",
        answer: "Approved language, no promises, no medical advice",
        handoff: "Contact, interest, and preferred time captured",
      },
      {
        label: "Weekend demand",
        time: "Saturday",
        title: "Body contouring lead comes from a paid campaign",
        value: "Package path",
        risk: "Competitor call next",
        caller: "Treatment interest, location, language, and urgency",
        answer: "Concierge tone with escalation rules intact",
        handoff: "Booking link or CRM task created for follow-up",
      },
    ],
    revenue: {
      eyebrow: "Revenue context",
      headline: "Campaign traffic is expensive. Silence is more expensive.",
      value: "$4K+",
      label: "Potential package or membership path",
      copy:
        "CayesDesk protects the moment between the paid click and the consult conversation your staff needs to close.",
      supporting: [
        "24/7 response for paid social and Google ad traffic",
        "English, Spanish, and French caller support",
        "Treatment interest, budget context, and preferred booking window captured",
      ],
    },
    captureHeadline: "What CayesDesk captures for med spas",
    captureCopy:
      "The patient feels answered. Your coordinator gets the details needed to move quickly without guessing from a voicemail.",
    captureItems: [
      "Treatment interest: injectables, lasers, skin, body, membership, or wellness",
      "Caller name, phone, email, preferred language, and booking window",
      "Campaign context, urgency, and whether the caller is new or returning",
      "Escalation flags for clinical, adverse-event, or emergency questions",
    ],
    workflowHeadline: "Fits the systems your med spa already uses",
    workflowCopy:
      "Route summaries into your CRM, scheduling link, email, SMS, or automation platform so the front desk sees the next step before the lead goes cold.",
    workflowItems: [
      "Aesthetic CRM and lead pipeline handoffs",
      "Booking links for consults or coordinator follow-up",
      "SMS or email alerts for urgent revenue opportunities",
    ],
    guardrailHeadline: "Premium response without clinical overreach",
    guardrailCopy:
      "CayesDesk does not recommend treatments, quote final clinical eligibility, or handle emergencies as medical advice.",
    guardrailItems: [
      "Clinical questions route back to your licensed team",
      "Emergency and adverse-event language follows your approved escalation rules",
      "BAA-ready workflows before live PHI handling",
    ],
    faqs: [
      {
        question: "Can CayesDesk answer after-hours med spa leads?",
        answer:
          "Yes. CayesDesk is built for after-hours and overflow aesthetic inquiries, including paid ad leads, package questions, consult interest, and booking next steps.",
      },
      {
        question: "Can it answer questions about Botox, fillers, lasers, or body contouring?",
        answer:
          "CayesDesk can follow your approved non-clinical script, capture treatment interest, and route clinical or eligibility questions to your staff.",
      },
      {
        question: "Can CayesDesk support Spanish-speaking med spa callers?",
        answer:
          "Yes. English, Spanish, and French caller support can be included in the concierge workflow.",
      },
      {
        question: "Will it connect with our med spa CRM or booking workflow?",
        answer:
          "CayesDesk can route staff-ready summaries into CRM, scheduling, email, SMS, or automation tools based on the workflow approved during onboarding.",
      },
    ],
    finalHeadline: "Let one real campaign week prove the gap.",
    finalCopy:
      "Start with live missed-call coverage, then review what CayesDesk captured from real med spa demand.",
  },
  {
    path: "/cosmetic-dental-answering-service",
    navLabel: "Cosmetic Dentistry",
    menuDescription: "Veneers, smile design, whitening, high-value consults",
    metaTitle: "Cosmetic Dental Answering Service | CayesDesk",
    metaDescription:
      "CayesDesk answers missed cosmetic dental consult calls 24/7 for veneers, smile design, whitening, and high-value private dental practices.",
    heroImage: cosmeticDentalImage,
    heroAlt: "Modern cosmetic dental suite with premium patient consultation atmosphere",
    eyebrow: "Cosmetic dental answering service",
    heroTitle: "Do not let a smile-design lead hit voicemail.",
    heroSubhead:
      "CayesDesk answers missed cosmetic dental calls like a trained front desk and routes consult-ready details to your team.",
    heroProof:
      "Built for veneers, whitening, smile design, bonding, Invisalign, and cash-pay cosmetic dentistry demand.",
    painHeadline: "The buyer already imagined the result.",
    painCopy:
      "Cosmetic dental leads are emotional and time-sensitive. They want to feel heard before they compare your practice to the next polished brand.",
    moments: [
      {
        label: "Smile design",
        time: "6:32 PM",
        title: "A veneer lead calls after comparing before-and-afters",
        value: "$8K+",
        risk: "Shopping another practice",
        caller: "Veneer goals, timing, budget, and consult questions",
        answer: "Approved concierge script with premium brand tone",
        handoff: "Intent, availability, and next step sent to staff",
      },
      {
        label: "Front desk busy",
        time: "11:48 AM",
        title: "New patient calls while hygiene and consults overlap",
        value: "Cosmetic path",
        risk: "A callback feels too slow",
        caller: "Smile concerns, photo consult interest, and schedule window",
        answer: "Calm intake without treatment promises",
        handoff: "Contact details and cosmetic interest summarized",
      },
      {
        label: "Weekend research",
        time: "Sunday",
        title: "A whitening or bonding inquiry comes from search",
        value: "Starter case",
        risk: "Lead loses momentum",
        caller: "Service interest, location, preferred time, and questions",
        answer: "Helpful first touch with staff escalation",
        handoff: "Follow-up task ready before Monday",
      },
    ],
    revenue: {
      eyebrow: "Revenue context",
      headline: "Cosmetic demand rewards the practice that answers first.",
      value: "$8K+",
      label: "Potential veneer or smile-design path",
      copy:
        "The first response should feel as polished as the case photos that brought the patient to your site.",
      supporting: [
        "Capture interest before the patient books elsewhere",
        "Protect staff focus during chairside and consult-heavy days",
        "Route clear summaries into the workflow your front desk already checks",
      ],
    },
    captureHeadline: "What CayesDesk captures for cosmetic dentistry",
    captureCopy:
      "CayesDesk turns a missed cosmetic call into a clean consult opportunity your team can act on.",
    captureItems: [
      "Cosmetic goal: veneers, bonding, whitening, aligners, smile design, or second opinion",
      "Caller contact, preferred language, consult window, and urgency",
      "Budget or financing context when appropriate to your script",
      "Clinical questions and emergencies routed to staff under approved rules",
    ],
    workflowHeadline: "Designed around a private dental front desk",
    workflowCopy:
      "CayesDesk can send summaries to your CRM, dental PMS, email, SMS, scheduling link, or automation tools so staff sees what matters.",
    workflowItems: [
      "Consult-ready summary for the treatment coordinator",
      "Scheduling and callback workflow routing",
      "Language support for English, Spanish, and French callers",
    ],
    guardrailHeadline: "No dental advice. No diagnosis. No triage.",
    guardrailCopy:
      "CayesDesk handles business-side consult capture, not dental decision-making.",
    guardrailItems: [
      "Clinical and emergency questions route to your team",
      "Approved script boundaries are set before launch",
      "BAA-ready onboarding for patient data workflows",
    ],
    faqs: [
      {
        question: "Is CayesDesk a cosmetic dental answering service?",
        answer:
          "Yes. CayesDesk answers missed and after-hours cosmetic dental calls, captures consult intent, and routes staff-ready handoffs to your practice.",
      },
      {
        question: "Can CayesDesk handle veneer and smile-design inquiries?",
        answer:
          "CayesDesk can capture the caller's cosmetic goal, preferred consult window, contact information, language, and questions while routing clinical details to staff.",
      },
      {
        question: "Can it integrate with our dental PMS or CRM?",
        answer:
          "CayesDesk can route summaries into the systems your team already uses, including PMS, CRM, scheduling, email, SMS, or automation workflows.",
      },
      {
        question: "Does CayesDesk give dental advice?",
        answer:
          "No. CayesDesk does not diagnose, triage, or provide dental advice. Clinical questions are routed to your staff.",
      },
    ],
    finalHeadline: "Give cosmetic callers the first response your brand deserves.",
    finalCopy:
      "Use a 7-day pilot to see which missed cosmetic calls were worth protecting.",
  },
  {
    path: "/implant-dentist-call-answering",
    navLabel: "Implant Dentistry",
    menuDescription: "Full-arch, implants, financing, consult capture",
    metaTitle: "Implant Dentist Call Answering | CayesDesk",
    metaDescription:
      "CayesDesk answers missed implant dentist calls 24/7 for full-arch, single implant, financing, and consultation inquiries.",
    heroImage: implantDentistImage,
    heroAlt: "Bright implant dental operatory prepared for a high-value consult",
    eyebrow: "Implant dentist call answering",
    heroTitle: "Your next full-arch consult should not wait on hold.",
    heroSubhead:
      "CayesDesk protects implant calls when your team is in surgery, consults, lunch, or after-hours coverage gaps.",
    heroProof:
      "Built for full-arch, single implant, All-on-X, financing, second opinions, and serious treatment inquiries.",
    painHeadline: "Implant callers are comparing trust, speed, and confidence.",
    painCopy:
      "A missed implant call is rarely just a missed phone event. It can be a patient weighing financing, fear, timing, and which practice feels ready.",
    moments: [
      {
        label: "Procedure day",
        time: "12:18 PM",
        title: "Full-arch lead calls while staff is in procedure",
        value: "$25K+",
        risk: "Voicemail loses the moment",
        caller: "Full-arch, financing, timeline, and consult questions",
        answer: "Approved intake, no clinical advice, calm reassurance",
        handoff: "Treatment interest and urgency routed to coordinator",
      },
      {
        label: "Paid search",
        time: "8:03 PM",
        title: "Implant second-opinion caller comes from Google Ads",
        value: "$6K+",
        risk: "Another office answers first",
        caller: "Pain point, case type, budget concern, preferred time",
        answer: "Business-side consult capture with escalation rules",
        handoff: "Staff-ready summary before morning follow-up",
      },
      {
        label: "Financing question",
        time: "Friday",
        title: "A hesitant caller asks if implant treatment is affordable",
        value: "Case path",
        risk: "Fear stops the consult",
        caller: "Financing, treatment interest, and appointment timing",
        answer: "Approved financing language and consult next step",
        handoff: "Coordinator sees the objection and next action",
      },
    ],
    revenue: {
      eyebrow: "Revenue context",
      headline: "One protected implant call can justify the pilot.",
      value: "$25K+",
      label: "Potential full-arch case value",
      copy:
        "CayesDesk is built for the consult calls where speed, tone, and staff handoff quality directly affect whether a patient books.",
      supporting: [
        "After-hours and procedure-day coverage",
        "Financing and consult-interest capture",
        "Coordinator-ready summaries for fast follow-up",
      ],
    },
    captureHeadline: "What CayesDesk captures for implant dentistry",
    captureCopy:
      "Your team gets the context they need without asking the patient to repeat everything from scratch.",
    captureItems: [
      "Implant interest: single implant, multiple implants, full-arch, second opinion, or denture alternative",
      "Financing concern, consultation readiness, and timing",
      "Caller contact, location, preferred language, and best callback window",
      "Emergency or clinical concern routed under your approved escalation rules",
    ],
    workflowHeadline: "Built for treatment coordinators and busy surgical days",
    workflowCopy:
      "CayesDesk can send the handoff to your PMS, CRM, treatment coordinator email, SMS alert, scheduling system, or automation workflow.",
    workflowItems: [
      "Procedure-day overflow coverage",
      "Full-arch and financing context in the summary",
      "Direct routing to the staff member responsible for consult conversion",
    ],
    guardrailHeadline: "Clear clinical boundaries",
    guardrailCopy:
      "CayesDesk does not diagnose, triage, give implant advice, or handle emergencies as clinical care.",
    guardrailItems: [
      "Approved script before launch",
      "Clinical questions route to staff",
      "Privacy-conscious workflows with BAA-ready deployment",
    ],
    faqs: [
      {
        question: "Can CayesDesk answer full-arch implant calls?",
        answer:
          "Yes. CayesDesk can capture full-arch interest, financing context, contact details, preferred timing, and urgency while routing clinical questions to your staff.",
      },
      {
        question: "Can it answer during procedure hours?",
        answer:
          "Yes. CayesDesk is designed for lunch, procedure blocks, consult overlaps, after-hours, and front desk overflow.",
      },
      {
        question: "Will it give implant treatment advice?",
        answer:
          "No. CayesDesk does not diagnose or provide dental advice. It follows your approved business-side script and escalates clinical questions.",
      },
      {
        question: "Can it route leads to a treatment coordinator?",
        answer:
          "Yes. Handoffs can be routed to coordinator email, SMS, CRM, PMS, scheduling, or automation workflows depending on your setup.",
      },
    ],
    finalHeadline: "Protect the implant calls your ads already paid for.",
    finalCopy:
      "Start with real missed-call coverage and see what serious implant demand was slipping through.",
  },
  {
    path: "/plastic-surgery-patient-concierge",
    navLabel: "Plastic Surgery",
    menuDescription: "Procedure inquiries, financing, discreet handoffs",
    metaTitle: "Plastic Surgery Patient Concierge | CayesDesk",
    metaDescription:
      "CayesDesk is a 24/7 plastic surgery patient concierge for missed consult calls, procedure inquiries, financing questions, and discreet staff handoffs.",
    heroImage: plasticSurgeryImage,
    heroAlt: "Upscale private practice reception for plastic surgery consult inquiries",
    eyebrow: "Plastic surgery patient concierge",
    heroTitle: "A discreet first response for serious procedure inquiries.",
    heroSubhead:
      "CayesDesk answers missed plastic surgery consult calls with calm, polished intake and routes sensitive questions back to your staff.",
    heroProof:
      "Built for breast, body, facial, revision, financing, and elective procedure consult demand.",
    painHeadline: "Privacy and tone matter before the consult is booked.",
    painCopy:
      "Plastic surgery callers may be nervous, private, and comparing practices quietly. A missed call can feel like the practice was not ready for them.",
    moments: [
      {
        label: "Private inquiry",
        time: "8:21 PM",
        title: "A procedure caller waits until after work",
        value: "Five figures",
        risk: "Trust drops at voicemail",
        caller: "Procedure interest, timing, financing, and privacy concerns",
        answer: "Discreet approved script with no clinical promises",
        handoff: "Consult context sent to the right coordinator",
      },
      {
        label: "Coordinator busy",
        time: "2:37 PM",
        title: "Surgical coordinator is with another consult",
        value: "Consult path",
        risk: "Caller keeps researching",
        caller: "Procedure type, location, and callback window",
        answer: "Premium intake and staff escalation for sensitive questions",
        handoff: "Summary includes objections and next best action",
      },
      {
        label: "Weekend lead",
        time: "Saturday",
        title: "A paid search lead asks about financing",
        value: "Procedure path",
        risk: "Lead cools by Monday",
        caller: "Financing, consult availability, and procedure category",
        answer: "Approved financing language and booking direction",
        handoff: "Staff sees the inquiry before the first business hour",
      },
    ],
    revenue: {
      eyebrow: "Revenue context",
      headline: "High-value procedure inquiries need a premium first touch.",
      value: "5 figures",
      label: "Potential elective procedure path",
      copy:
        "CayesDesk gives callers a calm response while preserving the boundary that clinical and procedural decisions stay with your staff.",
      supporting: [
        "Discreet intake for sensitive procedure questions",
        "Financing and consult readiness captured",
        "Staff-ready handoffs for the surgical coordinator",
      ],
    },
    captureHeadline: "What CayesDesk captures for plastic surgery",
    captureCopy:
      "The handoff gives your coordinator enough context to follow up with precision and care.",
    captureItems: [
      "Procedure category, goals, timing, and consult readiness",
      "Financing questions or scheduling blockers",
      "Caller contact, preferred communication method, and privacy preferences",
      "Clinical or urgent questions routed to your staff under approved rules",
    ],
    workflowHeadline: "A concierge layer for the coordinator workflow",
    workflowCopy:
      "CayesDesk can route summaries into CRM, email, SMS, scheduling, or your preferred coordination workflow.",
    workflowItems: [
      "Procedure-specific routing and notes",
      "Coordinator-ready follow-up summary",
      "Approved escalation path for clinical and urgent questions",
    ],
    guardrailHeadline: "Designed for sensitive boundaries",
    guardrailCopy:
      "CayesDesk does not advise on procedures, candidacy, risks, recovery, or emergency handling.",
    guardrailItems: [
      "No medical advice or triage",
      "Clinical questions return to your staff",
      "BAA-ready workflows for patient information",
    ],
    faqs: [
      {
        question: "Can CayesDesk answer plastic surgery consult calls after hours?",
        answer:
          "Yes. CayesDesk can answer missed and after-hours procedure inquiries, capture intent, and route staff-ready summaries to your coordinator.",
      },
      {
        question: "Can CayesDesk discuss procedure pricing or financing?",
        answer:
          "CayesDesk can follow your approved non-clinical language around pricing ranges, financing, or consult next steps, then route details to staff.",
      },
      {
        question: "Does CayesDesk provide medical advice?",
        answer:
          "No. CayesDesk does not provide medical advice, triage, candidacy decisions, or emergency handling as care.",
      },
      {
        question: "Can it handle sensitive callers discreetly?",
        answer:
          "Yes. The workflow can be configured for discreet language, privacy-conscious handoffs, and coordinator-specific routing.",
      },
    ],
    finalHeadline: "Make the first response feel like your practice.",
    finalCopy:
      "Hear how the concierge handles a procedure inquiry, then test it on real missed calls for 7 days.",
  },
  {
    path: "/clinical-research-smo-call-coverage",
    navLabel: "Clinical Research SMOs",
    menuDescription: "Participant inquiries, study routing, coordinator support",
    metaTitle: "Clinical Research SMO Call Coverage | CayesDesk",
    metaDescription:
      "CayesDesk supports clinical research SMOs with privacy-conscious participant inquiry capture, study-interest routing, and coordinator-ready handoffs.",
    heroImage: clinicalResearchImage,
    heroAlt: "Clinical research operations environment with privacy-conscious laboratory context",
    eyebrow: "Clinical research SMO call coverage",
    heroTitle: "Participant inquiries should not disappear between visits.",
    heroSubhead:
      "CayesDesk supports research-site operations with careful intake, protocol-aware boundaries, and coordinator-ready routing.",
    heroProof:
      "Built for SMOs, site networks, study-interest calls, sponsor/site routing, and privacy-conscious operations.",
    painHeadline: "Recruitment is expensive. Missed interest is invisible.",
    painCopy:
      "Study teams live inside visits, source docs, queries, sponsor calls, and recruitment pressure. A missed participant call can become a missing enrollment opportunity.",
    moments: [
      {
        label: "Recruitment ad",
        time: "6:58 PM",
        title: "Participant interest arrives after coordinator hours",
        value: "Enrollment path",
        risk: "Interest drops overnight",
        caller: "Study interest, location, availability, and contact details",
        answer: "Approved intake with no eligibility promises",
        handoff: "Coordinator-ready summary and routing context",
      },
      {
        label: "Clinic day",
        time: "10:44 AM",
        title: "Coordinator is with a participant visit",
        value: "Site capacity",
        risk: "Caller leaves no message",
        caller: "Protocol interest and best callback window",
        answer: "Respectful intake with clear research boundaries",
        handoff: "Study team gets contact and inquiry details",
      },
      {
        label: "Sponsor routing",
        time: "Friday",
        title: "A site operations call needs the right destination",
        value: "Operational time",
        risk: "Staff time wasted tracking context",
        caller: "Sponsor, participant, or referral source context",
        answer: "Structured intake and routing under approved SOP",
        handoff: "Clean next step for coordinator or operations lead",
      },
    ],
    revenue: {
      eyebrow: "Operational context",
      headline: "Recruitment loss often looks like a quiet phone gap.",
      value: "1 call",
      label: "Can be one missing enrollment path",
      copy:
        "CayesDesk brings healthcare operations discipline to call capture so participant interest reaches the right person with the right context.",
      supporting: [
        "Participant interest captured without eligibility promises",
        "Coordinator-ready notes aligned to approved SOP boundaries",
        "BAA-ready and privacy-conscious workflows before live PHI handling",
      ],
    },
    captureHeadline: "What CayesDesk captures for SMOs",
    captureCopy:
      "The goal is not to replace coordinators. It is to protect their attention while keeping inbound interest organized.",
    captureItems: [
      "Study interest, referral source, location, and best callback window",
      "Participant contact details and preferred language",
      "Routing context for coordinator, recruitment, or operations staff",
      "Escalation flags for clinical, safety, or urgent questions",
    ],
    workflowHeadline: "Built around coordinator reality",
    workflowCopy:
      "CayesDesk can route handoffs into email, CRM, CTMS-adjacent workflows, SMS alerts, scheduling tools, or approved operations channels.",
    workflowItems: [
      "SOP-aligned intake boundaries",
      "Coordinator and operations routing",
      "Research-site documentation support without eligibility decisions",
    ],
    guardrailHeadline: "Respect for persons comes first",
    guardrailCopy:
      "CayesDesk is shaped by clinical research experience handling patient information, participant communication, and privacy obligations.",
    guardrailItems: [
      "No eligibility promises or medical advice",
      "Safety and urgent questions route to staff",
      "BAA-ready workflows and controlled access expectations",
    ],
    faqs: [
      {
        question: "Can CayesDesk help clinical research sites with participant calls?",
        answer:
          "Yes. CayesDesk can capture participant interest, contact details, study context, and routing needs while leaving eligibility and clinical decisions to site staff.",
      },
      {
        question: "Does CayesDesk screen participants for eligibility?",
        answer:
          "CayesDesk can follow approved intake boundaries but does not make eligibility promises or clinical judgments.",
      },
      {
        question: "Can it route study inquiries to coordinators?",
        answer:
          "Yes. Handoffs can be routed to coordinator email, operations workflows, CRM, scheduling, SMS, or other approved tools.",
      },
      {
        question: "Is the workflow privacy-conscious?",
        answer:
          "Yes. CayesDesk is designed for BAA-ready, privacy-conscious workflows before live PHI handling.",
      },
    ],
    finalHeadline: "Protect participant interest before it gets lost.",
    finalCopy:
      "Use CayesDesk to support research operations without asking coordinators to answer every call in real time.",
  },
  {
    path: "/south-florida-patient-concierge",
    navLabel: "South Florida Clinics",
    menuDescription: "Luxury private practices and local paid lead coverage",
    metaTitle: "South Florida Patient Concierge | CayesDesk",
    metaDescription:
      "CayesDesk is South Florida's intelligent patient concierge for premium private clinics that need 24/7 missed-call recovery and consult capture.",
    heroImage: southFloridaImage,
    heroAlt: "Luxury South Florida private clinic reception prepared for premium patient calls",
    eyebrow: "South Florida patient concierge",
    heroTitle: "South Florida clinics cannot afford cold leads.",
    heroSubhead:
      "CayesDesk protects high-intent consult calls for premium private practices across the region, day or night.",
    heroProof:
      "Built for cosmetic dentistry, med spas, surgery, wellness, research sites, and cash-pay clinics serving fast-moving local demand.",
    painHeadline: "Your patient has options on the same block.",
    painCopy:
      "South Florida buyers move quickly. If your phone rings after hours, during lunch, or while staff is with a patient, another polished clinic may answer first.",
    moments: [
      {
        label: "Local search",
        time: "7:12 PM",
        title: "A paid search lead calls after office hours",
        value: "$4K-$25K",
        risk: "Another local practice answers",
        caller: "Consult interest, location, language, and timing",
        answer: "Premium first response matched to your script",
        handoff: "Staff gets context before the next business day",
      },
      {
        label: "Lunch gap",
        time: "12:36 PM",
        title: "The front desk is away while the ad keeps running",
        value: "Paid lead",
        risk: "Marketing spend leaks",
        caller: "Treatment interest and next available consult window",
        answer: "Immediate concierge response",
        handoff: "Summary routed to your preferred workflow",
      },
      {
        label: "Multilingual demand",
        time: "Saturday",
        title: "A Spanish-speaking caller wants a confident first touch",
        value: "Local trust",
        risk: "Caller keeps searching",
        caller: "Preferred language, service interest, and callback time",
        answer: "English, Spanish, or French support",
        handoff: "Staff-ready handoff with language noted",
      },
    ],
    revenue: {
      eyebrow: "Local market context",
      headline: "In a premium market, response speed is part of the brand.",
      value: "24/7",
      label: "Coverage for local consult demand",
      copy:
        "CayesDesk gives private clinics a polished layer of capacity without hiring another full-time receptionist for every gap.",
      supporting: [
        "Local high-ticket consult capture",
        "English, Spanish, and French support",
        "Workflow routing for the systems staff already checks",
      ],
    },
    captureHeadline: "What CayesDesk captures for South Florida practices",
    captureCopy:
      "Whether the caller is asking about implants, injectables, surgery, wellness, or research participation, the handoff is built for staff action.",
    captureItems: [
      "Practice-specific consult interest and service category",
      "Name, contact, preferred language, city, and best follow-up time",
      "Urgency, campaign context, and next step",
      "Clinical or emergency questions routed to staff under approved rules",
    ],
    workflowHeadline: "Works with the tools already inside your practice",
    workflowCopy:
      "CayesDesk can connect to CRM, PMS/EHR, scheduling software, email, SMS, and automation tools so the handoff lands where staff works.",
    workflowItems: [
      "Single-location or multi-location routing",
      "After-hours, lunch, weekend, and overflow coverage",
      "Weekly Missed Revenue Report after the pilot",
    ],
    guardrailHeadline: "Premium, privacy-conscious, and clinically bounded",
    guardrailCopy:
      "CayesDesk is for consult capture and business-side patient concierge workflows, not medical or dental advice.",
    guardrailItems: [
      "No clinical advice, diagnosis, or triage",
      "Clear emergency escalation language",
      "BAA-ready deployments and privacy-conscious handling",
    ],
    faqs: [
      {
        question: "Is CayesDesk based around South Florida private practices?",
        answer:
          "Yes. CayesDesk is positioned for premium South Florida clinics where missed consult calls can represent significant revenue leakage.",
      },
      {
        question: "What types of South Florida clinics does CayesDesk support?",
        answer:
          "CayesDesk supports cosmetic and implant dentistry, med spas, plastic surgery, wellness clinics, clinical research SMOs, and other high-ticket private practices.",
      },
      {
        question: "Can CayesDesk support multilingual callers?",
        answer:
          "Yes. English, Spanish, and French caller support can be included in the concierge workflow.",
      },
      {
        question: "Does CayesDesk replace our front desk?",
        answer:
          "No. CayesDesk adds 24/7 capacity and missed-call protection so your staff can stay focused on in-office patients and high-value follow-up.",
      },
    ],
    finalHeadline: "Give South Florida callers a reason to stay with your practice.",
    finalCopy:
      "Start with a 7-day pilot and see which local consult calls were waiting for a better first response.",
  },
];

export const solutionRouteMeta = Object.fromEntries(
  solutionLandingPages.map((page) => [
    page.path,
    {
      title: page.metaTitle,
      description: page.metaDescription,
    },
  ]),
) as Record<string, { title: string; description: string }>;
