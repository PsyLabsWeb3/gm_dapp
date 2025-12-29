import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { CheckEligibility } from './pages/CheckEligibility'
import { BuyMzcal } from './pages/BuyMzcal'
import { ClaimMZCAL } from './pages/ClaimMZCAL'
import { Marketplace } from './pages/Marketplace'
import { MyAssets } from './pages/MyAssets'
import { CreateListing } from './pages/CreateListing'
import { MyListings } from './pages/MyListings'
import { TradeHub } from './pages/TradeHub'
import { TradeDetail } from './pages/TradeDetail'
import { ActivityFeed } from './pages/ActivityFeed'
import backgroundImage from './assets/background.webp'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div
        className="min-h-screen flex flex-col relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
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
        <div className="flex-1 relative z-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check-eligibility" element={<CheckEligibility />} />
            <Route path="/buy" element={<BuyMzcal />} />
            <Route path="/claim" element={<ClaimMZCAL />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/my-assets" element={<MyAssets />} />
            <Route path="/marketplace/create-listing" element={<CreateListing />} />
            <Route path="/marketplace/my-listings" element={<MyListings />} />
            <Route path="/marketplace/trade" element={<TradeHub />} />
            <Route path="/marketplace/trade/:id" element={<TradeDetail />} />
            <Route path="/marketplace/activity" element={<ActivityFeed />} />
          </Routes>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          containerStyle={{
            top: '95px',
          }}
          toastOptions={{
            duration: 5000,
            style: {
              background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
              color: '#F9B064',
              border: '2px solid #F9B064',
              borderRadius: '16px',
              padding: '16px 24px',
              fontFamily: "'Lato', sans-serif",
              fontSize: '16px',
              fontStyle: 'italic',
              boxShadow: '0 8px 32px rgba(249, 176, 100, 0.3)',
              maxWidth: '600px',
            },
            error: {
              duration: 6000,
              iconTheme: {
                primary: '#F9B064',
                secondary: '#0C0C0C',
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
