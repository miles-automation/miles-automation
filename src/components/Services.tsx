import styles from "./Services.module.css";

const SERVICES = [
  {
    title: "Agentic AI Systems",
    desc: "LLM orchestration, multi-step reasoning, and autonomous workflows. We design AI systems that do real work — not just chatbots.",
    example: "Spark Swarm fleet ops, automated uptime monitoring",
  },
  {
    title: "Full-Stack Product Development",
    desc: "React + FastAPI + Postgres apps shipped in Docker containers with CI/CD, health checks, and zero-downtime deploys.",
    example: "IEOMD, Human Index, Esher's Codex",
  },
  {
    title: "Developer Tooling & Extensions",
    desc: "VS Code extensions, CLI tools, and AI copilots that integrate into existing workflows without disruption.",
    example: "Code Loom VS Code extension",
  },
  {
    title: "Infrastructure & DevOps",
    desc: "Docker Compose fleets, Caddy reverse proxy, automated deployments, secrets management, and production monitoring.",
    example: "Platform infrastructure running 10+ services",
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="container">
        <h2>Services</h2>
        <p className="section-intro">
          We take projects from concept to production. Here&apos;s what we bring
          to the table.
        </p>
        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <div key={s.title} className={styles.card}>
              <h3>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <span className={styles.example}>e.g. {s.example}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
