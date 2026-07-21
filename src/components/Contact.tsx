import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <h2>Request a pilot</h2>
        <div className={styles.content}>
          <p>
            Email five representative documents and the columns you need.
            We&apos;ll confirm whether the batch fits the pilot before you pay
            or send the remaining files.
          </p>
          <div className={styles.actions}>
            <a
              href="mailto:info@milesautomation.com?subject=Five-document%20preflight"
              className={styles.mailto}
            >
              Send 5 samples &rarr;
            </a>
          </div>
          <p className={styles.caution}>
            Please redact sensitive information from the samples where possible.
            Do not email regulated data before we agree on a handling plan.
          </p>
          <p className={styles.email}>info@milesautomation.com</p>
        </div>
      </div>
    </section>
  );
}
