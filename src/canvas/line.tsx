import { memo } from 'react';

import { CanvasComponent, CommonCanvasComponentProps } from '../types';

export interface LineProps extends CommonCanvasComponentProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke?: string;
  strokeWidth?: number;
}

export const Line: CanvasComponent<LineProps> = memo(() => {
  return null;
});

Line.drawBeforeChildren = (
  ctx,
  { startX, startY, endX, endY, stroke, strokeWidth = 1 }
) => {
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  if (stroke && strokeWidth) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
};

Line.displayName = 'Line';
