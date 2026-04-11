import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the hero heading", () => {
    render(<App />);
    expect(screen.getByText(/Build & Ship/)).toBeInTheDocument();
  });

  it("renders the portfolio section", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();
  });

  it("renders the services section", () => {
    render(<App />);
    expect(screen.getByText("Agentic AI Systems")).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<App />);
    expect(screen.getByText(/info@milesautomation\.com/)).toBeInTheDocument();
  });
});
