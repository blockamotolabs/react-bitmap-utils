import React, { ForwardedRef, HTMLAttributes, ReactNode } from 'react';

const { forwardRef, memo, useEffect, useMemo, useState } = React;

import { useCanvasRefWrapper, useDrawToCanvas } from './internal/hooks';
import { RENDERERS } from './internal/renderers';
import { CanvasComponentRenderers, Dimensions } from './types';
import { getDimensions } from './utils';

export interface CanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, 'onResize'> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers?: Record<string, CanvasComponentRenderers<any>>;
  children: ReactNode;
  ref?: ForwardedRef<HTMLCanvasElement>;
  onResize?: (dimensions: Dimensions) => void;
}

export const Canvas = memo(
  forwardRef(
    (
      {
        width,
        height,
        pixelRatio = 1,
        onResize,
        backgroundColor,
        children,
        renderers: rendererOverrides,
        ...props
      }: CanvasProps,
      ref: ForwardedRef<HTMLCanvasElement>
    ) => {
      const [canvasCtx, setCanvasCtx] = useState<{
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
      } | null>(null);
      const [dimensions, setDimensions] = useState(
        getDimensions(pixelRatio, width, height, canvasCtx?.canvas)
      );

      const renderers = useMemo(
        () => ({
          ...RENDERERS,
          ...rendererOverrides,
        }),
        [rendererOverrides]
      );

      const canvasContextValue = useMemo(() => {
        if (!canvasCtx) {
          return {
            canvas: null,
            ctx: null,
            width: dimensions.width,
            height: dimensions.height,
            pixelRatio,
            renderers,
            parent: null,
          };
        }

        return {
          ...canvasCtx,
          width: dimensions.width,
          height: dimensions.height,
          pixelRatio,
          renderers,
          parent: null,
        };
      }, [
        canvasCtx,
        dimensions.height,
        dimensions.width,
        pixelRatio,
        renderers,
      ]);

      useDrawToCanvas(
        canvasContextValue,
        canvasCtx,
        dimensions,
        pixelRatio,
        backgroundColor,
        children,
        useEffect,
        renderers
      );

      useEffect(() => {
        if (!canvasCtx) {
          return;
        }

        const resizeObserver = new ResizeObserver(() => {
          const nextDimensions = getDimensions(
            pixelRatio,
            width,
            height,
            canvasCtx.canvas
          );
          setDimensions({
            width: nextDimensions.width,
            height: nextDimensions.height,
          });
          onResize?.({
            width: nextDimensions.width / pixelRatio,
            height: nextDimensions.height / pixelRatio,
          });
        });

        resizeObserver.observe(canvasCtx.canvas);

        return () => {
          resizeObserver.disconnect();
        };
      }, [canvasCtx, height, onResize, pixelRatio, width]);

      const refWrapper = useCanvasRefWrapper(
        setCanvasCtx,
        setDimensions,
        onResize,
        ref,
        width,
        height,
        pixelRatio
      );

      return (
        <canvas
          width={dimensions.width}
          height={dimensions.height}
          {...props}
          ref={refWrapper}
        />
      );
    }
  )
);

Canvas.displayName = 'Canvas';
