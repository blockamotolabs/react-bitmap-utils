import React, { memo, ReactElement } from 'react';

import { AnyObject } from '../internal/types';
import { CommonCanvasComponentProps } from './types';

export interface WhileProps<T extends AnyObject>
  extends CommonCanvasComponentProps {
  context: T;
  test: (context: T) => boolean;
  children: (context: T) => ReactElement;
}

const MAX_LOOP = 1000000;

export const While = memo(
  <T extends AnyObject>({ context, test, children }: WhileProps<T>) => {
    const rendered = [];
    let index = 0;

    while (index <= MAX_LOOP && test(context)) {
      index += 1;
      rendered.push(children(context));
    }

    if (
      index > MAX_LOOP &&
      test(context) &&
      globalThis.console &&
      typeof globalThis.console.warn === 'function'
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `Maximum loop count exceeded. Only rendering last ${MAX_LOOP} elements.`
      );
    }

    return <>{rendered}</>;
  }
);

While.displayName = 'While';
