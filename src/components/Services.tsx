import styles from "./Services.module.css";

const SERVICES = [
  {
    title: "Pipeline audit",
    timing: "About a week · fixed fee",
    desc: "I trace where releases actually break: tests, migrations, deploys, health checks, secrets, and handoffs. You get a written order of operations the team can act on with or without me.",
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
            <div key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <span className={styles.timing}>{s.timing}</span>
              <p className={styles.desc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
