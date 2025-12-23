import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: '#F5F1E6',
      minHeight: '100vh',
      color: '#3D2F28'
    }}>
      <h1 style={{ color: '#3D2F28', marginBottom: '2rem' }}>Welcome to Retail Analytics</h1>
      
      <Link 
        to="/demand-prediction" 
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3D2F28',
          color: '#F5F1E6',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        sample landing page
      </Link>
    </div>
  )
}

export default Landing
