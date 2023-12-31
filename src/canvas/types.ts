import { ReactElement } from 'react';

import { AnyObject } from '../types';
import { LineProps } from './line';
import { CanvasChild } from './reconciler';
import { RectangleProps } from './rectangle';
import { RotateProps } from './rotate';
import { ScaleProps } from './scale';
import { TextProps } from './text';
import { TranslateProps } from './translate';

export enum CanvasElementType {
  ForEach = 'Canvas.ForEach',
  Rectangle = 'Canvas.Rectangle',
  Line = 'Canvas.Line',
  Text = 'Canvas.Text',
  Translate = 'Canvas.Translate',
  Scale = 'Canvas.Scale',
  Rotate = 'Canvas.Rotate',
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [CanvasElementType.Rectangle]: RectangleProps;
      [CanvasElementType.Line]: LineProps;
      [CanvasElementType.ForEach]: {
        children: ReactElement<AnyObject, CanvasElementType>[];
      };
      [CanvasElementType.Rotate]: RotateProps;
      [CanvasElementType.Translate]: TranslateProps;
      [CanvasElementType.Scale]: ScaleProps;
      [CanvasElementType.Text]: TextProps;
    }
  }
}

export interface CanvasComponentRenderers<
  P extends CommonCanvasComponentProps,
> {
  drawBeforeChildren?: (
    canvasContext: {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      drawChild: (child: CanvasChild) => void;
    },
    props: P
  ) => void;
  drawAfterChildren?: (
    canvasContext: {
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      drawChild: (child: CanvasChild) => void;
    },
    props: P
  ) => void;
}

export interface CommonCanvasComponentProps {
  restore?: boolean;
}
