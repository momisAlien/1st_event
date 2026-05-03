import { useEffect, useState } from "react";

export function useAssetPreload(srcList: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const work = srcList.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
        }),
    );
    Promise.all(work).then(() => mounted && setReady(true));
    return () => {
      mounted = false;
    };
  }, [srcList]);

  return ready;
}
