export function Home() {
  return (
    <div className="h-full w-full flex items-center justify-center px-8 py-12 relative">
      <div
        className="max-w-3xl w-full rounded-3xl p-20 relative z-30"
        style={{
          background: 'linear-gradient(180deg, #0C0C0C 0%, #181818 100%)',
          border: '3px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative'
        }}
      >
        {/* Gradient border effect */}
        <div
          className="absolute inset-0 rounded-3xl -z-10"
          style={{
            background: 'linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)',
            padding: '3px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        ></div>

        <h2 className="text-3xl font-bold mb-12 text-center tracking-wider" style={{ color: '#F9B064' }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}>Welcome to $MZCAL</span>
        </h2>
        <p className="text-center" style={{
          color: 'rgba(255, 255, 255, 0.60)',
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '18px',
          fontWeight: 400
        }}>
          Connect your wallet to get started
        </p>
      </div>
    </div>
  )
}