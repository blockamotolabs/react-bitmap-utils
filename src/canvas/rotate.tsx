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

Rotate.drawBeforeChildren = (ctx, { radians, children, restore }) => {
  if (children && restore !== false) {
    ctx.save();
  }

  ctx.rotate(radians);
};

Rotate.drawAfterChildren = (ctx, { children, restore }) => {
  if (children && restore !== false) {
    ctx.restore();
  }
};

Rotate.displayName = 'Rotate';
