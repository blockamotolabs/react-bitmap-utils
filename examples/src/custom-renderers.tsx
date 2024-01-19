import {
  CanvasComponentRenderers,
  CommonCanvasComponentProps,
} from '@blockamotolabs/react-bitmap-utils';

// This is our custom component. You can see it being used in the crosshair.tsx component.
// It is an "intrinsic" element (not a function/class), and so has to be added to JSX.IntrinsicElements if you're using TypeScript.
export const Circle = 'Custom.Circle';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // Here we're adding our custom component to the JSX.IntrinsicElements interface.
      // Now we can include the imported <Circle /> in our JSX.
      'Custom.Circle': CircleProps;
    }
  }
}

// All canvas components implicitly have a "restore" prop which tells the canvas to save/restore the state before/after drawing.
// Some components may want to implicitly save/restore (e.g. the Scale/Translate/Rotate components save/restore if they have children).
// You don't need to manually handle save/restore unless you want this behavior without the restore prop being set to true.
export interface CircleProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const circleRenderers: CanvasComponentRenderers<CircleProps> = {
  handlesChildren: false,
  drawBeforeChildren: (
    // The context includes the canvas, 2D rendering context, width, height, pixelRatio, and...
    // ...a drawChild(child) function which handles drawing to the parent canvas.
    { ctx },
    { props: { x, y, radius, fill, stroke, strokeWidth } }
    // If you want to manually handle the component's children (as opposed to letting the canvas renderer handle them)
    // You can set handlesChildren to true.
    // You should then use the "rendered" parameter of these drawing methods instead of props.children.
    // props.children are the raw JSX elements, while rendered are the reconciled elements (including text nodes).
    // If you use the props.children you will run into issues.
    /*, rendered */
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth || 1;
      ctx.stroke();
    }
  },
  drawAfterChildren: () => {
    // This method is used for cleaning up, or for anything that should be drawn on top of the children.
  },
};

export const CUSTOM_RENDERERS = {
  [Circle]: circleRenderers,
};
