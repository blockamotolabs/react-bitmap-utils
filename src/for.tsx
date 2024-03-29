import React, { ReactElement } from 'react';

const { memo } = React;

import { CommonCanvasComponentProps } from './types';

export interface ForCallbackContext {
  index: number;
  start: number;
  step: number;
  end: number;
}

export interface ForProps extends Omit<CommonCanvasComponentProps, 'children'> {
  start?: number;
  step?: number;
  end: number;
  children: (context: ForCallbackContext) => ReactElement;
}

export const For = memo(({ start = 0, step = 1, end, children }: ForProps) => {
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
});

For.displayName = 'For';
