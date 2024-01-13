import React, {
  Dispatch,
  ForwardedRef,
  ReactNode,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';

import { getDimensions, isArray, isKeyOf } from '../../utils';
import { CanvasContext } from '../context';
import CanvasReconcilerPublic, { CanvasChild, TextChild } from '../reconciler';
import { RENDERERS } from '../renderers';
import { CanvasContextValue } from '../types';

export const drawToCanvas = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelRatio: number,
  backgroundColor: string | undefined,
  rendered: string | readonly (string | CanvasChild | TextChild)[]
) => {
  canvas.width = width;
  canvas.height = height;

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.scale(pixelRatio, pixelRatio);

  const drawChild = (child: string | CanvasChild | TextChild) => {
    if (typeof child === 'string') {
      return;
    }

    if (!isKeyOf(RENDERERS, child.type)) {
      return;
    }

    const renderer = RENDERERS[child.type];

    if (child.props?.restore) {
      ctx.save();
    }

    renderer.drawBeforeChildren?.(
      {
        canvas,
        ctx,
        drawChild,
        width: canvas.width / pixelRatio,
        height: canvas.height / pixelRatio,
        pixelRatio,
      },
      child.props,
      child.rendered
    );

    if (!renderer.handlesChildren && isArray(child.rendered)) {
      child.rendered.forEach(drawChild);
    }

    renderer.drawAfterChildren?.(
      {
        canvas,
        ctx,
        drawChild,
        width: canvas.width,
        height: canvas.height,
        pixelRatio,
      },
      child.props,
      child.rendered
    );

    if (child.props?.restore) {
      ctx.restore();
    }
  };

  if (isArray(rendered)) {
    rendered.forEach(drawChild);
  }
};

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
  useEffect: typeof React.useEffect
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
      rendered
    );
  }, [
    backgroundColor,
    canvasCtx,
    dimensions.height,
    dimensions.width,
    pixelRatio,
    children,
    canvasContextValue,
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
