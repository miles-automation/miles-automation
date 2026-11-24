import { fireEvent, render, screen } from "@testing-library/react";
import { readAttribution, trackPageview } from "../attribution";
import Hero from "../components/Hero";

afterEach(() => {
  window.history.replaceState({}, "", "/");
  vi.unstubAllGlobals();
});

it("drops duplicate, unlisted, and oversized campaign data", () => {
  expect(
    readAttribution(
      "?utm_source=upwork&utm_medium=organic&utm_medium=organic&utm_campaign=private%40example.com&fbclid=secret",
    ),
  ).toEqual({ utm_source: "upwork" });
  expect(
    readAttribution("?utm_source=upwork&utm_campaign=" + "x".repeat(4096)),
  ).toEqual({});
});

it("tracks a sanitized pageview and CTA without interrupting navigation", () => {
  vi.stubGlobal("umami", {
    track: vi.fn((build: (base: Record<string, unknown>) => unknown) =>
      send(
        build({
          website: "website-id",
          url: "https://milesautomation.com/?email=private@example.com",
          referrer: "https://referrer.test/?email=private@example.com",
          data: { untrusted: "secret" },
        }),
      ),
    ),
  });
  const send = vi.fn();
  window.history.replaceState(
    {},
    "",
    "/?utm_source=linkedin&utm_medium=paid_social&utm_campaign=pre_ship_review&gclid=secret",
  );
  const expected = {
    website: "website-id",
    url: "https://milesautomation.com/?utm_source=linkedin&utm_medium=paid_social&utm_campaign=pre_ship_review",
    referrer: "",
  };
  trackPageview();
  expect(send).toHaveBeenNthCalledWith(1, expect.objectContaining(expected));
  expect(send.mock.calls[0][0]).not.toHaveProperty("data");
  render(<Hero />);
  const link = screen.getByRole("link", { name: "Talk through your pipeline" });
  expect(link).toHaveAttribute("href", "#contact");
  expect(fireEvent.click(link)).toBe(true);
  expect(send).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      ...expected,
      name: "inquiry_cta_clicked",
      data: { placement: "hero" },
    }),
  );
});
