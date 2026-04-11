import { useEffect, useState } from "react";
import styles from "./Portfolio.module.css";

interface Spark {
  name: string;
  slug: string;
  description: string | null;
  domain: string | null;
  stage: string;
  health: string;
}

const STAGE_LABEL: Record<string, string> = {
  live: "Live",
  building: "Building",
  coasting: "Coasting",
};

const HEALTH_DOT: Record<string, string> = {
  healthy: styles.healthy,
  degraded: styles.degraded,
  down: styles.down,
};

const EXCLUDED_SLUGS = new Set(["miles-automation"]);

export default function Portfolio() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [source, setSource] = useState<"live" | "fallback">("fallback");

  useEffect(() => {
    fetch("/api/v1/sparks")
      .then((r) => r.json())
      .then((data) => {
        setSparks(data.sparks ?? []);
        setSource(data.source ?? "fallback");
      })
      .catch(() => {});
  }, []);

  const visible = sparks.filter(
    (s) =>
      !EXCLUDED_SLUGS.has(s.slug) &&
      (s.stage === "live" || s.stage === "building"),
  );

  return (
    <section id="portfolio">
      <div className="container">
        <h2>Portfolio</h2>
        <p className="section-intro">
          Real products we&apos;ve built and operate &mdash; not mockups.
          {source === "live" && (
            <span className={styles.liveBadge}> Live data</span>
          )}
        </p>
        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((spark) => (
              <div key={spark.slug} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{spark.name}</h3>
                  <div className={styles.meta}>
                    {spark.health && spark.health !== "unknown" && (
                      <span
                        className={`${styles.dot} ${HEALTH_DOT[spark.health] ?? ""}`}
                      />
                    )}
                    <span className={styles.stage}>
                      {STAGE_LABEL[spark.stage] ?? spark.stage}
                    </span>
                  </div>
                </div>
                {spark.description && (
                  <p className={styles.desc}>{spark.description}</p>
                )}
                {spark.domain && (
                  <a
                    href={`https://${spark.domain}`}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {spark.domain} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.desc}>Loading portfolio&hellip;</p>
        )}
      </div>
    </section>
  );
}
