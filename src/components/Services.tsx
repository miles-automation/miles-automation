import styles from "./Services.module.css";

const INCLUDED = [
  "Up to 100 total pages across the accepted batch",
  "Up to 8 requested fields and 3 recurring document layouts",
  "Source-page references and a visible exception report",
  "Excel or CSV delivery with one correction pass",
];

const GOOD_FIT = [
  "Inconsistent layouts, low-quality but usable text layers, or exports",
  "A stable set of fields you need across the batch",
  "Work where traceability matters more than a black-box answer",
];

const NOT_A_FIT = [
  "Clean, uniform invoices a self-serve extractor already handles",
  "Image-only scans without an agreed OCR or manual path",
  "Unreadable handwriting or open-ended table reconstruction",
  "Sensitive or regulated data without an approved handling plan",
];

export default function Services() {
  return (
    <section id="offer">
      <div className="container">
        <p className={styles.kicker}>One bounded pilot</p>
        <h2>Use us for the documents the easy tools miss</h2>
        <p className="section-intro">
          The pilot begins only after we inspect five representative documents
          and confirm the batch can be delivered safely at the published price.
        </p>
        <div className={styles.offerLayout}>
          <article className={styles.card}>
            <div className={styles.cardTopline}>
              <span className={styles.badge}>Hard-case document batch</span>
              <span className={styles.turnaround}>
                2 business days after acceptance
              </span>
            </div>
            <h3>Messy documents &rarr; checked spreadsheet</h3>
            <p className={styles.price}>$149 pilot</p>
            <p className={styles.desc}>
              Send inconsistent PDFs or exports that defeated the usual
              copy-and-paste workflow. Get your requested columns back with
              ambiguous values flagged instead of guessed.
            </p>
            <ul className={styles.bullets}>
              {INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.note}>
              Start with five representative documents. We confirm usable text,
              layout count, field feasibility, and security fit before asking
              you to commit. Image-only scans need a separately agreed OCR or
              manual path; difficult handwriting, complex tables, and
              out-of-scope material may be declined or separately quoted.
            </p>
            <a
              className={styles.cta}
              href="mailto:info@milesautomation.com?subject=Five-document%20preflight"
            >
              Send 5 samples for preflight &rarr;
            </a>
          </article>

          <aside className={styles.fitCard} aria-label="Pilot fit guide">
            <div>
              <p className={styles.fitLabel}>Good fit</p>
              <ul className={styles.fitList}>
                {GOOD_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`${styles.fitLabel} ${styles.notFit}`}>Not a fit</p>
              <ul className={styles.fitList}>
                {NOT_A_FIT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
