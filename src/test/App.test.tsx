import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the hero heading", () => {
    render(<App />);
    expect(screen.getByText(/Ship AI-written code/)).toBeInTheDocument();
  });

  it("renders the portfolio section", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Portfolio" }),
    ).toBeInTheDocument();
  });

  it("renders the offer section", () => {
    render(<App />);
    expect(screen.getByText("Pipeline audit")).toBeInTheDocument();
  });

  it("renders the intake form", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Talk through your pipeline" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });
});
