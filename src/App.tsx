/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { trackPageView } from "./lib/customerio";
import About from "./pages/About";
import BookDemo from "./pages/BookDemo";
import Layout from "./components/Layout";
import { SoftwareApplicationJsonLd } from "./components/SoftwareApplicationJsonLd";
import ClinicalWorkflow from "./pages/ClinicalWorkflow";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import MissedRevenueTool from "./pages/MissedRevenueTool";
import PilotSuccess from "./pages/PilotSuccess";
import Pricing from "./pages/Pricing";
import RequestDemo from "./pages/RequestDemo";
import Resources from "./pages/Resources";
import SolutionLandingPage from "./pages/SolutionLandingPage";
import StartPilot from "./pages/StartPilot";
import Solutions from "./pages/Solutions";
import { solutionLandingPages } from "./lib/solutionLandingPages";
import {
  BusinessAssociateAgreement,
  HipaaWorkflows,
  LiveDemoLine,
  PrivacyPolicy,
  SecurityOverview,
  TermsOfService,
} from "./pages/TrustPages";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 });
    trackPageView();
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SoftwareApplicationJsonLd />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="about" element={<About />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          {solutionLandingPages.map((page) => (
            <Fragment key={page.path}>
              <Route
                element={<SolutionLandingPage page={page} />}
                path={page.path.slice(1)}
              />
            </Fragment>
          ))}
          <Route path="platform" element={<ClinicalWorkflow />} />
          <Route path="call-flow" element={<ClinicalWorkflow />} />
          <Route path="clinical-workflow" element={<ClinicalWorkflow />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="faq" element={<Faq />} />
          <Route path="book-demo" element={<BookDemo />} />
          <Route path="request-demo" element={<RequestDemo />} />
          <Route path="resources" element={<Resources />} />
          <Route path="missed-revenue-calculator" element={<MissedRevenueTool />} />
          <Route path="start-pilot" element={<StartPilot />} />
          <Route path="pilot/success" element={<PilotSuccess />} />
          <Route path="hipaa-workflows" element={<HipaaWorkflows />} />
          <Route path="security" element={<SecurityOverview />} />
          <Route path="demo-line" element={<LiveDemoLine />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="baa" element={<BusinessAssociateAgreement />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
