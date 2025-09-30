import { Navbar } from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <main className="w-full px-8 py-12">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white mb-6">
            Welcome to $MZCAL
          </h2>
          <p className="text-gray-400 ">
            Connect your wallet to get started
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
