import { PropsWithChildren } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface RotateProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  radians: number;
}

export const Rotate = CanvasElementType.Rotate;
