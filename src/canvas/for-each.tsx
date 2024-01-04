import { ReactElement } from 'react';

import { CanvasElementType, CommonCanvasComponentProps } from './types';

export interface ForEachProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  callback: (
    index: number,
    start: number,
    step: number,
    end: number
  ) => ReactElement;
}

export const ForEach = CanvasElementType.ForEach;
