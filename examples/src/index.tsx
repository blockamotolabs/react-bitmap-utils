import {
  Canvas,
  degreesToRadians,
  ForEach,
  Line,
  Rectangle,
  Rotate,
  Scale,
  Text,
  Translate,
  useAutoPixelRatio,
  useDelta,
  useFrameNow,
  useFrameRate,
} from '@bitmapland/react-bitmap-utils';
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const pixelRatio = useAutoPixelRatio();
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });
  const now = useFrameNow();
  const frameRate = useFrameRate(100);
  const delta = useDelta();

  const scale = 1 + Math.cos(now * 0.0025) * 0.2;

  const forEach = useCallback(
    (index: number) => (
      <Rectangle
        key={index}
        x={5}
        y={25 + index * 20}
        width={10}
        height={10}
        fill="black"
      />
    ),
    []
  );

  return (
    <>
      <Canvas
        pixelRatio={pixelRatio}
        style={{ width: '100%', height: '100%' }}
        onResize={setDimensions}
      >
        <Text x={5} y={5} fontSize={16} fill="black">
          Delta: {delta}
        </Text>
        <Line
          startX={width * 0.5}
          startY={0}
          endX={width * 0.5}
          endY={height}
          strokeWidth={1}
          stroke="cyan"
        />
        <ForEach end={3}>{forEach}</ForEach>
        <Translate
          x={width * 0.5}
          y={height * 0.5 + Math.sin(now * 0.005) * height * 0.25}
        >
          <Rotate radians={degreesToRadians(Math.sin(now * 0.005) * 45)}>
            <Rectangle
              x={-50 * 0.5}
              y={-50 * 0.5}
              width={50}
              height={50}
              fill="red"
              strokeWidth={1}
              stroke="black"
            />
          </Rotate>
          <Scale x={scale} y={scale}>
            <Text
              x={0}
              y={0}
              fontSize={16}
              textAlign="center"
              verticalAlign="middle"
              fill="white"
            >
              {Math.round(frameRate)}fps
            </Text>
          </Scale>
        </Translate>
      </Canvas>
    </>
  );
};

createRoot(globalThis.document.getElementById('app')!).render(<App />);
