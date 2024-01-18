import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface ImageProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  src: Parameters<CanvasRenderingContext2D['drawImage']>[0];
}

export const Image = CanvasElementType.Image;
