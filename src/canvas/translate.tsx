import { memo, ReactElement } from 'react';

import {
  AnyObject,
  CanvasComponent,
  CommonCanvasComponentProps,
} from '../types';

export interface TranslateProps extends CommonCanvasComponentProps {
  x?: number;
  y?: number;
  children?:
    | ReactElement<AnyObject, CanvasComponent<AnyObject>>
    | readonly ReactElement<AnyObject, CanvasComponent<AnyObject>>[];
}

export const Translate: CanvasComponent<TranslateProps> = memo(() => null);

Translate.drawBeforeChildren = (ctx, { x = 0, y = 0, children, restore }) => {
  if (children && restore !== false) {
    ctx.save();
  }

  ctx.translate(x, y);
};

Translate.drawAfterChildren = (ctx, { children, restore }) => {
  if (children && restore !== false) {
    ctx.restore();
  }
};

Translate.displayName = 'Translate';
