import { ReactElement } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface TranslateProps extends CommonCanvasComponentProps {
  x?: number;
  y?: number;
  children?: ReactElement | readonly ReactElement[];
}

export const Translate = CanvasElementType.Translate;
