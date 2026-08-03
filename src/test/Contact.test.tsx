import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Contact from "../components/Contact";

describe("Contact lead form", () => {
  it("submits the labeled fields and shows success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      json: () => Promise.resolve({ status: "accepted" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Company or team" }), {
      target: { value: "Analytical Engines" },
    });
    fireEvent.change(
      screen.getByRole("textbox", {
        name: "What does shipping look like today?",
      }),
      { target: { value: "We merge manually and deploy from a laptop." } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Send the details" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Thanks. I read these myself and will get back to you.",
      );
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/lead",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@example.com",
          company: "Analytical Engines",
          message: "We merge manually and deploy from a laptop.",
          website: "",
        }),
      }),
    );
  });

  it("shows an upstream error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ detail: "Please try again later." }),
      }),
    );

    render(<Contact />);
    fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(
      screen.getByRole("textbox", {
        name: "What does shipping look like today?",
      }),
      { target: { value: "We need a safer release path." } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Send the details" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Please try again later.",
      );
    });
  });
});
