import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <h2>How I work</h2>
        <p className={styles.intro}>
          I run Miles Automation as a one-person operation. The proof for this
          offer is the fleet itself: roughly ten production services &mdash;
          including IEOMD, Human Index, Esher&apos;s Codex, Noodle, Spark Swarm,
          and this site &mdash; operated by one person.
        </p>
        <p className={styles.intro}>
          The delivery path is concrete: a merge builds the image, runs
          migrations, health-checks through the reverse proxy, and rolls back
          automatically when the check fails. Uptime probes alert a chat room,
          and secrets come through an API rather than pasted <code>.env</code>
          files.
        </p>
        <div className={styles.proofGrid}>
          <div>
            <h3>Every change has a boundary</h3>
            <p>
              Claude and Codex work against real repositories with separate
              machine identities, isolated git worktrees, and one PR per change.
              A human or second model reviews the work before merge.
            </p>
          </div>
          <div>
            <h3>Every release has a way back</h3>
            <p>
              The deployment checks the service through the same reverse proxy
              users reach. If that check fails, the release rolls back instead
              of leaving a broken build in production.
            </p>
          </div>
        </div>
        <div className={styles.fitGrid}>
          <div>
            <h3>Good fit</h3>
            <p>
              Teams whose deploys are manual, scary, or slower than their code
              output &mdash; especially teams adopting coding agents without a
              safety net.
            </p>
          </div>
          <div>
            <h3>Not a fit</h3>
            <p>One-off marketing sites or staff augmentation by the hour.</p>
          </div>
        </div>
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
