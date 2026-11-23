import styles from "./Services.module.css";

const SERVICES = [
  {
    title: "Pipeline audit",
    timing: "About a week · fixed fee",
    desc: "I trace where releases actually break: tests, migrations, deploys, health checks, secrets, and handoffs. You get a written order of operations the team can act on with or without me.",
    audits: [
      {
        title: "Find out why your app is slow",
        desc: "Pick one slow upload, report, or screen. I reproduce it in a test environment, measure where the time goes in the app and database, and give you written findings and what I’d fix first.",
      },
      {
        title: "Get a second set of eyes before you ship",
        desc: "Pick one workflow you rely on, including in apps built with AI. I check what happens when a request fails or runs twice, how secrets are handled, and what your tests miss. You get a ranked list of fixes and what to test before shipping again.",
      },
    ],
  },
  {
    title: "Pipeline install",
    timing: "A few weeks",
    desc: "I build the merge-to-production automation: migrations, health checks, automatic rollback, uptime monitoring, alerting, secrets handled through an API, and an agent workflow with review gates your team will actually follow.",
  },
  {
    title: "Run it",
    timing: "Monthly",
    desc: "I run the pipeline once it is in place: upgrades, monitoring, incident response, and the maintenance work that usually gets skipped until something breaks.",
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="container">
        <h2>The offer</h2>
        <p className="section-intro">
          Three ways to start on the same delivery system. Find out what breaks,
          get it built, or hand me the running of it.
        </p>
        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <article key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <span className={styles.timing}>{s.timing}</span>
              <p className={styles.desc}>{s.desc}</p>
              {s.audits && (
                <div className={styles.audits}>
                  {s.audits.map((audit) => (
                    <div key={audit.title}>
                      <h4>{audit.title}</h4>
                      <p className={styles.desc}>{audit.desc}</p>
                    </div>
                  ))}
                  <p className={styles.desc}>
                    I work with C#/.NET, Python, and TypeScript, including apps
                    backed by SQL Server or PostgreSQL.
                  </p>
                  <p className={styles.desc}>
                    Both end with a written report. No production changes.
                    Implementation is quoted separately.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
