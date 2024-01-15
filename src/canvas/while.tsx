import React, { memo, ReactElement } from 'react';

import { AnyObject } from '../types';
import { CommonCanvasComponentProps } from './types';

export interface WhileProps<T extends AnyObject>
  extends CommonCanvasComponentProps {
  context: T;
  test: (context: T) => boolean;
  children: (context: T) => ReactElement;
}

export const While = memo(
  <T extends AnyObject>({ context, test, children }: WhileProps<T>) => {
    const rendered = [];

    while (test(context)) {
      rendered.push(children(context));
    }

    return <>{rendered}</>;
  }
);

While.displayName = 'While';
