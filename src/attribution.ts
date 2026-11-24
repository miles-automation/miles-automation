const APPROVED_TAGS = {
  utm_source: ["google", "bing", "linkedin", "upwork", "direct", "newsletter"],
  utm_medium: ["cpc", "paid_social", "organic", "referral", "email"],
  utm_campaign: ["miles_launch", "app_performance", "pre_ship_review"],
} as const;

type Attribution = Partial<Record<keyof typeof APPROVED_TAGS, string>>;
type TrackingPayload = Record<string, unknown>;

declare global {
  interface Window {
    umami?: {
      track: (payload: (base: TrackingPayload) => TrackingPayload) => unknown;
    };
  }
}

export function readAttribution(search: string): Attribution {
  if (search.length > 4096) return {};
  const params = new URLSearchParams(search);
  const result: Attribution = {};
  for (const field of Object.keys(APPROVED_TAGS) as Array<
    keyof typeof APPROVED_TAGS
  >) {
    const values = params.getAll(field);
    const approved: readonly string[] = APPROVED_TAGS[field];
    if (values.length === 1 && approved.includes(values[0])) {
      result[field] = values[0];
    }
  }
  return result;
}

function track(placement?: "hero" | "nav"): void {
  const tags = readAttribution(window.location.search);
  const url = new URL("https://milesautomation.com/");
  for (const [key, value] of Object.entries(tags)) {
    url.searchParams.set(key, value);
  }
  try {
    window.umami?.track(
      ({ website, screen, language, title, hostname, tag }) => ({
        website,
        screen,
        language,
        title,
        hostname,
        tag,
        url: url.href,
        referrer: "",
        ...(placement
          ? { name: "inquiry_cta_clicked", data: { placement } }
          : {}),
      }),
    );
  } catch {
    // Analytics must not interfere with the contact link.
  }
}

export function trackPageview(): void {
  if (window.umami) {
    track();
  } else {
    document
      .getElementById("miles-analytics")
      ?.addEventListener("load", () => track(), { once: true });
  }
}

export function trackIntakeClick(placement: "hero" | "nav"): void {
  track(placement);
}
