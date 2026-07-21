import styles from "./Process.module.css";

const STEPS = [
  {
    number: "01",
    title: "Send five samples",
    desc: "Share representative documents plus the columns you need—not the full batch yet.",
  },
  {
    number: "02",
    title: "We preflight the batch",
    desc: "We confirm legibility, layouts, fields, security fit, price, and deadline before payment.",
  },
  {
    number: "03",
    title: "Automation runs; a human checks",
    desc: "The repeatable work is automated. Ambiguities and exceptions are reviewed, not hidden.",
  },
  {
    number: "04",
    title: "Receive the checked data",
    desc: "Your spreadsheet arrives with page references, visible exceptions, and a correction window.",
  },
];

export default function Process() {
  return (
    <section id="process" className={styles.section}>
      <div className="container">
        <p className={styles.kicker}>How it works</p>
        <h2>Automation with an accountable finish line</h2>
        <div className={styles.grid}>
          {STEPS.map((step) => (
            <article key={step.number} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
