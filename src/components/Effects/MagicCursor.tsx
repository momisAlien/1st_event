import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  glyph: string;
};

const glyphs = ["✦", "✧", "✶", "♥", "✺"];

export function MagicCursor() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const spawn = (x: number, y: number, burst = false) => {
      const now = performance.now();
      if (!burst && now - lastSpawnRef.current < 38) return;
      lastSpawnRef.current = now;
      const count = burst ? 12 : 1;
      const next = Array.from({ length: count }, (_, index) => ({
        id: idRef.current++,
        x: x + (burst ? Math.cos(index) * 18 : 0),
        y: y + (burst ? Math.sin(index) * 18 : 0),
        size: burst ? 12 + Math.random() * 16 : 8 + Math.random() * 10,
        hue: 42 + Math.random() * 300,
        glyph: glyphs[(idRef.current + index) % glyphs.length],
      }));
      setParticles((current) => [...current.slice(-38), ...next]);
    };

    const handlePointerMove = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      spawn(event.clientX, event.clientY);
    };

    const handlePointerDown = (event: PointerEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
      spawn(event.clientX, event.clientY, true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="magic-cursor-layer" aria-hidden="true">
      <motion.div
        className="magic-cursor-orb"
        animate={{ x: position.x - 70, y: position.y - 70 }}
        transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.4 }}
      />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="magic-cursor-particle"
          initial={{ opacity: 0.95, x: particle.x, y: particle.y, scale: 0.65, rotate: 0 }}
          animate={{ opacity: 0, x: particle.x + (Math.random() - 0.5) * 90, y: particle.y - 72 - Math.random() * 54, scale: 1.5, rotate: 120 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          onAnimationComplete={() => setParticles((current) => current.filter((item) => item.id !== particle.id))}
          style={{ fontSize: particle.size, color: `hsl(${particle.hue} 95% 78%)` }}
        >
          {particle.glyph}
        </motion.span>
      ))}
    </div>
  );
}
