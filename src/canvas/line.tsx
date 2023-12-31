import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface LineProps extends CommonCanvasComponentProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke?: string;
  strokeWidth?: number;
}

export const Line = CanvasElementType.Line;
