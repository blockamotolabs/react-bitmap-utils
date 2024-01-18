import React, { memo, ReactElement } from 'react';

import { CommonCanvasComponentProps } from './types';

export interface ForEachCallbackContext {
  index: number;
  start: number;
  step: number;
  end: number;
}

export interface ForEachProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  children: (context: ForEachCallbackContext) => ReactElement;
}

export const ForEach = memo(
  ({ start = 0, step = 1, end, children }: ForEachProps) => {
    const rendered = [];

    for (let index = start; index < end; index += step) {
      rendered.push(
        children({
          index,
          start,
          step,
          end,
        })
      );
    }

    return <>{rendered}</>;
  }
);

ForEach.displayName = 'ForEach';
