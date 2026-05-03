export type ParticleKind = "petal" | "heart" | "sparkle" | "confetti";

export function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function makeParticleId(prefix: ParticleKind) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
