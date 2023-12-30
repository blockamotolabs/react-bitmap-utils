import { memo, ReactElement } from 'react';

import {
  AnyObject,
  CanvasComponent,
  CommonCanvasComponentProps,
} from '../types';

export interface RotateProps extends CommonCanvasComponentProps {
  radians: number;
  children?:
    | ReactElement<AnyObject, CanvasComponent<AnyObject>>
    | readonly ReactElement<AnyObject, CanvasComponent<AnyObject>>[];
}

export const Rotate: CanvasComponent<RotateProps> = memo(() => null);

Rotate.drawBeforeChildren = (ctx, { radians, children, preserve }) => {
  if (children && preserve !== false) {
    ctx.save();
  }

  ctx.rotate(radians);
};

Rotate.drawAfterChildren = (ctx, { children, preserve }) => {
  if (children && preserve !== false) {
    ctx.restore();
  }
};

Rotate.displayName = 'Rotate';
