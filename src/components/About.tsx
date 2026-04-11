import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <h2>About</h2>
        <p className={styles.intro}>
          Miles Automation is a one-person product studio and consultancy. We
          build AI-driven software products from scratch and operate them in
          production — not as demos, but as real services with real users.
        </p>
        <p className={styles.intro}>
          Our stack is opinionated: React, FastAPI, Postgres, Docker, Caddy. We
          deploy to our own infrastructure, monitor uptime, ship migrations, and
          iterate fast. Every project in the portfolio is live, running, and
          maintained.
        </p>
        <p className={styles.intro}>
          If you need a team of 20 and a 6-month roadmap, we&apos;re probably
          not the right fit. If you need someone who can take an idea from
          napkin sketch to production URL in weeks, let&apos;s talk.
        </p>
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
