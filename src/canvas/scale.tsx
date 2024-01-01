import { PropsWithChildren } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface ScaleProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  x?: number;
  y?: number;
}

export const Scale = CanvasElementType.Scale;
