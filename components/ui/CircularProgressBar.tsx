"use client";

import React, { useEffect, useRef, useState, startTransition } from "react";
import { useInView } from "framer-motion";

export type CircularProgressBarProps = {
  number?: string | number;
  percent?: number; // 0..100
  strokeWidth?: number; // px
  barColor?: string;
  trackColor?: string;
  numberColor?: string;
  fontSize?: number; // px for center number
  animate?: boolean;
  duration?: number; // seconds
  style?: React.CSSProperties;
  startAngle?: number; // degrees
  direction?: "clockwise" | "counterclockwise";
  label?: string;
  labelColor?: string;
  labelClassName?: string;
};

export function CircularProgressBar({
  number = 0,
  percent = 0,
  strokeWidth = 10,
  barColor = "#3154F0",
  trackColor = "#282c39",
  numberColor = "#ffffff",
  fontSize = 28,
  animate = true,
  duration = 1.2,
  style,
  startAngle = 0,
  direction = "clockwise",
  label,
  labelColor = "#9da3b9",
  labelClassName,
}: CircularProgressBarProps) {
  const size = 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(animate ? 0 : Math.max(0, Math.min(100, percent)));
  const requestRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-20%" });

  const rotation = (startAngle || 0) - 90;
  const directionSign = direction === "counterclockwise" ? -1 : 1;
  const dashOffset = directionSign * circumference * (1 - progress / 100);

  useEffect(() => {
    const target = Math.max(0, Math.min(100, percent));
    if (!animate) {
      startTransition(() => setProgress(target));
      return;
    }
    if (!inView) return;
  if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
  startTime.current = null;
    const step = (ts: number) => {
  if (startTime.current == null) startTime.current = ts;
  const elapsed = (ts - startTime.current) / 1000;
      const t = Math.min(elapsed / Math.max(duration, 0.01), 1);
      const val = target * t;
      startTransition(() => setProgress(val));
      if (t < 1) requestRef.current = requestAnimationFrame(step);
      else startTransition(() => setProgress(target));
    };
    requestRef.current = requestAnimationFrame(step);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [percent, animate, duration, inView]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ position: "absolute", top: 0, left: 0, transform: `rotate(${rotation}deg)` }}
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx={50} cy={50} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={50}
          cy={50}
          r={radius}
          stroke={barColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: numberColor, display: "inline-block", width: "100%", textAlign: "center", fontSize, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>
          {number}
        </span>
        {label && (
          <span className={labelClassName} style={{ color: labelColor, marginTop: 4, width: "100%", textAlign: "center" }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default CircularProgressBar;
