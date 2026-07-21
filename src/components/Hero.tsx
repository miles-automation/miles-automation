import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>Human-checked document extraction</p>
        <h1 className={styles.heading}>
          Difficult PDFs,
          <br />
          <span>into checked data.</span>
        </h1>
        <p className={styles.sub}>
          Send inconsistent PDFs with usable text layers. We return a checked
          spreadsheet, source-page references, and visible exceptions. If your
          samples are image-only scans, we quote the OCR or manual path
          separately after preflight.
        </p>
        <div className={styles.buttons}>
          <a href="#offer" className="btn btn-primary">
            See the pilot
          </a>
          <a href="#contact" className="btn btn-outline">
            Send 5 samples
          </a>
        </div>
        <ul className={styles.promises} aria-label="Service promises">
          <li>$149 pilot</li>
          <li>Up to 100 pages</li>
          <li>Human checked</li>
          <li>No subscription</li>
        </ul>
      </div>
    </section>
  );
}
