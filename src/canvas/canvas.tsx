import React, { HTMLAttributes } from 'react';

export interface CanvasProps extends HTMLAttributes<HTMLCanvasElement> {
  pixelRatio?: number;
}

export const Canvas = ({ pixelRatio, ...props }: CanvasProps) => (
  <canvas {...props}></canvas>
);

Canvas.displayName = 'Canvas';
