import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getLocationWithinElement, handlerNameToEventName } from '../utils';
import { CanvasContext } from './context';
import { Handlers, PointerHandlers, PointerStateWithinElement } from './types';

export const useAutoPixelRatio = () =>
  globalThis.devicePixelRatio >= 2 ? 2 : 1;

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

const INITIAL_POINTER_STATE = {
  down: null,
  now: null,
  dragged: null,
  delta: null,
  down2: null,
  now2: null,
  dragged2: null,
  delta2: null,
} as const satisfies PointerStateWithinElement;

export const usePointerStateWithinElement = (
  handlers: PointerHandlers,
  canvas: HTMLCanvasElement | null | undefined
) => {
  const stateRef = useRef<PointerStateWithinElement>({
    ...INITIAL_POINTER_STATE,
  });

  useEventHandlers(
    useMemo(() => {
      const { onPointerDown, onPointerUp, onPointerMove } = handlers;

      const onTouchEndOrCancel = (event: TouchEvent) => {
        const prev = { ...stateRef.current };

        const [one, two] = event.touches;

        if (!one) {
          stateRef.current.down = null;
          stateRef.current.now = null;
          stateRef.current.dragged = null;
        }

        if (!two) {
          stateRef.current.down2 = null;
          stateRef.current.now2 = null;
          stateRef.current.dragged2 = null;
        }

        onPointerUp?.({ ...stateRef.current }, prev);
      };

      return {
        onMouseDown: (event) => {
          if (event.button !== 0) {
            return;
          }

          event.preventDefault();

          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const loc = getLocationWithinElement(event, canvas);
          stateRef.current.down = loc;
          stateRef.current.now = loc;

          onPointerDown?.({ ...stateRef.current }, prev);
        },
        onMouseUp: (event) => {
          if (event.button !== 0) {
            return;
          }

          const prev = { ...stateRef.current };

          stateRef.current.down = null;
          stateRef.current.now = null;
          stateRef.current.dragged = null;

          onPointerUp?.({ ...stateRef.current }, prev);
        },
        onMouseMove: (event) => {
          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const loc = getLocationWithinElement(event, canvas);
          const dragged = prev.down
            ? {
                x: loc.x - prev.down.x,
                y: loc.y - prev.down.y,
              }
            : null;
          const delta = prev.now
            ? {
                x: loc.x - prev.now.x,
                y: loc.y - prev.now.y,
              }
            : null;

          stateRef.current.now = loc;
          stateRef.current.dragged = dragged;
          stateRef.current.delta = delta;

          onPointerMove?.({ ...stateRef.current }, prev);
        },
        onTouchStart: (event) => {
          event.preventDefault();

          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const [one, two] = event.touches;

          if (one) {
            const loc = getLocationWithinElement(one, canvas);
            stateRef.current.down = loc;
            stateRef.current.now = loc;
          }

          if (two) {
            const loc = getLocationWithinElement(two, canvas);
            stateRef.current.down2 = loc;
            stateRef.current.now2 = loc;
          }

          onPointerDown?.({ ...stateRef.current }, prev);
        },
        onTouchEnd: onTouchEndOrCancel,
        onTouchCancel: onTouchEndOrCancel,
        onTouchMove: (event) => {
          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const [one, two] = event.touches;

          if (one) {
            const loc = getLocationWithinElement(one, canvas);
            const dragged = prev.down
              ? {
                  x: loc.x - prev.down.x,
                  y: loc.y - prev.down.y,
                }
              : null;
            const delta = prev.now
              ? {
                  x: loc.x - prev.now.x,
                  y: loc.y - prev.now.y,
                }
              : null;
            stateRef.current.now = loc;
            stateRef.current.dragged = dragged;
            stateRef.current.delta = delta;
          }

          if (two) {
            const loc = getLocationWithinElement(two, canvas);
            const dragged = prev.down2
              ? {
                  x: loc.x - prev.down2.x,
                  y: loc.y - prev.down2.y,
                }
              : null;
            const delta = prev.now2
              ? {
                  x: loc.x - prev.now2.x,
                  y: loc.y - prev.now2.y,
                }
              : null;
            stateRef.current.now2 = loc;
            stateRef.current.dragged2 = dragged;
            stateRef.current.delta2 = delta;
          }

          onPointerMove?.({ ...stateRef.current }, prev);
        },
      };
    }, [canvas, handlers]),
    canvas
  );

  return stateRef;
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);

  if (!context) {
    throw new Error('Attempted to access CanvasContext outside of a Canvas');
  }

  return context;
};
