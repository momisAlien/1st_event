import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { makeParticleId, randomBetween } from "../../lib/particles";

type Petal = { id: string; left: number; size: number; delay: number; duration: number; x: number };

type PetalParticlesProps = {
  active?: boolean;
  burstKey?: number;
  density?: number;
};

export function PetalParticles({ active = true, burstKey = 0, density = 12 }: PetalParticlesProps) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) return;
    const batch = Array.from({ length: density }).map(() => ({
      id: makeParticleId("petal"),
      left: randomBetween(4, 96),
      size: randomBetween(8, 18),
      delay: randomBetween(0, 0.6),
      duration: randomBetween(3.8, 6.5),
      x: randomBetween(-80, 80),
    }));
    setPetals((current) => [...current.slice(-54), ...batch]);
  }, [active, burstKey, density]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute top-[-24px] rounded-full bg-roseMilk shadow-soft"
          style={{ left: `${petal.left}%`, width: petal.size, height: petal.size * 0.62 }}
          initial={{ y: -24, x: 0, opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", x: petal.x, opacity: [0, 0.95, 0.25], rotate: 260 }}
          transition={{ duration: petal.duration, delay: petal.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}
