import { useEffect, useMemo, useState } from "react";
import { appConfig } from "../../content/appConfig";

type TypewriterLetterProps = {
  content: string;
  onComplete: () => void;
  onStep?: () => void;
};

export function TypewriterLetter({ content, onComplete, onStep }: TypewriterLetterProps) {
  const chars = useMemo(() => Array.from(content), [content]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= chars.length) {
      onComplete();
      return;
    }

    const timeout = window.setTimeout(() => {
      setCount((value) => value + 1);
      onStep?.();
    }, appConfig.letterTypingSpeedMs);

    return () => window.clearTimeout(timeout);
  }, [chars.length, count, onComplete, onStep]);

  return (
    <p className="whitespace-pre-wrap font-letter text-[clamp(1rem,2.5vw,1.25rem)] leading-8 text-inkWarm sm:leading-10">
      {chars.slice(0, count).join("")}
      {count < chars.length && <span className="ml-0.5 inline-block h-5 w-2 animate-pulse rounded-full bg-cocoa/45 align-middle" />}
    </p>
  );
}
