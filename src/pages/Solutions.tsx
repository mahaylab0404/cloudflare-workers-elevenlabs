import { FileCheck, Headset, Hospital } from "lucide-react";

export default function Solutions() {
  return (
    <section className="py-24 bg-surface w-full flex-1">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary mb-6">
            Missed Consult Revenue Recovery
          </h1>
          <p className="text-xl text-on-surface-variant font-body max-w-2xl mx-auto">
            Premium concierge coverage for Cosmetic & Implant Dentistry, med spas, plastic surgery, and high-ticket cash-pay clinics in South Florida.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-surface-container-lowest p-8 rounded-lg ambient-shadow ghost-border flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-primary-container">
              <Headset className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-headline text-primary">
              After-Hours Revenue Capture
            </h3>
            <p className="text-on-surface-variant font-body">
              Give every high-intent implant, cosmetic, or aesthetic caller a polished English, Spanish, or French first touch before voicemail sends the appointment elsewhere.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-lg ambient-shadow ghost-border flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-headline text-primary">
              High-Ticket Consult Conversion
            </h3>
            <p className="text-on-surface-variant font-body">
              Capture implant, veneer, injectable, laser, GLP-1, and surgical consult intent with approved clinic language and appointment-focused next steps.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-lg ambient-shadow ghost-border flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <Hospital className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-headline text-primary">
              Front Desk Protection
            </h3>
            <p className="text-on-surface-variant font-body">
              Protect your front desk from phone overload so staff can stay focused on in-office patients while serious callers still receive a premium response.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-surface-container-lowest rounded-xl ambient-shadow ghost-border p-8 border-l-4 border-l-primary-container max-w-3xl mx-auto">
          <h3 className="text-xl font-bold font-headline text-primary mb-3">Built for Cash-Pay Decision Makers</h3>
          <p className="text-on-surface-variant font-body">
            CayesDesk is strongest when every inquiry carries revenue weight: implant dentistry, cosmetic dentistry, med spa treatment packages, elective surgery, weight loss, and other premium consult paths.
          </p>
        </div>
      </div>
    </section>
  );
}
