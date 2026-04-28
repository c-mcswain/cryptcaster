import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
export function VampiricAtmosphere() {
  const particles = useMemo(() => [...Array(12)], []); // Reduced count for performance
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Deep Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[1]" />
      {/* Misty Fog Layers */}
      <motion.div
        animate={{
          x: [-80, 80],
          opacity: [0.08, 0.15, 0.08]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute bottom-0 left-[-20%] w-[140%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(74,4,4,0.1)_0%,transparent_70%)] blur-[100px] z-[2]"
      />
      <motion.div
        animate={{
          x: [80, -80],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute top-0 right-[-20%] w-[140%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(26,0,46,0.1)_0%,transparent_70%)] blur-[80px] z-[2]"
      />
      {/* Static Film Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-[3] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      {/* Optimized Dust/Particles */}
      <div className="absolute inset-0 z-[4] opacity-20">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{
              top: `${(i * 7.7) % 100}%`,
              left: `${(i * 13.3) % 100}%`,
              opacity: 0
            }}
            animate={{
              y: [0, -50, -100],
              opacity: [0, 0.4, 0],
              x: [0, (i % 2 === 0 ? 10 : -10)]
            }}
            transition={{
              duration: 8 + (i % 5),
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  );
}