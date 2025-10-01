import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConnectButton } from './ConnectButton'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-black border-b border-[#3a3a3a]">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-xs font-bold text-black">M</span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
            <Link
              to="/check-eligibility"
              className="text-white hover:text-[#d4af37] transition-colors text-sm"
            >
              Eligibility
            </Link>
            <Link
              to="/buy"
              className="text-[#d4af37] hover:text-[#f0d576] transition-colors text-sm"
            >
              Buy $MZCAL
            </Link>
            <Link
              to="/claim"
              className="text-white hover:text-[#d4af37] transition-colors text-sm"
            >
              Claim
            </Link>
            <Link
              to="/marketplace"
              className="text-white hover:text-[#d4af37] transition-colors text-sm"
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