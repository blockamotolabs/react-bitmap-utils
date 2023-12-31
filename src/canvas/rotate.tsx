import { ReactElement } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface RotateProps extends CommonCanvasComponentProps {
  radians: number;
  children?: ReactElement | readonly ReactElement[];
}

export const Rotate = CanvasElementType.Rotate;
