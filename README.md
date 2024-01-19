# @blockamotolabs/react-bitmap-utils

## Intro

React Bitmap Utils is a set of React components and utilities for drawing Bitmap related imagery to an HTML5 canvas.

While this library is in a pre-release version (0.x.x) minor version changes may include breaking changes. We will try to avoid this where possible, but it may be necessary.

## Examples

You can find examples that demonstrate most of the library's features and some performance enhancements used by [bitmap.land](bitmap.land) in the [examples](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/examples) directory.

A live version of these examples is published [here](https://blockamotolabs.github.io/react-bitmap-utils/).

[![Image of example map](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/images/screenshot.png)](https://blockamotolabs.github.io/react-bitmap-utils/)

## Documentation

### Table of contents

- [Installation](#installation)
- [Constants](#constants)
- [Common Canvas Component Props](#common-canvas-component-props)
- [Canvas Components](#canvas-components)
  - [Canvas](#canvas)
  - [Rectangle](#rectangle)
  - [Line](#line)
  - [Text](#text)
  - [Image](#image)
  - [Translate](#translate)
  - [Rotate](#rotate)
  - [Scale](#scale)
  - [Opacity](#opacity)
  - [For](#for)
  - [While](#while)
  - [CanvasBuffer](#canvasbuffer)
- [Custom Components/Renderers](#custom-componentsrenderers)
  - [Custom Component](#custom-component)
  - [Overriding Renderers](#overriding-renderers)
- [Hooks](#hooks)
  - [useRecommendedPixelRatio](#userecommendedpixelratio)
  - [useFrameTimes](#useframetimes)
  - [useAverageFrameRate](#useaverageframerate)
  - [useDelta](#usedelta)
  - [useEventHandlers](#useeventhandlers)
  - [useCanvasContext](#usecanvascontext)
- [Utils](#utils)
  - [degreesToRadians](#degreestoradians)
  - [radiansToDegrees](#radianstodegrees)
  - [percentageOf](#percentageof)
  - [clamp](#clamp)
  - [remapValue](#remapvalue)
  - [getDimensions](#getdimensions)
  - [getLocationWithinElement](#getlocationwithinelement)
  - [getDistance](#getdistance)
  - [roundSquareRoot](#roundsquareroot)

### Installation

Install the library (`-P` will save this to your `package.json` production dependencies):

```shell
npm install @blockamotolabs/react-bitmap-utils -P
```

If this is a blank project you will also need to install React and React DOM:

```shell
npm install react react-dom -P
```

### Constants

Currently we only expose a few constants for the colors used on [bitmap.land](bitmap.land).

```ts
export const BLACK = '#181c1f';
export const WHITE = '#ffffff';
export const ORANGE = '#ff9500';
export const ORANGE_DARK = '#ff7e00';
```

### Common Canvas Component Props

Every component that can be drawn within a `Canvas` (excluding the `Canvas` itself) accepts a `restore` prop. If `true` the canvas state will be saved before this element is rendered and restored once complete.

Components that explicitly change the global state of the canvas (`Translate`, `Rotate`, `Scale`, `Opacity`) will automatically save and restore the canvas state if they have any children. If you want to avoid restoring the state after using one of these with children you can set the `restore` prop to `false`.

Examples:

In the below example the `fillStyle` of the canvas will be set to `"red"` and then restored to its previous state after the `Rectangle` is rendered.

```tsx
<Rectangle x={0} y={0} width={10} height={10} fill="red" restore />
```

The below example will draw a `20px` by `20px` red rectangle, and a `20px` by `20px` blue rectangle to its right.

If the `restore` prop were not provided it would draw a `20px` by `20px` red rectangle, and a `10px` by `10px` blue rectangle in the top right corner of the red rectangle.

```tsx
<>
  <Scale x={2} y={2} restore={false}>
    <Rectangle x={0} y={0} width={10} height={10} fill="red" />
  </Scale>
  <Rectangle x={10} y={0} width={10} height={10} fill="blue" />
</>
```

The below example will draw `20px` by `20px` red and blue rectangles next to each other because the `Scale` did not have any children, and therefore it is assumed that everything following it should be scaled.

```tsx
<>
  <Scale x={2} y={2} />
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
  <Rectangle x={10} y={0} width={10} height={10} fill="blue" />
</>
```

### Canvas Components

#### Canvas

The `Canvas` component is a wrapper around the HTML5 canvas element and handles drawing any of its descendants to the canvas.

Props:

```ts
export interface CanvasProps
  extends Omit<HTMLAttributes<HTMLCanvasElement>, 'onResize'> {
  width?: number;
  height?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  renderers?: Record<string, CanvasComponentRenderers<any>>;
  children: ReactNode;
  ref?: ForwardedRef<HTMLCanvasElement>;
  onResize?: (dimensions: Dimensions) => void;
}
```

You can either manually provide the desired `width` and or `height` of the canvas (which may be scaled if you're also providing a `pixelRatio`), or style the canvas with CSS and it'll automatically use the canvas's `clientWidth` and `clientHeight`.

The `pixelRatio` prop is used to scale the canvas to achieve crisper, higher density drawings on high DPI screens. This will default to `1`, but you can use the `useRecommendedPixelRatio` hook to achieve sensible defaults for various devices, or provide your own value. If the `pixelRatio` were set to `2`, and the `width` and `height` were set to `100` the canvas would be `200px` wide and `200px` tall. You should then use CSS to scale the canvas back down to `100px` wide and `100px` tall.

You can also define a `backgroundColor` to fill the canvas with a solid color before drawing any of its descendants.

Examples:

The below example will render a canvas that matches the size of its parent element, has a black background, and will scale the canvas density based on the current device.

```tsx
const App = () => {
  const pixelRatio = useRecommendedPixelRatio();

  return (
    <Canvas
      pixelRatio={pixelRatio}
      backgroundColor="black"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {/* Your elements here */}
    </Canvas>
  );
};
```

#### Rectangle

Draws a rectangle.

Props:

```ts
export interface RectangleProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}
```

Examples:

The below example will draw a `10px` by `10px` red rectangle in the top left corner of the canvas.

```tsx
<Rectangle x={0} y={0} width={10} height={10} fill="red" />
```

#### Line

Draws a line.

Props:

```ts
export interface LineProps extends CommonCanvasComponentProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  stroke?: string;
  strokeWidth?: number;
  /** Does not start a new shape when true */
  continuePath?: boolean;
}
```

Examples:

On a 100x100 canvas the below example will draw a red line from the top center of the canvas to the bottom center.

```tsx
<Line startX={50} startY={0} endX={50} endY={100} stroke="red" />
```

#### Text

Draws text.

Props:

```ts
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
```

Examples:

Ona 100x100 canvas the below example will draw the text `"Hello, World!"` in the center of the canvas.

```tsx
<Text x={50} y={50} align="center" verticalAlign="middle" fill="black">
  Hello, World!
</Text>
```

#### Image

Draws an image to the canvas.

Props:

```ts
export interface ImageProps extends CommonCanvasComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  src: Parameters<CanvasRenderingContext2D['drawImage']>[0];
}
```

Examples:

The below example will draw a 100x100 image in the top left corner of the canvas.

```tsx
<Image x=[0] y={0} width{100} height{100} src={image} />
```

The image component can draw more than just your average jpeg, including other canvases:

```ts
type CanvasImageSource =
  | HTMLOrSVGImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas
  | VideoFrame;
```

#### Translate

Changes the anchor point of the canvas so any nested/future elements will be offset.

Props:

```ts
export interface TranslateProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  x?: number;
  y?: number;
}
```

Examples:

The below examples will draw a red 10x10 rectangle 10 pixels from both the top and left of the canvas.

```tsx
<Translate x={10} y={10}>
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
</Translate>
```

#### Rotate

Rotates the canvas so any nested/future elements will be rotated.

Props:

```ts
export interface RotateProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  radians: number;
}
```

Examples:

The below example will draw a red 10x10 rectangle rotated 45 degrees.

```tsx
<Rotate radians={degreesToRadians(45)}>
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
</Rotate>
```

#### Scale

Scales the canvas so any nested/future elements will be drawn larger/smaller.

Props:

```ts
export interface RotateProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  radians: number;
}
```

Examples:

The below example will draw a red 20x20 rectangle.

```tsx
<Scale x={2} y={2}>
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
</Scale>
```

#### Opacity

Sets the opacity of the canvas so any nested/future elements will be drawn with the provided opacity (transparent).

Props:

```ts
export interface OpacityProps
  extends PropsWithChildren<CommonCanvasComponentProps> {
  opacity: number;
}
```

Examples:

The below example will draw a 50% transparent red 10x10 rectangle.

```tsx
<Opacity opacity={0.5}>
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
</Scale>
```

#### For

Like a for loop, but for drawing elements.

Optionally takes a `start` and `step` prop, and will call its child callback function from `start` to `end`, incrementing by `step` each time.

The callback returns the element(s) you'd like to draw.

By default `start` is `0` and `step` is `1`.

Props:

```ts
export interface ForCallbackContext {
  index: number;
  start: number;
  step: number;
  end: number;
}

export interface ForProps extends CommonCanvasComponentProps {
  start?: number;
  step?: number;
  end: number;
  children: (context: ForCallbackContext) => ReactElement;
}
```

Examples:

The below example will draw 10 outlined 10x10 rectangles in a line.

```tsx
<For end={10}>
  {({ index }) => (
    <Rectangle
      key={index}
      x={index * 10}
      y={0}
      width={10}
      height={10}
      stroke="black"
    />
  )}
</For>
```

#### While

Like a while loop, but for drawing elements.

Takes a `context` (object containing any data you'd like to use in the loop), and a `test` function that returns a boolean.

The child callback receives the current state of the `context` and can mutate it, returning elements to be drawn.

Props:

```ts
export interface WhileProps<T extends AnyObject>
  extends CommonCanvasComponentProps {
  context: T;
  test: (context: T) => boolean;
  children: (context: T) => ReactElement;
}
```

Examples:

The below example will draw 10 outlined 10x10 rectangles in a line.

```tsx
<While context={{ index: 0 }} test={({ index }) => index < 10}>
  {(context) => {
    // If we destructure our values here,
    // we can safely mutate the context below
    // without affecting the elements that are
    // returned after the mutation
    const { index } = context;

    context.index += 1;

    return (
      <Rectangle
        key={index}
        x={index * 10}
        y={0}
        width={10}
        height={10}
        stroke="black"
      />
    );
  }}
</While>
```

#### CanvasBuffer

The `CanvasBuffer` component creates an off-screen canvas element. Any children of the `CanvasBuffer` will be drawn to this off-screen canvas. The off-screen canvas is then drawn to the parent canvas as if it were an image.

This component is particularly useful for rendering clarity/performance improvements e.g.

Some browsers don't handle drawing very small/large text. Instead you can draw the text at a reasonable scale to the off-screen canvas, and then the off-screen canvas is drawn to the parent canvas at the desired scale.

The `CanvasBuffer` component will also only re-render its children if they (or its props) have changed, meaning you can use this to draw complex shapes only once (or when they need to be changed), and they will then be drawn to the parent canvas without needing to be re-rendered.

You can specify all the same props as to the `Canvas` component, plus `drawX`, `drawY`, `drawWidth` and `drawHeight` which define where and at what size the off-screen canvas should be drawn to the parent canvas.

Props:

```ts
export interface CanvasBufferProps
  extends CanvasProps,
    CommonCanvasComponentProps {
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
}
```

Examples:

The below example will draw some text with a font size of 20px to the 200x200 buffer, but then the buffer is drawn to the main canvas at 100x100 resulting in 10px text rendered on the main canvas.

```tsx
<Canvas width={100} height={100}>
  <CanvasBuffer
    width={200}
    height={200}
    drawX={0}
    drawY={0}
    drawWidth={100}
    drawHeight={100}
  >
    <Text
      x={100}
      y={100}
      fontSize={20}
      align="center"
      verticalAlign="middle"
      fill="black"
    >
      Hello, World!
    </Text>
  </CanvasBuffer>
</Canvas>
```

### Custom Components/Renderers

#### Custom Component

You can define your own intrinsic element components and renderers to use canvas context methods that aren't exposed by default.

You could also, but this isn't necessary as you can combine existing components in a typical function/class component, use this to group drawing logic into a single component. E.g. a `TextBox` that renders both a rectangle and some text.

First define your component - this can be a string, enum value, or object value.

We use enums internally because we're using TypeScript and it's easier to reference all of the various element types.

You should namespace your components to avoid conflicts with existing components (all of ours are prefixed with `Canvas.` and `Canvas.Internal.` - don't use this as you may break our existing components).

Here's an example of a nice way to define a `Circle` element type:

```ts
export enum CustomCanvasElementType {
  Circle = 'Canvas.Custom.Circle',
}
```

If you're using TypeScript you'll want to define a type for your component's props, and add this to the global `JSX.IntrinsicElements` interface.

```ts
interface CircleProps {
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [CustomCanvasElementType.Circle]: CircleProps;
    }
  }
}
```

Now we can simply export the enum value as our component:

```ts
export const Circle = CustomCanvasElementType.Circle;
```

Next we need to define our renderers. Renderers have 3 properties. Here's the type of a component's renderers:

```ts
export interface CanvasComponentRenderers<
  P extends CommonCanvasComponentProps,
> {
  // Prevents the canvas from handling drawing your component's children so you can manually handle them manually
  handlesChildren?: boolean;
  // Called before drawing the component's children - this will be the most used renderer
  drawBeforeChildren?: (
    canvasContext: DrawContext,
    element: ReconciledCanvasChild<P>
  ) => void;
  // Called after drawing the component's children - this allows you to clean up state changes, or draw over the top of your children
  drawAfterChildren?: (
    canvasContext: DrawContext,
    element: ReconciledCanvasChild<P>
  ) => void;
}
```

Here's an example of our `Circle` component's renderers:

```ts
const circleRenderers: CanvasComponentRenderers<CircleProps> = {
  drawBeforeChildren: (
    // The context includes the canvas, 2D rendering context, width, height, pixelRatio, and...
    // ...a drawChild(child) function which handles drawing to the parent canvas.
    { ctx },
    { props: { x, y, radius, fill, stroke, strokeWidth } }
    // If you want to manually handle the component's children (as opposed to letting the canvas renderer handle them)
    // You can set "handlesChildren" to true.
    // You should then use the "rendered" key of the reconciled element as opposed to the "props.children".
    // "props.children" are the raw JSX elements, while "rendered" are the reconciled elements (including text nodes).
    // If you use the "props.children" you will run into issues.
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
};
```

Now all we have to do is stick our circle renderers into an object keyed by the element type:

```ts
export const CUSTOM_RENDERERS = {
  [Circle]: circleRenderers,
};
```

Note: your renderers/renderers object should not be defined inside of a component as this will cause unnecessary re-renders, and should not rely on any external state.

The custom renderers object can then be provided to a `Canvas` and or `CanvasBuffer` component via the `renderers` prop.

It is not necessary to pass the `renderers` prop to a `CanvasBuffer` inside a `Canvas` if the `renderers` prop was provided to the `Canvas`. They will be inherited.

```tsx
<Canvas width={100} heigh={100} renderers={CUSTOM_RENDERERS}>
  <Circle x={50} y={50} radius={25} />
</Canvas>
```

#### Overriding Renderers

Note: the following is not recommended, as it may cause confusion if provided components no longer work in the same way as documented.

You can use the same element name as one of the provided elements e.g. all of our elements are prefixed with `Canvas.`, so you could create your own `Canvas.Rectangle` with your own renderer if you wanted to override the render logic of one of the existing components.

For example, we could override the `Canvas.Rectangle` component to draw a rectangle with rounded corners:

```ts
import {
  CanvasComponentRenderers,
  Rectangle,
  RectangleProps,
} from '@blockamotolabs/react-bitmap-utils';

// Define our renderers
const rectangleRenderers: CanvasComponentRenderers<RectangleProps> = {
  drawBeforeChildren: (
    { ctx },
    { props: { x, y, width, height, fill, stroke, strokeWidth = 1 } }
  ) => {
    // Don't let the radius be larger than half the width/height, or it will look weird
    const minRadius = Math.min(width / 2, height / 2, 5);

    // Draw the rectangle with rounded corners
    ctx.beginPath();
    ctx.moveTo(x + minRadius, y);
    ctx.lineTo(x + width - minRadius, y);
    ctx.arcTo(x + width, y, x + width, y + minRadius, minRadius);
    ctx.lineTo(x + width, y + height - minRadius);
    ctx.arcTo(
      x + width,
      y + height,
      x + width - minRadius,
      y + height,
      minRadius
    );
    ctx.lineTo(x + minRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - minRadius, minRadius);
    ctx.lineTo(x, y + minRadius);
    ctx.arcTo(x, y, x + minRadius, y, minRadius);
    ctx.closePath();

    // Optionally fill the rectangle
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // Optionally stroke the rectangle
    if (stroke && strokeWidth) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  },
};

// Override the existing renderer in our custom renderers
const CUSTOM_RENDERERS = {
  // Because we're referencing the Rectangle component from the library the key will be "Canvas.Rectangle"
  // You could also just manually set the key to "Canvas.Rectangle", but if the library changes your code will break
  [Rectangle]: rectangleRenderers,
};
```

### Hooks

#### useRecommendedPixelRatio

Returns a recommended pixel ratio for the current device.

Examples:

```ts
const pixelRatio = useRecommendedPixelRatio();
```

#### useFrameTimes

Returns an array of the last X frame times (`Date.now()`) in milliseconds.

The number of frames defaults to 60.

Examples:

```ts
const times = useFrameTimes(10); // returns the time of the last 10 frames
```

#### useAverageFrameRate

Returns the average frame rate (frames per second) over the last X frames.

The number of frames defaults to 60.

Examples:

```ts
const frameRate = useAverageFrameRate(10);
```

#### useDelta

Returns the time in milliseconds since the last frame.

Examples:

```ts
const delta = useDelta();
```

#### useEventHandlers

Takes an object containing event handlers and applies them to an element (non-passive).

End events (`mouseup`, `touchend`, `touchcancel`) are attached to the `window` to ensure they are captured even if the pointer leaves the element.

You should `useMemo` your object to avoid the listeners being recreated on every render.

Examples:

```ts
useEventHandlers(
  useMemo(
    () => ({
      onWheel: (event: WheelEvent) => {},
      onMouseDown: (event: MouseEvent) => {},
      onMouseMove: (event: MouseEvent) => {},
      onMouseUp: (event: MouseEvent) => {},
      onMouseEnter: (event: MouseEvent) => {},
      onMouseLeave: (event: MouseEvent) => {},
      onTouchStart: (event: TouchEvent) => {},
      onTouchMove: (event: TouchEvent) => {},
      onTouchEnd: (event: TouchEvent) => {},
      onTouchCancel: (event: TouchEvent) => {},
    }),
    []
  ),
  element
);
```

#### useCanvasContext

Returns the context for the closest parent `Canvas`.

Note: the `width` and `height` here are not the `width` and `height` props that were provided. These are the dimensions of the canvas taking into account the `pixelRadio` scaling.

This includes:

```ts
export interface CanvasContextValue {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  pixelRatio: number;
  renderers: Record<string, CanvasComponentRenderers<any>>;
  parent: CanvasContextValue | null;
}
```

### Utils

#### degreesToRadians

Takes degrees and converts it to radians.

Examples:

```ts
degreesToRadians(0); // returns 0
degreesToRadians(180); // returns Math.PI
```

#### radiansToDegrees

Takes radians and converts it to degrees.

Examples:

```ts
radiansToDegrees(0); // returns 0
radiansToDegrees(Math.PI); // returns 180
```

#### percentageOf

Takes a percentage and a total and returns the percentage value of that total.

Examples:

```ts
percentageOf(50, 200); // returns 100
```

#### clamp

Takes a value, and a min and max, and returns the value clamped between the min and max.

Examples:

```ts
clamp(10, 0, 5); // returns 5
clamp(10, 15, 20); // returns 15
```

#### remapValue

Takes a value and two ranges. Maps the value from one range to another.

Can optionally clamp the value to the output range.

Examples:

```ts
remapValue(10, 0, 20, 0, 100); // returns 50
remapValue(30, 0, 20, 0, 100); // returns 150
remapValue(30, 0, 20, 0, 100, true); // returns 100
```

#### getDimensions

Gets the scaled dimensions of a canvas taking into account the pixel ratio.

Examples

```ts
getDimensions(2, 100, 100, canvasElement); // returns { width: 200, height: 200 }
getDimensions(2, undefined, undefined, canvasElement); // returns { width: clientWidth * 2, height: clientHeight * 2 }
```

#### getLocationWithinElement

Returns the coordinates of a pointer (mouse/touch `clientX` + `clientY`) location within an element;

Examples:

```ts
getLocationWithinElement(event, element);
getLocationWithinElement(event.touches[0], element);

/*
If the element were offset by 10px from the top and left of the page,
and the pointer were at 20px from the top and left of the page,
this would return { x: 10, y: 10 }
*/
```

#### getDistance

Returns the distance between two points.

Examples:

```ts
getDistance({ x: 0, y: 0 }, { x: 10, y: 10 }); // returns 14.142135623730951
```

#### roundSquareRoot

Takes a number and returns a whole number that is close to (or exactly) the square root of that number.

The returned number will both be whole, and if the input were divided by the output the result would be a whole number.

Yes, it could have a better name, but I like the opposing themes of "round square".

Examples:

```ts
roundSquareRoot(210000); // returns 500
// 210000 / 500 = 420

Math.sqrt(210000); // returns 458.257569495584
/*
// The closest number is 458
// but 210000 / 458 = 458.51528384279476
// which is not a whole number
*/
```

## Contributing

If you plan on contributing to this project please make sure your code conforms to our defined standards, and therefore passes all linting, type-checking, formatting and unit tests.

When your code is complete (and passing all linting/tests) you should open a pull requests against the `main` branch. Please give a detailed explanation of the change, why it is necessary, and include screenshots of both desktop and mobile devices if it is a visual change.

If your branch is out of date from the `main` branch please update it and fix any conflicts.

If you add any dependencies please justify why the dependency was necessary.

If your change affects the public API please update the documentation ([readme](README.md)) to reflect this.

We reserve the right to deny any pull requests that do not meet any of the aforementioned standards, or that we do not believe are in the best interest of the project.

### Setup

Fork the repository and create a new branch from the `main` branch.

Branch names should only contain letters, numbers, and dashes. Do not include spaces or other symbols.

Make sure you are running a version of node matching that in the [`.nvmrc`](.nvmrc) file.

If you use NVM you can simply run:

```shell
nvm use
```

Install dependencies:

```shell
npm ci
```

### Dev server

To run the dev server run:

```shell
npm run dev
```

You can then access this at [http://localhost:8080](http://localhost:8080)

## Tests, linting, type-checking and formatting

You can run all of the checks with:

```shell
npm test
```

Or individual checks with any of the following:

```shell
npm run typecheck
npm run format-check
npm run lint
npm run tests
```

We use prettier for formatting, so if you have an equivalent extension in your editor you may be able to have it automatically format your code on paste/save.

Similarly we use eslint for linting, so if you have an equivalent extension in your editor you may be able to have it automatically fix issues in your code on paste/save.

If you don't want to use an editor extension for either of these:

- prettier - you can run `npm run format` to format all files
- eslint - you can run `npm run lint -- --fix` to fix some issues - others will need to be fixed manually
