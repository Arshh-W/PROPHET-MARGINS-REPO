import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>Prophet Margin: The Future of Inventory</h3>
          <p className={styles.mission}>
            Our mission is to democratise enterprise-level data analytics, allowing retailers of all sizes to minimise waste, maximise profit, and ensure product availability
          </p>
        </div>
        
        <div className={styles.techStack}>
          <p className={styles.techLabel}>Tech Stack:</p>
          <div className={styles.techIcons}>
            <span className={styles.techItem}>Flask</span>
            <span className={styles.techItem}>Pandas</span>
            <span className={styles.techItem}>Azure</span>
            <span className={styles.techItem}>Scikit-learn</span>
            <span className={styles.techItem}>Python</span>
            <span className={styles.techItem}>JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
