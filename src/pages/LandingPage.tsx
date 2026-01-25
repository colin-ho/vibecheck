import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export function LandingPage() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  
  const springConfig = { damping: 30, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Use fewer colors - sunset theme
  const primaryColor = "rgba(221, 80, 19, 0.6)"; // sunset-accent
  const secondaryColor = "rgba(189, 183, 252, 0.6)"; // lavender
  
  // Create motion templates for reactive gradients
  const outerGlowGradient = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, ${primaryColor} 0%, ${secondaryColor} 50%, transparent 100%)`;
  const mainOrbGradient = useMotionTemplate`radial-gradient(ellipse ${x}% ${y}% at center, ${primaryColor} 0%, ${secondaryColor} 60%, transparent 100%)`;
  const innerCoreGradient = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, ${secondaryColor} 0%, ${primaryColor} 50%, transparent 100%)`;
  
  // Reuse the same 2 colors for orbiting particles
  const particleColors = [primaryColor, secondaryColor, primaryColor, secondaryColor, primaryColor, secondaryColor];
  
  const installCommand =
    "curl -fsSL https://raw.githubusercontent.com/colin-ho/vibecheck/main/plugin/install.sh | bash";

  const samples = [
    { path: "/sample_1", label: "Vibe Coder", icon: "🎲" },
    { path: "/sample_2", label: "3AM Demon", icon: "👹" },
    { path: "/sample_3", label: "Polite Menace", icon: "🎭" },
    { path: "/sample_4", label: "Essay Writer", icon: "📚" },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="min-h-screen text-[#3b110c] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFCBA4 50%, #FFB08A 100%)'
      }}
    >
      <div className="min-h-screen flex">
        {/* Left 2/3 - Dynamic Orb Animation */}
        <div 
          ref={containerRef}
          className="w-2/3 flex items-center justify-center p-8 relative overflow-hidden"
        >
          {/* Dynamic Morphing Orb */}
          <motion.div
            className="relative"
            style={{
              width: 400,
              height: 400,
            }}
          >
            {/* Outer glow layer */}
            <motion.div
              className="absolute inset-0 rounded-full blur-[100px]"
              style={{
                background: outerGlowGradient,
              }}
              animate={{
                scale: [1, 1.4, 0.9, 1.3, 1],
                opacity: [0.6, 0.85, 0.5, 0.75, 0.6],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Main morphing orb */}
            <motion.div
              className="absolute inset-0 blur-2xl"
              style={{
                background: mainOrbGradient,
                borderRadius: useTransform(x, [0, 100], ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%"]),
                x: useTransform(x, [0, 100], [-30, 30]),
                y: useTransform(y, [0, 100], [-30, 30]),
              }}
              animate={{
                scale: [1, 1.3, 0.95, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: [
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "70% 30% 30% 70% / 70% 70% 30% 30%",
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                  "30% 70% 70% 30% / 30% 30% 70% 70%",
                  "60% 40% 40% 60% / 60% 60% 40% 40%",
                ],
              }}
              transition={{
                scale: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
                borderRadius: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
            
            {/* Inner core */}
            <motion.div
              className="absolute inset-[25%] rounded-full blur-3xl"
              style={{
                background: innerCoreGradient,
                x: useTransform(x, [0, 100], [-25, 25]),
                y: useTransform(y, [0, 100], [-25, 25]),
              }}
              animate={{
                scale: [1, 1.4, 0.85, 1.25, 1],
                opacity: [0.8, 0.95, 0.65, 0.9, 0.8],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Orbiting particles */}
            {[...Array(6)].map((_, i) => {
              const initialAngle = (i * 360) / 6; // Distribute evenly around circle
              const baseOrbitRadius = 140; // Smaller base radius
              const particleSize = 80 + i * 5; // Much bigger, closer to main orb
              const orbitDuration = 6 + i * 0.8; // Faster movement
              
              // Calculate orbit positions with varying radius for more movement
              const orbitX = (angle: number, radiusOffset: number = 0) => 
                Math.cos((angle * Math.PI) / 180) * (baseOrbitRadius + radiusOffset);
              const orbitY = (angle: number, radiusOffset: number = 0) => 
                Math.sin((angle * Math.PI) / 180) * (baseOrbitRadius + radiusOffset);
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-2xl"
                  style={{
                    width: particleSize,
                    height: particleSize,
                    background: particleColors[i],
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [
                      orbitX(initialAngle, -15) - particleSize / 2,
                      orbitX(initialAngle + 180, 20) - particleSize / 2,
                      orbitX(initialAngle + 360, -15) - particleSize / 2,
                    ],
                    y: [
                      orbitY(initialAngle, -15) - particleSize / 2,
                      orbitY(initialAngle + 180, 20) - particleSize / 2,
                      orbitY(initialAngle + 360, -15) - particleSize / 2,
                    ],
                    scale: [0.9, 1.2, 0.85, 1.15, 0.9],
                    opacity: [0.5, 0.85, 0.6, 0.8, 0.5],
                  }}
                  transition={{
                    x: {
                      duration: orbitDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: orbitDuration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 2.5 + i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    },
                    opacity: {
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    },
                  }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Right 1/3 - Content */}
        <div className="w-1/3 flex flex-col justify-center items-end pl-8 pr-20 py-12 text-right">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black mb-10 tracking-tight text-[#3b110c]">
            VibeChecked
          </h1>

          <div className="mb-10">
            <p className="text-sm uppercase tracking-widest mb-4 text-[#3b110c]/70">
              Check Your Vibes
            </p>
            <div className="rounded-2xl p-6 bg-[#3b110c]/10 border border-[#3b110c]/10 cursor-pointer hover:bg-[#3b110c]/15 transition-colors" onClick={handleCopy}>
              <div className="flex items-start gap-3">
                <code className="font-mono flex-1 text-[clamp(10px,1.5vw,13px)] break-all text-right text-[#3b110c]/90 pr-2">
                  {installCommand}
                </code>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="flex-shrink-0 p-2 rounded-lg bg-[#3b110c]/10 hover:bg-[#3b110c]/20 transition-colors cursor-pointer border border-[#3b110c]/20"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-[#3b110c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#3b110c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest mb-4 text-[#3b110c]/50">
              Or try a demo
            </p>
            <div className="flex flex-col gap-3">
              {samples.map((sample) => (
                <Link
                  key={sample.path}
                  to={sample.path}
                  className="px-5 py-2 rounded-lg hover:bg-[#3b110c]/10 transition-colors flex items-center justify-end gap-2 text-sm text-[#3b110c]/80"
                >
                  <span>{sample.icon}</span>
                  <span>{sample.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
