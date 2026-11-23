import { render, screen, within } from "@testing-library/react";
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

  it("shows the two bounded reviews under Pipeline audit without replacing the other offers", () => {
    render(<App />);
    const offers = screen
      .getByRole("heading", { name: "The offer" })
      .closest("section")!;
    const auditHeading = within(offers).getByRole("heading", {
      name: "Pipeline audit",
    });
    const audit = within(auditHeading.closest("article")!);

    expect(
      audit.getByRole("heading", { name: "Find out why your app is slow" }),
    ).toBeInTheDocument();
    expect(audit.getByText(/measure where the time goes/)).toBeInTheDocument();
    expect(
      audit.getByText(/Pick one slow upload, report, or screen/),
    ).toBeInTheDocument();
    expect(
      audit.getByRole("heading", {
        name: "Get a second set of eyes before you ship",
      }),
    ).toBeInTheDocument();
    expect(
      audit.getByText(
        /Pick one workflow you rely on, including in apps built with AI/,
      ),
    ).toBeInTheDocument();
    expect(
      audit.getByText(
        /C#\/\.NET, Python, and TypeScript.*SQL Server or PostgreSQL/,
      ),
    ).toBeInTheDocument();
    expect(
      audit.getByText(
        /No production changes. Implementation is quoted separately./,
      ),
    ).toBeInTheDocument();

    expect(
      within(offers).getByRole("heading", { name: "Pipeline install" }),
    ).toBeInTheDocument();
    expect(
      within(offers).getByRole("heading", { name: "Run it" }),
    ).toBeInTheDocument();
  });

  it("renders the intake form", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Talk through your pipeline" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });
});
