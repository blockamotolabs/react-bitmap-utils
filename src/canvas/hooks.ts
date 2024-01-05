import { useContext, useEffect, useState } from 'react';

import { handlerNameToEventName } from '../utils';
import { CanvasContext } from './context';

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

export const useDelta = () => {
  const now = useFrameNow();
  const [{ delta }, setLastDelta] = useState({
    last: now,
    delta: 0,
  });

  useEffect(() => {
    setLastDelta(({ last }) => ({
      last: now,
      delta: now - last,
    }));
  }, [now]);

  return delta;
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

interface Handlers {
  onWheel?: (event: WheelEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
  onTouchLeave?: (event: TouchEvent) => void;
}

export const useEventHandlers = (
  handlers: Handlers,
  canvas: HTMLCanvasElement | null | undefined
) => {
  useEffect(() => {
    if (canvas) {
      Object.entries(handlers).forEach(([key, handler]) => {
        if (handler) {
          canvas.addEventListener(handlerNameToEventName(key), handler);
        }
      });
    }

    return () => {
      if (canvas) {
        Object.entries(handlers).forEach(([key, handler]) => {
          if (handler) {
            canvas.removeEventListener(handlerNameToEventName(key), handler);
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
