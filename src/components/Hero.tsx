import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={`container ${styles.content}`}>
        <h1 className={styles.heading}>
          Ship AI-written code <span className={styles.accent}>safely.</span>
        </h1>
        <p className={styles.sub}>
          I install the delivery pipeline that builds, tests, deploys, monitors,
          and rolls back automatically. I run one myself for about ten
          production services.
        </p>
        <div className={styles.buttons}>
          <a href="#contact" className="btn btn-primary">
            Talk through your pipeline
          </a>
          <a href="#about" className="btn btn-outline">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
