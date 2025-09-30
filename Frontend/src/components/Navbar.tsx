import { Link } from 'react-router-dom'
import { ConnectButton } from './ConnectButton'

export function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
              $MZCAL
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/check-eligibility"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Check Eligibility
              </Link>
            </div>
          </div>

          {/* Connect Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  )
}