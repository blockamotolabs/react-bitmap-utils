import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  getDifference,
  getDistance,
  getLocationWithinElement,
  handlerNameToEventName,
} from '../utils';
import { CanvasContext } from './context';
import { Handlers, PointerHandlers, PointerStateWithinElement } from './types';

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

const INITIAL_POINTER_STATE = {
  isTouch: null,
  isTap: null,
  down: null,
  now: null,
  dragged: null,
  delta: null,
  isTouch2: null,
  isTap2: null,
  down2: null,
  now2: null,
  dragged2: null,
  delta2: null,
  pinched: null,
  pinchedDelta: null,
  primaryPointer: null,
} as const satisfies PointerStateWithinElement;

const getTouches = (event: TouchEvent) => {
  const touches = [...event.touches];

  const one = touches.find((touch) => touch.identifier === 0);
  const two = touches.find((touch) => touch.identifier === 1);

  return [one, two];
};

export const usePointerStateWithinElement = (
  handlers: PointerHandlers,
  canvas: HTMLCanvasElement | null | undefined,
  tapThreshold = 10
) => {
  const stateRef = useRef<PointerStateWithinElement>({
    ...INITIAL_POINTER_STATE,
  });

  useEventHandlers(
    useMemo(() => {
      const { onPointerDown, onPointerUp, onPointerMove } = handlers;

      const onTouchEndOrCancel = (event: TouchEvent) => {
        const prev = { ...stateRef.current };

        const [one, two] = getTouches(event);

        if (!one) {
          stateRef.current.isTouch = true;
          stateRef.current.isTap = null;
          stateRef.current.down = null;
          stateRef.current.now = null;
          stateRef.current.dragged = null;
          stateRef.current.primaryPointer = two ? 1 : null;
        }

        if (!two) {
          stateRef.current.isTouch2 = true;
          stateRef.current.isTap = null;
          stateRef.current.down2 = null;
          stateRef.current.now2 = null;
          stateRef.current.dragged2 = null;
          stateRef.current.pinched = null;
          stateRef.current.pinchedDelta = null;
          stateRef.current.primaryPointer = one ? 0 : null;
        }

        onPointerUp?.({ ...stateRef.current }, prev, event);
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
          stateRef.current.isTouch = false;
          stateRef.current.isTap = true;
          stateRef.current.down = loc;
          stateRef.current.now = loc;
          stateRef.current.primaryPointer = 0;

          onPointerDown?.({ ...stateRef.current }, prev, event);
        },
        onMouseUp: (event) => {
          if (event.button !== 0) {
            return;
          }

          const prev = { ...stateRef.current };

          stateRef.current.isTouch = false;
          stateRef.current.isTap = null;
          stateRef.current.down = null;
          stateRef.current.now = null;
          stateRef.current.dragged = null;
          stateRef.current.pinched = null;
          stateRef.current.pinchedDelta = null;
          stateRef.current.primaryPointer = null;

          onPointerUp?.({ ...stateRef.current }, prev, event);
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

          stateRef.current.isTouch = false;
          if (stateRef.current.isTap !== false) {
            stateRef.current.isTap = prev.down
              ? getDistance(loc.x, loc.y, prev.down.x, prev.down.y) <
                tapThreshold
              : null;
          }
          stateRef.current.now = loc;
          stateRef.current.dragged = dragged;
          stateRef.current.delta = delta;
          stateRef.current.primaryPointer =
            stateRef.current.primaryPointer ?? 0;

          onPointerMove?.({ ...stateRef.current }, prev, event);
        },
        onTouchStart: (event) => {
          event.preventDefault();

          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const [one, two] = getTouches(event);

          if (one) {
            const loc = getLocationWithinElement(one, canvas);
            stateRef.current.isTouch = true;
            stateRef.current.isTap = true;
            stateRef.current.down = stateRef.current.down ?? loc;
            stateRef.current.now = loc;
            stateRef.current.dragged = stateRef.current.dragged ?? {
              x: 0,
              y: 0,
            };
            stateRef.current.delta = stateRef.current.delta ?? {
              x: 0,
              y: 0,
            };
            stateRef.current.primaryPointer =
              stateRef.current.primaryPointer ?? 0;
          }

          if (two) {
            const loc = getLocationWithinElement(two, canvas);
            stateRef.current.isTouch2 = true;
            stateRef.current.isTap2 = true;
            stateRef.current.down2 = stateRef.current.down2 ?? loc;
            stateRef.current.now2 = loc;
            stateRef.current.dragged2 = stateRef.current.dragged2 ?? {
              x: 0,
              y: 0,
            };
            stateRef.current.delta2 = stateRef.current.delta2 ?? {
              x: 0,
              y: 0,
            };
            stateRef.current.pinched = 0;
            stateRef.current.pinchedDelta = 0;
            stateRef.current.primaryPointer =
              stateRef.current.primaryPointer ?? 1;
          }

          onPointerDown?.({ ...stateRef.current }, prev, event);
        },
        onTouchEnd: onTouchEndOrCancel,
        onTouchCancel: onTouchEndOrCancel,
        onTouchMove: (event) => {
          if (!canvas) {
            return;
          }

          const prev = { ...stateRef.current };

          const [one, two] = getTouches(event);

          const loc1 = one ? getLocationWithinElement(one, canvas) : null;

          if (loc1) {
            const dragged = prev.down
              ? {
                  x: loc1.x - prev.down.x,
                  y: loc1.y - prev.down.y,
                }
              : null;
            const delta = prev.now
              ? {
                  x: loc1.x - prev.now.x,
                  y: loc1.y - prev.now.y,
                }
              : null;
            stateRef.current.isTouch = true;
            if (stateRef.current.isTap !== false) {
              stateRef.current.isTap = prev.down
                ? getDistance(loc1.x, loc1.y, prev.down.x, prev.down.y) <
                  tapThreshold
                : null;
            }
            stateRef.current.now = loc1;
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
            stateRef.current.isTouch = true;
            if (stateRef.current.isTap2 !== false) {
              stateRef.current.isTap2 = prev.down
                ? getDistance(loc.x, loc.y, prev.down.x, prev.down.y) <
                  tapThreshold
                : null;
            }
            stateRef.current.now2 = loc;
            stateRef.current.dragged2 = dragged;
            stateRef.current.delta2 = delta;
            stateRef.current.pinched =
              loc1 && prev.down && prev.down2
                ? getDifference(
                    getDistance(
                      prev.down.x,
                      prev.down.y,
                      prev.down2.x,
                      prev.down2.y
                    ),
                    getDistance(loc1.x, loc1.y, loc.x, loc.y)
                  )
                : null;
            stateRef.current.pinchedDelta =
              loc1 && prev.now && prev.now2
                ? getDifference(
                    getDistance(
                      prev.now.x,
                      prev.now.y,
                      prev.now2.x,
                      prev.now2.y
                    ),
                    getDistance(loc1.x, loc1.y, loc.x, loc.y)
                  )
                : null;
          }

          onPointerMove?.({ ...stateRef.current }, prev, event);
        },
      };
    }, [canvas, handlers, tapThreshold]),
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
