import React, {
  Dispatch,
  ForwardedRef,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';

import { CanvasComponentRenderers, CanvasContextValue } from '../types';
import { getDimensions } from '../utils';
import { CanvasContext } from './context';
import CanvasReconcilerPublic from './reconciler';
import { drawToCanvas } from './utils';

export const useDrawToCanvas = (
  canvasContextValue: CanvasContextValue,
  canvasCtx: null | {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  },
  dimensions: {
    width: number;
    height: number;
  },
  pixelRatio: number,
  backgroundColor: string | undefined,
  children: ReactNode,
  useEffect: typeof React.useEffect,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, CanvasComponentRenderers<any>>
) => {
  const rootContainerRef = useRef<null | ReturnType<
    typeof CanvasReconcilerPublic.render
  >>(null);

  useEffect(() => {
    if (!canvasCtx) {
      rootContainerRef.current?.unmount();
      rootContainerRef.current = null;
      return;
    }

    if (!rootContainerRef.current) {
      rootContainerRef.current = CanvasReconcilerPublic.render(
        <CanvasContext.Provider value={canvasContextValue}>
          {children}
        </CanvasContext.Provider>
      );
    } else {
      rootContainerRef.current.update(
        <CanvasContext.Provider value={canvasContextValue}>
          {children}
        </CanvasContext.Provider>
      );
    }

    const {
      container: {
        containerInfo: { rendered },
      },
    } = rootContainerRef.current;

    const { canvas, ctx } = canvasCtx;

    drawToCanvas(
      canvas,
      ctx,
      dimensions.width,
      dimensions.height,
      pixelRatio,
      backgroundColor,
      rendered,
      renderers
    );
  }, [
    backgroundColor,
    canvasCtx,
    dimensions.height,
    dimensions.width,
    pixelRatio,
    children,
    canvasContextValue,
    renderers,
  ]);
};

export const useCanvasRefWrapper = (
  setCanvasCtx:
    | Dispatch<
        SetStateAction<{
          canvas: HTMLCanvasElement;
          ctx: CanvasRenderingContext2D;
        } | null>
      >
    | undefined,
  setDimensions:
    | Dispatch<SetStateAction<{ width: number; height: number }>>
    | undefined,
  onResize:
    | ((dimensions: { width: number; height: number }) => void)
    | undefined,
  ref: ForwardedRef<HTMLCanvasElement>,
  width: number | undefined,
  height: number | undefined,
  pixelRatio: number
) =>
  useCallback(
    (canvas: HTMLCanvasElement | null) => {
      setCanvasCtx?.(() => {
        if (!canvas) {
          return null;
        }

        return {
          canvas,
          ctx: canvas.getContext('2d')!,
        };
      });
      const nextDimensions = getDimensions(pixelRatio, width, height, canvas);
      setDimensions?.(nextDimensions);
      onResize?.({
        width: nextDimensions.width / pixelRatio,
        height: nextDimensions.height / pixelRatio,
      });

      if (ref) {
        if (typeof ref === 'object') {
          ref.current = canvas;
        } else if (typeof ref === 'function') {
          ref(canvas);
        }
      }
    },
    [height, onResize, pixelRatio, ref, setCanvasCtx, setDimensions, width]
  );
