import { useEffect, useState } from 'react';

export const useAutoPixelRatio = () =>
  globalThis.devicePixelRatio >= 2 ? 2 : 1;

export const useFrameNow = () => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const setDateNow = () => {
      setNow(Date.now());
    };

    const raf = globalThis.requestAnimationFrame(setDateNow);

    return () => {
      globalThis.cancelAnimationFrame(raf);
    };
  }, [now]);

  return now;
};

export const useFrameRate = (lastXFrames = 5) => {
  const now = useFrameNow();
  const [frames, setFrames] = useState<readonly number[]>([]);

  useEffect(() => {
    setFrames((prev) => {
      const next = [...prev];
      next.unshift(now);
      return next.splice(0, lastXFrames);
    });
  }, [lastXFrames, now]);

  return (
    1000 /
    (frames.reduce((acc, num, index, context) => {
      const num2 = context[index + 1];

      if (typeof num2 !== 'number') {
        return acc;
      }

      return acc + (num - num2);
    }, 0) /
      (frames.length ?? 1))
  );
};
