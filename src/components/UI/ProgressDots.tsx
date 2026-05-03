type ProgressDotsProps = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`${current + 1} / ${total}`}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full transition-all ${index === current ? "w-7 bg-inkWarm" : "w-2 bg-white/70"}`}
        />
      ))}
    </div>
  );
}
