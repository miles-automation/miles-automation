import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <h2>Start a Project</h2>
        <div className={styles.content}>
          <p>
            Have an idea that needs building? A system that needs AI wired in?
            An existing product that needs to ship faster? Reach out and
            let&apos;s figure out if we&apos;re a good fit.
          </p>
          <a href="mailto:info@milesautomation.com" className={styles.mailto}>
            info@milesautomation.com &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
