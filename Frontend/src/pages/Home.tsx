/**
 * Home Page - Welcome screen matching Mint page styles
 */

export function Home() {
  return (
    <div className="min-h-full w-full flex flex-col items-center px-4 md:px-8 py-6">
      <div
        className="w-full flex flex-col gap-6"
        style={{ maxWidth: "1100px" }}
      >
        {/* Welcome Card */}
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #0C0C0C 0%, #181818 100%)",
            border: "3px solid transparent",
            backgroundClip: "padding-box",
          }}
        >
          {/* Gradient border effect */}
          <div
            className="absolute inset-0 rounded-3xl -z-10"
            style={{
              background:
                "linear-gradient(180deg, #F9B064 0%, rgba(147, 104, 59, 0.27) 100%)",
              padding: "3px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: "#F9B064",
                  boxShadow: "0 0 6px #F9B064",
                  left: `${15 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center py-12">
            {/* Title */}
            <h1
              style={{
                color: "#F9B064",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 700,
                marginBottom: "24px",
                textTransform: "uppercase",
                letterSpacing: "4px",
              }}
            >
              Welcome to $MZCAL
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: "rgba(255, 255, 255, 0.60)",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                fontWeight: 400,
                marginBottom: "32px",
              }}
            >
              The spirits await your arrival
            </p>

            {/* Connect prompt */}
            <p
              style={{
                color: "#F9B064",
                fontFamily: "Lato, sans-serif",
                fontStyle: "italic",
                fontSize: "18px",
              }}
            >
              Connect your wallet to begin your journey
            </p>
          </div>
        </div>
      </div>

      {/* Float animation keyframes */}
      <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
                    50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
                }
            `}</style>
    </div>
  );
}
