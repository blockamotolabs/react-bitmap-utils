import { memo, ReactElement } from 'react';

import {
  AnyObject,
  CanvasComponent,
  CommonCanvasComponentProps,
} from '../types';

export interface ScaleProps extends CommonCanvasComponentProps {
  x?: number;
  y?: number;
  children?:
    | ReactElement<AnyObject, CanvasComponent<AnyObject>>
    | readonly ReactElement<AnyObject, CanvasComponent<AnyObject>>[];
}

export const Scale: CanvasComponent<ScaleProps> = memo(() => null);

Scale.drawBeforeChildren = (ctx, { x = 1, y = 1, children, restore }) => {
  if (children && restore !== false) {
    ctx.save();
  }

  ctx.scale(x, y);
};

Scale.drawAfterChildren = (ctx, { children, restore }) => {
  if (children && restore !== false) {
    ctx.restore();
  }
};

Scale.displayName = 'Scale';
