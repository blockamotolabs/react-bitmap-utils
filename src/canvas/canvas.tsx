import React, {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDimensions } from '../utils';
import { CanvasContext } from './context';
import { useCanvasRefWrapper, useDrawToCanvas } from './internal/hooks';
import { Dimensions } from './types';

export interface CanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, 'onResize'> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
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

      const canvasContextValue = useMemo(() => {
        if (!canvasCtx) {
          return {
            canvas: null,
            ctx: null,
            width: dimensions.width,
            height: dimensions.height,
            pixelRatio,
          };
        }

        return {
          ...canvasCtx,
          width: dimensions.width,
          height: dimensions.height,
          pixelRatio,
        };
      }, [canvasCtx, dimensions.height, dimensions.width, pixelRatio]);

      useDrawToCanvas(
        canvasContextValue,
        canvasCtx,
        dimensions,
        pixelRatio,
        backgroundColor,
        children,
        useEffect
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
        <CanvasContext.Provider value={canvasContextValue}>
          <canvas
            width={dimensions.width}
            height={dimensions.height}
            {...props}
            ref={refWrapper}
          />
        </CanvasContext.Provider>
      );
    }
  )
);

Canvas.displayName = 'Canvas';
