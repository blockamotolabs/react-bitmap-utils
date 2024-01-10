import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';

import { CanvasProps } from './canvas';
import { CanvasContext } from './context';
import { useCanvasContext } from './hooks';
import { Image } from './image';
import { useCanvasRefWrapper, useDrawToCanvas } from './internal/hooks';

export interface CanvasBufferProps
  extends Omit<CanvasProps, 'width' | 'height'> {
  width: number;
  height: number;
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

export const CanvasBuffer = memo(
  forwardRef(
    (
      {
        width,
        height,
        pixelRatio,
        backgroundColor,
        onResize,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
        children,
      }: CanvasBufferProps,
      ref: ForwardedRef<HTMLCanvasElement>
    ) => {
      const parentCanvasContextValue = useCanvasContext();
      const pixelRatioDefined =
        pixelRatio ?? parentCanvasContextValue?.pixelRatio ?? 1;

      const dimensions = useMemo(
        () => ({
          width: width * pixelRatioDefined,
          height: height * pixelRatioDefined,
        }),
        [height, width, pixelRatioDefined]
      );

      const canvasCtx = useMemo(() => {
        const canvas = globalThis.document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        return {
          canvas,
          ctx,
        };
      }, []);

      const canvasContextValue = useMemo(
        () => ({
          ...canvasCtx,
          width: dimensions.width,
          height: dimensions.height,
          pixelRatio: pixelRatioDefined,
          parent: parentCanvasContextValue,
        }),
        [
          canvasCtx,
          dimensions.height,
          dimensions.width,
          parentCanvasContextValue,
          pixelRatioDefined,
        ]
      );

      useDrawToCanvas(
        canvasContextValue,
        canvasCtx,
        dimensions,
        pixelRatioDefined,
        backgroundColor,
        children,
        useLayoutEffect
      );

      const refWrapper = useCanvasRefWrapper(
        undefined,
        undefined,
        onResize,
        ref,
        width,
        height,
        pixelRatioDefined
      );

      useEffect(() => {
        refWrapper(canvasCtx.canvas);
      }, [canvasCtx.canvas, refWrapper]);

      return (
        <CanvasContext.Provider value={canvasContextValue}>
          <Image
            x={drawX}
            y={drawY}
            width={drawWidth}
            height={drawHeight}
            src={canvasCtx.canvas}
          />
        </CanvasContext.Provider>
      );
    }
  )
);

CanvasBuffer.displayName = 'CanvasBuffer';
