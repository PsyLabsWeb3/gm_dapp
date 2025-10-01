export function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-8 py-12">
      <div className="max-w-xl w-full bg-black border-2 border-[#d4af37] rounded-3xl p-12">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-6 text-center tracking-wider">
          Welcome to $MZCAL
        </h2>
        <p className="text-[#d4af37]/70 text-center">
          Connect your wallet to get started
        </p>
      </div>
    </div>
  )
}