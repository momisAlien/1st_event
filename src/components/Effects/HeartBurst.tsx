import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { makeParticleId, randomBetween } from "../../lib/particles";

type Heart = { id: string; x: number; y: number; size: number };

type HeartBurstProps = {
  trigger: number;
};

export function HeartBurst({ trigger }: HeartBurstProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const next = Array.from({ length: 10 }).map(() => ({
      id: makeParticleId("heart"),
      x: randomBetween(-100, 100),
      y: randomBetween(-130, -40),
      size: randomBetween(16, 28),
    }));
    setHearts(next);
  }, [trigger]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute text-rose-400"
          style={{ fontSize: heart.size }}
          initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.8], x: heart.x, y: heart.y }}
          transition={{ duration: 1.15, ease: "easeOut" }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
