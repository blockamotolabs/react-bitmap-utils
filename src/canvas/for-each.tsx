import { ReactElement } from 'react';

import {
  CanvasElementType,
  CommonCanvasComponentProps,
  DrawContext,
} from './types';

export interface ForEachCallbackContext extends DrawContext {
  index: number;
  start: number;
  step: number;
  end: number;
}

export interface ForEachProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  callback: (context: ForEachCallbackContext) => ReactElement | void;
}

export const ForEach = CanvasElementType.ForEach;
