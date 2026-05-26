import { ChevronDown, Menu, PhoneCall, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import cayesdeskLogo from "../assets/cayesdesk-logo-render.svg";
import {
  liveDemoLinePath,
  sitePhoneDisplay,
  sitePhoneHref,
  supportEmail,
  supportMailto,
} from "../lib/flow";
import { solutionLandingPages } from "../lib/solutionLandingPages";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsMenuRef = useRef<HTMLDivElement | null>(null);
  const { pathname } = useLocation();

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    setSolutionsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!solutionsOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        solutionsMenuRef.current &&
        !solutionsMenuRef.current.contains(event.target as Node)
      ) {
        setSolutionsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [solutionsOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-primary focus:shadow-lg"
        href="#main-content"
      >
        Skip to content
      </a>
      <nav className="sticky top-0 z-50 w-full border-b border-primary/8 bg-white/94 shadow-[0_10px_28px_rgba(0,33,71,0.035)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link
            to="/"
            aria-label="CayesDesk home"
            className="inline-flex min-w-0 shrink-0 items-center"
          >
            <img
              alt="CayesDesk"
              className="h-8 w-auto max-w-[14rem] sm:h-9 sm:max-w-[15rem] lg:h-10 lg:max-w-[17rem] xl:h-11 xl:max-w-[18rem]"
              src={cayesdeskLogo}
            />
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center gap-5 xl:flex 2xl:gap-7">
            <Link
              to="/how-it-works"
              className="inline-flex min-h-11 items-center whitespace-nowrap font-label text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-[#002147]"
            >
              How It Works
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
              ref={solutionsMenuRef}
            >
              <button
                aria-expanded={solutionsOpen}
                aria-haspopup="menu"
                className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap font-label text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-[#002147] focus:outline-none focus-visible:text-[#002147]"
                onClick={() => setSolutionsOpen((value) => !value)}
                onFocus={() => setSolutionsOpen(true)}
                type="button"
              >
                Solutions
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${solutionsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {solutionsOpen && (
                <div
                  className="absolute left-1/2 top-full z-50 w-[24rem] -translate-x-1/2 pt-3"
                  role="menu"
                >
                  <div className="overflow-hidden rounded-lg border border-primary/10 bg-white shadow-[0_24px_70px_rgba(0,33,71,0.16)]">
                    <Link
                      className="block border-b border-primary/8 px-5 py-4 transition hover:bg-surface-container-low"
                      onClick={() => setSolutionsOpen(false)}
                      role="menuitem"
                      to="/solutions"
                    >
                      <span className="block text-sm font-extrabold text-primary">
                        All Solutions
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
                        Missed consult recovery for premium private clinics.
                      </span>
                    </Link>
                    <div className="grid gap-0 p-2">
                      {solutionLandingPages.map((page) => (
                        <Link
                          className="rounded-md px-4 py-3 transition hover:bg-surface-container-low focus:bg-surface-container-low focus:outline-none"
                          key={page.path}
                          onClick={() => setSolutionsOpen(false)}
                          role="menuitem"
                          to={page.path}
                        >
                          <span className="block text-sm font-extrabold text-primary">
                            {page.navLabel}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
                            {page.menuDescription}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/pricing"
              className="inline-flex min-h-11 items-center whitespace-nowrap font-label text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-[#002147]"
            >
              Pricing
            </Link>
            <Link
              to="/security"
              className="inline-flex min-h-11 items-center whitespace-nowrap font-label text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-[#002147]"
            >
              Security &amp; BAA
            </Link>
          </div>
          <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
            <a
              href={sitePhoneHref}
              className="hidden min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-primary/15 bg-white px-3.5 py-2 text-sm font-bold text-primary shadow-[0_8px_24px_rgba(0,33,71,0.08)] transition hover:border-primary/30 hover:bg-primary hover:text-white xl:inline-flex"
            >
              <PhoneCall className="h-4 w-4" />
              {sitePhoneDisplay}
            </a>
            <Link
              to="/demo-line"
              className="hidden min-h-11 items-center whitespace-nowrap rounded-md px-3 py-2 font-label text-sm font-medium text-primary hover:bg-surface-container-low 2xl:inline-flex"
            >
              Live Demo Line
            </Link>
            <button
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-primary hover:bg-surface-container-low xl:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="border-t border-surface-variant/40 bg-white px-8 py-5 xl:hidden">
            <div className="flex flex-col gap-4">
              <Link to="/how-it-works" onClick={closeMobile} className="font-semibold text-primary">
                How It Works
              </Link>
              <div className="rounded-lg border border-primary/10 bg-surface-container-low p-4">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-primary-container">
                  Solutions
                </p>
                <div className="grid gap-3">
                  <Link
                    to="/solutions"
                    onClick={closeMobile}
                    className="font-semibold text-primary"
                  >
                    All Solutions
                  </Link>
                  {solutionLandingPages.map((page) => (
                    <Link
                      className="text-sm font-semibold leading-5 text-slate-600"
                      key={page.path}
                      onClick={closeMobile}
                      to={page.path}
                    >
                      {page.navLabel}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/pricing" onClick={closeMobile} className="font-semibold text-primary">
                Pricing
              </Link>
              <Link to="/security" onClick={closeMobile} className="font-semibold text-primary">
                Security &amp; BAA
              </Link>
              <a
                href={sitePhoneHref}
                onClick={closeMobile}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-white"
              >
                <PhoneCall className="h-5 w-5" />
                Call the Concierge
              </a>
              <Link to="/demo-line" onClick={closeMobile} className="font-semibold text-primary">
                Live Demo Line
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1" id="main-content">
        <Outlet />
      </main>

      <footer className="mt-auto w-full border-t border-slate-100 bg-[#F8F9FA] py-12 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-12 px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="flex flex-col items-center text-center lg:-mt-2 lg:items-center">
            <img
              alt="CayesDesk"
              className="mb-6 h-24 w-auto max-w-full"
              src={cayesdeskLogo}
            />
            <p className="mb-8 max-w-sm text-sm leading-6 text-slate-500 font-body">
              South Florida&apos;s Intelligent Patient Concierge for premium private clinics.
            </p>
            <p className="text-sm leading-6 text-slate-500 font-body">
              CayesDesk by Oncova Clinical Research LLC.
              <br />
              © 2026 CayesDesk. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col space-y-3">
            <p className="font-semibold font-headline text-[#002147] mb-2">
              Product
            </p>
            <Link
              to="/how-it-works"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              How It Works
            </Link>
            <Link
              to="/call-flow"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Call Flow
            </Link>
            <Link
              to="/hipaa-workflows"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              BAA & Security
            </Link>
            <Link
              to="/security"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Security Overview
            </Link>
            <Link
              to={liveDemoLinePath}
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Live Demo Line
            </Link>
            <Link
              to="/faq"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              FAQ
            </Link>
            <Link
              to="/missed-revenue-calculator"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Missed Revenue Calculator
            </Link>
          </div>
          <div className="flex flex-col space-y-3">
            <p className="font-semibold font-headline text-[#002147] mb-2">
              Contact
            </p>
            <a
              href={sitePhoneHref}
              className="inline-flex items-center gap-2 text-lg font-extrabold text-[#002147] transition-colors hover:text-primary-container"
            >
              <PhoneCall className="h-5 w-5" />
              {sitePhoneDisplay}
            </a>
            <a
              href={supportMailto}
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              {supportEmail}
            </a>
          </div>
          <div className="flex flex-col space-y-3">
            <p className="font-semibold font-headline text-[#002147] mb-2">
              Company & Legal
            </p>
            <Link
              to="/about"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              About CayesDesk
            </Link>
            <Link
              to="/privacy"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-slate-500 hover:text-[#002147] transition-colors text-sm font-body"
            >
              Terms of Service
            </Link>
            <Link
              to="/baa"
              className="text-sm font-bold text-[#002147] underline decoration-tertiary-fixed decoration-2 underline-offset-4 transition-colors hover:text-primary-container"
            >
              Business Associate Agreement (BAA)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
