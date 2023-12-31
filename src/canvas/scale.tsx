import { ReactElement } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface ScaleProps extends CommonCanvasComponentProps {
  x?: number;
  y?: number;
  children?: ReactElement | readonly ReactElement[];
}

export const Scale = CanvasElementType.Scale;
