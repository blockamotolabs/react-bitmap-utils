import { FunctionComponent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: readonly any[]) => any;

export interface CanvasComponent<P extends CommonCanvasComponentProps>
  extends FunctionComponent<P> {
  drawBeforeChildren?: (ctx: CanvasRenderingContext2D, props: P) => void;
  drawAfterChildren?: (ctx: CanvasRenderingContext2D, props: P) => void;
}

export interface CommonCanvasComponentProps {
  preserve?: boolean;
}
