 // src/components/LandingPage.jsx

import React from "react";
import "./landingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <img className = "logo-nav" src="Logo-removebg-preview.png" alt="Prophet Margins logo" />
          <span>Prophet Margins</span>
        </div>

        <div className="nav-actions">
          <a href="#about">About Us</a>
          <button className="primary-btn">Book Services</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Prophet Margins</h1>
          <p>Stop Guessing.Start Predicting. Maximise Your Margin!</p>
          <button className="primary-btn two">Book services</button>
        </div>

        <div className="hero-image">
          <img
            src="logo.png"
            alt="Justice illustration"
          />
        </div>
      </section>
    </div>
  );
}
