import { useState } from "react";
import type { FormEvent } from "react";
import styles from "./Contact.module.css";

type FormStatus = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <h2>Talk through your pipeline</h2>
        <div className={styles.content}>
          <p>
            Tell me how shipping works today and where it hurts. If coding
            agents are in the mix, say so. I&apos;ll write back with which of
            the three makes sense for you, or tell you if none of them do.
          </p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/v1/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let detail = "";
      try {
        const data = (await response.json()) as { detail?: string };
        detail = data.detail ?? "";
      } catch {
        // A successful upstream response does not need a JSON body.
      }

      if (!response.ok) {
        throw new Error(
          detail || "Could not submit right now. Please try again.",
        );
      }

      setFormData(INITIAL_FORM);
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not submit right now. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            maxLength={200}
            autoComplete="name"
            required
          />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            maxLength={320}
            autoComplete="email"
            required
          />
        </label>
      </div>
      <label className={styles.field}>
        <span>Company or team</span>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={(event) => updateField("company", event.target.value)}
          maxLength={200}
          autoComplete="organization"
        />
      </label>
      <label className={styles.field}>
        <span>What does shipping look like today?</span>
        <textarea
          name="message"
          value={formData.message}
          onChange={(event) => updateField("message", event.target.value)}
          maxLength={5000}
          rows={5}
          required
        />
      </label>
      <label className={styles.honeypot} aria-hidden="true">
        <span>Website</span>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(event) => updateField("website", event.target.value)}
          maxLength={200}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send the details"}
      </button>
      <div className={styles.status} aria-live="polite" role="status">
        {status === "success" &&
          "Thanks. I read these myself and will get back to you."}
        {status === "error" && errorMessage}
      </div>
    </form>
  );
}
