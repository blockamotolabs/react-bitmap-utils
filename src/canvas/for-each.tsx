import React, { ReactElement } from 'react';

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

export const ForEach = ({
  start = 0,
  step = 1,
  end,
  children,
}: ForEachProps) => {
  const rendered = [];

  for (let index = start || 0; index < end; index += step || 1) {
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
};
