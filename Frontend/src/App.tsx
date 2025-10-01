import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { CheckEligibility } from './pages/CheckEligibility'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-eligibility" element={<CheckEligibility />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
