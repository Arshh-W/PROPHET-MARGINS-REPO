import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './landingPage.css'

export default function LandingPage() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
    elements.forEach(el => observer.observe(el));

    // Animate stats
    const animateStats = () => {
      const stats = document.querySelectorAll('.stat-number');
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateStat = () => {
          current += increment;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateStat);
          } else {
            stat.textContent = target;
          }
        };
        
        const statObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !stat.classList.contains('animated')) {
              stat.classList.add('animated');
              updateStat();
            }
          });
        }, { threshold: 0.5 });
        
        statObserver.observe(stat.parentElement);
      });
    };

    animateStats();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <img className="logo-nav" src="/Logo-removebg-preview.png" alt="Prophet Margins logo" />
          <span>Prophet Margins</span>
        </div>

        <div className="nav-actions">
          <a href="#about" className="nav-link">About Us</a>
          <Link to="/demand-prediction" className="primary-btn">Book Services</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              <span className="title-line">Prophet Margins</span>
            </h1>
            <p className="hero-subtitle slide-up">
              Stop Guessing. Start Predicting. Maximise Your Margin.
            </p>
            <div className="hero-actions slide-up">
              <Link to="/demand-prediction" className="primary-btn hero-btn pulse-on-hover">
                Book Services
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>

          <div className="hero-image scale-in">
            <div className="image-wrapper">
              <img
                src="/logo.png"
                alt="Prophet Margins illustration"
                className="hero-img"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* THE RETAILER'S DILEMMA SECTION */}
      <section className="dilemma-section" id="about">
        <div className="dilemma-content fade-in">
          <h2 className="section-title">The Retailer's Dilemma: The Cost of Guessing</h2>
          <p className="section-description">
            Retailers constantly face the "Goldilocks Problem": they either stock too much inventory, 
            leading to costly storage and wastage, or stock too little, resulting in losing potential sales. 
            In today's rapidly growing and volatile market, simple spreadsheets aren't adequate. We solve it efficiently by:
          </p>
          
          <div className="dilemma-features">
            <div className="dilemma-feature slide-up">
              <div className="dilemma-icon-wrapper">
                <div className="dilemma-icon">♻️</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Waste Reduction</h3>
              <p>Minimize inventory waste and reduce storage costs through accurate demand forecasting</p>
            </div>
            
            <div className="dilemma-feature slide-up">
              <div className="dilemma-icon-wrapper">
                <div className="dilemma-icon">💰</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Profit Maximisation</h3>
              <p>Optimize inventory levels to maximize revenue and reduce opportunity costs</p>
            </div>
            
            <div className="dilemma-feature slide-up">
              <div className="dilemma-icon-wrapper">
                <div className="dilemma-icon">😊</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Customer Retention</h3>
              <p>Ensure product availability to keep customers satisfied and coming back</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP PATH SECTION */}
      <section className="steps-section">
        <div className="steps-content">
          <h2 className="section-title fade-in">Prophet Margin: Your 3-Step Path to Prediction</h2>
          
          <div className="steps-grid">
            <div className="step-card slide-up">
              <div className="step-icon-wrapper">
                <div className="step-icon">💾</div>
                <div className="step-number">1</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Data Ingestion</h3>
              <p>We securely connect your historical sales data and other relevant market factors to our forecasting engine.</p>
            </div>
            
            <div className="step-card slide-up">
              <div className="step-icon-wrapper">
                <div className="step-icon">🧠</div>
                <div className="step-number">2</div>
                <div className="icon-glow"></div>
              </div>
              <h3>AI Prediction</h3>
              <p>Our custom Machine Learning model analyses demand and forecasts expected sales volumes for the upcoming weeks with high accuracy, to keep you ahead.</p>
            </div>
            
            <div className="step-card slide-up">
              <div className="step-icon-wrapper">
                <div className="step-icon">📊</div>
                <div className="step-number">3</div>
                <div className="icon-glow"></div>
              </div>
              <h3>Actionable Insights</h3>
              <p>View dynamic, easy-to-understand dashboards to translate forecasts into inventory orders, preventing overstock and minimising losses.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
