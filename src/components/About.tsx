import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <h2>Built from the work backward</h2>
        <p className={styles.intro}>
          Miles Automation turns difficult document-conversion jobs into a
          dependable, productized service. We begin with the actual batch,
          fulfill it end to end, and automate the slowest steps as evidence
          accumulates.
        </p>
        <p className={styles.intro}>
          The result is deliberately less magical than most AI pitches: fixed
          scope, visible exceptions, source-linked outputs, and a human who is
          accountable for the final spreadsheet.
        </p>
        <p className={styles.intro}>
          When a pilot repeats, the automation becomes standing infrastructure.
          Until then, you are buying the completed job—not a platform rollout or
          another monthly software seat.
        </p>
        <div className={styles.links}>
          <a
            href="https://richmiles.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            richmiles.xyz &rarr;
          </a>
          <a
            href="https://github.com/miles-automation"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
