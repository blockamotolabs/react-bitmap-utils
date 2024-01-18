import { useContext, useEffect, useState } from 'react';

import { CanvasContext } from './internal/context';
import { handlerNameToEventName } from './internal/utils';
import { Handlers } from './types';

const MATCHES_ANDROID = /android/i;

export const useRecommendedPixelRatio = () => {
  if (MATCHES_ANDROID.test(globalThis.navigator.userAgent)) {
    // Android has some really bad performance with up-scaled canvases
    return 1;
  }

  return globalThis.devicePixelRatio >= 2 ? 2 : 1;
};

export const useFrameTimes = (lastXFrames = 60) => {
  const [frames, setFrames] = useState<number[]>([]);

  useEffect(() => {
    const raf = globalThis.requestAnimationFrame(() => {
      const now = Date.now();

      setFrames((prev) => {
        prev.unshift(now);
        return prev.slice(0, lastXFrames);
      });
    });

    return () => {
      globalThis.cancelAnimationFrame(raf);
    };
  }, [lastXFrames, frames]);

  return frames;
};

export const useAverageFrameRate = (lastXFrames = 60) => {
  const frames = useFrameTimes(lastXFrames);

  const sum = frames.reduce((acc, num, index, context) => {
    const num2 = context[index + 1];

    if (typeof num2 !== 'number') {
      return acc;
    }

    return acc + (num - num2);
  }, 0);

  if (!sum) {
    return 0;
  }

  return 1000 / (sum / (frames.length || 1));
};

export const useDelta = () => {
  const [lastDelta, setLastDelta] = useState({
    last: Date.now(),
    delta: 0,
  });

  useEffect(() => {
    const raf = globalThis.requestAnimationFrame(() => {
      const now = Date.now();

      setLastDelta(({ last }) => ({
        last: now,
        delta: now - last,
      }));
    });

    return () => {
      globalThis.cancelAnimationFrame(raf);
    };
  }, [lastDelta]);

  return lastDelta.delta;
};

const MATCHES_WINDOW_LISTENER = /(Up|End|Cancel)$/;

export const useEventHandlers = (
  handlers: Handlers,
  canvas: HTMLCanvasElement | null | undefined
) => {
  useEffect(() => {
    if (canvas) {
      Object.entries(handlers).forEach(([key, handler]) => {
        if (handler) {
          if (MATCHES_WINDOW_LISTENER.test(key)) {
            globalThis.window.addEventListener(
              handlerNameToEventName(key),
              handler,
              {
                passive: false,
              }
            );
          } else {
            canvas.addEventListener(handlerNameToEventName(key), handler, {
              passive: false,
            });
          }
        }
      });
    }

    return () => {
      if (canvas) {
        Object.entries(handlers).forEach(([key, handler]) => {
          if (handler) {
            if (MATCHES_WINDOW_LISTENER.test(key)) {
              globalThis.window.removeEventListener(
                handlerNameToEventName(key),
                handler
              );
            } else {
              canvas.removeEventListener(handlerNameToEventName(key), handler);
            }
          }
        });
      }
    };
  }, [canvas, handlers]);
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('Attempted to access CanvasContext outside of a Canvas');
  }

  return context;
};
