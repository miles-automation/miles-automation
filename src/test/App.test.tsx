import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the hero heading", () => {
    render(<App />);
    expect(screen.getByText(/Difficult PDFs/)).toBeInTheDocument();
  });

  it("does not render an uncurated portfolio", () => {
    render(<App />);
    expect(
      screen.queryByText(/Systems behind the service/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Bullshit or Fit/)).not.toBeInTheDocument();
  });

  it("renders the bounded document pilot", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: "Messy documents → checked spreadsheet",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("$149 pilot")).toHaveLength(2);
    expect(screen.getByText(/Up to 100 total pages/)).toBeInTheDocument();
    expect(screen.queryByText(/lead list/i)).not.toBeInTheDocument();
    expect(screen.getByText(/image-only scans need/i)).toBeInTheDocument();
  });

  it("requires a preflight before payment", () => {
    render(<App />);
    expect(screen.getByText(/before payment/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Send 5 samples for preflight/i }),
    ).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<App />);
    expect(screen.getByText(/info@milesautomation\.com/)).toBeInTheDocument();
  });
});
