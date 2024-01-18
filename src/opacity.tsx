import { PropsWithChildren } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface OpacityProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  opacity: number;
}

export const Opacity = CanvasElementType.Opacity;
