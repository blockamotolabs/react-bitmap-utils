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

export const Scale: CanvasComponent<ScaleProps> = memo(() => {
  return null;
});

Scale.drawBeforeChildren = (ctx, { x = 1, y = 1, children, preserve }) => {
  if (children && preserve !== false) {
    ctx.save();
  }

  ctx.scale(x, y);
};

Scale.drawAfterChildren = (ctx, { children, preserve }) => {
  if (children && preserve !== false) {
    ctx.restore();
  }
};

Scale.displayName = 'Scale';
