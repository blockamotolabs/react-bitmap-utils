# @blockamotolabs/react-bitmap-utils

## Intro

React Bitmap Utils is a set of React components and utilities for drawing Bitmap related imagery to an HTML5 canvas.

While this library is in a pre-release version (0.x.x) minor version changes may include breaking changes. We will try to avoid this where possible, but it may be necessary.

## Examples

You can find examples that demonstrate most of the library's features and some performance enhancements used by [bitmap.land](bitmap.land) in the [examples](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/examples) directory.

A live version of these examples is published [here](https://blockamotolabs.github.io/react-bitmap-utils/).

[![Image of example map](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/images/screenshot.png)](https://blockamotolabs.github.io/react-bitmap-utils/)

## Documentation

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

#### Common Canvas Component Props

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

The below example will draw `20px` by `20px`` red and blue rectangles next to each other because the `Scale` did not have any children, and therefore it is assumed that everything following it should be scaled.

```tsx
<>
  <Scale x={2} y={2} />
  <Rectangle x={0} y={0} width={10} height={10} fill="red" />
  <Rectangle x={10} y={0} width={10} height={10} fill="blue" />
</>
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
  parent?: CanvasContextValue | null;
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
