import {
  Canvas,
  Rectangle,
  Text,
  useAutoPixelRatio,
  useFrameNow,
  useFrameRate,
} from '@bitmapland/react-bitmap-utils';
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const pixelRatio = useAutoPixelRatio();
  const width = 500;
  const height = (width / 16) * 9;
  const now = useFrameNow();
  const frameRate = useFrameRate(100);

  return (
    <>
      <h1>Hello, World!</h1>
      <Canvas pixelRatio={pixelRatio} style={{ width, height }}>
        <Text
          x={5 * pixelRatio}
          y={5 * pixelRatio}
          fontSize={20 * pixelRatio}
          fill="black"
        >
          {Math.round(frameRate)}
        </Text>
        <Rectangle
          x={width * 0.5 * pixelRatio - 50 * 0.5 * pixelRatio}
          y={
            height * 0.5 * pixelRatio -
            50 * 0.5 * pixelRatio +
            Math.sin(now * 0.005) * height * 0.25 * pixelRatio
          }
          width={50 * pixelRatio}
          height={50 * pixelRatio}
          fill="red"
        />
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
