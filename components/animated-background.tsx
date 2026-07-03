"use client";

import { motion } from "framer-motion";
import React from "react";

const BLOBS = [
  {
    id: 1,
    size: 920,
    style: { top: "-8%", right: "-14%" } as React.CSSProperties,
    opacity: 0.88,
    blur: 6,
    x: [0, 80, -50, 100, -30, 0],
    y: [0, -50, 80, -40, 60, 0],
    borderRadius: [
      "30% 70% 70% 30%",
      "60% 40% 30% 70%",
      "40% 60% 70% 30%",
      "70% 30% 40% 60%",
      "30% 70% 70% 30%",
    ],
    duration: 20,
    delay: 0,
  },
  {
    id: 2,
    size: 700,
    style: { top: "24%", left: "-16%" } as React.CSSProperties,
    opacity: 0.13,
    blur: 90,
    x: [0, -60, 80, -40, 70, 0],
    y: [0, 100, -70, 90, -50, 0],
    borderRadius: [
      "60% 40% 30% 70%",
      "30% 70% 70% 30%",
      "70% 30% 40% 60%",
      "40% 60% 70% 30%",
      "60% 40% 30% 70%",
    ],
    duration: 28,
    delay: 3,
  },
  {
    id: 3,
    size: 600,
    style: { top: "50%", right: "-8%" } as React.CSSProperties,
    opacity: 0.11,
    blur: 100,
    x: [0, 60, -80, 50, -60, 0],
    y: [0, 70, -50, 80, -30, 0],
    borderRadius: [
      "40% 60% 70% 30%",
      "70% 30% 40% 60%",
      "30% 70% 70% 30%",
      "60% 40% 30% 70%",
      "40% 60% 70% 30%",
    ],
    duration: 24,
    delay: 6,
  },
  {
    id: 4,
    size: 520,
    style: { top: "74%", left: "12%" } as React.CSSProperties,
    opacity: 0.08,
    blur: 120,
    x: [0, 50, -60, 40, -50, 0],
    y: [0, -70, 60, -50, 70, 0],
    borderRadius: [
      "70% 30% 40% 60%",
      "40% 60% 70% 30%",
      "60% 40% 30% 70%",
      "30% 70% 70% 30%",
      "70% 30% 40% 60%",
    ],
    duration: 32,
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
