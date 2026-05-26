import { useEffect, useRef, useState } from "react";
import type { PilotPlanId } from "../lib/flow";

type PayPalApproveData = {
  orderID?: string;
  subscriptionID?: string;
};

type PayPalActions = {
  subscription: {
    create: (payload: Record<string, unknown>) => Promise<string>;
  };
};

type PayPalButtonsInstance = {
  close?: () => void;
  isEligible?: () => boolean;
  render: (container: HTMLElement | string) => Promise<void>;
};

type PayPalNamespace = {
  Buttons: (options: {
    createSubscription: (
      data: Record<string, unknown>,
      actions: PayPalActions,
    ) => Promise<string>;
    onApprove?: (data: PayPalApproveData) => void | Promise<void>;
    onCancel?: () => void;
    onError?: (error: unknown) => void;
    style?: Record<string, string | number | boolean>;
  }) => PayPalButtonsInstance;
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let paypalSdkPromise: Promise<PayPalNamespace> | null = null;
let paypalSdkSrc = "";

function loadPayPalSdk(clientId: string): Promise<PayPalNamespace> {
  const params = new URLSearchParams({
    "client-id": clientId,
    components: "buttons",
    currency: "USD",
    intent: "subscription",
    vault: "true",
  });
  const src = `https://www.paypal.com/sdk/js?${params.toString()}`;

  if (window.paypal && paypalSdkSrc === src) {
    return Promise.resolve(window.paypal);
  }

  if (paypalSdkPromise && paypalSdkSrc === src) {
    return paypalSdkPromise;
  }

  paypalSdkSrc = src;
  paypalSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-cayesdesk-paypal-sdk="subscription"]',
    );

    if (existingScript && existingScript.src === src) {
      existingScript.addEventListener("load", () => {
        if (window.paypal) {
          resolve(window.paypal);
        } else {
          reject(new Error("PayPal SDK loaded without the buttons namespace."));
        }
      });
      existingScript.addEventListener("error", () => {
        reject(new Error("Unable to load PayPal checkout."));
      });
      return;
    }

    existingScript?.remove();

    const script = document.createElement("script");
    script.async = true;
    script.dataset.cayesdeskPaypalSdk = "subscription";
    script.src = src;
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error("PayPal SDK loaded without the buttons namespace."));
      }
    };
    script.onerror = () => {
      reject(new Error("Unable to load PayPal checkout."));
    };
    document.head.appendChild(script);
  });

  return paypalSdkPromise;
}

export function PayPalSubscriptionButton({
  clientId,
  disabledMessage = "PayPal checkout is being configured for this plan.",
  onApprove,
  planId,
  planKey,
}: {
  clientId: string;
  disabledMessage?: string;
  onApprove?: (data: PayPalApproveData) => Promise<void> | void;
  planId: string;
  planKey: PilotPlanId;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !clientId || !planId) {
      return;
    }

    let active = true;
    container.innerHTML = "";
    setError("");
    setLoading(true);

    loadPayPalSdk(clientId)
      .then((paypal) => {
        if (!active || !containerRef.current) {
          return;
        }

        const buttons = paypal.Buttons({
          createSubscription: (_data, actions) =>
            actions.subscription.create({
              custom_id: `cayesdesk-${planKey}`,
              plan_id: planId,
            }),
          onApprove: async (data) => {
            if (onApprove) {
              await onApprove(data);
              return;
            }

            const query = new URLSearchParams({
              plan: planKey,
              subscription_id: data.subscriptionID || "",
            });
            window.location.assign(`/pilot/success?${query.toString()}`);
          },
          onCancel: () => {
            setError("Checkout was canceled before the subscription was approved.");
          },
          onError: (checkoutError) => {
            console.error("PayPal checkout error", checkoutError);
            setError("Unable to open PayPal checkout right now.");
          },
          style: {
            color: "black",
            height: 48,
            label: "subscribe",
            layout: "vertical",
            shape: "rect",
            tagline: false,
          },
        });

        if (buttons.isEligible && !buttons.isEligible()) {
          setError("PayPal checkout is not eligible for this browser session.");
          return;
        }

        buttonsRef.current = buttons;
        buttons.render(containerRef.current).catch((renderError) => {
          console.error("PayPal button render error", renderError);
          setError("Unable to render PayPal checkout right now.");
        });
      })
      .catch((sdkError) => {
        console.error("PayPal SDK load error", sdkError);
        if (active) {
          setError("Unable to load PayPal checkout right now.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      buttonsRef.current?.close?.();
      buttonsRef.current = null;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [clientId, onApprove, planId, planKey]);

  if (!clientId || !planId) {
    return (
      <div className="rounded-md border border-surface-variant bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface-variant">
        {disabledMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {loading && (
        <div className="rounded-md border border-surface-variant bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface-variant">
          Loading PayPal checkout...
        </div>
      )}
      <div ref={containerRef} />
      {error && (
        <p className="text-sm font-medium text-on-error-container">{error}</p>
      )}
    </div>
  );
}
