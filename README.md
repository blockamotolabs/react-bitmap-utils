# @blockamotolabs/react-bitmap-utils

## Intro

React Bitmap Utils is a set of React components and utilities for drawing Bitmap related imagery to an HTML5 canvas.

While this library is in a pre-release version (0.x.x) minor version changes may include breaking changes. We will try to avoid this where possible, but it may be necessary.

## Examples

You can find examples that demonstrate most of the library's features and some performance enhancements used by [bitmap.land](bitmap.land) in the [examples](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/examples) directory.

A live version of these examples is published [here](https://blockamotolabs.github.io/react-bitmap-utils/).

![Image of example map](https://github.com/blockamotolabs/react-bitmap-utils/tree/main/images/screenshot.png)

## Documentation

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

## Contributing

If you plan on contributing to this project please make sure your code conforms to our defined standards, and therefore passes all linting, type-checking, formatting and unit tests.

When your code is complete (and passing all linting/tests) you should open a pull requests against the `main` branch. Please give a detailed explanation of the change, why it is necessary, and include screenshots of both desktop and mobile devices if it is a visual change.

If your branch is out of date from the `main` branch please update it and fix any conflicts.

If you add any dependencies please justify why the dependency was necessary.

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
