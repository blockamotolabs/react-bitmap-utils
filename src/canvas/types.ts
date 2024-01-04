import { ForEachProps } from './for-each';
import { LineProps } from './line';
import { OpacityProps } from './opacity';
import { CanvasChild, TextChild } from './reconciler';
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
  Opacity = 'Canvas.Opacity',
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [CanvasElementType.Rectangle]: RectangleProps;
      [CanvasElementType.Line]: LineProps;
      [CanvasElementType.ForEach]: ForEachProps;
      [CanvasElementType.Rotate]: RotateProps;
      [CanvasElementType.Translate]: TranslateProps;
      [CanvasElementType.Scale]: ScaleProps;
      [CanvasElementType.Text]: TextProps;
      [CanvasElementType.Opacity]: OpacityProps;
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
      drawChild: (child: CanvasChild | TextChild) => void;
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

export interface Dimensions {
  width: number;
  height: number;
}
