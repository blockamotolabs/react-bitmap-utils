import React, {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { getDimensions, isArray, isKeyOf } from '../utils';
import { CanvasContext } from './context';
import CanvasReconcilerPublic, { CanvasChild, TextChild } from './reconciler';
import { RENDERERS } from './renderers';
import { Dimensions } from './types';

export interface CanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, 'onResize'> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  children?: ReactElement | readonly ReactElement[];
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
      ref
    ) => {
      const [canvasCtx, setCanvasCtx] = useState<{
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
      } | null>(null);
      const [dimensions, setDimensions] = useState(
        getDimensions(pixelRatio, width, height, canvasCtx?.canvas)
      );

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
            <>{children}</>
          );
        } else {
          rootContainerRef.current.update(<>{children}</>);
        }

        const {
          container: { containerInfo },
        } = rootContainerRef.current;

        const { canvas, ctx } = canvasCtx;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        if (backgroundColor) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        }

        ctx.scale(pixelRatio, pixelRatio);

        const drawChild = (child: CanvasChild | TextChild) => {
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
            child.props
          );

          if (isArray(child.rendered)) {
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
            child.props
          );

          if (child.props?.restore) {
            ctx.restore();
          }
        };

        containerInfo.rendered.forEach(drawChild);
      }, [
        backgroundColor,
        canvasCtx,
        children,
        dimensions.height,
        dimensions.width,
        pixelRatio,
      ]);

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

      const refWrapper = useCallback(
        (canvas: HTMLCanvasElement | null) => {
          setCanvasCtx(() => {
            if (!canvas) {
              return null;
            }

            return {
              canvas,
              ctx: canvas.getContext('2d')!,
            };
          });
          const nextDimensions = getDimensions(
            pixelRatio,
            width,
            height,
            canvas
          );
          setDimensions(nextDimensions);
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
        [height, onResize, pixelRatio, ref, width]
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
