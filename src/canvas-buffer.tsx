import React, { ForwardedRef } from 'react';

const { forwardRef, memo, useEffect, useMemo } = React;

import { CanvasProps } from './canvas';
import { useCanvasContext } from './hooks';
import { CanvasContext } from './internal/context';
import { useCanvasRefWrapper } from './internal/hooks';
import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface CanvasBufferProps
  extends CanvasProps,
    Omit<CommonCanvasComponentProps, 'children'> {
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}

export interface IntrinsicCanvasBufferProps
  extends Required<
      Pick<CanvasBufferProps, 'pixelRatio' | 'width' | 'height' | 'renderers'>
    >,
    Omit<
      CanvasBufferProps,
      'pixelRatio' | 'width' | 'height' | 'renderers' | 'onResize'
    > {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export const CanvasBuffer = memo(
  forwardRef(
    (
      {
        pixelRatio,
        width,
        height,
        onResize,
        backgroundColor,
        children,
        renderers: rendererOverrides,
        ...props
      }: CanvasBufferProps,
      ref: ForwardedRef<HTMLCanvasElement>
    ) => {
      const parentCanvasContextValue = useCanvasContext();
      const widthDefined = width ?? parentCanvasContextValue?.width;
      const heightDefined = height ?? parentCanvasContextValue?.height;
      const pixelRatioDefined =
        pixelRatio ?? parentCanvasContextValue?.pixelRatio ?? 1;

      const dimensions = useMemo(
        () => ({
          width: widthDefined * pixelRatioDefined,
          height: heightDefined * pixelRatioDefined,
        }),
        [heightDefined, widthDefined, pixelRatioDefined]
      );

      const renderers = useMemo(
        () => ({
          ...parentCanvasContextValue.renderers,
          ...rendererOverrides,
        }),
        [parentCanvasContextValue.renderers, rendererOverrides]
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
          renderers,
        }),
        [
          canvasCtx,
          dimensions.height,
          dimensions.width,
          parentCanvasContextValue,
          pixelRatioDefined,
          renderers,
        ]
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

        return () => {
          refWrapper(null);
        };
      }, [canvasCtx.canvas, refWrapper]);

      return (
        <CanvasContext.Provider value={canvasContextValue}>
          <CanvasElementType.CanvasBuffer
            {...props}
            width={widthDefined}
            height={heightDefined}
            pixelRatio={pixelRatioDefined}
            backgroundColor={backgroundColor}
            canvas={canvasCtx.canvas}
            ctx={canvasCtx.ctx}
            renderers={renderers}
          >
            {children}
          </CanvasElementType.CanvasBuffer>
        </CanvasContext.Provider>
      );
    }
  )
);

CanvasBuffer.displayName = 'CanvasBuffer';
