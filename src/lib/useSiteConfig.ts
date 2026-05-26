import { useEffect, useState } from "react";
import type { PayPalPlanIds } from "./flow";

type SiteConfig = {
  demoBookingUrl: string;
  paypal: {
    clientId: string;
    environment: "sandbox" | "live";
    planIds: PayPalPlanIds;
  };
};

const emptyConfig: SiteConfig = {
  demoBookingUrl: "",
  paypal: {
    clientId: "",
    environment: "sandbox",
    planIds: {
      boutique: "",
      premier: "",
      concierge: "",
    },
  },
};

export function useSiteConfig(): {
  config: SiteConfig;
  loading: boolean;
} {
  const [config, setConfig] = useState<SiteConfig>(emptyConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/site-config", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => (response.ok ? response.json() : emptyConfig))
      .then((data: Partial<SiteConfig>) => {
        if (!active) {
          return;
        }

        setConfig({
          demoBookingUrl:
            typeof data.demoBookingUrl === "string" ? data.demoBookingUrl : "",
          paypal: {
            clientId:
              typeof data.paypal?.clientId === "string" ? data.paypal.clientId : "",
            environment: data.paypal?.environment === "live" ? "live" : "sandbox",
            planIds: {
              boutique:
                typeof data.paypal?.planIds?.boutique === "string"
                  ? data.paypal.planIds.boutique
                  : "",
              premier:
                typeof data.paypal?.planIds?.premier === "string"
                  ? data.paypal.planIds.premier
                  : "",
              concierge:
                typeof data.paypal?.planIds?.concierge === "string"
                  ? data.paypal.planIds.concierge
                  : "",
            },
          },
        });
      })
      .catch(() => {
        if (active) {
          setConfig(emptyConfig);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
}
