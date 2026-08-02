import styles from "./Services.module.css";

const SERVICES = [
  {
    title: "Pipeline audit",
    timing: "About a week · fixed fee",
    desc: "We trace where releases actually break: tests, migrations, deploys, health checks, secrets, and handoffs. You get a written order of operations the team can act on with or without me.",
  },
  {
    title: "Pipeline install",
    timing: "A few weeks",
    desc: "I install merge-to-production automation, migrations, health checks, automatic rollback, uptime monitoring, alerting, API-managed secrets, and an agent workflow with review gates people will follow.",
  },
  {
    title: "Run it",
    timing: "Monthly",
    desc: "I operate the pipeline after it is in place: upgrades, monitoring, incident response, and the boring maintenance nobody staffs but every production service needs.",
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="container">
        <h2>The offer</h2>
        <p className="section-intro">
          One delivery system, three ways to start. I can find the failure
          points, install the safety net, or keep it running.
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
