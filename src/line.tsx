import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface LineProps extends CommonCanvasComponentProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke?: string;
  strokeWidth?: number;
  /** Does not start a new shape when true */
  continuePath?: boolean;
}

export const Line = CanvasElementType.Line;
