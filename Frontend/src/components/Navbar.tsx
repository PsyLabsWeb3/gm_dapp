import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from './ConnectButton'
import iconLogo from '../assets/icon.webp'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-black" style={{ borderBottom: '1px solid #E8B467' }}>
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50">
            <img
              src={iconLogo}
              alt="MZCAL Logo"
              className="w-10 h-10 hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
            <Link
              to="/check-eligibility"
              className="hover:text-[#F9B064] transition-colors font-normal"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal',
                color: location.pathname === '/check-eligibility' ? '#F9B064' : '#FFFFFF'
              }}
            >
              Eligibility
            </Link>
            <Link
              to="/buy"
              className="hover:text-[#F9B064] transition-colors font-normal"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal',
                color: location.pathname === '/buy' ? '#F9B064' : '#FFFFFF'
              }}
            >
              Buy $MZCAL
            </Link>
            <Link
              to="/claim"
              className="hover:text-[#F9B064] transition-colors font-normal"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: 'normal',
                color: location.pathname === '/claim' ? '#F9B064' : '#FFFFFF'
              }}
            >
              Claim
            </Link>
            <Link
              to="/marketplace"
              className="hover:text-[#F9B064] transition-colors font-normal"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '900',
                lineHeight: 'normal',
                color: location.pathname === '/marketplace' ? '#F9B064' : '#FFFFFF'
              }}
            >
              Marketplace
            </Link>
          </div>

          {/* Right side - Hamburger + Connect Button */}
          <div className="flex items-center gap-4 z-50">
            {/* Connect Button */}
            <div className="flex items-center">
              <ConnectButton />
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-[#d4af37] hover:text-[#f0d576] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-16 left-0 right-0 bg-black border-b border-[#3a3a3a] shadow-lg z-40">
            <div className="flex flex-col px-4 py-4 space-y-4">
              <Link
                to="/check-eligibility"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#d4af37] transition-colors text-sm py-2 border-b border-[#3a3a3a]/50"
              >
                Eligibility
              </Link>
              <Link
                to="/buy"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#d4af37] hover:text-[#f0d576] transition-colors text-sm py-2 border-b border-[#3a3a3a]/50"
              >
                Buy $MZCAL
              </Link>
              <Link
                to="/claim"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#d4af37] transition-colors text-sm py-2 border-b border-[#3a3a3a]/50"
              >
                Claim
              </Link>
              <Link
                to="/marketplace"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-[#d4af37] transition-colors text-sm py-2"
              >
                Marketplace
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}