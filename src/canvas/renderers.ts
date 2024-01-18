import { IntrinsicCanvasBufferProps } from './canvas-buffer';
import { ImageProps } from './image';
import { drawToCanvas } from './internal/utils';
import { LineProps } from './line';
import { OpacityProps } from './opacity';
import { RectangleProps } from './rectangle';
import { RotateProps } from './rotate';
import { ScaleProps } from './scale';
import { TextProps } from './text';
import { TranslateProps } from './translate';
import {
  CanvasComponentRenderers,
  CanvasElementType,
  InternalCanvasElementType,
  ReconciledCanvasChild,
  ReconciledTextChild,
} from './types';

const rectangleRenderers: CanvasComponentRenderers<RectangleProps> = {
  drawBeforeChildren: (
    { ctx },
    { x, y, width, height, fill, stroke, strokeWidth = 1 }
  ) => {
    if (!fill && !stroke) {
      ctx.rect(x, y, width, height);
    }

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, width, height);
    }

    if (stroke && strokeWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(x, y, width, height);
    }
  },
};

const lineRenderers: CanvasComponentRenderers<LineProps> = {
  drawBeforeChildren: (
    { ctx },
    { startX, startY, endX, endY, stroke, strokeWidth = 1, continuePath }
  ) => {
    if (continuePath !== false) {
      ctx.beginPath();
    }

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    if (stroke && strokeWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  },
};

const rotateRenderers: CanvasComponentRenderers<RotateProps> = {
  drawBeforeChildren: ({ ctx }, { radians, restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.save();
    }

    ctx.rotate(radians);
  },
  drawAfterChildren: ({ ctx }, { restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.restore();
    }
  },
};

const translateRenderers: CanvasComponentRenderers<TranslateProps> = {
  drawBeforeChildren: ({ ctx }, { x = 0, y = 0, restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.save();
    }

    ctx.translate(x, y);
  },
  drawAfterChildren: ({ ctx }, { restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.restore();
    }
  },
};

const scaleRenderers: CanvasComponentRenderers<ScaleProps> = {
  drawBeforeChildren: ({ ctx }, { x = 1, y = 1, restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.save();
    }

    ctx.scale(x, y);
  },

  drawAfterChildren: ({ ctx }, { restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.restore();
    }
  },
};

const stringify = (
  rendered: string | readonly (ReconciledCanvasChild | ReconciledTextChild)[]
) => {
  if (typeof rendered === 'string') {
    return rendered;
  }

  return rendered
    .map((node) =>
      node.type === InternalCanvasElementType.Text ? node.rendered : ''
    )
    .join('');
};

const textRenderers: CanvasComponentRenderers<TextProps> = {
  drawBeforeChildren: (
    { ctx },
    {
      x,
      y,
      fontFamily = 'arial',
      fontSize = 12,
      fontStyle = 'normal',
      fontVariant = 'normal',
      fontWeight = 'normal',
      textAlign = 'left',
      verticalAlign = 'top',
      fill,
      stroke,
      strokeWidth = 1,
    },
    rendered
  ) => {
    if (verticalAlign) {
      ctx.textBaseline = verticalAlign;
    }

    if (textAlign) {
      ctx.textAlign = textAlign;
    }

    const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;

    ctx.font = font;

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fillText(stringify(rendered), x, y);
    }

    if (stroke && strokeWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(stringify(rendered), x, y);
    }
  },
};

const opacityRenderers: CanvasComponentRenderers<OpacityProps> = {
  drawBeforeChildren: ({ ctx }, { opacity = 1, restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.save();
    }

    ctx.globalAlpha = opacity;
  },

  drawAfterChildren: ({ ctx }, { restore }, rendered) => {
    if (rendered.length && restore !== false) {
      ctx.restore();
    }
  },
};

const imageRenderers: CanvasComponentRenderers<ImageProps> = {
  drawBeforeChildren: ({ ctx }, { x, y, width, height, src }) => {
    ctx.drawImage(src, x, y, width, height);
  },
};

const canvasBufferRenderers: CanvasComponentRenderers<IntrinsicCanvasBufferProps> =
  {
    handlesChildren: true,
    drawBeforeChildren: (
      { ctx: parentCtx },
      {
        width,
        height,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
        backgroundColor,
        pixelRatio,
        canvas,
        ctx,
        renderers,
      },
      rendered
    ) => {
      const dimensions = {
        width: width * pixelRatio,
        height: height * pixelRatio,
      };

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

      parentCtx.drawImage(canvas, drawX, drawY, drawWidth, drawHeight);
    },
  };

export const RENDERERS: Record<
  CanvasElementType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CanvasComponentRenderers<any>
> = {
  [CanvasElementType.Rectangle]: rectangleRenderers,
  [CanvasElementType.Line]: lineRenderers,
  [CanvasElementType.Rotate]: rotateRenderers,
  [CanvasElementType.Translate]: translateRenderers,
  [CanvasElementType.Scale]: scaleRenderers,
  [CanvasElementType.Text]: textRenderers,
  [CanvasElementType.Opacity]: opacityRenderers,
  [CanvasElementType.Image]: imageRenderers,
  [CanvasElementType.CanvasBuffer]: canvasBufferRenderers,
};
