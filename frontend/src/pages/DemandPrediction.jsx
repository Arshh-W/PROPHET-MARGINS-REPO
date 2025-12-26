import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mode1Form from '../components/Mode1Form';
import Mode2Form from '../components/Mode2Form';
import Mode3Form from '../components/Mode3Form';
import './DemandPrediction.css';

const DemandPrediction = () => {
  const [activeMode, setActiveMode] = useState(1);

  const modes = [
    {
      id: 1,
      title: 'Dataset + Category',
      description: 'Upload a dataset and analyze demand for a specific product category',
      component: Mode1Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: '#8B7355',
    },
    {
      id: 2,
      title: 'Direct Prediction',
      description: 'Predict demand directly from past 7 days data',
      component: Mode2Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: '#6B5D4F',
    },
    {
      id: 3,
      title: 'Overall Analysis',
      description: 'Analyze all categories in your dataset',
      component: Mode3Form,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: '#A0826D',
    },
  ];

  const ActiveComponent = modes.find(m => m.id === activeMode)?.component;

  useEffect(() => {
    // Intersection Observer for animations
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

    const elements = document.querySelectorAll('.fade-in, .slide-up');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeMode]);

  return (
    <div className="demand-prediction-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="prediction-navbar">
        <Link to="/" className="nav-logo">
          <img src="/Logo-removebg-preview.png" alt="Prophet Margins" className="nav-logo-img" />
          <span>Prophet Margins</span>
        </Link>
        <Link to="/" className="nav-back-btn">
          ← Back to Home
        </Link>
      </nav>

      <div className="prediction-container">
        {/* Header Section */}
        <div className="prediction-header fade-in">
          <h1 className="prediction-title">
            Demand Prediction
          </h1>
          <div className="title-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-line"></div>
          </div>
          <p className="prediction-subtitle">
            Sophisticated analytics and forecasting for discerning businesses
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="modes-container">
          <div className="modes-grid">
            {modes.map((mode, index) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`mode-card slide-up ${activeMode === mode.id ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mode-card-inner">
                  <div className="mode-icon-wrapper">
                    <div 
                      className={`mode-icon ${activeMode === mode.id ? 'active' : ''}`}
                      style={activeMode === mode.id ? { backgroundColor: mode.color } : {}}
                    >
                      {mode.icon}
                    </div>
                    {activeMode === mode.id && (
                      <div className="mode-check">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="mode-content">
                    <div className="mode-number">{mode.id}</div>
                    <h3 className="mode-title">{mode.title}</h3>
                    <p className="mode-description">{mode.description}</p>
                  </div>

                  <div 
                    className="mode-indicator"
                    style={{ backgroundColor: mode.color }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Form Container */}
        <div className="form-container slide-up">
          <div className="form-header">
            <div className="form-header-content">
              <div 
                className="form-icon-wrapper"
                style={{ backgroundColor: modes.find(m => m.id === activeMode)?.color }}
              >
                {modes.find(m => m.id === activeMode)?.icon}
              </div>
              <div className="form-header-text">
                <h2 className="form-title">
                  {modes.find(m => m.id === activeMode)?.title}
                </h2>
                <p className="form-description">
                  {modes.find(m => m.id === activeMode)?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="form-content">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-badge fade-in">
          <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p>Enterprise-grade security and confidentiality</p>
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;
