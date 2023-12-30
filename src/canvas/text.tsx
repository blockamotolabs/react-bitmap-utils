import { memo } from 'react';

import { CanvasComponent, CommonCanvasComponentProps } from '../types';

export interface TextProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  fontVariant?: 'normal' | 'small-caps';
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center';
  verticalAlign?:
    | 'top'
    | 'hanging'
    | 'middle'
    | 'alphabetic'
    | 'ideographic'
    | 'bottom';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  children: number | string | readonly (number | string)[];
}

const stringify = (children: TextProps['children']) => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'number') {
    return children.toString();
  }

  return children.join('');
};

export const Text: CanvasComponent<TextProps> = memo(() => {
  return null;
});

Text.drawBeforeChildren = (
  ctx,
  {
    x,
    y,
    fontFamily = 'arial',
    fontSize = 12,
    fontStyle = 'normal',
    fontVariant = 'normal',
    fontWeight = 'normal',
    textAlign = 'left',
    verticalAlign = 'top',
    fill,
    stroke,
    strokeWidth = 1,
    children,
  }
) => {
  if (verticalAlign) {
    ctx.textBaseline = verticalAlign;
  }

  if (textAlign) {
    ctx.textAlign = textAlign;
  }

  const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;

  ctx.font = font;

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillText(stringify(children), x, y);
  }

  if (stroke && strokeWidth) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(stringify(children), x, y);
  }
};

Text.displayName = 'Text';
