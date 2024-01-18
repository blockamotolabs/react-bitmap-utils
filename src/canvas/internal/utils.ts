import { isArray } from '../../utils';
import {
  CanvasComponentRenderers,
  ReconciledCanvasChild,
  ReconciledTextChild,
} from '../types';

export const drawToCanvas = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelRatio: number,
  backgroundColor: string | undefined,
  rendered:
    | string
    | readonly (string | ReconciledCanvasChild | ReconciledTextChild)[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, CanvasComponentRenderers<any>>
) => {
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
    if (typeof child === 'string') {
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
