import type { PropsWithChildren } from 'react';

import type { AnyObject } from './internal/types';

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

export interface ReconciledTextChild {
  type: InternalCanvasElementType.Text;
  props?: never;
  rendered: string;
}

export interface ReconciledCanvasChild<
  P extends CommonCanvasComponentProps = AnyObject,
> {
  type: CanvasElementType;
  props: P;
  rendered: (ReconciledTextChild | ReconciledCanvasChild)[];
  hasUpdates: boolean;
}

export interface DrawContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
  drawChild: (child: ReconciledCanvasChild | ReconciledTextChild) => void;
}

export interface CanvasComponentRenderers<
  P extends CommonCanvasComponentProps,
> {
  handlesChildren?: boolean;
  drawBeforeChildren?: (
    canvasContext: DrawContext,
    element: ReconciledCanvasChild<P>
  ) => void;
  drawAfterChildren?: (
    canvasContext: DrawContext,
    element: ReconciledCanvasChild<P>
  ) => void;
}

export type CommonCanvasComponentProps = PropsWithChildren<{
  restore?: boolean;
}>;

export interface Coordinates {
  x: number;
  y: number;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, CanvasComponentRenderers<any>>;
  parent: CanvasContextValue | null;
}

export interface CanvasContextValuePopulated {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  pixelRatio: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderers: Record<string, CanvasComponentRenderers<any>>;
  parent: CanvasContextValue | null;
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
