import React, { memo, ReactElement, useMemo } from 'react';

import {
  AnyObject,
  CanvasComponent,
  CommonCanvasComponentProps,
} from '../types';

export interface ForEachProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  children: (
    index: number,
    start: number,
    step: number,
    end: number
  ) => ReactElement<AnyObject, CanvasComponent<AnyObject>>;
}

export const ForEach: CanvasComponent<ForEachProps> = memo(
  ({ start = 0, step = 1, end, children }) => {
    const rendered = useMemo(() => {
      const acc = [];

      for (let index = start; index < end; index += step) {
        acc.push(children(index, start, step, end));
      }

      return acc;
    }, [children, end, start, step]);

    return <>{rendered}</>;
  }
);

ForEach.displayName = 'ForEach';
