import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>&copy; {new Date().getFullYear()} Miles Automation</p>
        <div className={styles.links}>
          <a
            href="https://richmiles.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            richmiles.xyz
          </a>
          <a
            href="https://github.com/miles-automation"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
