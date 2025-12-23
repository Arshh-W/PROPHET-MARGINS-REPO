import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Left Section */}
        <div className={styles.brand}>
          <h3 className={styles.logo}>Namedly</h3>
          <p className={styles.tagline}>
            Descriptive line about what your company does.
          </p>

          <div className={styles.socials}>
            <span>📷</span>
            <span>in</span>
            <span>𝕏</span>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.linksWrapper}>

          <div className={styles.column}>
            <h4>Features</h4>
            <a href="#">Core features</a>
            <a href="#">Pro experience</a>
            <a href="#">Integrations</a>
          </div>

          <div className={styles.column}>
            <h4>Learn more</h4>
            <a href="#">Blog</a>
            <a href="#">Case studies</a>
            <a href="#">Customer stories</a>
            <a href="#">Best practices</a>
          </div>

          <div className={styles.column}>
            <h4>Support</h4>
            <a href="#">Contact</a>
            <a href="#">Support</a>
            <a href="#">Legal</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
