import React, {
  Children,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import CanvasReconcilerPublic from './reconciler';

export interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  children?: ReactElement | readonly ReactElement[];
  ref?: ForwardedRef<HTMLCanvasElement>;
}

const getDimensions = (
  pixelRatio: number,
  width: number | undefined,
  height: number | undefined,
  canvas: HTMLCanvasElement | null
) => {
  return {
    width:
      typeof width === 'number'
        ? width * pixelRatio
        : (canvas?.clientWidth ?? 0) * pixelRatio,
    height:
      typeof height === 'number'
        ? height * pixelRatio
        : (canvas?.clientHeight ?? 0) * pixelRatio,
  };
};

export const Canvas = memo(
  forwardRef(
    (
      { width, height, pixelRatio = 1, children, ...props }: CanvasProps,
      ref
    ) => {
      const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(
        null
      );
      const ctx = useMemo(() => canvas?.getContext('2d'), [canvas]);
      const dimensions = getDimensions(pixelRatio, width, height, canvas);

      const rootContainerRef = useRef<null | ReturnType<
        typeof CanvasReconcilerPublic.render
      >>(null);

      useEffect(() => {
        if (!canvas) {
          rootContainerRef.current?.unmount();
          rootContainerRef.current = null;
          return;
        }

        if (!rootContainerRef.current) {
          rootContainerRef.current = CanvasReconcilerPublic.render(
            <>{children}</>,
            canvas
          );
        } else {
          rootContainerRef.current.update(<>{children}</>);
        }
      }, [canvas, children]);

      const refWrapper = useCallback(
        (nextCanvas: HTMLCanvasElement | null) => {
          setCanvas(nextCanvas);

          if (ref) {
            if (typeof ref === 'object') {
              ref.current = nextCanvas;
            } else if (typeof ref === 'function') {
              ref(nextCanvas);
            }
          }
        },
        [ref]
      );

      useEffect(() => {
        if (!canvas || !ctx) {
          return;
        }

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const drawChild = (child: ReactNode) => {
          if (!child || typeof child !== 'object' || !('type' in child)) {
            return;
          }

          const { type, props: childProps } = child;

          if (typeof type !== 'function' && typeof type !== 'object') {
            return;
          }

          if (childProps.restore) {
            ctx.save();
          }

          if (
            'drawBeforeChildren' in type &&
            typeof type.drawBeforeChildren === 'function'
          ) {
            type.drawBeforeChildren(ctx, childProps);
          }

          Children.forEach(childProps.children, drawChild);

          if (
            'drawAfterChildren' in type &&
            typeof type.drawAfterChildren === 'function'
          ) {
            type.drawAfterChildren(ctx, childProps);
          }

          if (childProps.restore) {
            ctx.restore();
          }
        };

        Children.forEach(children, drawChild);
      }, [canvas, children, ctx, dimensions.height, dimensions.width]);

      return (
        <canvas
          width={dimensions.width}
          height={dimensions.height}
          {...props}
          ref={refWrapper}
        ></canvas>
      );
    }
  )
);

Canvas.displayName = 'Canvas';
