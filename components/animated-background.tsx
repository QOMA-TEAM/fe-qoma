"use client";

import { motion } from "framer-motion";
import React from "react";

const BLOBS = [
  {
    id: 1,
    size: 920,
    style: { top: "-10%", right: "-10%" } as React.CSSProperties,
    opacity: 0.88,
    blur: 6,
    x: ["0vw", "-30vw", "-70vw", "-20vw", "0vw"],
    y: ["0vh", "20vh", "40vh", "10vh", "0vh"],
    borderRadius: [
      "30% 70% 70% 30%",
      "60% 40% 30% 70%",
      "40% 60% 70% 30%",
      "70% 30% 40% 60%",
      "30% 70% 70% 30%",
    ],
    duration: 35,
    delay: 0,
  },
  {
    id: 2,
    size: 700,
    style: { top: "20%", left: "-10%" } as React.CSSProperties,
    opacity: 0.13,
    blur: 90,
    x: ["0vw", "40vw", "80vw", "30vw", "0vw"],
    y: ["0vh", "-20vh", "30vh", "50vh", "0vh"],
    borderRadius: [
      "60% 40% 30% 70%",
      "30% 70% 70% 30%",
      "70% 30% 40% 60%",
      "40% 60% 70% 30%",
      "60% 40% 30% 70%",
    ],
    duration: 40,
    delay: 3,
  },
  {
    id: 3,
    size: 600,
    style: { top: "60%", right: "-5%" } as React.CSSProperties,
    opacity: 0.11,
    blur: 100,
    x: ["0vw", "-50vw", "-90vw", "-40vw", "0vw"],
    y: ["0vh", "-30vh", "-50vh", "10vh", "0vh"],
    borderRadius: [
      "40% 60% 70% 30%",
      "70% 30% 40% 60%",
      "30% 70% 70% 30%",
      "60% 40% 30% 70%",
      "40% 60% 70% 30%",
    ],
    duration: 38,
    delay: 6,
  },
  {
    id: 4,
    size: 520,
    style: { top: "80%", left: "5%" } as React.CSSProperties,
    opacity: 0.08,
    blur: 120,
    x: ["0vw", "30vw", "70vw", "40vw", "0vw"],
    y: ["0vh", "-40vh", "-80vh", "-20vh", "0vh"],
    borderRadius: [
      "70% 30% 40% 60%",
      "40% 60% 70% 30%",
      "60% 40% 30% 70%",
      "30% 70% 70% 30%",
      "70% 30% 40% 60%",
    ],
    duration: 45,
    delay: 9,
  },
];

export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {BLOBS.map((blob) => (
        <motion.div
          key={blob.id}
          animate={{
            x: blob.x,
            y: blob.y,
            borderRadius: blob.borderRadius,
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
            delay: blob.delay,
          }}
          style={{
            position: "absolute",
            width: blob.size,
            height: blob.size,
            background: "#ff6b00",
            opacity: blob.opacity,
            filter: `blur(${blob.blur}px)`,
            ...blob.style,
          }}
        />
      ))}
    </div>
  );
}
