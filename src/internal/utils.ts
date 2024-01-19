import {
  CanvasComponentRenderers,
  InternalCanvasElementType,
  ReconciledCanvasChild,
  ReconciledTextChild,
} from '../types';
import { Container } from './reconciler';
import { AnyObject, HandlerNameToEventName } from './types';

const MATCHES_ON_PREFIX = /^on/;

export const handlerNameToEventName = <const T extends string>(
  handlerName: T
) =>
  handlerName
    .replace(MATCHES_ON_PREFIX, '')
    .toLowerCase() as HandlerNameToEventName<T>;

export const hasKey = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): obj is T extends Record<K, any> ? T : never => key in obj;

export const isKeyOf = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): key is K extends keyof T ? K : never => key in obj;

export const isArray = <T>(
  input: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): input is T extends readonly any[] ? T : never => Array.isArray(input);

export const drawToCanvas = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelRatio: number,
  backgroundColor: string | undefined,
  element: ReconciledCanvasChild | Container,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, CanvasComponentRenderers<any>>
) => {
  if (element.type !== InternalCanvasElementType.Root && !element.hasUpdates) {
    return;
  }

  canvas.width = width;
  canvas.height = height;

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.scale(pixelRatio, pixelRatio);

  const drawChild = (
    child: string | ReconciledCanvasChild | ReconciledTextChild
  ) => {
    if (
      typeof child === 'string' ||
      child.type === InternalCanvasElementType.Text
    ) {
      return;
    }

    const renderer = renderers[child.type];

    if (!renderer) {
      return;
    }

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
      child
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
      child
    );

    if (child.props?.restore) {
      ctx.restore();
    }

    if (element.type !== InternalCanvasElementType.Root) {
      element.hasUpdates = false;
    }
  };

  if (isArray(element.rendered)) {
    element.rendered.forEach(drawChild);
  }
};
