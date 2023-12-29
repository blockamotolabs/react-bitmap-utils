import { memo } from 'react';

import { CanvasComponent, CommonCanvasComponentProps } from '../types';

interface RectangleProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const Rectangle: CanvasComponent<RectangleProps> = memo(() => {
  return null;
});

Rectangle.drawBeforeChildren = (
  ctx,
  { x, y, width, height, fill, stroke, strokeWidth = 1 }
) => {
  if (!fill && !stroke) {
    ctx.rect(x, y, width, height);
  }

  if (fill) {
    ctx.fillRect(x, y, width, height);
  }

  if (stroke && strokeWidth) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(x, y, width, height);
  }
};

Rectangle.displayName = 'Rectangle';
