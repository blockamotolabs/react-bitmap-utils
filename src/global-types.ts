import type { IntrinsicCanvasBufferProps } from './canvas-buffer';
import type { ImageProps } from './image';
import type { LineProps } from './line';
import type { OpacityProps } from './opacity';
import type { RectangleProps } from './rectangle';
import type { RotateProps } from './rotate';
import type { ScaleProps } from './scale';
import type { TextProps } from './text';
import type { TranslateProps } from './translate';
import type { CanvasElementType } from './types';

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
