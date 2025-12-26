import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DemandPrediction from './pages/DemandPrediction'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demand-prediction" element={<DemandPrediction />} />
      </Routes>
    </Router>
  )
}

export default App



