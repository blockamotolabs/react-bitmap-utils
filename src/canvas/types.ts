import { IntrinsicCanvasBufferProps } from './canvas-buffer';
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
  CanvasBuffer = 'Canvas.CanvasBuffer',
}

export enum InternalCanvasElementType {
  Root = 'Canvas.Internal.Root',
  Text = 'Canvas.Internal.Text',
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
      [CanvasElementType.CanvasBuffer]: IntrinsicCanvasBufferProps;
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
  handlesChildren?: boolean;
  drawBeforeChildren?: (
    canvasContext: DrawContext,
    props: P,
    rendered: string | readonly (CanvasChild | TextChild)[]
  ) => void;
  drawAfterChildren?: (
    canvasContext: DrawContext,
    props: P,
    rendered: string | readonly (CanvasChild | TextChild)[]
  ) => void;
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

export interface Handlers {
  onWheel?: (event: WheelEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchCancel?: (event: TouchEvent) => void;
}

export interface Coordinates {
  x: number;
  y: number;
}
