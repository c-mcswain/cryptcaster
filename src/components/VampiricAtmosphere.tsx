import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
export function VampiricAtmosphere() {
  const particles = useMemo(() => [...Array(10)], []);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Deeper Nocturnal Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/95 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-[1]" />
      {/* Subdued Misty Fog Layers */}
      <motion.div
        animate={{
          x: [-40, 40],
          opacity: [0.04, 0.08, 0.04]
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute bottom-0 left-[-20%] w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(61,3,3,0.08)_0%,transparent_70%)] blur-[120px] z-[2]"
      />
      <motion.div
        animate={{
          x: [40, -40],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        className="absolute top-0 right-[-20%] w-[140%] h-[30%] bg-[radial-gradient(ellipse_at_center,rgba(18,0,33,0.08)_0%,transparent_70%)] blur-[100px] z-[2]"
      />
      {/* Ultra Subtle Static Film Grain Texture */}
      <div className="absolute inset-0 opacity-[0.015] z-[3] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      {/* Slower Dust/Particles */}
      <div className="absolute inset-0 z-[4] opacity-10">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{
              top: `${(i * 9.7) % 100}%`,
              left: `${(i * 17.3) % 100}%`,
              opacity: 0
            }}
            animate={{
              y: [0, -30, -60],
              opacity: [0, 0.2, 0],
              x: [0, (i % 2 === 0 ? 5 : -5)]
            }}
            transition={{
              duration: 12 + (i % 8),
              repeat: Infinity,
              delay: i * 1.5
            }}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
          />
        ))}
      </div>
    </div>
  );
}