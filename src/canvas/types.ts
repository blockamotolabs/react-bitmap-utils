import { ImageProps } from './image';
import { LineProps } from './line';
import { OpacityProps } from './opacity';
import { CanvasChild, TextChild } from './reconciler';
import { RectangleProps } from './rectangle';
import { RotateProps } from './rotate';
import { ScaleProps } from './scale';
import { TextProps } from './text';
import { TranslateProps } from './translate';

export enum CanvasElementType {
  Rectangle = 'Canvas.Rectangle',
  Line = 'Canvas.Line',
  Text = 'Canvas.Text',
  Translate = 'Canvas.Translate',
  Scale = 'Canvas.Scale',
  Rotate = 'Canvas.Rotate',
  Opacity = 'Canvas.Opacity',
  Image = 'Canvas.Image',
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [CanvasElementType.Rectangle]: RectangleProps;
      [CanvasElementType.Line]: LineProps;
      [CanvasElementType.Rotate]: RotateProps;
      [CanvasElementType.Translate]: TranslateProps;
      [CanvasElementType.Scale]: ScaleProps;
      [CanvasElementType.Text]: TextProps;
      [CanvasElementType.Opacity]: OpacityProps;
      [CanvasElementType.Image]: ImageProps;
    }
  }
}

export interface DrawContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
  drawChild: (child: CanvasChild | TextChild) => void;
}

export interface CanvasComponentRenderers<
  P extends CommonCanvasComponentProps,
> {
  drawBeforeChildren?: (canvasContext: DrawContext, props: P) => void;
  drawAfterChildren?: (canvasContext: DrawContext, props: P) => void;
}

export interface CommonCanvasComponentProps {
  restore?: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CanvasContextValueUnpopulated {
  canvas: null;
  ctx: null;
  width: number;
  height: number;
  pixelRatio: number;
  parent?: CanvasContextValue | null;
}

export interface CanvasContextValuePopulated {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
  parent?: CanvasContextValue | null;
}

export type CanvasContextValue =
  | CanvasContextValueUnpopulated
  | CanvasContextValuePopulated;
