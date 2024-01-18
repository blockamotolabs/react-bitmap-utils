import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface RectangleProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export const Rectangle = CanvasElementType.Rectangle;
