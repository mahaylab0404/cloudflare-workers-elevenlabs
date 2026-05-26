import { FileCheck } from "lucide-react";

export default function Resources() {
  return (
    <section className="py-24 bg-surface w-full flex-1">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary mb-6">
            Resources & Guides
          </h1>
          <p className="text-xl text-on-surface-variant font-body max-w-2xl mx-auto">
            Practical guidance for setting up CayesDesk with privacy-aware,
            high-ticket patient concierge coverage.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 py-12">
           <div className="bg-surface-container-lowest p-8 rounded-lg ambient-shadow ghost-border flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary-container">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-headline text-primary">
              100% HIPAA Compliant Workflow Guide
            </h3>
            <p className="text-on-surface-variant font-body">
              Learn how BAA Included onboarding, encryption, approved scripts, and
              human escalation fit into deployment planning.
            </p>
            <button className="text-primary-container font-semibold mt-4 hover:opacity-80 transition-opacity">
              Download PDF &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
