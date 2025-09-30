import { ConnectButton } from './ConnectButton'

export function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              $MZCAL
            </h1>
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