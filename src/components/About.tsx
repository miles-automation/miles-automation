import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <h2>How I work</h2>
        <p className={styles.intro}>
          I run Miles Automation on my own. About ten production services use
          this pipeline right now, including IEOMD, Human Index, Esher&apos;s
          Codex, Noodle, and Spark Swarm. This site uses it too.
        </p>
        <p className={styles.intro}>
          A merge builds the image, runs migrations, health-checks the service
          through the reverse proxy, and rolls back automatically if that check
          fails. Uptime probes alert a chat room. Secrets come from an API
          instead of hand-edited <code>.env</code> files.
        </p>
        <div className={styles.proofGrid}>
          <div>
            <h3>How changes get reviewed</h3>
            <p>
              Claude and Codex work against real repositories with separate
              machine identities, isolated git worktrees, and one PR per change.
              A human or second model reviews the work before merge.
            </p>
          </div>
          <div>
            <h3>How releases roll back</h3>
            <p>
              The deployment checks the service through the same reverse proxy
              your users hit. If that check fails, the release rolls back on its
              own and the previous version keeps serving.
            </p>
          </div>
        </div>
        <div className={styles.fitGrid}>
          <div>
            <h3>Good fit</h3>
            <p>
              Teams whose deploys are manual, scary, or slower than the code
              they are writing. Especially teams picking up coding agents
              without a safety net.
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
