import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { CheckEligibility } from './pages/CheckEligibility'
import backgroundImage from './assets/background.webp'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div
        className="h-screen flex flex-col overflow-hidden relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Left gradient */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #000000 0%, rgba(0,0,0,0.8) 50%, transparent 100%)'
          }}
        ></div>

        {/* Right gradient */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #000000 0%, rgba(0,0,0,0.8) 50%, transparent 100%)'
          }}
        ></div>

        <Navbar />
        <div className="flex-1 overflow-hidden relative z-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check-eligibility" element={<CheckEligibility />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
