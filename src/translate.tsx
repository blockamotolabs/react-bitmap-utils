import { PropsWithChildren } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface TranslateProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  x?: number;
  y?: number;
}

export const Translate = CanvasElementType.Translate;
