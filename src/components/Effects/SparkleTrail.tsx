import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { makeParticleId } from "../../lib/particles";

type Spark = { id: string; x: number; y: number };

type SparkleTrailProps = {
  active?: boolean;
};

export function SparkleTrail({ active = true }: SparkleTrailProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (!active) return;
    const onMove = (event: PointerEvent) => {
      setSparks((current) => [...current.slice(-18), { id: makeParticleId("sparkle"), x: event.clientX, y: event.clientY }]);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          className="absolute h-2 w-2 rounded-full bg-white shadow-glow"
          style={{ left: spark.x, top: spark.y }}
          initial={{ opacity: 0.9, scale: 0 }}
          animate={{ opacity: 0, scale: 2.6 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </div>
  );
}
